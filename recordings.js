const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Common course names to avoid confusing course numbers with lesson numbers
const COMMON_COURSE_ALIASES = [
    'פיזיקה 3', 'פיזיקה 2', 'פיזיקה 1',
    'אותות ומערכות', 'הסתברות וסטטיסטיקה', 'מבוא להנדסת חשמל',
    'התקני מלמ', 'מלמ', 'אותות אקראיים ורעש', 'עיבוד אותות',
    'שדות אלמ', 'תורת החשמל ואלקטרומגנטיקה', 'תורת החשמל',
    'מדח', 'מדר', 'אנליזה מתקדמת', 'אינפי 1', 'אינפי 2',
    'מבוא לבקרה', 'מעבדה 1', 'גלים ופיזיקה מודרנית',
    'אלגברה לינארית', 'מערכות ספרתיות', 'מבוא למדעי המחשב', 'ארכיטקטורת מחשבים'
];

/**
 * Check if a folder name represents recordings / reserve lessons / supplementary sessions
 */
function isRecordingsFolderName(name) {
    if (!name) return false;
    return /(הקלט|מילואים|תגבור|זום|zoom|מוקלט)/i.test(name);
}

/**
 * Intelligently parse a lesson filename into structured data
 * Handles: פיזיקה 3, סדרה א/ב/קצרה, חלק א/ב, המשך, חזרה למבחן, הקלטות, etc.
 */
