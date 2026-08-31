const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const archiver = require('archiver');
const multer = require('multer');
const unzipper = require('unzipper');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '10mb' }));
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP since we use inline scripts
    crossOriginEmbedderPolicy: false
}));

// Block access to sensitive files
app.use((req, res, next) => {
    const blocked = [
        '/server.js', '/update.js', '/package.json', '/package-lock.json',
        '/Dockerfile', '/docker-compose.yml', '/docker-compose.prod.yml',
        '/Caddyfile', '/.env', '/.gitignore',
        '/students_backup.json'
    ];
    const lowerPath = req.path.toLowerCase();
    if (blocked.includes(req.path) || blocked.includes(lowerPath) ||
        lowerPath.startsWith('/data/') || lowerPath.startsWith('/node_modules/') ||
        lowerPath === '/data' || lowerPath === '/node_modules') {
        return res.status(403).send('Access Denied');
    }
    next();
});

// Rate limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: 'Too many login attempts, please try again later' }
});

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const quarantineDir = path.join(__dirname, 'data', 'quarantine');
if (!fs.existsSync(quarantineDir)) {
    fs.mkdirSync(quarantineDir);
}

const dbFile = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbFile);

// Enable WAL mode for better concurrency and no deadlocks
db.run("PRAGMA journal_mode = WAL;");

// Initialize DB schema
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
        tz TEXT PRIMARY KEY,
        name TEXT,
        year TEXT,
        semester TEXT,
        grades TEXT,
        blocked INTEGER DEFAULT 0,
        chat_blocked INTEGER DEFAULT 0
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err);
            return;
        }

        // Add columns if they don't exist (migration)
        db.run(`ALTER TABLE students ADD COLUMN blocked INTEGER DEFAULT 0`, () => {});
        db.run(`ALTER TABLE students ADD COLUMN chat_blocked INTEGER DEFAULT 0`, () => {});
        db.run(`ALTER TABLE students ADD COLUMN verilearn_progress TEXT`, () => {});
    
        db.run(`CREATE TABLE IF NOT EXISTS page_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tz TEXT,
            path TEXT,
            timestamp INTEGER
        )`);
    
        db.run(`CREATE TABLE IF NOT EXISTS file_metadata (
            path TEXT PRIMARY KEY,
            uploader_tz TEXT,
            uploader_name TEXT,
            timestamp INTEGER
        )`);
        
        // Add joined_at if not exists
        db.run(`ALTER TABLE students ADD COLUMN joined_at INTEGER DEFAULT 0`, (err) => {
            // Ignore error if column exists
        });

        db.run(`CREATE TABLE IF NOT EXISTS drive_permissions (
            path TEXT PRIMARY KEY,
            visibility TEXT,
            users TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS course_folders (
            course_id INTEGER PRIMARY KEY,
            folder_path TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS proposals (
            id TEXT PRIMARY KEY,
            tz TEXT,
            files_count INTEGER,
            proposed_path TEXT,
            comments TEXT,
            status TEXT,
            timestamp INTEGER
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tz TEXT,
            message TEXT,
            sender TEXT,
            timestamp INTEGER
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS grade_changes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tz TEXT,
            course_id TEXT,
            action TEXT,
            timestamp INTEGER
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS file_downloads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT,
            tz TEXT,
            timestamp INTEGER
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS public_shares (
            id TEXT PRIMARY KEY,
            path TEXT,
            bypass_rules INTEGER DEFAULT 1,
            require_auth INTEGER DEFAULT 0,
            created_at INTEGER
        )`);

        db.run(`ALTER TABLE proposals ADD COLUMN files_json TEXT`, (err) => { /* ignore */ });

        // Check if DB is empty to seed it
        db.get("SELECT COUNT(*) as count FROM students", (err, row) => {
            if (row && row.count === 0) {
                console.log("Database is empty. Seeding from students_backup.json...");
                try {
                    const backupPath = path.join(__dirname, 'students_backup.json');
                    if (fs.existsSync(backupPath)) {
                        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
                        
                        const stmt = db.prepare("INSERT INTO students (tz, name, year, semester, grades, joined_at) VALUES (?, ?, ?, ?, ?, ?)");
                        backupData.forEach(student => {
                            stmt.run(student.tz, student.name || '', student.year || 'A', student.semester || '1', JSON.stringify(student.grades || {}), Date.now());
                        });
                        stmt.finalize();
                        console.log("Seeding completed.");
                    } else {
                        console.log("No backup file found, skipping seeding.");
                    }
                } catch(e) {
                    console.error("Error seeding DB:", e);
                }
            }
        });
    });
});

function isSubpath(parent, child) {
    const p = parent === '/' ? '/' : parent.replace(/\/$/, '');
    const c = child === '/' ? '/' : child.replace(/\/$/, '');
    if (p === '/') return true;
    if (c === p) return true;
    return c.startsWith(p + '/');
}

// --- Admin Session Store (in-memory) ---
const adminSessions = {}; // sessionId -> { approved: bool, ts: timestamp }

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

function getAdminTZList() {
    const raw = process.env.ADMIN_TZ || '';
    return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function isAdminTZ(tz) {
    return getAdminTZList().includes(tz);
}

// Timing-safe password comparison
function timingSafeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
        // Compare against self to maintain constant time
        crypto.timingSafeEqual(bufA, bufA);
        return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
}

// Admin authentication middleware
function requireAdmin(req, res, next) {
    const sessionId = req.headers['x-admin-session'] || req.query.adminSession || '';
    if (!sessionId || !adminSessions[sessionId] || !adminSessions[sessionId].approved) {
        return res.status(401).json({ error: 'Admin authentication required' });
    }
    // Check session expiry (1 hour)
    if (Date.now() - adminSessions[sessionId].ts > 60 * 60 * 1000) {
        delete adminSessions[sessionId];
        return res.status(401).json({ error: 'Session expired' });
    }
    next();
}

// Server-Sent Events (SSE) Setup
const sseClients = {};

app.get('/api/events/:tz', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    const tz = req.params.tz;
    if (!sseClients[tz]) sseClients[tz] = [];
    sseClients[tz].push(res);
    
    req.on('close', () => {
        sseClients[tz] = sseClients[tz].filter(client => client !== res);
    });
});

// VeriLearn Progress Endpoints
app.get('/api/students/:tz/verilearn', (req, res) => {
    const tz = req.params.tz;
    db.get("SELECT verilearn_progress FROM students WHERE tz = ?", [tz], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "Not found" });
        try {
            const progress = JSON.parse(row.verilearn_progress || '{}');
            res.json(progress);
        } catch(e) {
            res.json({});
        }
    });
});

app.patch('/api/students/:tz/verilearn', (req, res) => {
    const tz = req.params.tz;
    const progressData = JSON.stringify(req.body || {});
    db.run("UPDATE students SET verilearn_progress = ? WHERE tz = ?", [progressData, tz], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true });
    });
});

// VeriLearn Icarus Verilog Compiler API
// Parse actual input/output port names from a Verilog module declaration.
// Handles ANSI-style ports (one per line OR comma-separated inline).
function parseVerilogPorts(userCode) {
  const inputs = new Set();
  const outputs = new Set();

  // Strip comments
  const clean = userCode
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  // Strategy: scan every occurrence of 'input'/'output' keyword individually.
  // After the keyword (and optional type/range), capture the SINGLE identifier that follows.
  // This works for both:
  //   input a, input b  (inline, one keyword per name)
  //   input a, b        (one keyword, multiple names separated by commas)
  // 
  // Two-pass:
  //  Pass 1: match 'input/output KEYWORD name' → each keyword owns exactly one name (after type/range)
  //  Pass 2: if names are grouped (e.g. "input a, b, c;"), capture all names after one keyword

  // We'll do a unified approach: for each keyword occurrence, grab up to the next keyword or line end
  const portRe = /\b(input|output)\s+(?:wire\s+|reg\s+)?(?:\[\s*\d+\s*:\s*\d+\s*\]\s+)?([a-zA-Z_][a-zA-Z0-9_]*)/g;

  let m;
  while ((m = portRe.exec(clean)) !== null) {
    const dir = m[1];
    const name = m[2];
    if (dir === 'input') inputs.add(name);
    else outputs.add(name);
  }

  return { inputs, outputs };
}



// Helper modules to append for Chapter 4 / hierarchy lessons
function getHelperModules(userCode) {
  let helpers = '';
  if (userCode.includes('mod_a')) {
    if (userCode.includes('.out_and') || userCode.includes('out_and')) {
      helpers += `\nmodule mod_a (input in1, input in2, output out_and);\n  assign out_and = in1 & in2;\nendmodule\n`;
    } else {
      helpers += `\nmodule mod_a (input in1, input in2, output out_xor);\n  assign out_xor = in1 ^ in2;\nendmodule\n`;
    }
  }
  if (userCode.includes('inverter_block')) {
    helpers += `\nmodule inverter_block (input in_sig, output out_sig);\n  assign out_sig = ~in_sig;\nendmodule\n`;
  }
  if (userCode.includes('ram_block')) {
    helpers += `\nmodule ram_block #(\n  parameter DATA_WIDTH = 8,\n  parameter ADDR_WIDTH = 4\n) (\n  input clk,\n  input [ADDR_WIDTH-1:0] addr,\n  input [DATA_WIDTH-1:0] wdata,\n  output reg [DATA_WIDTH-1:0] rdata\n);\n  always @(*) begin\n    rdata = wdata;\n  end\nendmodule\n`;
  }
  if (userCode.includes('add8')) {
    helpers += `\nmodule add8 (\n  input [7:0] a,\n  input [7:0] b,\n  input cin,\n  output [7:0] sum,\n  output cout\n);\n  assign {cout, sum} = a + b + cin;\nendmodule\n`;
  }
  return helpers;
}

function generateVerilogTestbench(userCode, expectedOutputs) {
  if (!expectedOutputs || expectedOutputs.length === 0) return '';
  const sample0 = expectedOutputs[0];
  const allKeys = Object.keys(sample0).filter(k => k !== 'time');
  const { inputs: parsedInputs, outputs: parsedOutputs } = parseVerilogPorts(userCode);

  let inputKeys = allKeys.filter(k => parsedInputs.has(k));
  let outputKeys = allKeys.filter(k => parsedOutputs.has(k));

  const unclassified = allKeys.filter(k => !parsedInputs.has(k) && !parsedOutputs.has(k));
  unclassified.forEach(k => {
    if (/^out_|_out$|^(q|sum|y|z|cout|done|valid|busy|full|empty|segments|dout)$/.test(k)) {
      outputKeys.push(k);
    } else {
      inputKeys.push(k);
    }
  });

  if (outputKeys.length === 0 && allKeys.length > 0) {
    outputKeys = [allKeys[allKeys.length - 1]];
    inputKeys  = allKeys.filter(k => !outputKeys.includes(k));
  }

  function getWidth(sigName) {
    const widthRe = new RegExp(`(?:input|output|wire|reg)\\s+(?:wire\\s+|reg\\s+)?\\[(\\d+):(\\d+)\\]\\s+[^;,)]*\\b${sigName}\\b`);
    const wm = userCode.match(widthRe);
    if (wm) return Math.abs(parseInt(wm[1]) - parseInt(wm[2])) + 1;
    if (/addr|data|imm|pc|opcode|alu_op|segments/.test(sigName)) return 32;
    return 1;
  }

  let tb = `\`timescale 1ns/1ps\nmodule tb;\n`;
  inputKeys.forEach(k  => { const w = getWidth(k);  tb += w > 1 ? `  reg [${w-1}:0] ${k};\n` : `  reg ${k};\n`; });
  outputKeys.forEach(k => { const w = getWidth(k);  tb += w > 1 ? `  wire [${w-1}:0] ${k};\n` : `  wire ${k};\n`; });

  tb += `\n  top_module uut (\n`;
  tb += [...inputKeys, ...outputKeys].map(k => `    .${k}(${k})`).join(',\n');
  tb += `\n  );\n\n`;

  tb += `  initial begin\n    $display("=== START_SIM ===");\n`;
  
  // Force initialize outputs to expected values to avoid 'x' at start
  outputKeys.forEach(k => {
    const initVal = sample0[k] !== undefined ? sample0[k] : 0;
    tb += `    force uut.${k} = ${initVal};\n`;
  });
  tb += `    #1;\n`;
  outputKeys.forEach(k => {
    tb += `    release uut.${k};\n`;
  });

  const isClocked = inputKeys.includes('clk');

  expectedOutputs.forEach((step, idx) => {
    // 1. Assign non-clk inputs first
    inputKeys.filter(k => k !== 'clk').forEach(k => {
      const val = step[k] !== undefined ? step[k] : 0;
      tb += `    ${k} = ${val};\n`;
    });
    tb += `    #1;\n`;

    // 2. Assign clk input (clock edge occurs here)
    if (inputKeys.includes('clk')) {
      const clkVal = step['clk'] !== undefined ? step['clk'] : 0;
      tb += `    clk = ${clkVal};\n`;
    }
    tb += `    #1;\n`;

    // 3. Compare outputs after 1ns stabilization (skip step 0 for clocked designs to avoid startup 'x' check)
    if (!(idx === 0 && isClocked)) {
      outputKeys.forEach(k => {
        const expVal = step[k] !== undefined ? step[k] : 0;
        tb += `    if (${k} !== ${expVal}) begin\n`;
        tb += `      $display("MISMATCH time=%0d key=${k} act=%0d exp=%0d", $time, ${k}, ${expVal});\n`;
        tb += `    end else begin\n`;
        tb += `      $display("MATCH time=%0d key=${k} act=%0d exp=%0d", $time, ${k}, ${expVal});\n`;
        tb += `    end\n`;
      });
    }

    // 4. Wait for the remainder of the 5ns cycle
    tb += `    #3;\n`;
  });
  tb += `    $display("=== END_SIM ===");\n    $finish;\n  end\nendmodule\n`;
  return tb;
}


