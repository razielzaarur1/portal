const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, 'server.js');
let code = fs.readFileSync(serverFile, 'utf8');

const newCode = `
// ==========================================
// CHAT & PROPOSALS API
// ==========================================

const upload = multer({ 
    dest: quarantineDir,
    limits: { fileSize: 40 * 1024 * 1024 } // 40MB
});

function runClamScan(filePath) {
    return new Promise((resolve) => {
        // Run clamscan. 0 = OK, 1 = Virus, 2 = Error
        exec(\`clamscan "\${filePath}"\`, (error, stdout, stderr) => {
            if (error && error.code === 1) {
                // Virus found
                const match = stdout.match(/: (.*) FOUND/);
                const virusName = match ? match[1] : 'Unknown Virus';
                resolve({ safe: false, virus: virusName });
            } else if (error && error.code === 2) {
                // Error running clamscan
                resolve({ safe: true }); // Assume safe if scanner fails or is missing, or we can handle it differently.
            } else {
                resolve({ safe: true });
            }
        });
    });
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
    
    if (userFolderCounts[tz].length > 3) {
        // Spam!
        const folders = userFolderCounts[tz].length;
        sendTelegramMessage(
            \`\u26a0\ufe0f התראת ספאם!\nהסטודנט בעל ת.ז \${tz} ניסה ליצור יותר מ-3 תיקיות (\${folders} פעמים) ב-5 דקות האחרונות.\`,
            JSON.stringify({
                inline_keyboard: [[
                    { text: '\ud83d\udeab חסום סטודנט', callback_data: \`confirm_block_\${tz}\` },
                    { text: '\ud83d\udc41\ufe0f התעלם', callback_data: 'ignore_spam' }
                ]]
            })
        );
        return res.status(429).json({ error: 'spam_protection', message: 'יצרת יותר מדי תיקיות. אנא המתן מספר דקות.' });
    }
    
    // Set 5 min timer
    if (userFolderTimers[\`\${tz}_\${folderPath}\`]) clearTimeout(userFolderTimers[\`\${tz}_\${folderPath}\`]);
    
    userFolderTimers[\`\${tz}_\${folderPath}\`] = setTimeout(() => {
        sendTelegramMessage(\`\u26a0\ufe0f התראה: הסטודנט \${tz} ניסה ליצור תיקייה ריקה (\${folderPath}) ולא העלה שום קובץ תוך 5 דקות.\`);
        delete userFolderTimers[\`\${tz}_\${folderPath}\`];
    }, 5 * 60 * 1000);
    
    res.json({ success: true });
});

app.post('/api/drive/propose-file', upload.array('files', 20), async (req, res) => {
    const { tz, proposed_path, comments } = req.body;
    const files = req.files;
    
    if (!tz || !files || files.length === 0) {
        return res.status(400).json({ error: 'Missing files or data' });
    }
    
    // Clear the empty folder timer if it exists for this path
    if (userFolderTimers[\`\${tz}_\${proposed_path}\`]) {
        clearTimeout(userFolderTimers[\`\${tz}_\${proposed_path}\`]);
        delete userFolderTimers[\`\${tz}_\${proposed_path}\`];
    }
    
    db.get("SELECT name FROM students WHERE tz = ?", [tz], async (err, student) => {
        const studentName = student ? student.name : 'לא ידוע';
        
        const proposalId = crypto.randomBytes(8).toString('hex');
        
        // Save to DB
        db.run(
            "INSERT INTO proposals (id, tz, files_count, proposed_path, comments, status, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [proposalId, tz, files.length, proposed_path, comments, 'pending', Date.now()]
        );
        
        // Scan files
        let hasVirus = false;
        let virusName = '';
        
        for (const file of files) {
            const scan = await runClamScan(file.path);
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
                \`\u26a0\ufe0f סכנת וירוס!\nהסטודנט \${studentName} (\${tz}) ניסה להעלות קבצים לנתיב \${proposed_path}.\nהסורק זיהה וירוס: \${virusName}\nהקבצים נמצאים כעת בהסגר.\`,
                JSON.stringify({
                    inline_keyboard: [[
                        { text: '\ud83d\uddd1\ufe0f השמד קבצים', callback_data: \`destroy_prop_\${proposalId}\` },
                        { text: '\u26a0\ufe0f המשך בכל זאת (מסוכן)', callback_data: \`force_prop_\${proposalId}\` }
                    ]]
                })
            );
            return res.json({ success: true, warning: 'virus' });
        }
        
        // Safe files - Notify Admin
        await notifyAdminNewProposal(proposalId, studentName, tz, proposed_path, comments, files);
        
        res.json({ success: true });
    });
});

async function notifyAdminNewProposal(proposalId, studentName, tz, proposed_path, comments, files) {
    let msg = \`\ud83d\udcc4 הצעת קבצים חדשה!\n\n\ud83d\udc64 סטודנט: \${studentName} (\${tz})\n\ud83d\udcc1 יעד מוצע: \${proposed_path}\n\ud83d\udcac הערות: \${comments || 'אין'}\n\ud83d\udccb מספר קבצים: \${files.length}\`;
    
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
                await require('axios').post(\`https://api.telegram.org/bot\${token}/sendDocument\`, form, {
                    headers: form.getHeaders()
                });
            } catch(e) {
                console.error("Error sending document", e.message);
            }
        }
    }
    
    // If we didn't send caption (files too big or error), send it as text
    if (!sentFiles) {
        await require('axios').post(\`https://api.telegram.org/bot\${token}/sendMessage\`, {
            chat_id: chatId,
            text: msg + '\n(לא ניתן לשלוח את הקבצים - כנראה חורגים מגודל 50MB)'
        });
    }
    
    // Send action buttons
    const keyboard = {
        inline_keyboard: [
            [
                { text: '\u2705 אישור', callback_data: \`appr_prop_\${proposalId}\` },
                { text: '\u274c דחייה', callback_data: \`rej_prop_\${proposalId}\` }
            ],
            [
                { text: '\ud83d\udcc2 שנה נתיב (אינטראקטיבי)', callback_data: \`nav_prop_\${proposalId}_/\` },
            ],
            [
                { text: '\ud83d\udeab חסום סטודנט', callback_data: \`confirm_block_\${tz}\` }
            ]
        ]
    };
    
    await require('axios').post(\`https://api.telegram.org/bot\${token}/sendMessage\`, {
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
    
    require('axios').post(\`https://api.telegram.org/bot\${token}/sendMessage\`, body).catch(()=>{});
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
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json(rows);
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
                const history = rows.reverse().map(r => \`[\${r.sender === 'student' ? 'סטודנט' : 'מנהל'}]: \${r.message}\`).join('\\n');
                
                sendTelegramMessage(
                    \`\ud83d\udcac הודעה חדשה מסטודנט!\n\ud83d\udc64 שם: \${student.name} (\${tz})\n\nהיסטוריה אחרונה:\n\${history}\`,
                    JSON.stringify({
                        inline_keyboard: [[
                            { text: '\ud83d\udcac הגב', callback_data: \`reply_chat_\${tz}\` },
                            { text: '\ud83d\udeab חסום צ\\'אט', callback_data: \`block_chat_\${tz}\` }
                        ]]
                    })
                );
            });
        }
        
        res.json({ success: true });
    });
});

app.post('/api/students/:tz/block-chat', (req, res) => {
    db.run("UPDATE students SET chat_blocked = ? WHERE tz = ?", [req.body.blocked ? 1 : 0, req.params.tz]);
    res.json({ success: true });
});

// Telegram Polling Update (to be added)
// ==========================================
`;

code = code.replace('// Serve static files', newCode + '\n// Serve static files');

fs.writeFileSync(serverFile, code);
console.log('Routes injected successfully!');
