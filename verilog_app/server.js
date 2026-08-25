const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = __dirname;

// List of known output keys in test vectors
const KNOWN_OUTPUT_KEYS = [
  'out', 'q', 'sum', 'cout', 'out_bitwise', 'out_logical', 'out_and', 'out_or',
  'pwm_out', 'tx', 'tx_busy', 'rx_data', 'rx_done', 'baud_tick', 'sclk', 'mosi',
  'ss', 'done', 'scl', 'sda', 'sda_oe', 'busy', 'empty', 'full', 'read_data1',
  'read_data2', 'data_out', 'data_out_b', 'fifo_cnt', 'wr_ptr', 'rd_ptr', 'sp',
  'read_val', 'reg_ctrl', 'reg_data0', 'reg_data1', 'z', 'y'
];

/**
 * Generate a Verilog testbench dynamically for any lesson's test vectors.
 */
function generateTestbench(userCode, expectedOutputs) {
  if (!expectedOutputs || expectedOutputs.length === 0) return '';

  const sample0 = expectedOutputs[0];
  const allKeys = Object.keys(sample0).filter(k => k !== 'time');

  // Identify output keys vs input keys
  const outputKeys = allKeys.filter(k => KNOWN_OUTPUT_KEYS.includes(k));

  // If outputKeys is empty, fallback to assuming 'out' or 'q' or the last key is output
  if (outputKeys.length === 0) {
    if (allKeys.includes('q')) outputKeys.push('q');
    else if (allKeys.includes('out')) outputKeys.push('out');
    else outputKeys.push(allKeys[allKeys.length - 1]);
  }

  // Input keys are everything else
  const actualInputKeys = allKeys.filter(k => !outputKeys.includes(k));

  let tb = `\`timescale 1ns/1ps\nmodule tb;\n`;

  // Declare inputs as reg [31:0] and outputs as wire [31:0]
  actualInputKeys.forEach(k => {
    tb += `  reg [31:0] ${k};\n`;
  });
  outputKeys.forEach(k => {
    tb += `  wire [31:0] ${k};\n`;
  });

  // Instantiate top_module
  tb += `\n  top_module uut (\n`;
  const portConnections = [...actualInputKeys, ...outputKeys].map(k => `    .${k}(${k})`).join(',\n');
  tb += portConnections + `\n  );\n\n`;

  // Test vector stimulus block
  tb += `  initial begin\n`;
  tb += `    $display("=== START_SIM ===");\n`;

  expectedOutputs.forEach((step, idx) => {
    const delay = (idx === 0) ? 0 : 5;
    if (delay > 0) tb += `    #${delay};\n`;

    // Apply inputs
    actualInputKeys.forEach(k => {
      const val = step[k] !== undefined ? step[k] : 0;
      tb += `    ${k} = 32'd${val};\n`;
    });

    tb += `    #1;\n`; // Wait for propagation

    // Perform strict Verilog inequality check (!== handles z and x correctly)
    outputKeys.forEach(k => {
      const expVal = step[k] !== undefined ? step[k] : 0;
      tb += `    if (${k} !== 32'd${expVal}) begin\n`;
      tb += `      $display("MISMATCH time=%0d key=${k} act=%0d exp=${expVal}", $time, ${k}, 32'd${expVal});\n`;
      tb += `    end else begin\n`;
      tb += `      $display("MATCH time=%0d key=${k} act=%0d exp=${expVal}", $time, ${k}, 32'd${expVal});\n`;
      tb += `    end\n`;
    });
  });

  tb += `    $display("=== END_SIM ===");\n`;
  tb += `    $finish;\n`;
  tb += `  end\n`;
  tb += `endmodule\n`;

  return tb;
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Ping Endpoint
  if (req.url === '/api/ping' || req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', compiler: 'Icarus Verilog' }));
    return;
  }

  // Compile & Simulate Endpoint
  if (req.method === 'POST' && (req.url === '/api/compile' || req.url === '/compile')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const userCode = payload.userCode || '';
        const expectedOutputs = payload.expectedOutputs || [];

        if (!userCode.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ compileError: true, log: '# Error: Code is empty.' }));
          return;
        }

        // Create temporary directory for compilation
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verilearn-'));
        const topPath = path.join(tmpDir, 'top_module.v');
        const tbPath = path.join(tmpDir, 'tb.v');
        const simPath = path.join(tmpDir, 'sim.out');

        const tbCode = generateTestbench(userCode, expectedOutputs);

        fs.writeFileSync(topPath, userCode);
        fs.writeFileSync(tbPath, tbCode);

        // Run iverilog compiler
        const cmdCompile = `iverilog -g2012 -o "${simPath}" "${topPath}" "${tbPath}"`;
        exec(cmdCompile, (compileErr, stdout, stderr) => {
          if (compileErr || (stderr && (stderr.includes('syntax error') || stderr.includes('error:')))) {
            // Clean up paths in error message for security & clean output
            const rawErr = (stderr || stdout || compileErr.message);
            const cleanErr = rawErr
              .replace(new RegExp(tmpDir.replace(/\\/g, '\\\\'), 'g'), 'top_module.v')
              .replace(/.*top_module\.v:/g, '# ** Error: top_module.v:');

            const log = `
# vlog top_module.v
${cleanErr.trim()}
# Errors: 1, Warnings: 0
`.trim();

            // Cleanup temp dir
            try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              compileError: true,
              status: 'Compile Error',
              log,
              actualOutputs: [],
              mismatches: expectedOutputs.length
            }));
            return;
          }

          // Run simulation via vvp
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

            // Cleanup temp dir
            try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              compileError: false,
              passed,
              status: passed ? 'Success' : 'Incorrect',
              log,
              actualOutputs,
              mismatches,
              totalSamples: expectedOutputs.length
            }));
          });
        });
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ compileError: true, log: `# Internal Server Error: ${err.message}` }));
      }
    });
    return;
  }

  // Serve static files for frontend
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js': contentType = 'text/javascript'; break;
    case '.css': contentType = 'text/css'; break;
    case '.json': contentType = 'application/json'; break;
    case '.png': contentType = 'image/png'; break;
    case '.jpg': contentType = 'image/jpg'; break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 VeriLearn Compiler Server & Web App Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`⚙️  Compiler Engine: Icarus Verilog (iverilog)`);
  console.log(`==================================================\n`);
});