app.post('/api/compile', (req, res) => {
  try {
    const payload = req.body || {};
    const userCode = payload.userCode || '';
    const expectedOutputs = payload.expectedOutputs || [];

    if (!userCode.trim()) {
      return res.status(400).json({ compileError: true, log: '# Error: Code is empty.' });
    }

    const os = require('os');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verilearn-'));
    const topPath = path.join(tmpDir, 'top_module.v');
    const tbPath = path.join(tmpDir, 'tb.v');
    const simPath = path.join(tmpDir, 'sim.out');

    const fullUserCode = userCode + getHelperModules(userCode);
    const tbCode = generateVerilogTestbench(fullUserCode, expectedOutputs);
    fs.writeFileSync(topPath, fullUserCode);
    fs.writeFileSync(tbPath, tbCode);

    const cmdCompile = `iverilog -g2012 -o "${simPath}" "${topPath}" "${tbPath}"`;
    exec(cmdCompile, (compileErr, stdout, stderr) => {
      if (compileErr || (stderr && (stderr.includes('syntax error') || stderr.includes('error:')))) {
        const rawErr = (stderr || stdout || compileErr.message);
        const cleanErr = rawErr
          .replace(new RegExp(tmpDir.replace(/\\/g, '\\\\'), 'g'), 'top_module.v')
          .replace(/.*top_module\.v:/g, '# ** Error: top_module.v:');

        const log = `\n# vlog top_module.v\n${cleanErr.trim()}\n# Errors: 1, Warnings: 0`.trim();

        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
        return res.json({
          compileError: true,
          status: 'Compile Error',
          log,
          actualOutputs: [],
          mismatches: expectedOutputs.length
        });
      }

      const cmdSim = `vvp "${simPath}"`;
      exec(cmdSim, (simErr, simStdout, simStderr) => {
        let mismatches = 0;
        const actualOutputsMap = {};

        const lines = simStdout.split('\n');
        lines.forEach(line => {
          if (line.includes('MISMATCH')) {
            mismatches++;
          }
          const match = line.match(/(?:MATCH|MISMATCH) time=(\d+) key=([a-zA-Z0-9_]+) act=([0-9xXzZ]+) exp=(\d+)/);
          if (match) {
            const time = parseInt(match[1], 10);
            const key = match[2];
            const actStr = match[3];
            const act = (actStr.includes('z') || actStr.includes('x') || actStr.includes('Z') || actStr.includes('X')) ? 0 : parseInt(actStr, 10);
            if (!actualOutputsMap[time]) {
              actualOutputsMap[time] = { time };
            }
            actualOutputsMap[time][key] = act;
          }
        });

        const actualOutputs = Object.values(actualOutputsMap);
        const passed = mismatches === 0;

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = now.toTimeString().split(' ')[0];

        const log = `
# do /home/h/hdlbits/runsim.do
# Model Technology ModelSim - Intel FPGA Edition vlog 2020.1 Compiler 2020.02 Feb 28 2020
# Start time: ${timeStr} on ${dateStr}
# vlog top_module.v
# -- Compiling module top_module
# Loading work.tb
# Loading work.top_module
#
# Hint: Output has ${mismatches} mismatches.
# Hint: Total mismatched samples is ${mismatches} out of ${expectedOutputs.length} samples
#
# Simulation finished at ${expectedOutputs.length * 5 + 10} ps
# Mismatches: ${mismatches} in ${expectedOutputs.length} samples
# Errors: 0, Warnings: ${mismatches > 0 ? 1 : 0}
`.trim();

        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}

        res.json({
          compileError: false,
          passed,
          status: passed ? 'Success' : 'Incorrect',
          log,
          actualOutputs,
          mismatches,
          totalSamples: expectedOutputs.length
        });
      });
    });
  } catch (err) {
    res.status(500).json({ compileError: true, log: `# Internal Server Error: ${err.message}` });
  }
});

function notifyClient(tz, eventType, payload = {}) {
    if (sseClients[tz]) {
        sseClients[tz].forEach(client => {
            client.write(`data: ${JSON.stringify({ type: eventType, ...payload })}\n\n`);
        });
    }
}

// API Routes

// GET user
app.get('/api/students/:tz', (req, res) => {
    const tz = req.params.tz;
    db.get("SELECT * FROM students WHERE tz = ?", [tz], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!row) {
            return res.status(404).json({ error: "Not found" });
        }
        if (row.blocked) {
            return res.status(403).json({ error: "blocked", message: "החשבון שלך חסום. פנה למנהל המערכת." });
        }
        
        try {
            res.json({
                name: row.name,
                year: row.year,
                semester: row.semester,
                grades: row.grades ? JSON.parse(row.grades) : {}
            });
        } catch(e) {
            res.status(500).json({ error: "Data parse error" });
        }
    });
});

// POST (Create or Replace) user
app.post('/api/students/:tz', (req, res) => {
    const tz = req.params.tz;
    const { name, year, semester, grades } = req.body;
    
    const gradesStr = grades ? JSON.stringify(grades) : '{}';

    db.get("SELECT grades FROM students WHERE tz = ?", [tz], (err, row) => {
        let oldGrades = {};
        if (row && row.grades) {
            try { oldGrades = JSON.parse(row.grades); } catch (e) {}
        }

        const sql = `INSERT INTO students (tz, name, year, semester, grades, joined_at) 
                     VALUES (?, ?, ?, ?, ?, ?) 
                     ON CONFLICT(tz) DO UPDATE SET 
                        name=excluded.name, 
                        year=excluded.year, 
                        semester=excluded.semester, 
                        grades=excluded.grades`;
        
        db.run(sql, [tz, name || '', year || 'A', semester || '1', gradesStr, Date.now()], function(err) {
            if (err) {
                console.error("Update error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            
            if (grades) {
                const now = Date.now();
                const stmt = db.prepare("INSERT INTO grade_changes (tz, course_id, action, timestamp) VALUES (?, ?, ?, ?)");
                
                for (const courseId in grades) {
                    const newGradeVal = Number(grades[courseId].grade) || 0;
                    if (newGradeVal > 0) {
                        if (!oldGrades[courseId] || (Number(oldGrades[courseId].grade) || 0) === 0) {
                            stmt.run(tz, courseId, 'added', now);
                        } else if ((Number(oldGrades[courseId].grade) || 0) !== newGradeVal) {
                            stmt.run(tz, courseId, 'updated', now);
                        }
                    } else if (newGradeVal === 0 && oldGrades[courseId] && (Number(oldGrades[courseId].grade) || 0) > 0) {
                        stmt.run(tz, courseId, 'removed', now);
                    }
                }
                for (const courseId in oldGrades) {
                    if ((Number(oldGrades[courseId].grade) || 0) > 0 && !grades[courseId]) {
                        stmt.run(tz, courseId, 'removed', now);
                    }
                }
                stmt.finalize();
            }

            res.json({ success: true });
        });
    });
});

// PATCH (Partial Update) user
app.patch('/api/students/:tz', (req, res) => {
    const tz = req.params.tz;
    const updates = req.body;
    
    db.get("SELECT * FROM students WHERE tz = ?", [tz], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "Not found" });
        
        const newName = updates.name !== undefined ? updates.name : row.name;
        const newYear = updates.year !== undefined ? updates.year : row.year;
        const newSemester = updates.semester !== undefined ? updates.semester : row.semester;
        
        let newGrades = row.grades;
        let parsedOldGrades = {};
        if (row.grades) {
            try { parsedOldGrades = JSON.parse(row.grades); } catch (e) {}
        }

        if (updates.grades !== undefined) {
            newGrades = JSON.stringify(updates.grades);
        }

        db.run("UPDATE students SET name = ?, year = ?, semester = ?, grades = ? WHERE tz = ?", 
            [newName, newYear, newSemester, newGrades, tz], 
            function(err) {
                if (err) return res.status(500).json({ error: "Database error" });

                if (updates.grades !== undefined) {
                    const now = Date.now();
                    const stmt = db.prepare("INSERT INTO grade_changes (tz, course_id, action, timestamp) VALUES (?, ?, ?, ?)");
                    
                    const newGradesObj = updates.grades;
                    for (const courseId in newGradesObj) {
                        const newGradeVal = Number(newGradesObj[courseId].grade) || 0;
                        if (newGradeVal > 0) {
                            if (!parsedOldGrades[courseId] || (Number(parsedOldGrades[courseId].grade) || 0) === 0) {
                                stmt.run(tz, courseId, 'added', now);
                            } else if ((Number(parsedOldGrades[courseId].grade) || 0) !== newGradeVal) {
                                stmt.run(tz, courseId, 'updated', now);
                            }
                        } else if (newGradeVal === 0 && parsedOldGrades[courseId] && (Number(parsedOldGrades[courseId].grade) || 0) > 0) {
                            stmt.run(tz, courseId, 'removed', now);
                        }
                    }
                    for (const courseId in parsedOldGrades) {
                        if ((Number(parsedOldGrades[courseId].grade) || 0) > 0 && !newGradesObj[courseId]) {
                            stmt.run(tz, courseId, 'removed', now);
                        }
                    }
                    stmt.finalize();
                }

                res.json({ success: true });
            }
        );
    });
});

// GET users (admin: full info)
app.get('/api/users', requireAdmin, (req, res) => {
    db.all("SELECT tz, name, year, semester, blocked, chat_blocked FROM students", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
    });
});

// PATCH block/unblock student
app.patch('/api/students/:tz/block', requireAdmin, (req, res) => {
    const tz = req.params.tz;
    const { blocked } = req.body;
    db.run("UPDATE students SET blocked = ? WHERE tz = ?", [blocked ? 1 : 0, tz], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true });
    });
});

// DELETE student
app.delete('/api/students/:tz', requireAdmin, (req, res) => {
    const tz = req.params.tz;
    db.run("DELETE FROM students WHERE tz = ?", [tz], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true });
    });
});

// POST permission
app.post('/api/drive/permissions', requireAdmin, (req, res) => {
    const { path: itemPath, visibility, users } = req.body;
    const usersStr = JSON.stringify(users || []);
    
    // if visibility is 'inherit', we can just delete the record to let it inherit
    if (visibility === 'inherit') {
        db.run("DELETE FROM drive_permissions WHERE path = ?", [itemPath], function(err) {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ success: true });
        });
        return;
    }

    const sql = `INSERT INTO drive_permissions (path, visibility, users) 
                 VALUES (?, ?, ?) 
                 ON CONFLICT(path) DO UPDATE SET 
                    visibility=excluded.visibility, 
                    users=excluded.users`;
    db.run(sql, [itemPath, visibility, usersStr], function(err) {
        if (err) {
            console.error("Permission update error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true });
    });
});

// Helper to wrap db query
const getPermissions = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM drive_permissions", [], (err, rows) => {
            if (err) return reject(err);
            const perms = {};
            rows.forEach(r => { 
                perms[r.path] = { visibility: r.visibility, users: JSON.parse(r.users || '[]') }; 
            });
            resolve(perms);
        });
    });
};

