const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const archiver = require('archiver');

const app = express();
app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbFile = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbFile);

// Initialize DB schema
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
        tz TEXT PRIMARY KEY,
        name TEXT,
        year TEXT,
        semester TEXT,
        grades TEXT,
        blocked INTEGER DEFAULT 0
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err);
            return;
        }

        // Add blocked column if it doesn't exist (migration)
        db.run(`ALTER TABLE students ADD COLUMN blocked INTEGER DEFAULT 0`, () => {});

        db.run(`CREATE TABLE IF NOT EXISTS drive_permissions (
            path TEXT PRIMARY KEY,
            visibility TEXT,
            users TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS course_folders (
            course_id INTEGER PRIMARY KEY,
            folder_path TEXT
        )`);

        // Check if DB is empty to seed it
        db.get("SELECT COUNT(*) as count FROM students", (err, row) => {
            if (row && row.count === 0) {
                console.log("Database is empty. Seeding from students_backup.json...");
                try {
                    const backupPath = path.join(__dirname, 'students_backup.json');
                    if (fs.existsSync(backupPath)) {
                        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
                        
                        const stmt = db.prepare("INSERT INTO students (tz, name, year, semester, grades) VALUES (?, ?, ?, ?, ?)");
                        backupData.forEach(student => {
                            stmt.run(
                                student.tz,
                                student.name || '',
                                student.year || 'A',
                                student.semester || '1',
                                JSON.stringify(student.grades || {})
                            );
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

// --- Admin Session Store (in-memory) ---
const adminSessions = {}; // sessionId -> { approved: bool, ts: timestamp }

function generateSessionId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getAdminTZList() {
    const raw = process.env.ADMIN_TZ || '';
    return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function isAdminTZ(tz) {
    return getAdminTZList().includes(tz);
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

    const sql = `INSERT INTO students (tz, name, year, semester, grades) 
                 VALUES (?, ?, ?, ?, ?) 
                 ON CONFLICT(tz) DO UPDATE SET 
                    name=excluded.name, 
                    year=excluded.year, 
                    semester=excluded.semester, 
                    grades=excluded.grades`;
    
    db.run(sql, [tz, name || '', year || 'A', semester || '1', gradesStr], function(err) {
        if (err) {
            console.error("Update error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true });
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
        if (updates.grades !== undefined) {
            newGrades = JSON.stringify(updates.grades);
        }

        db.run("UPDATE students SET name = ?, year = ?, semester = ?, grades = ? WHERE tz = ?", 
            [newName, newYear, newSemester, newGrades, tz], 
            function(err) {
                if (err) return res.status(500).json({ error: "Database error" });
                res.json({ success: true });
            }
        );
    });
});

// GET users (admin: full info)
app.get('/api/users', (req, res) => {
    db.all("SELECT tz, name, year, semester, blocked FROM students", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
    });
});

// PATCH block/unblock student
app.patch('/api/students/:tz/block', (req, res) => {
    const tz = req.params.tz;
    const { blocked } = req.body;
    db.run("UPDATE students SET blocked = ? WHERE tz = ?", [blocked ? 1 : 0, tz], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true });
    });
});

// DELETE student
app.delete('/api/students/:tz', (req, res) => {
    const tz = req.params.tz;
    db.run("DELETE FROM students WHERE tz = ?", [tz], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true });
    });
});

// POST permission
app.post('/api/drive/permissions', (req, res) => {
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
app.post('/api/courses/link', (req, res) => {
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

app.post('/api/drive/refresh', async (req, res) => {
    // Clear the cache manually
    dirCacheMap = {};
    res.json({ success: true, message: "Cache cleared successfully" });
});

// Drive API Route
app.get('/api/drive/list', async (req, res) => {
    try {
        const queryPath = req.query.path || '/';
        const tz = req.query.tz || '';
        const editMode = req.query.editMode === 'true';
        const isAdmin = tz === '322368564';

        const perms = await getPermissions();
        const courseLinks = await getCourseFolders();

        function hasAccess(itemPath) {
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

        const files = [];
        for (const item of rawItems) {
            if (!hasAccess(item.path)) continue;

            const exactPerm = perms[item.path] || { visibility: 'inherit', users: [] };
            files.push({
                ...item,
                permission: isAdmin ? exactPerm : undefined,
                courseId: courseLinks[item.path] || null
            });
        }
        
        res.json({ files, cached: true });
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
        const isAdmin = tz === '322368564';
        
        const baseDir = fs.existsSync('/app/studies') ? '/app/studies' : 'D:/לימודים רזיאל';
        const resolvedPath = path.join(baseDir, reqPath);
        
        // Prevent directory traversal
        if (!resolvedPath.startsWith(path.resolve(baseDir))) {
            return res.status(403).send("Access Denied");
        }

        const perms = await getPermissions();

        function hasAccess(itemPath) {
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

        res.sendFile(resolvedPath);
    } catch(err) {
        console.error("Error serving file:", err);
        res.status(500).send("Server Error");
    }
});

// Edit password verification
app.post('/api/auth/edit-password', (req, res) => {
    const { password } = req.body;
    const editPassword = process.env.EDIT_PASSWORD;
    if (!editPassword) {
        return res.status(500).json({ error: 'EDIT_PASSWORD not configured' });
    }
    if (password === editPassword) {
        return res.json({ success: true });
    }
    return res.status(401).json({ error: 'wrong_password' });
});

app.get('/api/drive/download-zip', async (req, res) => {
    try {
        const reqPath = decodeURIComponent(req.query.path || '/');
        const tz = req.query.tz || '';
        const isAdmin = tz === '322368564';
        
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
app.post('/api/auth/admin-login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
        return res.status(401).json({ error: 'wrong_password' });
    }
    const sessionId = generateSessionId();
    adminSessions[sessionId] = { approved: false, ts: Date.now() };
    // Clean old sessions
    Object.keys(adminSessions).forEach(k => {
        if (Date.now() - adminSessions[k].ts > 5 * 60 * 1000) delete adminSessions[k];
    });
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
        fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${msg}&reply_markup=${encodeURIComponent(keyboard)}`)
            .catch(e => console.error('Telegram error:', e));
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

// Basic Telegram polling for Admin login approval
let lastUpdateId = 0;
function pollTelegram() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        setTimeout(pollTelegram, 5000);
        return;
    }
    
    fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`)
        .then(res => res.json())
        .then(data => {
            if (data.ok && data.result.length > 0) {
                for (const update of data.result) {
                    lastUpdateId = update.update_id;
                    if (update.callback_query) {
                        const cb = update.callback_query;
                        const cbData = cb.data;
                        if (cbData.startsWith('approve_admin_')) {
                            const sessionId = cbData.replace('approve_admin_', '');
                            if (adminSessions[sessionId]) adminSessions[sessionId].approved = true;
                            fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery?callback_query_id=${cb.id}&text=\u2705+\u05d0\u05d5\u05e9\u05e8!`).catch(()=>{});
                        } else if (cbData.startsWith('deny_admin_')) {
                            const sessionId = cbData.replace('deny_admin_', '');
                            if (adminSessions[sessionId]) adminSessions[sessionId].denied = true;
                            fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery?callback_query_id=${cb.id}&text=\u274c+\u05e0\u05d3\u05d7\u05d4`).catch(()=>{});
                        }
                    }
                }
            }
        })
        .catch(err => {}) // Ignore fetch errors in polling
        .finally(() => {
            setTimeout(pollTelegram, 2000);
        });
}
// Start polling
setTimeout(pollTelegram, 2000);

// Admin courses GET
app.get('/api/admin/courses', (req, res) => {
    const coursesPath = path.join(__dirname, 'grade_calc', 'courses.json');
    try {
        const data = fs.readFileSync(coursesPath, 'utf8');
        res.json(JSON.parse(data));
    } catch(e) {
        res.status(500).json({ error: 'Failed to read courses' });
    }
});

// Admin courses PUT
app.put('/api/admin/courses', (req, res) => {
    const coursesPath = path.join(__dirname, 'grade_calc', 'courses.json');
    try {
        fs.writeFileSync(coursesPath, JSON.stringify(req.body, null, 2), 'utf8');
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: 'Failed to save courses' });
    }
});

// Admin check TZ
app.get('/api/auth/is-admin/:tz', (req, res) => {
    res.json({ isAdmin: isAdminTZ(req.params.tz) });
});

// Serve static files
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
