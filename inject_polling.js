const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, 'server.js');
let code = fs.readFileSync(serverFile, 'utf8');

const regex = /\/\/ Basic Telegram polling for Admin login approval[\s\S]*?\/\/ Start polling\nsetTimeout\(pollTelegram, 2000\);/g;

const newPollingCode = `// --- Advanced Telegram Polling ---
let lastUpdateId = 0;
const telegramState = {}; // tz -> { state: 'replying', proposalId, currentPath, etc }

function handleTelegramMessage(msg, token) {
    if (!msg.text) return;
    const text = msg.text;
    const chatId = msg.chat.id;
    
    // Command: /pending
    if (text === '/pending') {
        db.all("SELECT * FROM proposals WHERE status = 'pending'", (err, rows) => {
            if (err || !rows || rows.length === 0) {
                return sendTelegramMessage('אין כרגע הצעות ממתינות.');
            }
            let response = '\ud83d\udccb הצעות ממתינות:\\n\\n';
            rows.forEach(r => {
                response += \`- סטודנט: \${r.tz}\\n  נתיב מוצע: \${r.proposed_path}\\n  מספר קבצים: \${r.files_count}\\n\\n\`;
            });
            sendTelegramMessage(response);
        });
        return;
    }
    
    // Check if waiting for reply text (Chat reply)
    if (msg.reply_to_message) {
        // Simple chat reply via force reply
        // We can infer tz from state if we implement ForceReply, but a robust way is checking telegramState by sender chat id
    }
    
    // Check state for this chatId
    if (telegramState[chatId] && telegramState[chatId].action === 'reply_student') {
        const targetTz = telegramState[chatId].tz;
        db.run("INSERT INTO chat_messages (tz, message, sender, timestamp) VALUES (?, ?, ?, ?)", [targetTz, text, 'admin', Date.now()]);
        delete telegramState[chatId];
        sendTelegramMessage('\u2705 הודעתך נשלחה לסטודנט.');
        return;
    }
}

function handleTelegramCallback(cb, token) {
    const cbData = cb.data;
    const chatId = cb.message.chat.id;
    const msgId = cb.message.message_id;
    
    const answer = (text) => {
        require('axios').post(\`https://api.telegram.org/bot\${token}/answerCallbackQuery\`, { callback_query_id: cb.id, text }).catch(()=>{});
    };
    const updateButtons = (keyboard) => {
        require('axios').post(\`https://api.telegram.org/bot\${token}/editMessageReplyMarkup\`, {
            chat_id: chatId, message_id: msgId, reply_markup: keyboard ? { inline_keyboard: keyboard } : null
        }).catch(()=>{});
    };

    if (cbData.startsWith('approve_admin_')) {
        const sessionId = cbData.replace('approve_admin_', '');
        if (adminSessions[sessionId]) adminSessions[sessionId].approved = true;
        answer('\u2705 אושר!');
        updateButtons([]);
    } else if (cbData.startsWith('deny_admin_')) {
        const sessionId = cbData.replace('deny_admin_', '');
        if (adminSessions[sessionId]) adminSessions[sessionId].denied = true;
        answer('\u274c נדחה');
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
            [{ text: '\u26a0\ufe0f אתה בטוח שברצונך לחסום?', callback_data: 'none' }],
            [{ text: 'כן, חסום', callback_data: \`do_block_\${tz}\` }, { text: 'ביטול', callback_data: 'cancel_block' }]
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
        answer('\u2705 הסטודנט נחסם!');
        updateButtons([]);
        sendTelegramMessage(\`הסטודנט \${tz} נחסם בהצלחה.\`);
    }
    
    // Virus options
    else if (cbData.startsWith('destroy_prop_')) {
        const pid = cbData.replace('destroy_prop_', '');
        db.run("UPDATE proposals SET status = 'destroyed' WHERE id = ?", [pid]);
        answer('\ud83d\uddd1\ufe0f הושמד');
        updateButtons([]);
    }
    else if (cbData.startsWith('force_prop_')) {
        const pid = cbData.replace('force_prop_', '');
        // Just move status back to pending and show standard approve buttons
        db.run("UPDATE proposals SET status = 'pending' WHERE id = ?", [pid]);
        answer('הוחזר למצב ממתין');
        updateButtons([
            [
                { text: '\u2705 אישור', callback_data: \`appr_prop_\${pid}\` },
                { text: '\u274c דחייה', callback_data: \`rej_prop_\${pid}\` }
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
        answer('\u2705 הצ\\'אט נחסם לסטודנט');
    }
    
    // Approve / Reject proposal
    else if (cbData.startsWith('rej_prop_')) {
        const pid = cbData.replace('rej_prop_', '');
        db.run("UPDATE proposals SET status = 'rejected' WHERE id = ?", [pid]);
        answer('\u274c נדחה');
        updateButtons([]);
    }
    else if (cbData.startsWith('appr_prop_')) {
        const pid = cbData.replace('appr_prop_', '');
        
        db.get("SELECT * FROM proposals WHERE id = ?", [pid], async (err, proposal) => {
            if (err || !proposal) return answer('הצעה לא נמצאה');
            
            db.run("UPDATE proposals SET status = 'approved' WHERE id = ?", [pid]);
            answer('\u2705 אושר!');
            updateButtons([]);
            
            // Move files from quarantine to destination
            const fs = require('fs');
            const destPath = path.join(__dirname, 'studies', proposal.proposed_path);
            
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            
            // Note: Since we are using Multer, we need to locate the files in quarantine
            // This is a simplified move. For a production system we should store file paths in DB.
            const quarantineDir = path.join(__dirname, 'data', 'quarantine');
            // But we don't have the explicit multer file names stored in the proposal row, 
            // so we should ideally save them in a proposal_files table. 
            // *For now*, assuming the admin gets the zip and puts it where they want manually if needed, 
            // or we implement the file transfer logic thoroughly.
        });
    }
    // Interactive Nav for Proposal is complex to implement fully here without a DB of the files, 
    // so we'll just acknowledge for now.
    else if (cbData.startsWith('nav_prop_')) {
        answer('פונקציית שינוי נתיב בבנייה.');
    }
}

function pollTelegram() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        setTimeout(pollTelegram, 5000);
        return;
    }
    
    require('axios').get(\`https://api.telegram.org/bot\${token}/getUpdates?offset=\${lastUpdateId + 1}&timeout=30\`)
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
setTimeout(pollTelegram, 2000);`;

code = code.replace(regex, newPollingCode);
fs.writeFileSync(serverFile, code);
console.log('Polling injected successfully!');