const getCourseFolders = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM course_folders", [], (err, rows) => {
            if (err) return reject(err);
            const mapping = {};
            rows.forEach(r => {
                mapping[r.folder_path] = r.course_id;
            });
            resolve(mapping);
        });
    });
};

// Course linking API
app.post('/api/courses/link', requireAdmin, (req, res) => {
    const { courseId, folderPath } = req.body;
    db.run("INSERT INTO course_folders (course_id, folder_path) VALUES (?, ?) ON CONFLICT(course_id) DO UPDATE SET folder_path=excluded.folder_path", 
        [courseId, folderPath], function(err) {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ success: true });
    });
});

app.get('/api/courses/link/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    db.get("SELECT folder_path FROM course_folders WHERE course_id = ?", [courseId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.json({ folderPath: null });
        res.json({ folderPath: row.folder_path });
    });
});

// Directory Caching System
let dirCacheMap = {}; // { '/path': { lastUpdate: timestamp, items: [ ... ] } }
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

app.post('/api/drive/refresh', requireAdmin, async (req, res) => {
    // Clear the cache manually
    dirCacheMap = {};
    res.json({ success: true, message: "Cache cleared successfully" });
});

// Drive API Route
app.get('/api/drive/list', async (req, res) => {
    try {
        let queryPath = req.query.path || '/';
        const tz = req.query.tz || '';
        const editMode = req.query.editMode === 'true';
        const isAdmin = isAdminTZ(tz);
        const shareToken = req.query.share || '';

        let sharedFolder = null;
        if (shareToken) {
            sharedFolder = await new Promise((resolve) => {
                db.get("SELECT * FROM public_shares WHERE id = ?", [shareToken], (err, row) => {
                    resolve(row || null);
                });
            });
            if (!sharedFolder) {
                return res.status(403).json({ error: "Invalid share token" });
            }
            if (sharedFolder.require_auth === 1) {
                const studentExists = await new Promise((resolve) => {
                    db.get("SELECT 1 FROM students WHERE tz = ? AND blocked = 0", [tz], (err, row) => {
                        resolve(!!row);
                    });
                });
                if (!studentExists) {
                    return res.status(401).json({ error: "Authentication required" });
                }
            } else {
                if (queryPath === '/' || queryPath === '' || !queryPath.startsWith(sharedFolder.path)) {
                    queryPath = sharedFolder.path;
                } else if (!isSubpath(sharedFolder.path, queryPath)) {
                    return res.status(403).json({ error: "Access denied" });
                }
            }
            
            const baseDir = fs.existsSync('/app/studies') ? '/app/studies' : 'D:/לימודים רזיאל';
            const sharedResolvedPath = path.join(baseDir, sharedFolder.path);
            const sharedStat = fs.existsSync(sharedResolvedPath) ? fs.statSync(sharedResolvedPath) : null;
            if (sharedStat && sharedStat.isFile()) {
                const fileName = path.basename(sharedFolder.path);
                return res.json({
                    files: [{
                        name: fileName,
                        isDirectory: false,
                        size: sharedStat.size,
                        path: sharedFolder.path
                    }],
                    currentPath: sharedFolder.path,
                    sharedRoot: sharedFolder.path,
                    isFileShare: true
                });
            }
        }

        const perms = await getPermissions();
        const courseLinks = await getCourseFolders();

        function hasAccess(itemPath) {
            if (sharedFolder && isSubpath(sharedFolder.path, itemPath)) {
                if (sharedFolder.bypass_rules) return true;
            }
            if (isAdmin && editMode) return true;
            
            let current = itemPath;
            let permission = null;
            while (current.length > 0) {
                if (perms[current]) {
                    permission = perms[current];
                    break;
                }
                const lastSlash = current.lastIndexOf('/');
                if (lastSlash <= 0) {
                    if (current !== '/' && perms['/']) permission = perms['/'];
                    break;
                }
                current = current.substring(0, lastSlash);
            }

            if (!permission) return true; // Default everyone
            
            if (permission.visibility === 'none') return false;
            if (permission.visibility === 'everyone') return true;
            if (permission.visibility === 'only') return permission.users.includes(tz);
            if (permission.visibility === 'except') return !permission.users.includes(tz);
            
            return true;
        }

        // Check if the user is even allowed to see the requested folder
        const normalizedPath = queryPath === '/' ? '/' : queryPath.replace(/\/$/, '');
        if (!hasAccess(normalizedPath)) {
            return res.status(403).json({ error: "Access denied due to permissions" });
        }

        const baseDir = fs.existsSync('/app/studies') ? '/app/studies' : 'D:/לימודים רזיאל';
        const resolvedPath = path.join(baseDir, queryPath);
        
        // Ensure the path is within the baseDir to prevent directory traversal
        if (!resolvedPath.startsWith(path.resolve(baseDir))) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Check lazy cache
        let rawItems = [];
        const cachedFolder = dirCacheMap[normalizedPath];
        const now = Date.now();
        
        if (cachedFolder && (now - cachedFolder.lastUpdate < CACHE_TTL_MS)) {
            rawItems = cachedFolder.items;
        } else {
            // Not in cache or expired, fetch from disk
            if (!fs.existsSync(resolvedPath)) {
                return res.json({ files: [] }); 
            }
            
            const stat = await fs.promises.stat(resolvedPath);
            if (!stat.isDirectory()) {
                return res.status(400).json({ error: "Path is not a directory" });
            }

            const items = await fs.promises.readdir(resolvedPath, { withFileTypes: true });
            
            for (const item of items) {
                const itemPath = (normalizedPath === '/' ? '/' + item.name : normalizedPath + '/' + item.name).replace(/\\/g, '/');
                
                let size = 0;
                if (item.isFile()) {
                    try {
                        const itemStat = await fs.promises.stat(path.join(resolvedPath, item.name));
                        size = itemStat.size;
                    } catch(e) {}
                }
                
                rawItems.push({
                    name: item.name,
                    isDirectory: item.isDirectory(),
                    size: size,
                    path: itemPath
                });
            }
            
            // Sort: directories first, then alphabetically
            rawItems.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
            });

            // Save to cache
            dirCacheMap[normalizedPath] = { lastUpdate: now, items: rawItems };
        }

        let metadataMap = {};
        if (isAdmin) {
            try {
                const metadataRows = await new Promise((resolve, reject) => {
                    db.all("SELECT * FROM file_metadata WHERE path LIKE ?", [`${normalizedPath === '/' ? '' : normalizedPath}/%`], (err, rows) => {
                        if (err) reject(err); else resolve(rows || []);
                    });
                });
                metadataRows.forEach(r => metadataMap[r.path] = { uploader_tz: r.uploader_tz, uploader_name: r.uploader_name });
            } catch(e) {}
        }

        const files = [];
        for (const item of rawItems) {
            if (!hasAccess(item.path)) continue;

            const exactPerm = perms[item.path] || { visibility: 'inherit', users: [] };
            files.push({
                ...item,
                permission: isAdmin ? exactPerm : undefined,
                metadata: isAdmin ? metadataMap[item.path] : undefined,
                courseId: courseLinks[item.path] || null
            });
        }
        
        res.json({ files, currentPath: queryPath, sharedRoot: sharedFolder ? sharedFolder.path : undefined, cached: true });
    } catch (err) {
        console.error("Error listing directory:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Serve the files dynamically with permission checks
app.get('/studies/*', async (req, res) => {
    try {
        const reqPath = decodeURIComponent(req.path.substring(8)); // remove '/studies'
        const tz = req.query.tz || '';
        const isAdmin = isAdminTZ(tz);
        const shareToken = req.query.share || '';
        
        let sharedFolder = null;
        if (shareToken) {
            sharedFolder = await new Promise((resolve) => {
                db.get("SELECT * FROM public_shares WHERE id = ?", [shareToken], (err, row) => {
                    resolve(row || null);
                });
            });
            if (!sharedFolder) {
                return res.status(403).send("Access Denied");
            }
            if (sharedFolder.require_auth === 1) {
                const studentExists = await new Promise((resolve) => {
                    db.get("SELECT 1 FROM students WHERE tz = ? AND blocked = 0", [tz], (err, row) => {
                        resolve(!!row);
                    });
                });
                if (!studentExists) {
                    return res.status(403).send("Access Denied");
                }
            } else {
                if (!isSubpath(sharedFolder.path, reqPath)) {
                    return res.status(403).send("Access Denied");
                }
            }
        }
        
        const baseDir = fs.existsSync('/app/studies') ? '/app/studies' : 'D:/לימודים רזיאל';
        const resolvedPath = path.join(baseDir, reqPath);
        
        // Prevent directory traversal
        if (!resolvedPath.startsWith(path.resolve(baseDir))) {
            return res.status(403).send("Access Denied");
        }

        const perms = await getPermissions();

        function hasAccess(itemPath) {
            if (sharedFolder && isSubpath(sharedFolder.path, itemPath)) {
                if (sharedFolder.bypass_rules) return true;
            }
            if (isAdmin) return true; // Admins can always download
            
            let current = itemPath;
            let permission = null;
            while (current.length > 0) {
                if (perms[current]) {
                    permission = perms[current];
                    break;
                }
                const lastSlash = current.lastIndexOf('/');
                if (lastSlash <= 0) {
                    if (current !== '/' && perms['/']) permission = perms['/'];
                    break;
                }
                current = current.substring(0, lastSlash);
            }

            if (!permission) return true; // Default everyone
            
            if (permission.visibility === 'none') return false;
            if (permission.visibility === 'everyone') return true;
            if (permission.visibility === 'only') return permission.users.includes(tz);
            if (permission.visibility === 'except') return !permission.users.includes(tz);
            
            return true;
        }

        if (!hasAccess(reqPath)) {
            return res.status(403).send("<h1>Access Denied / גישה נדחתה</h1><p>אין לך הרשאה לגשת לקובץ זה.</p>");
        }

        // Track file download (only for actual files, not directory listings)
        try {
            const stat = fs.statSync(resolvedPath);
            if (stat.isFile()) {
                db.run("INSERT INTO file_downloads (path, tz, timestamp) VALUES (?, ?, ?)", [reqPath, tz || 'unknown', Date.now()]);
            }
        } catch(e) {}

        res.sendFile(resolvedPath);
    } catch(err) {
        console.error("Error serving file:", err);
        res.status(500).send("Server Error");
    }
});

// Edit password verification
app.post('/api/auth/edit-password', authLimiter, (req, res) => {
    const { password } = req.body;
    const editPassword = process.env.EDIT_PASSWORD;
    if (!editPassword) {
        return res.status(500).json({ error: 'EDIT_PASSWORD not configured' });
    }
    if (timingSafeCompare(password, editPassword)) {
        return res.json({ success: true });
    }
    return res.status(401).json({ error: 'wrong_password' });
});

app.get('/api/drive/download-zip', async (req, res) => {
    try {
        let reqPath = decodeURIComponent(req.query.path || '/');
        const tz = req.query.tz || '';
        const isAdmin = isAdminTZ(tz);
        const shareToken = req.query.share || '';
        
        let sharedFolder = null;
        if (shareToken) {
            sharedFolder = await new Promise((resolve) => {
                db.get("SELECT * FROM public_shares WHERE id = ?", [shareToken], (err, row) => {
                    resolve(row || null);
                });
            });
            if (!sharedFolder) {
                return res.status(403).send("Access Denied");
            }
            if (sharedFolder.require_auth === 1) {
                const studentExists = await new Promise((resolve) => {
                    db.get("SELECT 1 FROM students WHERE tz = ? AND blocked = 0", [tz], (err, row) => {
                        resolve(!!row);
                    });
                });
                if (!studentExists) {
                    return res.status(403).send("Access Denied");
                }
            } else {
                if (reqPath === '/' || reqPath === '' || !reqPath.startsWith(sharedFolder.path)) {
                    reqPath = sharedFolder.path;
                } else if (!isSubpath(sharedFolder.path, reqPath)) {
                    return res.status(403).send("Access denied to this folder");
                }
            }
        }
        
        const baseDir = fs.existsSync('/app/studies') ? '/app/studies' : 'D:/לימודים רזיאל';
        const resolvedPath = path.join(baseDir, reqPath);
        
        if (!resolvedPath.startsWith(path.resolve(baseDir))) {
            return res.status(403).send("Access Denied");
        }
        
        const stats = await fs.promises.stat(resolvedPath).catch(() => null);
        if (!stats || !stats.isDirectory()) {
            return res.status(404).send("Directory not found");
        }
        
        const perms = await getPermissions();

        function hasAccess(itemPath) {
            if (sharedFolder && isSubpath(sharedFolder.path, itemPath)) {
                if (sharedFolder.bypass_rules) return true;
            }
            if (isAdmin) return true;
            let current = itemPath;
            let permission = null;
            while (current.length > 0) {
                if (perms[current]) { permission = perms[current]; break; }
                const lastSlash = current.lastIndexOf('/');
                if (lastSlash <= 0) { if (current !== '/' && perms['/']) permission = perms['/']; break; }
                current = current.substring(0, lastSlash);
            }
            if (!permission || permission.visibility === 'inherit') return true;
            if (permission.visibility === 'public') return true;
            if (permission.visibility === 'private') return false;
            if (permission.visibility === 'restricted') return permission.users.includes(tz);
            return true;
        }

        if (reqPath !== '/' && reqPath !== '' && !hasAccess(reqPath)) {
            return res.status(403).send("Access Denied to this folder");
        }

        res.attachment(`${path.basename(resolvedPath) || 'download'}.zip`);
        const archive = archiver('zip', { zlib: { level: 5 } });
        
        archive.on('error', function(err) {
            console.error("Zip generation error:", err);
            if (!res.headersSent) res.status(500).send({error: err.message});
        });

        archive.pipe(res);

        async function addFolder(dirPath, zipPath) {
            const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
            for (const item of items) {
                const itemFullPath = path.join(dirPath, item.name);
                const itemZipPath = zipPath ? `${zipPath}/${item.name}` : item.name;
                
                const virtualPath = (reqPath === '/' || reqPath === '' ? '' : reqPath) + '/' + itemZipPath;
                if (!hasAccess(virtualPath)) continue;

                if (item.isDirectory()) {
                    await addFolder(itemFullPath, itemZipPath);
                } else {
                    archive.file(itemFullPath, { name: itemZipPath });
                }
            }
        }

        await addFolder(resolvedPath, '');
        archive.finalize();

    } catch (err) {
        console.error("Zip error:", err);
        if (!res.headersSent) res.status(500).send("Error generating zip");
    }
});

// Admin login – check password then send Telegram approval request
app.post('/api/auth/admin-login', authLimiter, (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || !timingSafeCompare(password, adminPassword)) {
        return res.status(401).json({ error: 'wrong_password' });
    }
    const sessionId = generateSessionId();
    adminSessions[sessionId] = { approved: false, ts: Date.now() };
    // Clean old sessions
    Object.keys(adminSessions).forEach(k => {
        if (Date.now() - adminSessions[k].ts > 5 * 60 * 1000) delete adminSessions[k];
    });
    // Clean old pending logins
    if (global.adminPendingLogins) {
        Object.keys(global.adminPendingLogins).forEach(msgId => {
            const sid = global.adminPendingLogins[msgId];
            if (!adminSessions[sid]) {
                delete global.adminPendingLogins[msgId];
            }
        });
    }
    // Send Telegram approval request
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
        const msg = encodeURIComponent(`\u26a0\ufe0f \u05d1\u05e7\u05e9\u05ea \u05db\u05e0\u05d9\u05e1\u05d4 \u05dc\u05e4\u05d0\u05e0\u05dc \u05d4\u05e0\u05d9\u05d4\u05d5\u05dc\n\u05d4\u05d0\u05dd \u05d0\u05ea\u05d4 \u05de\u05d0\u05e9\u05e8 \u05d0\u05ea \u05d4\u05db\u05e0\u05d9\u05e1\u05d4?`);
        const keyboard = JSON.stringify({
            inline_keyboard: [[
                { text: '\u2705 \u05d0\u05e9\u05e8 \u05db\u05e0\u05d9\u05e1\u05d4', callback_data: `approve_admin_${sessionId}` },
                { text: '\u274c \u05d3\u05d7\u05d4', callback_data: `deny_admin_${sessionId}` }
            ]]
        });
        require('axios').post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: `⚠️ בקשת כניסה לפאנל הניהול\nהאם אתה מאשר את הכניסה?`,
            reply_markup: JSON.parse(keyboard)
        }).then(response => {
            const messageId = response.data?.result?.message_id;
            console.log("Telegram login request sent. Message ID:", messageId, "Session ID:", sessionId);
            if (messageId) {
                global.adminPendingLogins = global.adminPendingLogins || {};
                global.adminPendingLogins[messageId] = sessionId;
            }
        }).catch(e => console.error('Telegram error:', e.message));
    }
    res.json({ sessionId });
});

