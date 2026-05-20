const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

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
        grades TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err);
            return;
        }

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

// GET users
app.get('/api/users', (req, res) => {
    db.all("SELECT tz, name FROM students", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
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
                permission: isAdmin ? exactPerm : undefined
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

// Serve static files
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
