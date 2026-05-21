const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'admin.html');
let code = fs.readFileSync(file, 'utf8');

// Add Nav Button
code = code.replace(/<button class="nav-btn active" id="nav-students" onclick="showSection\('students'\)">/, 
    '<button class="nav-btn active" id="nav-students" onclick="showSection(\'students\')">\n                <i class="fas fa-users"></i> סטודנטים\n            </button>\n            <button class="nav-btn" id="nav-chats" onclick="showSection(\'chats\'); loadChats();">\n                <i class="fas fa-comments"></i> צ\'אטים\n            </button>'
).replace(/<i class="fas fa-users"><\/i> סטודנטים\n            <\/button>\n            <button class="nav-btn" id="nav-chats"/, '<button class="nav-btn" id="nav-chats"'); // Cleanup dup

// Add Section
const chatsSection = `
        <!-- Chats Section -->
        <div class="section" id="section-chats">
            <div class="section-title">
                <i class="fas fa-comments" style="color:var(--primary)"></i>
                צ'אט עם סטודנטים
            </div>
            
            <div style="display:flex; gap: 20px; height: 60vh;">
                <div style="flex: 1; background: white; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); overflow-y: auto;">
                    <div id="chat-users-list" style="padding: 10px;">
                        <div class="empty-state">טוען משתמשים...</div>
                    </div>
                </div>
                <div style="flex: 2; background: white; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); display: flex; flex-direction: column;">
                    <div id="chat-header" style="padding: 16px; border-bottom: 1px solid var(--border); font-weight: bold; background: #f8fafc; border-radius: 16px 16px 0 0;">
                        בחר סטודנט לשיחה
                    </div>
                    <div id="chat-messages-container" style="flex: 1; padding: 16px; overflow-y: auto; background: #f1f5f9; display: flex; flex-direction: column; gap: 10px;">
                        
                    </div>
                    <div style="padding: 16px; border-top: 1px solid var(--border); display: flex; gap: 10px;">
                        <input type="text" id="admin-chat-input" placeholder="הקלד הודעה..." disabled style="flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 8px;">
                        <button onclick="sendAdminChat()" id="admin-chat-btn" disabled style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">שלח</button>
                    </div>
                </div>
            </div>
        </div>
`;

code = code.replace(/<\/div>\n    <\/div>\n<\/div>\n\n<!-- Toast -->/, `        </div>\n${chatsSection}    </div>\n</div>\n\n<!-- Toast -->`);

const jsCode = `
    // --- Chats ---
    let activeChatTz = null;
    
    async function loadChats() {
        const listEl = document.getElementById('chat-users-list');
        listEl.innerHTML = allStudents.map(s => \`
            <div onclick="openChat('\${s.tz}', '\${s.name}')" style="padding: 12px; cursor: pointer; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px; transition: 0.2s;" class="chat-user-item hover:bg-slate-50">
                <div style="width: 40px; height: 40px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                    \${s.name ? s.name.charAt(0) : '?'}
                </div>
                <div>
                    <div style="font-weight: bold; font-size: 0.9rem;">\${s.name || 'ללא שם'}</div>
                    <div style="font-size: 0.8rem; color: var(--muted);">\${s.tz}</div>
                </div>
            </div>
        \`).join('');
    }
    
    async function openChat(tz, name) {
        activeChatTz = tz;
        document.getElementById('chat-header').textContent = \`שיחה עם \${name || tz}\`;
        document.getElementById('admin-chat-input').disabled = false;
        document.getElementById('admin-chat-btn').disabled = false;
        
        await fetchMessages(tz);
    }
    
    async function fetchMessages(tz) {
        if (!tz) return;
        try {
            const res = await fetch(\`/api/chat/\${tz}\`);
            const msgs = await res.json();
            
            const container = document.getElementById('chat-messages-container');
            container.innerHTML = msgs.map(m => \`
                <div style="padding: 10px 14px; border-radius: 12px; max-width: 80%; \${m.sender === 'admin' ? 'background: #d1fae5; align-self: flex-start;' : 'background: white; align-self: flex-end;'} box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <div style="font-size: 0.9rem; color: #1e293b;">\${m.message}</div>
                    <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 4px;">\${new Date(m.timestamp).toLocaleString()}</div>
                </div>
            \`).join('');
            container.scrollTop = container.scrollHeight;
        } catch(e) {}
    }
    
    async function sendAdminChat() {
        if (!activeChatTz) return;
        const input = document.getElementById('admin-chat-input');
        const text = input.value.trim();
        if (!text) return;
        
        try {
            await fetch(\`/api/chat/\${activeChatTz}\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, sender: 'admin' })
            });
            input.value = '';
            fetchMessages(activeChatTz);
        } catch(e) {}
    }
`;

code = code.replace(/function showToast\(msg\)/, jsCode + '\n    function showToast(msg)');

fs.writeFileSync(file, code);
console.log('admin.html injected successfully!');