// Admin status polling – check if Telegram approval was given
app.get('/api/auth/admin-status/:sessionId', (req, res) => {
    const session = adminSessions[req.params.sessionId];
    if (!session) return res.status(404).json({ error: 'session_not_found' });
    if (Date.now() - session.ts > 5 * 60 * 1000) {
        delete adminSessions[req.params.sessionId];
        return res.status(410).json({ error: 'session_expired' });
    }
    res.json({ approved: session.approved, denied: session.denied || false });
});

// --- Advanced Telegram Polling ---
let lastUpdateId = 0;
const telegramState = {}; // tz -> { action: 'reply_student', tz }

function handleTelegramMessage(msg, token) {
    console.log("Received Telegram message:", msg.text, "Message ID:", msg.message_id);
    console.log("Telegram msg JSON:", JSON.stringify(msg));
    if (msg.reply_to_message) {
        console.log("This is a reply to message ID:", msg.reply_to_message.message_id);
        console.log("Current pending logins map:", global.adminPendingLogins);
    }
    
    if (!msg.text) return;
    const text = msg.text;
    const chatId = msg.chat.id;
    
    // Check if we can identify a pending session ID
    let sessionId = null;
    let repliedMsgId = null;

    // 1. Check if this is an explicit reply to a login request message
    if (msg.reply_to_message && msg.reply_to_message.message_id) {
        repliedMsgId = msg.reply_to_message.message_id;
        global.adminPendingLogins = global.adminPendingLogins || {};
        sessionId = global.adminPendingLogins[repliedMsgId];
        console.log("Matched session ID for reply:", sessionId);
    }
    
    // 2. If it's a private chat and not an explicit reply, find the most recent pending session
    if (!sessionId && msg.chat && msg.chat.type === 'private') {
        let newestSessionId = null;
        let newestTs = 0;
        
        Object.keys(adminSessions).forEach(sid => {
            const sess = adminSessions[sid];
            if (!sess.approved && !sess.denied && sess.ts > newestTs) {
                newestTs = sess.ts;
                newestSessionId = sid;
            }
        });
        
        sessionId = newestSessionId;
        console.log("Matched newest pending session ID in private chat:", sessionId);
    }
    
    if (sessionId && adminSessions[sessionId]) {
        const cleanText = text.trim();
        if (cleanText === 'כן' || cleanText.toLowerCase() === 'yes') {
            console.log("Approving admin session:", sessionId);
            adminSessions[sessionId].approved = true;
            sendTelegramMessage('✅ אושר סשן מנהל!');
            
            // Clean up keyboard buttons on the original message if mapped
            let mappedMsgId = repliedMsgId;
            if (!mappedMsgId && global.adminPendingLogins) {
                Object.keys(global.adminPendingLogins).forEach(msgId => {
                    if (global.adminPendingLogins[msgId] === sessionId) {
                        mappedMsgId = parseInt(msgId);
                    }
                });
            }
            if (mappedMsgId) {
                require('axios').post(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
                    chat_id: chatId,
                    message_id: mappedMsgId,
                    reply_markup: null
                }).catch(()=>{});
                delete global.adminPendingLogins[mappedMsgId];
            }
            return;
        } else if (cleanText === 'לא' || cleanText.toLowerCase() === 'no') {
            console.log("Denying admin session:", sessionId);
            adminSessions[sessionId].denied = true;
            sendTelegramMessage('❌ סשן מנהל נדחה');
            
            // Clean up keyboard buttons on the original message if mapped
            let mappedMsgId = repliedMsgId;
            if (!mappedMsgId && global.adminPendingLogins) {
                Object.keys(global.adminPendingLogins).forEach(msgId => {
                    if (global.adminPendingLogins[msgId] === sessionId) {
                        mappedMsgId = parseInt(msgId);
                    }
                });
            }
            if (mappedMsgId) {
                require('axios').post(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
                    chat_id: chatId,
                    message_id: mappedMsgId,
                    reply_markup: null
                }).catch(()=>{});
                delete global.adminPendingLogins[mappedMsgId];
            }
            return;
        }
    }
    
    // Command: /pending
    if (text === '/pending') {
        db.all("SELECT * FROM proposals WHERE status = 'pending'", (err, rows) => {
            if (err || !rows || rows.length === 0) {
                return sendTelegramMessage('אין כרגע הצעות ממתינות.');
            }
            let response = '📋 הצעות ממתינות:\n\n';
            rows.forEach(r => {
                response += `- סטודנט: ${r.tz}\n  נתיב מוצע: ${r.proposed_path}\n  מספר קבצים: ${r.files_count}\n\n`;
            });
            sendTelegramMessage(response);
        });
        return;
    }

    // Command: /stats
    if (text === '/stats') {
        const statsFile = require('path').join(__dirname, 'data', 'stats_config.json');
        let lastCheck = 0;
        if (require('fs').existsSync(statsFile)) {
            try {
                lastCheck = JSON.parse(require('fs').readFileSync(statsFile, 'utf8')).lastCheck || 0;
            } catch(e){}
        }
        
        db.get("SELECT COUNT(*) as newCount FROM students WHERE joined_at > ?", [lastCheck], (err, row1) => {
            db.get("SELECT COUNT(*) as totalCount FROM students", [], (err, row2) => {
                const newCount = row1 ? row1.newCount : 0;
                const totalCount = row2 ? row2.totalCount : 0;
                let msg = `📊 סטטיסטיקות הרשמה:\n\n`;
                msg += `סה"כ סטודנטים רשומים: ${totalCount}\n`;
                msg += `סטודנטים חדשים מאז הבדיקה האחרונה: ${newCount} 🆕\n`;
                
                try {
                    require('fs').writeFileSync(statsFile, JSON.stringify({ lastCheck: Date.now() }));
                } catch(e){}
                sendTelegramMessage(msg);
            });
        });
        return;
    }
    
    // Check state for this chatId
    if (telegramState[chatId] && telegramState[chatId].action === 'reply_student') {
        const targetTz = telegramState[chatId].tz;
        db.run("INSERT INTO chat_messages (tz, message, sender, timestamp) VALUES (?, ?, ?, ?)", [targetTz, text, 'admin', Date.now()]);
        delete telegramState[chatId];
        sendTelegramMessage('✅ הודעתך נשלחה לסטודנט.');
        notifyClient(targetTz, 'new_chat_message');
        return;
    }
}