function parseLessonFile(filename, courseName = '') {
    let name = filename.replace(/\.(url|mp4|mkv|avi|mov|webm)$/i, '').trim();

    // 1. Remove prefixes like 'הקלטת שיעור', 'הקלטת תרגול', 'הקלטות', 'תרגול מילואים', 'תגבור מילואים', 'מילואים'
    const prefixRegex = /^(?:הקלטות|הקלטת|הקלטה|תרגול|תגבור|שיעור|מפגש)?\s*(?:מילואים|זום|zoom)?\s*(?:הקלטות|הקלטת|הקלטה|תרגול|תגבור|שיעור|מפגש)?\s*(?:מילואים)?\s*/i;
    name = name.replace(prefixRegex, '').trim();

    // 2. Remove course name from filename start if present (e.g. 'פיזיקה 3', 'מדח')
    if (courseName) {
        const cleanCourse = courseName.replace(/[\"']/g, '').trim();
        if (cleanCourse && name.startsWith(cleanCourse)) {
            name = name.substring(cleanCourse.length).trim();
        }
    }

    // 3. Remove common course aliases if still present at the start
    for (const alias of COMMON_COURSE_ALIASES) {
        if (name.startsWith(alias)) {
            name = name.substring(alias.length).trim();
            break;
        }
    }

    // Secondary cleanup in case "מילואים" or "הקלטות" was after the course name (e.g. "פיזיקה 3 מילואים סדרה א 1")
    name = name.replace(/^(?:הקלטות|הקלטת|הקלטה|תרגול|תגבור|שיעור|מילואים)\s*/i, '').trim();

    let series = null;
    let lessonTitle = name;
    let lessonNum = null;
    let part = null;

    // 4. Detect Series patterns: 'סדרה א', 'סדרה ב', 'סדרה קצרה', 'סדרה 1'
    const seriesMatch = name.match(/^(סדרה\s+[א-ת0-9]+)\s*(.*)$/i);
    if (seriesMatch) {
        series = seriesMatch[1].trim();
        lessonTitle = seriesMatch[2].trim();
    }

    // 5. Detect Part patterns: 'חלק א', 'חלק ב', 'חלק 1', 'חלק 2'
    const partMatch = lessonTitle.match(/(.*?)(?:\s*[-–]?\s*חלק\s*([א-ת0-9]+))$/i);
    if (partMatch) {
        lessonTitle = partMatch[1].trim();
        part = 'חלק ' + partMatch[2].trim();
    }

    // 6. Detect 'המשך X' or 'המשך'
    const hemshechMatch = lessonTitle.match(/^המשך\s*(\d+)?$/i);
    if (hemshechMatch) {
        lessonNum = hemshechMatch[1] ? parseInt(hemshechMatch[1], 10) : null;
        part = 'המשך' + (lessonNum ? ` ${lessonNum}` : '');
        lessonTitle = '';
    } else {
        // Detect lesson number standalone or prefixed with 'שיעור'
        const numMatch = lessonTitle.match(/^(?:שיעור\s*|מפגש\s*|תרגול\s*)?(\d+)$/i);
        if (numMatch) {
            lessonNum = parseInt(numMatch[1], 10);
            lessonTitle = '';
        } else {
            // Number followed by trailing text: e.g. "1 חזרה" or "10 המשך"
            const trailingNum = lessonTitle.match(/^(\d+)\s*(.*)$/);
            if (trailingNum) {
                lessonNum = parseInt(trailingNum[1], 10);
                lessonTitle = trailingNum[2].trim();
            }
        }
    }

    // 7. Format clean display name
    let displayName = '';
    if (lessonNum !== null) {
        displayName = `שיעור ${lessonNum}`;
        if (part) displayName += ` - ${part}`;
        if (lessonTitle) displayName += ` (${lessonTitle})`;
    } else if (part) {
        displayName = `${part}`;
        if (lessonTitle) displayName += ` - ${lessonTitle}`;
    } else {
        displayName = lessonTitle || filename.replace(/\.(url|mp4|mkv|avi|mov|webm)$/i, '');
    }

    // Generate stable unique lesson ID
    const lessonId = 'les_' + crypto.createHash('md5').update(filename).digest('hex').substring(0, 12);

    return {
        id: lessonId,
        rawFilename: filename,
        series,
        lessonNum,
        part,
        extraTitle: lessonTitle,
        displayName
    };
}

/**
 * Extract target URL from a .url shortcut file
 */
function extractShortcutUrl(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/URL=(.+)/i);
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

/**
 * Auto-find the course folder in studies base directory
 */
function autoFindCourseFolder(courseIdOrName, baseDir, db = null) {
    if (!fs.existsSync(baseDir)) return null;

    let courses = [];
    const coursesPath1 = path.join(__dirname, 'data', 'courses.json');
    const coursesPath2 = path.join(__dirname, 'grade_calc', 'courses.json');
    const cPath = fs.existsSync(coursesPath1) ? coursesPath1 : coursesPath2;
    if (fs.existsSync(cPath)) {
        try {
            courses = JSON.parse(fs.readFileSync(cPath, 'utf8'));
        } catch (e) {}
    }

    let targetCourse = null;
    if (typeof courseIdOrName === 'number' || /^\d+$/.test(courseIdOrName)) {
        const cid = parseInt(courseIdOrName, 10);
        targetCourse = courses.find(c => c.id === cid);
    } else if (typeof courseIdOrName === 'string') {
        const norm = s => s.replace(/[\"\'\-\_\(\)\d]/g, '').trim().toLowerCase();
        const searchNorm = norm(courseIdOrName);
        targetCourse = courses.find(c => {
            const cNorm = norm(c.name);
            return cNorm === searchNorm || cNorm.includes(searchNorm) || searchNorm.includes(cNorm);
        });
    }

    if (!targetCourse) return null;

    const yearHeb = targetCourse.year === 1 ? 'שנה א' : (targetCourse.year === 2 ? 'שנה ב' : 'שנה ' + targetCourse.year);
    const semHeb = targetCourse.semester === 'A' ? 'סמסטר א' : 'סמסטר ב';
    const semPath = path.join(baseDir, yearHeb, semHeb);

    if (!fs.existsSync(semPath)) return null;

    const courseDirs = fs.readdirSync(semPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    let matchedDir = null;
    const norm = s => s.replace(/[\"\'\-\_\(\)\d]/g, '').trim().toLowerCase();
    const cNorm = norm(targetCourse.name);

    if (targetCourse.name.includes('פיזיקה 3') || targetCourse.name.includes('גלים ופיזיקה מודרנית')) {
        matchedDir = courseDirs.find(d => d.includes('פיזיקה 3'));
    } else if (targetCourse.name.includes('חלקיות') || targetCourse.name.includes('מד"ח') || targetCourse.name.includes('מדח')) {
        matchedDir = courseDirs.find(d => d.includes('מדח'));
    } else if (targetCourse.name.includes('התקני') || targetCourse.name.includes('מל"מ') || targetCourse.name.includes('מלמ')) {
        matchedDir = courseDirs.find(d => d.includes('מלמ'));
    } else if (targetCourse.name.includes('תורת החשמל') || (targetCourse.name.includes('חשמל') && targetCourse.name.includes('תורת'))) {
        matchedDir = courseDirs.find(d => d.includes('תורת החשמל'));
    } else if (targetCourse.name.includes('שדות')) {
        matchedDir = courseDirs.find(d => d.includes('שדות'));
    } else {
        matchedDir = courseDirs.find(d => {
            const dNorm = norm(d);
            return dNorm === cNorm || dNorm.includes(cNorm) || cNorm.includes(dNorm);
        });
    }

    if (!matchedDir) return null;

    return `/${yearHeb}/${semHeb}/${matchedDir}`;
}

/**
 * Find the best recordings folder inside a course directory
 */
function findRecordingsSubfolder(fullDirPath) {
    if (!fs.existsSync(fullDirPath)) return null;
    try {
        const subs = fs.readdirSync(fullDirPath, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);

        const candidates = subs.filter(s => isRecordingsFolderName(s));
        if (candidates.length === 0) return null;
        if (candidates.length === 1) return candidates[0];

        // Prefer one containing .url files if multiple
        for (const c of candidates) {
            try {
                const cPath = path.join(fullDirPath, c);
                const hasUrls = fs.readdirSync(cPath).some(f => f.toLowerCase().endsWith('.url'));
                if (hasUrls) return c;
            } catch (e) {}
        }
        return candidates[0];
    } catch (e) {
        return null;
    }
}

/**
 * Resolve the recordings folder path for a course or path
 */
async function resolveRecordingsFolder(courseId, rawPath, baseDir, db) {
    if (!fs.existsSync(baseDir)) return null;

    let courseName = '';
    let resolvedRelPath = null;

    // 1. If explicit path is provided
    if (rawPath) {
        let cleanPath = rawPath.replace(/\\/g, '/').replace(/^\/+/, '');
        const full = path.join(baseDir, cleanPath);
        if (fs.existsSync(full)) {
            const stat = fs.statSync(full);
            if (stat.isDirectory()) {
                const basename = path.basename(cleanPath);
                if (isRecordingsFolderName(basename)) {
                    resolvedRelPath = '/' + cleanPath;
                    courseName = path.basename(path.dirname(cleanPath));
                } else {
                    // Check if subfolder has recordings
                    const recSub = findRecordingsSubfolder(full);
                    if (recSub) {
                        resolvedRelPath = '/' + cleanPath + '/' + recSub;
                        courseName = basename;
                    }
                }
            }
        }
    }

    // 2. If courseId is provided and no path resolved yet
    if (!resolvedRelPath && courseId) {
        // First check database course_folders
        if (db) {
            const linked = await new Promise(resolve => {
                db.get("SELECT folder_path FROM course_folders WHERE course_id = ?", [courseId], (err, row) => {
                    resolve(row ? row.folder_path : null);
                });
            });

            if (linked) {
                const fullLinked = path.join(baseDir, linked);
                if (fs.existsSync(fullLinked)) {
                    if (isRecordingsFolderName(path.basename(linked))) {
                        resolvedRelPath = linked;
                        courseName = path.basename(path.dirname(linked));
                    } else {
                        const recSub = findRecordingsSubfolder(fullLinked);
                        if (recSub) {
                            resolvedRelPath = linked + '/' + recSub;
                            courseName = path.basename(linked);
                        }
                    }
                }
            }
        }

        // Auto-find course folder if not linked yet
        if (!resolvedRelPath) {
            const autoFolder = autoFindCourseFolder(courseId, baseDir, db);
            if (autoFolder) {
                const fullAuto = path.join(baseDir, autoFolder);
                if (fs.existsSync(fullAuto)) {
                    const recSub = findRecordingsSubfolder(fullAuto);
                    if (recSub) {
                        resolvedRelPath = autoFolder + '/' + recSub;
                        courseName = path.basename(autoFolder);
                    }
                }
            }
        }
    }

    if (!resolvedRelPath) return null;

    const fullPath = path.join(baseDir, resolvedRelPath);
    if (!fs.existsSync(fullPath)) return null;

    return {
        courseId: courseId || null,
        courseName: courseName || path.basename(path.dirname(resolvedRelPath)),
        folderPath: resolvedRelPath,
        fullPath: fullPath
    };
}

/**
 * Scan and parse all lessons in a recordings folder
 */
function getRecordingsLessons(folderFullPath, courseName = '') {
    if (!fs.existsSync(folderFullPath)) return null;

    const entries = fs.readdirSync(folderFullPath, { withFileTypes: true });
    const rawLessons = [];

    for (const ent of entries) {
        if (!ent.isFile()) continue;
        const lowerName = ent.name.toLowerCase();
        const isUrl = lowerName.endsWith('.url');
        const isVideo = /\.(mp4|mkv|avi|mov|webm)$/i.test(lowerName);

        if (isUrl || isVideo) {
            const filePath = path.join(folderFullPath, ent.name);
            let url = '';
            if (isUrl) {
                url = extractShortcutUrl(filePath) || '';
            } else if (isVideo) {
                // Return direct streaming URL
                const rel = filePath.replace(/\\/g, '/');
                url = '/studies/' + encodeURIComponent(path.basename(rel));
            }

            const parsed = parseLessonFile(ent.name, courseName);
            rawLessons.push({
                ...parsed,
                url: url
            });
        }
    }

    if (rawLessons.length === 0) {
        return {
            hasMultipleSeries: false,
            seriesList: [],
            totalLessons: 0
        };
    }

    // Determine series grouping
    const seriesSet = new Set();
    rawLessons.forEach(l => {
        if (l.series) seriesSet.add(l.series);
    });

    const hasMultipleSeries = seriesSet.size >= 2 || (seriesSet.size === 1 && rawLessons.some(l => !l.series));

    let seriesList = [];

    if (!hasMultipleSeries) {
        // Single series!
        const sortedLessons = sortLessons(rawLessons);
        seriesList = [{
            seriesName: seriesSet.size === 1 ? Array.from(seriesSet)[0] : null,
            lessons: sortedLessons
        }];
    } else {
        // Multiple series: group each series
        const groups = {};
        for (const l of rawLessons) {
            const sName = l.series || 'סדרה ראשית';
            if (!groups[sName]) groups[sName] = [];
            groups[sName].push(l);
        }

        // Sort series names nicely (e.g. סדרה א before סדרה ב, סדרה ראשית first)
        const sortedSeriesNames = Object.keys(groups).sort((a, b) => {
            if (a === 'סדרה ראשית') return -1;
            if (b === 'סדרה ראשית') return 1;
            return a.localeCompare(b, 'he');
        });

        seriesList = sortedSeriesNames.map(sName => ({
            seriesName: sName,
            lessons: sortLessons(groups[sName])
        }));
    }

    return {
        hasMultipleSeries,
        seriesList,
        totalLessons: rawLessons.length
    };
}

/**
 * Sort lessons: numerical lessons first (1, 2, ...), parts ordered, non-numbered at the end
 */
function sortLessons(lessons) {
    return [...lessons].sort((a, b) => {
        // Both have numbers
        if (a.lessonNum !== null && b.lessonNum !== null) {
            if (a.lessonNum !== b.lessonNum) {
                return a.lessonNum - b.lessonNum;
            }
            // Same lesson number: sort by part
            const partA = a.part || '';
            const partB = b.part || '';
            return partA.localeCompare(partB, 'he');
        }
        // One has number, other does not
        if (a.lessonNum !== null && b.lessonNum === null) return -1;
        if (a.lessonNum === null && b.lessonNum !== null) return 1;

        // Neither has number: sort by displayName
        return a.displayName.localeCompare(b.displayName, 'he');
    });
}

/**
 * Register all recordings express routes
 */
function initRecordingsRoutes(app, db, getBaseDir) {
    // 1. Check if a course or path has recordings folder
    const handleCheck = async (req, res) => {
        try {
            const { courseId, path: reqPath } = req.query;
            const baseDir = getBaseDir();
            const resolved = await resolveRecordingsFolder(courseId, reqPath, baseDir, db);

            if (!resolved) {
                return res.json({ hasRecordings: false, hasMiluim: false });
            }

            // Verify folder actually contains recordings (.url or video files)
            let hasFiles = false;
            try {
                const files = fs.readdirSync(resolved.fullPath);
                hasFiles = files.some(f => f.toLowerCase().endsWith('.url') || /\.(mp4|mkv|webm)$/i.test(f));
            } catch (e) {}

            if (!hasFiles) {
                return res.json({ hasRecordings: false, hasMiluim: false });
            }

            res.json({
                hasRecordings: true,
                hasMiluim: true, // backward compat
                courseId: resolved.courseId,
                courseName: resolved.courseName,
                folderPath: resolved.folderPath
            });
        } catch (err) {
            console.error('Error in /api/recordings/check:', err);
            res.status(500).json({ error: 'Server error' });
        }
    };

    app.get('/api/recordings/check', handleCheck);
    app.get('/api/miluim/check', handleCheck);

    // 2. Get lessons for a course or path
    const handleLessons = async (req, res) => {
        try {
            const { courseId, path: reqPath, tz } = req.query;
            const baseDir = getBaseDir();
            const resolved = await resolveRecordingsFolder(courseId, reqPath, baseDir, db);

            if (!resolved) {
                return res.status(404).json({ error: 'לא נמצאה תיקיית הקלטות עבור קורס זה' });
            }

            const data = getRecordingsLessons(resolved.fullPath, resolved.courseName);
            if (!data) {
                return res.status(404).json({ error: 'שגיאה בסריקת ההקלטות' });
            }

            // Fetch watched lessons for tz if provided
            let watchedMap = {};
            if (tz && db) {
                const cid = resolved.courseId || resolved.folderPath;
                // Query both recordings_progress and miluim_progress
                const rows = await new Promise((resolve) => {
                    db.all(`
                        SELECT lesson_id, watched FROM recordings_progress WHERE tz = ? AND course_id = ?
                        UNION
                        SELECT lesson_id, watched FROM miluim_progress WHERE tz = ? AND course_id = ?
                    `, [tz, String(cid), tz, String(cid)], (err, rows) => {
                        resolve(rows || []);
                    });
                });
                rows.forEach(r => {
                    if (r.watched === 1) watchedMap[r.lesson_id] = true;
                });
            }

            res.json({
                courseId: resolved.courseId,
                courseName: resolved.courseName,
                folderPath: resolved.folderPath,
                hasMultipleSeries: data.hasMultipleSeries,
                seriesList: data.seriesList,
                totalLessons: data.totalLessons,
                watchedMap
            });
        } catch (err) {
            console.error('Error in /api/recordings/lessons:', err);
            res.status(500).json({ error: 'Server error' });
        }
    };

    app.get('/api/recordings/lessons', handleLessons);
    app.get('/api/miluim/lessons', handleLessons);

    // 3. Update watched progress
    const handleProgress = async (req, res) => {
        try {
            const { tz, courseId, lessonId, watched } = req.body;
            if (!tz || !courseId || !lessonId) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const isWatched = watched ? 1 : 0;
            const now = Date.now();

            // Save to recordings_progress
            await new Promise((resolve, reject) => {
                db.run(`
                    INSERT INTO recordings_progress (tz, course_id, lesson_id, watched, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(tz, course_id, lesson_id) DO UPDATE SET
                    watched = excluded.watched,
                    updated_at = excluded.updated_at
                `, [tz, String(courseId), lessonId, isWatched, now], function(err) {
                    if (err) reject(err); else resolve();
                });
            });

            // Also mirror to miluim_progress for backward compatibility
            db.run(`
                INSERT INTO miluim_progress (tz, course_id, lesson_id, watched, updated_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(tz, course_id, lesson_id) DO UPDATE SET
                watched = excluded.watched,
                updated_at = excluded.updated_at
            `, [tz, String(courseId), lessonId, isWatched, now], () => {});

            res.json({ success: true, watched: isWatched });
        } catch (err) {
            console.error('Error in /api/recordings/progress:', err);
            res.status(500).json({ error: 'Server error' });
        }
    };

    app.post('/api/recordings/progress', handleProgress);
    app.post('/api/miluim/progress', handleProgress);

    // 4. Get all available recordings courses (with 30-min cache)
    let allRecordingsCache = { timestamp: 0, courses: [] };
    const CACHE_TTL = 30 * 60 * 1000;

    const handleAll = async (req, res) => {
        try {
            const now = Date.now();
            if (allRecordingsCache.courses.length > 0 && (now - allRecordingsCache.timestamp < CACHE_TTL)) {
                return res.json({ courses: allRecordingsCache.courses });
            }

            const baseDir = getBaseDir();
            if (!fs.existsSync(baseDir)) return res.json({ courses: [] });

            let courses = [];
            const coursesPath1 = path.join(__dirname, 'data', 'courses.json');
            const coursesPath2 = path.join(__dirname, 'grade_calc', 'courses.json');
            const cPath = fs.existsSync(coursesPath1) ? coursesPath1 : coursesPath2;
            if (fs.existsSync(cPath)) {
                try {
                    courses = JSON.parse(fs.readFileSync(cPath, 'utf8'));
                } catch (e) {}
            }

            const available = [];
            for (const year of ['שנה א', 'שנה ב']) {
                const yPath = path.join(baseDir, year);
                if (!fs.existsSync(yPath)) continue;
                for (const sem of ['סמסטר א', 'סמסטר ב']) {
                    const sPath = path.join(yPath, sem);
                    if (!fs.existsSync(sPath)) continue;
                    let cDirs = [];
                    try {
                        cDirs = fs.readdirSync(sPath, { withFileTypes: true }).filter(d => d.isDirectory());
                    } catch(e) {}
                    for (const cDir of cDirs) {
                        const courseFullPath = path.join(sPath, cDir.name);
                        let subs = [];
                        try {
                            subs = fs.readdirSync(courseFullPath, { withFileTypes: true }).filter(d => d.isDirectory());
                        } catch(e) {}
                        const recSub = subs.find(s => isRecordingsFolderName(s.name));
                        if (recSub) {
                            const recFullPath = path.join(courseFullPath, recSub.name);
                            const relFolder = `/${year}/${sem}/${cDir.name}/${recSub.name}`;
                            let files = [];
                            try {
                                files = fs.readdirSync(recFullPath).filter(f => f.toLowerCase().endsWith('.url') || /\.(mp4|mkv|webm)$/i.test(f));
                            } catch(e) {}
                            if (files.length > 0) {
                                const seriesSet = new Set();
                                files.forEach(f => {
                                    const m = f.match(/סדרה\s+[א-ת0-9]+/i);
                                    if (m) seriesSet.add(m[0]);
                                });
                                const hasMultipleSeries = seriesSet.size >= 2 || (seriesSet.size === 1 && files.some(f => !/סדרה\s+[א-ת0-9]+/i.test(f)));

                                // Match with courses.json to get ID
                                const norm = s => s.replace(/[\"\'\-\_\(\)\d]/g, '').trim().toLowerCase();
                                const cNorm = norm(cDir.name);
                                const semCode = sem.includes('א') ? 'A' : 'B';
                                const yearNum = year.includes('א') ? 1 : 2;
                                const matchedCourse = courses.find(c => {
                                    if (c.year !== yearNum || c.semester !== semCode) return false;
                                    const nameNorm = norm(c.name);
                                    return nameNorm === cNorm || nameNorm.includes(cNorm) || cNorm.includes(nameNorm);
                                });

                                available.push({
                                    id: matchedCourse ? matchedCourse.id : cDir.name,
                                    name: matchedCourse ? matchedCourse.name : cDir.name,
                                    year: yearNum,
                                    semester: semCode,
                                    folderPath: relFolder,
                                    totalLessons: files.length,
                                    hasMultipleSeries: hasMultipleSeries,
                                    seriesCount: seriesSet.size || 1
                                });
                            }
                        }
                    }
                }
            }

            allRecordingsCache = { timestamp: now, courses: available };
            res.json({ courses: available });
        } catch (err) {
            console.error('Error in /api/recordings/all:', err);
            res.status(500).json({ error: 'Server error' });
        }
    };

    app.get('/api/recordings/all', handleAll);
    app.get('/api/miluim/all', handleAll);
}

module.exports = {
    isRecordingsFolderName,
    parseLessonFile,
    extractShortcutUrl,
    autoFindCourseFolder,
    findRecordingsSubfolder,
    resolveRecordingsFolder,
    getRecordingsLessons,
    sortLessons,
    initRecordingsRoutes
};