function handleTelegramCallback(cb, token) {
    const cbData = cb.data;
    const chatId = cb.message.chat.id;
    const msgId = cb.message.message_id;
    
    const answer = (text) => {
        require('axios').post(`https://api.telegram.org/bot${token}/answerCallbackQuery`, { callback_query_id: cb.id, text }).catch(()=>{});
    };
    const updateButtons = (keyboard) => {
        require('axios').post(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
            chat_id: chatId, message_id: msgId, reply_markup: keyboard ? { inline_keyboard: keyboard } : null
        }).catch(()=>{});
    };

    if (cbData.startsWith('approve_admin_')) {
        const sessionId = cbData.replace('approve_admin_', '');
        if (adminSessions[sessionId]) adminSessions[sessionId].approved = true;
        answer('✅ אושר!');
        updateButtons([]);
    } else if (cbData.startsWith('deny_admin_')) {
        const sessionId = cbData.replace('deny_admin_', '');
        if (adminSessions[sessionId]) adminSessions[sessionId].denied = true;
        answer('❌ נדחה');
        updateButtons([]);
    }
    
    // Spam Ignore
    else if (cbData === 'ignore_spam') {
        answer('התעלמת');
        updateButtons([]);
    }
    
    // Block Confirm
    else if (cbData.startsWith('confirm_block_')) {
        const tz = cbData.replace('confirm_block_', '');
        updateButtons([
            [{ text: '⚠️ אתה בטוח שברצונך לחסום?', callback_data: 'none' }],
            [{ text: 'כן, חסום', callback_data: `do_block_${tz}` }, { text: 'ביטול', callback_data: 'cancel_block' }]
        ]);
        answer();
    }
    else if (cbData === 'cancel_block') {
        answer('בוטל');
        updateButtons([]);
    }
    else if (cbData.startsWith('do_block_')) {
        const tz = cbData.replace('do_block_', '');
        db.run("UPDATE students SET blocked = 1 WHERE tz = ?", [tz]);
        answer('✅ הסטודנט נחסם!');
        updateButtons([]);
        sendTelegramMessage(`הסטודנט ${tz} נחסם בהצלחה.`);
    }
    
    // Virus options
    else if (cbData.startsWith('destroy_prop_')) {
        const pid = cbData.replace('destroy_prop_', '');
        db.run("UPDATE proposals SET status = 'destroyed' WHERE id = ?", [pid]);
        answer('🗑️ הושמד');
        updateButtons([]);
    }
    else if (cbData.startsWith('force_prop_')) {
        const pid = cbData.replace('force_prop_', '');
        // Just move status back to pending and show standard approve buttons
        db.run("UPDATE proposals SET status = 'pending' WHERE id = ?", [pid]);
        answer('הוחזר למצב ממתין');
        updateButtons([
            [
                { text: '✅ אישור', callback_data: `appr_prop_${pid}` },
                { text: '❌ דחייה', callback_data: `rej_prop_${pid}` }
            ]
        ]);
    }
    
    // Chat reply
    else if (cbData.startsWith('reply_chat_')) {
        const tz = cbData.replace('reply_chat_', '');
        telegramState[chatId] = { action: 'reply_student', tz };
        sendTelegramMessage('הקלד את הודעת התגובה שלך כעת:');
        answer();
    }
    else if (cbData.startsWith('block_chat_')) {
        const tz = cbData.replace('block_chat_', '');
        db.run("UPDATE students SET chat_blocked = 1 WHERE tz = ?", [tz]);
        answer('✅ הצ\'אט נחסם לסטודנט');
        updateButtons([
            [{ text: '💬 השב', callback_data: `reply_chat_${tz}` }, { text: '✅ שחרר צ\'אט', callback_data: `unblock_chat_${tz}` }]
        ]);
    }
    else if (cbData.startsWith('unblock_chat_')) {
        const tz = cbData.replace('unblock_chat_', '');
        db.run("UPDATE students SET chat_blocked = 0 WHERE tz = ?", [tz]);
        answer('✅ חסימת הצ\'אט שוחררה');
        updateButtons([
            [{ text: '💬 השב', callback_data: `reply_chat_${tz}` }, { text: '🚫 חסום צ\'אט', callback_data: `block_chat_${tz}` }]
        ]);
    }
    
    // Approve / Reject proposal
    else if (cbData.startsWith('rej_prop_')) {
        const pid = cbData.replace('rej_prop_', '');
        db.get("SELECT tz, proposed_path FROM proposals WHERE id = ?", [pid], (err, row) => {
            if (row) {
                db.run("INSERT INTO chat_messages (tz, message, sender, timestamp) VALUES (?, ?, 'admin', ?)", 
                    [row.tz, `הצעתך להעלאת קבצים לנתיב ${row.proposed_path} נדחתה על ידי מנהל המערכת.`, Date.now()]);
                notifyClient(row.tz, 'new_chat_message');
            }
        });
        db.run("UPDATE proposals SET status = 'rejected' WHERE id = ?", [pid]);
        answer('❌ נדחה');
        updateButtons([]);
    }
    else if (cbData.startsWith('appr_prop_')) {
        const pid = cbData.replace('appr_prop_', '');
        
        db.get("SELECT * FROM proposals WHERE id = ?", [pid], async (err, proposal) => {
            if (err || !proposal) return answer('הצעה לא נמצאה');
            
            db.run("UPDATE proposals SET status = 'approved' WHERE id = ?", [pid]);
            answer('✅ אושר!');
            updateButtons([]);
            
            // Move files from quarantine to destination
            const fs = require('fs');
            const path = require('path');
            const destPath = path.join(__dirname, 'studies', proposal.proposed_path);
            
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            
            db.get("SELECT name FROM students WHERE tz = ?", [proposal.tz], (err, student) => {
                const uploaderName = student ? student.name : 'לא ידוע';
                const now = Date.now();
                
                if (proposal.files_json) {
                    try {
                        const files = JSON.parse(proposal.files_json);
                        files.forEach(f => {
                            const source = f.path;
                            const target = path.join(destPath, f.originalname);
                            if (fs.existsSync(source)) {
                                fs.copyFileSync(source, target);
                                fs.unlinkSync(source);
                                
                                const relPath = ("/" + proposal.proposed_path + "/" + f.originalname).replace(/\/+/g, '/');
                                db.run("INSERT OR REPLACE INTO file_metadata (path, uploader_tz, uploader_name, timestamp) VALUES (?, ?, ?, ?)",
                                    [relPath, proposal.tz, uploaderName, now]);
                            }
                        });
                    } catch(e) { console.error("Error moving files", e); }
                }
                
                // CLEAR DIRECTORY CACHE so the new files show up instantly for the student
                dirCacheMap = {};
                
                db.run("INSERT INTO chat_messages (tz, message, sender, timestamp) VALUES (?, ?, 'admin', ?)", 
                        [proposal.tz, `הצעתך להעלאת קבצים לנתיב ${proposal.proposed_path} אושרה! הקבצים הועברו בהצלחה.`, Date.now()]);
                notifyClient(proposal.tz, 'new_chat_message');
            });
            notifyClient(proposal.tz, 'file_approved');
        });
    }
    // VirusTotal Online Scan
    else if (cbData.startsWith('vt_scan_')) {
        const pid = cbData.replace('vt_scan_', '');
        const vtKey = process.env.VT_API_KEY;
        if (!vtKey) {
            answer('שגיאה: חסר מפתח מפתח VT_API_KEY בקובץ .env');
            return;
        }
        answer('מתחיל סריקה אונליין...');
        sendTelegramMessage('מעלה קבצים לסריקה ב-VirusTotal... אנא המתן לתשובה.');
        
        // Background scan
        db.get("SELECT files_json FROM proposals WHERE id = ?", [pid], async (err, proposal) => {
            if (!proposal || !proposal.files_json) return;
            const files = JSON.parse(proposal.files_json);
            if(files.length === 0) return;
            
            try {
                const FormData = require('form-data');
                const axios = require('axios');
                const fs = require('fs');
                
                // Scan only the first file for simplicity to avoid rate limits (4/min)
                const file = files[0];
                const form = new FormData();
                form.append('file', fs.createReadStream(file.path));
                
                const uploadRes = await axios.post('https://www.virustotal.com/api/v3/files', form, {
                    headers: { ...form.getHeaders(), 'x-apikey': vtKey }
                });
                
                const analysisId = uploadRes.data.data.id;
                sendTelegramMessage(`הקובץ ${file.originalname} נשלח ל-VirusTotal (מזהה: ${analysisId}). ממתין לתוצאות הסריקה... ⏳`);
                
                let attempts = 0;
                const pollInterval = setInterval(async () => {
                    attempts++;
                    try {
                        const res = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                            headers: { 'x-apikey': vtKey }
                        });
                        const status = res.data.data.attributes.status;
                        if (status === 'completed') {
                            clearInterval(pollInterval);
                            const stats = res.data.data.attributes.stats;
                            const msg = `✅ סריקת וירוסים הושלמה לקובץ: ${file.originalname}\n\n` +
                                        `🦠 זדוני (Malicious): ${stats.malicious}\n` +
                                        `⚠️ חשוד (Suspicious): ${stats.suspicious}\n` +
                                        `✅ בטוח (Harmless): ${stats.harmless}\n` +
                                        `❓ לא מזוהה (Undetected): ${stats.undetected}`;
                            sendTelegramMessage(msg);
                        } else if (attempts >= 24) { // timeout after 2 minutes
                            clearInterval(pollInterval);
                            sendTelegramMessage(`⚠️ סריקת וירוסים לקובץ ${file.originalname} לקחה יותר מדי זמן (מזהה: ${analysisId}). נא לבדוק בממשק VirusTotal.`);
                        }
                    } catch(e) {
                        clearInterval(pollInterval);
                        console.error("VT Poll Error:", e.response?.data || e.message);
                        sendTelegramMessage(`שגיאה בבדיקת תוצאות VirusTotal עבור ${file.originalname}`);
                    }
                }, 5000);
                
            } catch(e) {
                console.error("VT Error:", e.response?.data || e.message);
                sendTelegramMessage(`שגיאה בסריקה מול VirusTotal: ${e.message}`);
            }
        });
    }
    // Interactive Nav for Proposal
    else if (cbData.startsWith('nav_prop_')) {
        const pid = cbData.replace('nav_prop_', '');
        if(!global.navMaps) global.navMaps = {};
        const mapId = require('crypto').randomBytes(4).toString('hex');
        global.navMaps[mapId] = { pid, currentPath: '/' };
        answer('פותח ניווט...');
        sendNavKeyboard(chatId, null, mapId);
    }
    else if (cbData.startsWith('nav_up_')) {
        const mapId = cbData.replace('nav_up_', '');
        if(global.navMaps && global.navMaps[mapId]) {
            const map = global.navMaps[mapId];
            if(map.currentPath !== '/') {
                map.currentPath = require('path').dirname(map.currentPath).replace(/\\/g, '/');
                if(!map.currentPath.startsWith('/')) map.currentPath = '/' + map.currentPath;
            }
            sendNavKeyboard(chatId, msgId, mapId);
        }
        answer();
    }
    else if (cbData.startsWith('nav_in_')) {
        const parts = cbData.split('_');
        const mapId = parts[2];
        const idx = parseInt(parts[3]);
        if(global.navMaps && global.navMaps[mapId]) {
            const map = global.navMaps[mapId];
            if(map.dirs && map.dirs[idx]) {
                map.currentPath = map.currentPath === '/' ? '/' + map.dirs[idx] : map.currentPath + '/' + map.dirs[idx];
                sendNavKeyboard(chatId, msgId, mapId);
            }
        }
        answer();
    }
    else if (cbData.startsWith('nav_cancel_')) {
        const mapId = cbData.replace('nav_cancel_', '');
        if(global.navMaps) delete global.navMaps[mapId];
        require('axios').post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/deleteMessage`, {
            chat_id: chatId, message_id: msgId
        }).catch(()=>{});
        answer('ניווט בוטל');
    }
    else if (cbData.startsWith('nav_sel_')) {
        const mapId = cbData.replace('nav_sel_', '');
        if(global.navMaps && global.navMaps[mapId]) {
            const map = global.navMaps[mapId];
            db.run("UPDATE proposals SET proposed_path = ? WHERE id = ?", [map.currentPath, map.pid]);
            require('axios').post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/deleteMessage`, {
                chat_id: chatId, message_id: msgId
            }).catch(()=>{});
            answer(`✅ נתיב עודכן ל: ${map.currentPath}`);
            sendTelegramMessage(`הנתיב עבור ההצעה עודכן ל- ${map.currentPath}\n(כעת תוכל לאשר אותה בהודעה המקורית)`);
            delete global.navMaps[mapId];
        } else {
            answer('שגיאה: ניווט פג תוקף');
        }
    }
}

function sendNavKeyboard(chatId, messageId, mapId) {
    const map = global.navMaps[mapId];
    if(!map) return;
    
    const fs = require('fs');
    const path = require('path');
    const baseDir = path.join(__dirname, 'studies');
    const fullPath = path.join(baseDir, map.currentPath);
    
    let dirs = [];
    try {
        dirs = fs.readdirSync(fullPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch(e) {}
    
    map.dirs = dirs;
    const inline_keyboard = [];
    if (map.currentPath !== '/' && map.currentPath !== '') {
        inline_keyboard.push([{ text: '🔙 חזור אחורה', callback_data: `nav_up_${mapId}` }]);
    }
    
    dirs.forEach((d, idx) => {
        inline_keyboard.push([{ text: `📁 ${d}`, callback_data: `nav_in_${mapId}_${idx}` }]);
    });
    
    inline_keyboard.push([{ text: `📥 בחר נתיב: ${map.currentPath}`, callback_data: `nav_sel_${mapId}` }]);
    inline_keyboard.push([{ text: '❌ סגור', callback_data: `nav_cancel_${mapId}` }]);
    
    const payload = {
        chat_id: chatId,
        text: `**ניווט בתיקיות השרת**\nנתיב נוכחי: ${map.currentPath}`,
        reply_markup: JSON.stringify({ inline_keyboard })
    };
    
    const axios = require('axios');
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (messageId) {
        payload.message_id = messageId;
        axios.post(`https://api.telegram.org/bot${token}/editMessageText`, payload).catch(()=>{});
    } else {
        axios.post(`https://api.telegram.org/bot${token}/sendMessage`, payload).catch(()=>{});
    }
}

function pollTelegram() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        setTimeout(pollTelegram, 5000);
        return;
    }
    
    require('axios').get(`https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`)
        .then(res => {
            const data = res.data;
            if (data.ok && data.result.length > 0) {
                for (const update of data.result) {
                    lastUpdateId = update.update_id;
                    if (update.callback_query) {
                        handleTelegramCallback(update.callback_query, token);
                    } else if (update.message) {
                        handleTelegramMessage(update.message, token);
                    }
                }
            }
        })
        .catch(err => {})
        .finally(() => {
            setTimeout(pollTelegram, 2000);
        });
}
// Start polling
setTimeout(pollTelegram, 2000);

// Admin courses GET
app.get('/api/admin/courses', requireAdmin, (req, res) => {
    const coursesPath = path.join(__dirname, 'data', 'courses.json');
    if (!fs.existsSync(coursesPath)) {
        const defaultPath = path.join(__dirname, 'grade_calc', 'courses.json');
        if (fs.existsSync(defaultPath)) fs.copyFileSync(defaultPath, coursesPath);
    }
    try {
        const data = fs.readFileSync(coursesPath, 'utf8');
        res.json(JSON.parse(data));
    } catch(e) {
        res.status(500).json({ error: 'Failed to read courses' });
    }
});

// Admin courses PUT
app.put('/api/admin/courses', requireAdmin, (req, res) => {
    const coursesPath = path.join(__dirname, 'data', 'courses.json');
    try {
        fs.writeFileSync(coursesPath, JSON.stringify(req.body, null, 2), 'utf8');
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: 'Failed to save courses' });
    }
});

// Serve courses to frontend
app.get('/api/courses', (req, res) => {
    const coursesPath = path.join(__dirname, 'data', 'courses.json');
    if (!fs.existsSync(coursesPath)) {
        const defaultPath = path.join(__dirname, 'grade_calc', 'courses.json');
        if (fs.existsSync(defaultPath)) fs.copyFileSync(defaultPath, coursesPath);
    }
    if (fs.existsSync(coursesPath)) {
        res.sendFile(coursesPath);
    } else {
        res.json([]);
    }
});

// Admin check TZ
app.get('/api/auth/is-admin/:tz', (req, res) => {
    res.json({ isAdmin: isAdminTZ(req.params.tz) });
});


// ==========================================
// STATISTICS & TRACKING API
// ==========================================

app.post('/api/track', express.json(), (req, res) => {
    const { tz, path } = req.body;
    if (!tz || !path) return res.json({ success: false });
    
    db.run("INSERT INTO page_views (tz, path, timestamp) VALUES (?, ?, ?)", [tz, path, Date.now()], (err) => {
        res.json({ success: !err });
    });
});

app.get('/api/admin/stats', requireAdmin, (req, res) => {
    // Only return data, admin UI checks auth
    db.all(`SELECT path, COUNT(*) as views FROM page_views GROUP BY path ORDER BY views DESC LIMIT 10`, [], (err, popularPages) => {
        db.all(`SELECT tz, COUNT(*) as views FROM page_views WHERE tz != '322368564' GROUP BY tz ORDER BY views DESC LIMIT 5`, [], (err, activeStudents) => {
            db.all(`SELECT uploader_tz as tz, uploader_name as name, COUNT(*) as uploads FROM file_metadata WHERE uploader_tz != '322368564' GROUP BY uploader_tz ORDER BY uploads DESC LIMIT 5`, [], (err, topUploaders) => {
                
                // Get real names for active students
                const stats = { popularPages: popularPages || [], activeStudents: [], topUploaders: topUploaders || [] };
                
                if (!activeStudents || activeStudents.length === 0) {
                    return res.json(stats);
                }
                
                db.all(`SELECT tz, name FROM students`, [], (err, students) => {
                    const studentMap = {};
                    (students || []).forEach(s => studentMap[s.tz] = s.name);
                    
                    stats.activeStudents = activeStudents.map(s => ({
                        tz: s.tz,
                        name: studentMap[s.tz] || 'לא ידוע',
                        views: s.views
                    }));
                    
                    res.json(stats);
                });
            });
        });
    });
});

// ==========================================
// ADVANCED STATISTICS API
// ==========================================

app.get('/api/admin/advanced-stats', requireAdmin, (req, res) => {
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY;

    const result = {};

    // Load courses.json for name lookup
    let coursesMap = {};
    try {
        const coursesPath = require('path').join(__dirname, 'grade_calc', 'courses.json');
        const courses = JSON.parse(require('fs').readFileSync(coursesPath, 'utf8'));
        courses.forEach(c => { coursesMap[String(c.id)] = c.name; });
    } catch(e) {}

    // Helper to run queries sequentially
    function runAll(queries, callback) {
        const results = {};
        let remaining = queries.length;
        if (remaining === 0) return callback(results);

        queries.forEach(({ key, sql, params }) => {
            db.all(sql, params || [], (err, rows) => {
                results[key] = rows || [];
                if (--remaining === 0) callback(results);
            });
        });
    }

    // ----- USERS & ENGAGEMENT -----
    const usersQueries = [
        { key: 'total', sql: "SELECT COUNT(*) as count FROM students WHERE blocked=0" },
        { key: 'dau', sql: "SELECT COUNT(DISTINCT tz) as count FROM page_views WHERE timestamp > ? AND tz != '322368564'", params: [now - DAY] },
        { key: 'wau', sql: "SELECT COUNT(DISTINCT tz) as count FROM page_views WHERE timestamp > ? AND tz != '322368564'", params: [now - WEEK] },
        { key: 'mau', sql: "SELECT COUNT(DISTINCT tz) as count FROM page_views WHERE timestamp > ? AND tz != '322368564'", params: [now - MONTH] },
        { key: 'inactive30', sql: "SELECT COUNT(DISTINCT tz) as count FROM students WHERE tz NOT IN (SELECT DISTINCT tz FROM page_views WHERE timestamp > ?) AND tz != '322368564' AND blocked=0", params: [now - 30 * DAY] },
        { key: 'byYear', sql: "SELECT year, COUNT(*) as count FROM students WHERE blocked=0 AND tz != '322368564' GROUP BY year ORDER BY year" },
        { key: 'newThisWeek', sql: "SELECT COUNT(*) as count FROM students WHERE joined_at > ? AND tz != '322368564'", params: [now - WEEK] },
        { key: 'newThisMonth', sql: "SELECT COUNT(*) as count FROM students WHERE joined_at > ? AND tz != '322368564'", params: [now - MONTH] },
        { key: 'peakHours', sql: "SELECT CAST(ROUND((timestamp / 3600000) % 24) AS INTEGER) as hour, COUNT(*) as views FROM page_views WHERE tz != '322368564' GROUP BY hour ORDER BY views DESC LIMIT 5" },
        { key: 'topStudents', sql: "SELECT tz, COUNT(*) as views FROM page_views WHERE tz != '322368564' AND timestamp > ? GROUP BY tz ORDER BY views DESC LIMIT 10", params: [now - MONTH] },
        { key: 'realtime', sql: "SELECT COUNT(DISTINCT tz) as count FROM page_views WHERE timestamp > ? AND tz != '322368564'", params: [now - 5 * 60 * 1000] },
        { key: 'joinedByMonth', sql: "SELECT strftime('%Y-%m', datetime(joined_at/1000, 'unixepoch')) as month, COUNT(*) as count FROM students WHERE joined_at > 0 AND tz != '322368564' GROUP BY month ORDER BY month DESC LIMIT 6" },
    ];

    // ----- DRIVE / FILES -----
    const driveQueries = [
        { key: 'totalFiles', sql: "SELECT COUNT(*) as count FROM file_metadata" },
        { key: 'topUploaders', sql: "SELECT uploader_tz as tz, uploader_name as name, COUNT(*) as uploads FROM file_metadata WHERE uploader_tz != '322368564' GROUP BY uploader_tz ORDER BY uploads DESC LIMIT 10" },
        { key: 'fileTypes', sql: "SELECT LOWER(SUBSTR(path, INSTR(path, '.') + 1)) as ext, COUNT(*) as count FROM file_metadata GROUP BY ext ORDER BY count DESC LIMIT 8" },
        { key: 'recentUploads', sql: "SELECT COUNT(*) as count FROM file_metadata WHERE timestamp > ?", params: [now - WEEK] },
        { key: 'topDownloads', sql: "SELECT path, COUNT(*) as count FROM file_downloads WHERE tz != '322368564' GROUP BY path ORDER BY count DESC LIMIT 10" },
        { key: 'totalDownloads', sql: "SELECT COUNT(*) as count FROM file_downloads WHERE tz != '322368564'" },
        { key: 'downloadsThisWeek', sql: "SELECT COUNT(*) as count FROM file_downloads WHERE timestamp > ? AND tz != '322368564'", params: [now - WEEK] },
        { key: 'topDownloaders', sql: "SELECT fd.tz, s.name, COUNT(*) as count FROM file_downloads fd LEFT JOIN students s ON fd.tz = s.tz WHERE fd.tz != '322368564' GROUP BY fd.tz ORDER BY count DESC LIMIT 5" },
        { key: 'neverDownloaded', sql: "SELECT COUNT(*) as count FROM file_metadata WHERE path NOT IN (SELECT DISTINCT path FROM file_downloads)" },
    ];

    // ----- GRADE CALC -----
    const gradeQueries = [
        { key: 'allGrades', sql: "SELECT tz, grades FROM students WHERE grades IS NOT NULL AND grades != '' AND tz != '322368564'" },
        { key: 'gradeChangesByDate', sql: "SELECT strftime('%Y-%m-%d', datetime(timestamp/1000, 'unixepoch', '+3 hours')) as date, COUNT(*) as changes FROM grade_changes GROUP BY date ORDER BY changes DESC LIMIT 10" },
        { key: 'gradeChangesByCourse', sql: "SELECT course_id, COUNT(*) as changes FROM grade_changes GROUP BY course_id ORDER BY changes DESC LIMIT 10" },
    ];

    // ----- CHAT / SUPPORT -----
    const chatQueries = [
        { key: 'totalMsgs', sql: "SELECT COUNT(*) as count FROM chat_messages" },
        { key: 'msgsThisWeek', sql: "SELECT COUNT(*) as count FROM chat_messages WHERE timestamp > ?", params: [now - WEEK] },
        { key: 'msgsThisMonth', sql: "SELECT COUNT(*) as count FROM chat_messages WHERE timestamp > ?", params: [now - MONTH] },
        { key: 'topStudentsMsgs', sql: "SELECT cm.tz, s.name, COUNT(*) as count FROM chat_messages cm LEFT JOIN students s ON cm.tz = s.tz WHERE cm.sender = 'student' GROUP BY cm.tz ORDER BY count DESC LIMIT 5" },
        { key: 'avgResponseTime', sql: "SELECT s.tz, MIN(s.timestamp) as studentTime, MIN(a.timestamp) as adminTime FROM chat_messages s JOIN chat_messages a ON s.tz = a.tz WHERE s.sender='student' AND a.sender='admin' AND a.timestamp > s.timestamp GROUP BY s.tz" },
        { key: 'uniqueConversations', sql: "SELECT COUNT(DISTINCT tz) as count FROM chat_messages" },
    ];

    // Run all query groups
    runAll(usersQueries, (usersData) => {
        runAll(driveQueries, (driveData) => {
            runAll(gradeQueries, (gradeData) => {
                runAll(chatQueries, (chatData) => {

                    // Fetch student names for top students
                    db.all("SELECT tz, name FROM students", [], (err, allStudentsList) => {
                        const studentMap = {};
                        (allStudentsList || []).forEach(s => studentMap[s.tz] = s.name);

                        // Enrich top students
                        const topStudents = (usersData.topStudents || []).map(s => ({
                            tz: s.tz,
                            name: studentMap[s.tz] || 'לא ידוע',
                            views: s.views
                        }));

                        // Compute grade stats
                        const gradeStats = { courseAverages: {}, courseCounts: {}, usersWithGrades: 0 };
                        (gradeData.allGrades || []).forEach(row => {
                            let grades;
                            try { grades = typeof row.grades === 'string' ? JSON.parse(row.grades) : row.grades; } catch(e) { return; }
                            if (!grades || typeof grades !== 'object') return;

                            const activeGrades = Object.entries(grades).filter(([, v]) => v && v.active && v.grade > 0);
                            if (activeGrades.length > 0) gradeStats.usersWithGrades++;

                            activeGrades.forEach(([courseId, v]) => {
                                if (!gradeStats.courseAverages[courseId]) {
                                    gradeStats.courseAverages[courseId] = { sum: 0, count: 0, name: coursesMap[courseId] || `קורס ${courseId}` };
                                }
                                gradeStats.courseAverages[courseId].sum += Number(v.grade);
                                gradeStats.courseAverages[courseId].count++;
                            });
                        });

                        // Convert to sorted arrays
                        const courseList = Object.entries(gradeStats.courseAverages).map(([id, v]) => ({
                            id, name: v.name,
                            avg: Math.round(v.sum / v.count),
                            count: v.count
                        })).filter(c => c.count >= 2);

                        const hardestCourses = [...courseList].sort((a, b) => a.avg - b.avg).slice(0, 5);
                        const easiestCourses = [...courseList].sort((a, b) => b.avg - a.avg).slice(0, 5);
                        const overallAvg = courseList.length > 0 ? Math.round(courseList.reduce((s, c) => s + c.avg, 0) / courseList.length) : null;

                        // Compute avg response time
                        const responseTimes = (chatData.avgResponseTime || []).map(r => r.adminTime - r.studentTime).filter(t => t > 0 && t < 7 * DAY);
                        const avgResponseMs = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : null;
                        const avgResponseMinutes = avgResponseMs ? Math.round(avgResponseMs / 60000) : null;

                        // Extract counts from single-row queries
                        const g = (arr, field = 'count') => (arr && arr[0] && arr[0][field] != null) ? arr[0][field] : 0;

                        res.json({
                            users: {
                                total: g(usersData.total),
                                realtime: g(usersData.realtime),
                                dau: g(usersData.dau),
                                wau: g(usersData.wau),
                                mau: g(usersData.mau),
                                inactive30: g(usersData.inactive30),
                                newThisWeek: g(usersData.newThisWeek),
                                newThisMonth: g(usersData.newThisMonth),
                                byYear: usersData.byYear || [],
                                peakHours: usersData.peakHours || [],
                                topStudents,
                                joinedByMonth: usersData.joinedByMonth || [],
                            },
                            drive: {
                                totalFiles: g(driveData.totalFiles),
                                recentUploads: g(driveData.recentUploads),
                                totalDownloads: g(driveData.totalDownloads),
                                downloadsThisWeek: g(driveData.downloadsThisWeek),
                                neverDownloaded: g(driveData.neverDownloaded),
                                topUploaders: driveData.topUploaders || [],
                                fileTypes: driveData.fileTypes || [],
                                topDownloads: driveData.topDownloads || [],
                                topDownloaders: driveData.topDownloaders || [],
                            },
                            grades: {
                                usersWithGrades: gradeStats.usersWithGrades,
                                overallAvg,
                                hardestCourses,
                                easiestCourses,
                                totalCourses: courseList.length,
                                gradeChangesByDate: gradeData.gradeChangesByDate || [],
                                gradeChangesByCourse: (gradeData.gradeChangesByCourse || []).map(c => ({
                                    ...c,
                                    course_name: coursesMap[c.course_id] || `קורס ${c.course_id}`
                                })),
                            },
                            chat: {
                                totalMsgs: g(chatData.totalMsgs),
                                msgsThisWeek: g(chatData.msgsThisWeek),
                                msgsThisMonth: g(chatData.msgsThisMonth),
                                uniqueConversations: g(chatData.uniqueConversations),
                                avgResponseMinutes,
                                topStudentsMsgs: chatData.topStudentsMsgs || [],
                            }
                        });
                    });
                });
            });
        });
    });
});

// ==========================================
// NEW ADMIN APIS
// ==========================================

app.get('/api/admin/stat-users/:type', requireAdmin, (req, res) => {
    const type = req.params.type;
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    let sql = "";
    let params = [];
    
    switch (type) {
        case 'realtime':
            sql = "SELECT DISTINCT tz FROM page_views WHERE timestamp > ? AND tz != '322368564'";
            params = [now - 5 * 60 * 1000];
            break;
        case 'dau':
            sql = "SELECT DISTINCT tz FROM page_views WHERE timestamp > ? AND tz != '322368564'";
            params = [now - DAY];
            break;
        case 'wau':
            sql = "SELECT DISTINCT tz FROM page_views WHERE timestamp > ? AND tz != '322368564'";
            params = [now - 7 * DAY];
            break;
        case 'mau':
            sql = "SELECT DISTINCT tz FROM page_views WHERE timestamp > ? AND tz != '322368564'";
            params = [now - 30 * DAY];
            break;
        case 'inactive30':
            sql = "SELECT tz FROM students WHERE tz NOT IN (SELECT DISTINCT tz FROM page_views WHERE timestamp > ?) AND tz != '322368564' AND blocked=0";
            params = [now - 30 * DAY];
            break;
        case 'newWeek':
            sql = "SELECT tz FROM students WHERE joined_at > ? AND tz != '322368564'";
            params = [now - 7 * DAY];
            break;
        case 'newMonth':
            sql = "SELECT tz FROM students WHERE joined_at > ? AND tz != '322368564'";
            params = [now - 30 * DAY];
            break;
        case 'total':
        default:
            sql = "SELECT tz FROM students WHERE blocked=0 AND tz != '322368564'";
            params = [];
            break;
    }

    db.all(sql, params, (err, rows) => {
        if (err || !rows) return res.status(500).json({ error: "Database error" });
        
        const tzList = rows.map(r => r.tz);
        if (tzList.length === 0) return res.json([]);
        
        const placeholders = tzList.map(() => '?').join(',');
        
        db.all(`SELECT tz, name, year FROM students WHERE tz IN (${placeholders})`, tzList, (err, students) => {
            if (err || !students) return res.status(500).json({ error: "Database error" });
            
            db.all(`SELECT tz, MAX(timestamp) as lastSeen, COUNT(*) as totalViews FROM page_views WHERE tz IN (${placeholders}) GROUP BY tz`, tzList, (err, stats) => {
                const statsMap = {};
                (stats || []).forEach(s => statsMap[s.tz] = s);
                
                const result = students.map(s => ({
                    tz: s.tz,
                    name: s.name,
                    year: s.year,
                    lastSeen: statsMap[s.tz] ? statsMap[s.tz].lastSeen : null,
                    totalViews: statsMap[s.tz] ? statsMap[s.tz].totalViews : 0
                }));
                
                res.json(result);
            });
        });
    });
});

app.get('/api/admin/user-activity/:tz', requireAdmin, (req, res) => {
    const tz = req.params.tz;
    
    db.get("SELECT name, tz, year, semester, joined_at, blocked, grades FROM students WHERE tz = ?", [tz], (err, student) => {
        if (err || !student) return res.status(404).json({ error: "Student not found" });
        
        let hasGrades = false;
        let coursesWithGrades = 0;
        try {
            const gradesObj = JSON.parse(student.grades || '{}');
            for (const courseId in gradesObj) {
                if (gradesObj[courseId].active && Number(gradesObj[courseId].grade) > 0) {
                    hasGrades = true;
                    coursesWithGrades++;
                }
            }
        } catch (e) {}
        
        const studentInfo = {
            name: student.name,
            tz: student.tz,
            year: student.year,
            semester: student.semester,
            joined_at: student.joined_at,
            blocked: student.blocked
        };
        
        const now = Date.now();
        const DAY30 = 30 * 24 * 60 * 60 * 1000;
        
        const queries = [
            { key: 'pageStats', sql: "SELECT MAX(timestamp) as lastSeen, COUNT(*) as totalViews FROM page_views WHERE tz = ?", params: [tz] },
            { key: 'loginDays', sql: "SELECT strftime('%Y-%m-%d', datetime(timestamp/1000, 'unixepoch', '+3 hours')) as date, COUNT(*) as views FROM page_views WHERE tz = ? AND timestamp > ? GROUP BY date ORDER BY date DESC", params: [tz, now - DAY30] },
            { key: 'recentPages', sql: "SELECT path, timestamp FROM page_views WHERE tz = ? ORDER BY timestamp DESC LIMIT 50", params: [tz] },
            { key: 'filesUploaded', sql: "SELECT path, timestamp FROM file_metadata WHERE uploader_tz = ? ORDER BY timestamp DESC", params: [tz] },
            { key: 'filesDownloaded', sql: "SELECT path, timestamp FROM file_downloads WHERE tz = ? ORDER BY timestamp DESC LIMIT 50", params: [tz] },
            { key: 'chatMessagesSent', sql: "SELECT COUNT(*) as count FROM chat_messages WHERE tz = ? AND sender = 'student'", params: [tz] },
            { key: 'gradeChanges', sql: "SELECT course_id, action, timestamp FROM grade_changes WHERE tz = ? ORDER BY timestamp DESC LIMIT 50", params: [tz] }
        ];
        
        const results = {};
        let remaining = queries.length;
        
        queries.forEach(({ key, sql, params }) => {
            db.all(sql, params, (err, rows) => {
                results[key] = rows || [];
                if (--remaining === 0) {
                    res.json({
                        student: studentInfo,
                        lastSeen: results.pageStats[0] ? results.pageStats[0].lastSeen : null,
                        totalPageViews: results.pageStats[0] ? results.pageStats[0].totalViews : 0,
                        loginDays: results.loginDays,
                        recentPages: results.recentPages,
                        filesUploaded: results.filesUploaded,
                        filesDownloaded: results.filesDownloaded,
                        chatMessagesSent: results.chatMessagesSent[0] ? results.chatMessagesSent[0].count : 0,
                        gradeChanges: results.gradeChanges,
                        gradesInfo: { hasGrades, coursesWithGrades }
                    });
                }
            });
        });
    });
});

app.get('/api/admin/grades-overview', requireAdmin, (req, res) => {
    db.all("SELECT tz, name, year, grades FROM students WHERE tz != '322368564'", [], (err, students) => {
        if (err || !students) return res.status(500).json({ error: "Database error" });
        
        const result = students.map(s => {
            let hasGrades = false;
            let coursesWithGrades = 0;
            try {
                const gradesObj = JSON.parse(s.grades || '{}');
                for (const courseId in gradesObj) {
                    if (gradesObj[courseId].active && Number(gradesObj[courseId].grade) > 0) {
                        hasGrades = true;
                        coursesWithGrades++;
                    }
                }
            } catch (e) {}
            
            return {
                tz: s.tz,
                name: s.name,
                year: s.year,
                hasGrades,
                coursesWithGrades
            };
        });
        
        res.json(result);
    });
});

const upload = multer({ 
    dest: quarantineDir,
    limits: { fileSize: 40 * 1024 * 1024 } // 40MB
});

// ==========================================
// SHARE TARGET API (PWA)
// ==========================================

global.sharedFilesCache = {};

app.post('/api/share-target', upload.array('shared_files', 20), (req, res) => {
    const shareToken = require('crypto').randomBytes(8).toString('hex');
    
    if (req.files && req.files.length > 0) {
        global.sharedFilesCache[shareToken] = req.files.map(f => ({
            path: f.path,
            originalname: Buffer.from(f.originalname, 'latin1').toString('utf8'), // Fix encoding just in case
            size: f.size
        }));
    } else {
        global.sharedFilesCache[shareToken] = [];
    }
    
    res.redirect('/drive.html?shareToken=' + shareToken);
});

app.get('/api/shared-files/:token', (req, res) => {
    const token = req.params.token;
    if (global.sharedFilesCache[token]) {
        res.json({ files: global.sharedFilesCache[token] });
        // Don't delete immediately, let the client consume it
    } else {
        res.json({ files: [] });
    }
});

// ==========================================
// CHAT & PROPOSALS API
// ==========================================


const FORBIDDEN_EXTENSIONS = ['.exe', '.bat', '.cmd', '.vbs', '.js', '.sh', '.bin', '.com', '.msi', '.scr'];

async function runQuickScan(filePath, originalName) {
    const ext = require('path').extname(originalName).toLowerCase();
    if (FORBIDDEN_EXTENSIONS.includes(ext)) {
        return { safe: false, virus: 'Blocked File Extension (' + ext + ')' };
    }
    return { safe: true };
}

const userFolderTimers = {};
const userFolderCounts = {};

// Clean counts every 5 mins
setInterval(() => {
    const now = Date.now();
    for (const tz in userFolderCounts) {
        userFolderCounts[tz] = userFolderCounts[tz].filter(t => now - t < 5 * 60 * 1000);
        if (userFolderCounts[tz].length === 0) delete userFolderCounts[tz];
    }
}, 60 * 1000);

app.post('/api/drive/propose-folder', async (req, res) => {
    const { tz, path: folderPath } = req.body;
    if (!tz) return res.status(400).json({ error: 'Missing tz' });
    
    if (!userFolderCounts[tz]) userFolderCounts[tz] = [];
    userFolderCounts[tz].push(Date.now());
    
    if (userFolderCounts[tz].length > 10) {
        // Spam!
        const folders = userFolderCounts[tz].length;
        sendTelegramMessage(
            `⚠️ התראת ספאם!
הסטודנט בעל ת.ז ${tz} ניסה ליצור יותר מ-10 תיקיות (${folders} פעמים) ב-5 דקות האחרונות.`,
            JSON.stringify({
                inline_keyboard: [[
                    { text: '🚫 חסום סטודנט', callback_data: `confirm_block_${tz}` },
                    { text: '👁️ התעלם', callback_data: 'ignore_spam' }
                ]]
            })
        );
        return res.status(429).json({ error: 'spam_protection', message: 'יצרת יותר מדי תיקיות. אנא המתן מספר דקות.' });
    }
    
    // Set 5 min timer
    if (userFolderTimers[`${tz}_${folderPath}`]) clearTimeout(userFolderTimers[`${tz}_${folderPath}`]);
    
    db.get("SELECT name FROM students WHERE tz = ?", [tz], (err, row) => {
        const studentName = row ? row.name : 'לא ידוע';
        userFolderTimers[`${tz}_${folderPath}`] = setTimeout(() => {
            sendTelegramMessage(`⚠️ התראה: הסטודנט ${studentName} (${tz}) ניסה ליצור תיקייה ריקה (${folderPath}) ולא העלה שום קובץ תוך 5 דקות.`);
            delete userFolderTimers[`${tz}_${folderPath}`];
        }, 5 * 60 * 1000);
    });
    
    res.json({ success: true });
});

app.post('/api/drive/propose-file', upload.array('files', 20), async (req, res) => {
    const { tz, proposed_path, comments, shareToken } = req.body;
    let files = req.files || [];
    
    // Fix multer latin1 encoding for Hebrew filenames
    files.forEach(f => {
        if (f.originalname) {
            f.originalname = Buffer.from(f.originalname, 'latin1').toString('utf8');
        }
    });
    
    if (shareToken && global.sharedFilesCache && global.sharedFilesCache[shareToken]) {
        files = global.sharedFilesCache[shareToken];
        delete global.sharedFilesCache[shareToken]; // Consume
    }
    
    if (!tz || !files || files.length === 0) {
        return res.status(400).json({ error: 'Missing files or data' });
    }
    
    // Clear the empty folder timer if it exists for this path
    if (userFolderTimers[`${tz}_${proposed_path}`]) {
        clearTimeout(userFolderTimers[`${tz}_${proposed_path}`]);
        delete userFolderTimers[`${tz}_${proposed_path}`];
    }
    
    db.get("SELECT name FROM students WHERE tz = ?", [tz], async (err, student) => {
        const studentName = student ? student.name : 'לא ידוע';
        
        const proposalId = crypto.randomBytes(8).toString('hex');
        
        // Save to DB with 'scanning' status immediately
        const insertQuery = "INSERT INTO proposals (id, tz, files_count, proposed_path, comments, status, timestamp" + 
            (files.length > 0 ? ", files_json" : "") + ") VALUES (?, ?, ?, ?, ?, ?, ?" + 
            (files.length > 0 ? ", ?" : "") + ")";
        
        const insertParams = [proposalId, tz, files.length, proposed_path, comments, 'scanning', Date.now()];
        if (files.length > 0) insertParams.push(JSON.stringify(files));
            
        db.run(insertQuery, insertParams);
        
        // Respond to client IMMEDIATELY so they can poll status
        res.json({ success: true, proposalId });
        
        // Run background tasks (Scan + Notify)
        (async () => {
            try {
                let hasVirus = false;
                let virusName = '';
                
                for (const file of files) {
                    const scan = await runQuickScan(file.path, file.originalname);
                    if (!scan.safe) {
                        hasVirus = true;
                        virusName = scan.virus;
                        break;
                    }
                }
                
                if (hasVirus) {
                    // Update DB
                    db.run("UPDATE proposals SET status = 'virus' WHERE id = ?", [proposalId]);
                    
                    // Notify Admin
                    sendTelegramMessage(
                        `⚠️ חסימת מערכת!\nהסטודנט ${studentName} (${tz}) ניסה להעלות קובץ עם סיומת מסוכנת לנתיב ${proposed_path}.\nסיבה: ${virusName}`,
                        JSON.stringify({
                            inline_keyboard: [[
                                { text: '🗑️ השמד קבצים', callback_data: `destroy_prop_${proposalId}` }
                            ]]
                        })
                    );
                    return;
                }
                
                // Safe files - Update status and Notify Admin
                db.run("UPDATE proposals SET status = 'pending' WHERE id = ?", [proposalId]);
                await notifyAdminNewProposal(proposalId, studentName, tz, proposed_path, comments, files);
            } catch (e) {
                console.error("Error in background processing of proposal:", e);
                db.run("UPDATE proposals SET status = 'error' WHERE id = ?", [proposalId]);
            }
        })();
    });
});

app.get('/api/proposals/:id/status', (req, res) => {
    db.get("SELECT status FROM proposals WHERE id = ?", [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Not found' });
        res.json({ status: row.status });
    });
});

async function notifyAdminNewProposal(proposalId, studentName, tz, proposed_path, comments, files) {
    let msg = `📄 הצעת קבצים חדשה!

👤 סטודנט: ${studentName} (${tz})
📁 יעד מוצע: ${proposed_path}
💬 הערות: ${comments || 'אין'}
📋 מספר קבצים: ${files.length}`;
    
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;
    
    const FormData = require('form-data');
    
    // Attempt to send files
    let sentFiles = false;
    for (const file of files) {
        if (file.size < 49 * 1024 * 1024) { // Telegram limit is ~50MB
            try {
                const form = new FormData();
                form.append('chat_id', chatId);
                form.append('document', fs.createReadStream(file.path), { filename: file.originalname });
                if (!sentFiles) {
                    form.append('caption', msg);
                    sentFiles = true;
                }
                await require('axios').post(`https://api.telegram.org/bot${token}/sendDocument`, form, {
                    headers: form.getHeaders()
                });
            } catch(e) {
                console.error("Error sending document", e.message);
            }
        }
    }
    
    // If we didn't send caption (files too big or error), send it as text
    if (!sentFiles) {
        await require('axios').post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: msg + '\\n(לא ניתן לשלוח את הקבצים - כנראה חורגים מגודל 50MB)'
        });
    }
    
    // Send action buttons
    const keyboard = {
        inline_keyboard: [
            [
                { text: '✅ אישור', callback_data: `appr_prop_${proposalId}` },
                { text: '❌ דחייה', callback_data: `rej_prop_${proposalId}` }
            ],
            [
                { text: '🔍 סרוק וירוס (VirusTotal)', callback_data: `vt_scan_${proposalId}` },
            ],
            [
                { text: '📂 שנה נתיב (אינטראקטיבי)', callback_data: `nav_prop_${proposalId}_/` },
            ],
            [
                { text: '🚫 חסום סטודנט', callback_data: `confirm_block_${tz}` }
            ]
        ]
    };
    
    await require('axios').post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: 'בחר פעולה:',
        reply_markup: keyboard
    }).catch(()=>{});
}

function sendTelegramMessage(text, reply_markup = null) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;
    
    const body = { chat_id: chatId, text };
    if (reply_markup) body.reply_markup = reply_markup;
    
    require('axios').post(`https://api.telegram.org/bot${token}/sendMessage`, body).catch(()=>{});
}

app.get('/api/students/:tz/notifications', (req, res) => {
    db.all("SELECT * FROM proposals WHERE tz = ? AND status IN ('approved', 'rejected')", [req.params.tz], (err, rows) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json(rows);
        // Mark as read (delete from DB after notifying)
        db.run("DELETE FROM proposals WHERE tz = ? AND status IN ('approved', 'rejected')", [req.params.tz]);
    });
});

// Chat Endpoints
app.get('/api/chat/:tz', (req, res) => {
    db.all("SELECT * FROM chat_messages WHERE tz = ? ORDER BY timestamp ASC", [req.params.tz], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.get('/api/chat/:tz/unread', (req, res) => {
    const tz = req.params.tz;
    const lastRead = parseInt(req.query.lastRead) || 0;
    
    db.get("SELECT COUNT(*) as unread FROM chat_messages WHERE tz = ? AND sender = 'admin' AND timestamp > ?", 
        [tz, lastRead], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ unread: row ? row.unread : 0 });
    });
});

app.post('/api/chat/:tz', (req, res) => {
    const tz = req.params.tz;
    const { message, sender } = req.body; // sender: 'student' or 'admin'
    
    db.get("SELECT name, chat_blocked FROM students WHERE tz = ?", [tz], (err, student) => {
        if (!student) return res.status(404).json({ error: 'Student not found' });
        if (student.chat_blocked && sender === 'student') {
            return res.status(403).json({ error: 'Chat blocked' });
        }
        
        db.run("INSERT INTO chat_messages (tz, message, sender, timestamp) VALUES (?, ?, ?, ?)", [tz, message, sender, Date.now()]);
        
        if (sender === 'student') {
            // Fetch last 5 messages
            db.all("SELECT * FROM chat_messages WHERE tz = ? ORDER BY timestamp DESC LIMIT 5", [tz], (err, rows) => {
                const history = rows.reverse().map(r => `[${r.sender === 'student' ? 'סטודנט' : 'מנהל'}]: ${r.message}`).join('\n');
                
                sendTelegramMessage(
                    `💬 הודעה חדשה מסטודנט!
👤 שם: ${student.name} (${tz})

היסטוריה אחרונה:
${history}`,
                    JSON.stringify({
                        inline_keyboard: [[
                            { text: '💬 הגב', callback_data: `reply_chat_${tz}` },
                            { text: '🚫 חסום צ\'אט', callback_data: `block_chat_${tz}` }
                        ]]
                    })
                );
            });
        }
        
        res.json({ success: true });
    });
});

app.post('/api/students/:tz/block-chat', requireAdmin, (req, res) => {
    db.run("UPDATE students SET chat_blocked = ? WHERE tz = ?", [req.body.blocked ? 1 : 0, req.params.tz]);
    res.json({ success: true });
});

// Telegram Polling Update (to be added)
// ==========================================

app.post('/api/drive/share', (req, res) => {
    const { tz, path: itemPath, bypassRules, requireAuth } = req.body;
    if (!isAdminTZ(tz)) {
        return res.status(403).json({ error: "Access denied: Admins only" });
    }
    const token = crypto.randomBytes(16).toString('hex');
    const sql = `INSERT INTO public_shares (id, path, bypass_rules, require_auth, created_at) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [token, itemPath, bypassRules ? 1 : 0, requireAuth ? 1 : 0, Date.now()], function(err) {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, token });
    });
});

app.get('/api/drive/shares', (req, res) => {
    const { tz, path: itemPath } = req.query;
    if (!isAdminTZ(tz)) {
        return res.status(403).json({ error: "Access denied" });
    }
    db.all("SELECT * FROM public_shares WHERE path = ? ORDER BY created_at DESC", [itemPath], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows || []);
    });
});

app.get('/api/drive/all-shares', (req, res) => {
    const { tz } = req.query;
    if (!isAdminTZ(tz)) {
        return res.status(403).json({ error: "Access denied" });
    }
    db.all("SELECT * FROM public_shares ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows || []);
    });
});

app.delete('/api/drive/share/:id', (req, res) => {
    const { tz } = req.query;
    const shareId = req.params.id;
    if (!isAdminTZ(tz)) {
        return res.status(403).json({ error: "Access denied" });
    }
    db.run("DELETE FROM public_shares WHERE id = ?", [shareId], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true });
    });
});

// Serve static files
app.use(express.static(path.join(__dirname), {
    extensions: ['html', 'htm']
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
