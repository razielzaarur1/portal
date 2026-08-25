/* ==========================================================================
   VeriLearn Chat & Bug Report System
   Integrated directly with Portal API & Telegram Admin Notifications
   ========================================================================== */

class VeriLearnChat {
  constructor() {
    this.modalEl = null;
    this.pollInterval = null;
  }

  init() {
    if (document.getElementById('verilearn-chat-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'verilearn-chat-modal';
    modal.style.cssText = `
      display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8);
      z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(6px);
      padding: 15px; font-family: var(--font-family-sans, sans-serif);
    `;

    modal.innerHTML = `
      <div style="background: var(--bg-card, #1e293b); color: var(--text-primary, #f8fafc); width: 100%; max-width: 480px; height: 80vh; max-height: 600px; border-radius: 20px; border: 1px solid var(--border-color, #334155); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; overflow: hidden; position: relative;">
        <!-- Header -->
        <div style="padding: 16px 20px; background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid var(--border-color, #334155); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 1.3rem; color: var(--accent-primary, #6366f1);">💬</div>
            <div>
              <div style="font-weight: 700; font-size: 1rem;">דיווח על תקלה / פנייה למנהל</div>
              <div style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">מחובר ישירות ל-Telegram של רזיאל</div>
            </div>
          </div>
          <button id="vl-chat-close" style="background: none; border: none; color: var(--text-muted, #94a3b8); font-size: 1.4rem; cursor: pointer; padding: 4px 8px;">✕</button>
        </div>

        <!-- Message List Container -->
        <div id="vl-chat-messages" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: rgba(15, 23, 42, 0.2);">
          <div style="text-align: center; color: var(--text-muted, #94a3b8); font-size: 0.85rem; margin-top: 20px;">טוען היסטוריית הודעות...</div>
        </div>

        <!-- Input Bar -->
        <div style="padding: 12px 16px; background: rgba(15, 23, 42, 0.6); border-top: 1px solid var(--border-color, #334155); display: flex; gap: 10px;">
          <input type="text" id="vl-chat-input" placeholder="תאר את התקלה או השאלה שלך..." style="flex: 1; background: var(--bg-input, #0f172a); border: 1px solid var(--border-color, #334155); color: white; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; outline: none;">
          <button id="vl-chat-send" style="background: var(--accent-primary, #6366f1); color: white; border: none; padding: 0 18px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">שלח 🚀</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    document.getElementById('vl-chat-close')?.addEventListener('click', () => this.close());
    document.getElementById('vl-chat-send')?.addEventListener('click', () => this.send());
    document.getElementById('vl-chat-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.send();
    });
  }

  open() {
    this.init();
    if (!this.modalEl) return;
    this.modalEl.style.display = 'flex';
    this.loadHistory();
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => this.loadHistory(), 3000);
  }

  close() {
    if (this.modalEl) this.modalEl.style.display = 'none';
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  async loadHistory() {
    const tz = typeof localStorage !== 'undefined' ? localStorage.getItem('student_tz') : null;
    const msgContainer = document.getElementById('vl-chat-messages');
    if (!msgContainer) return;

    if (!tz) {
      msgContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--text-muted, #94a3b8); font-size: 0.9rem;">
          <p style="margin-bottom: 10px;">כדי לדווח על תקלה ולהתכתב עם המנהל, אנא התחבר דרך פורטל הלימודים שלי.</p>
          <a href="../index.html" style="color: var(--accent-primary, #6366f1); font-weight: 600;">← מעבר להתחברות בפורטל</a>
        </div>
      `;
      return;
    }

    try {
      const res = await fetch(`/api/chat/${tz}`);
      if (!res.ok) return;
      const msgs = await res.json();
      
      msgContainer.innerHTML = '';
      if (!msgs || msgs.length === 0) {
        msgContainer.innerHTML = `
          <div style="text-align: center; color: var(--text-muted, #94a3b8); margin-top: 20px; font-size: 0.85rem;">
            אין הודעות קודמות. כתוב הודעה או תאר תקלה ונציג יענה לך בטלגרם.
          </div>
        `;
        return;
      }

      msgs.forEach(m => {
        const isStudent = m.sender === 'student';
        const div = document.createElement('div');
        div.style.cssText = `
          padding: 10px 14px; border-radius: 14px; max-width: 82%; font-size: 0.9rem; line-height: 1.4;
          word-break: break-word; ${isStudent ? 
            'align-self: flex-start; background: var(--accent-primary, #6366f1); color: white; border-bottom-right-radius: 2px;' : 
            'align-self: flex-end; background: #334155; color: #f8fafc; border-bottom-left-radius: 2px;'}
        `;
        div.textContent = m.message;
        msgContainer.appendChild(div);
      });
      msgContainer.scrollTop = msgContainer.scrollHeight;
    } catch (e) {
      console.warn('Chat load error:', e);
    }
  }

  async send() {
    const tz = typeof localStorage !== 'undefined' ? localStorage.getItem('student_tz') : null;
    const input = document.getElementById('vl-chat-input');
    const sendBtn = document.getElementById('vl-chat-send');
    if (!input || !tz) return;

    const text = input.value.trim();
    if (!text) return;

    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    try {
      const res = await fetch(`/api/chat/${tz}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `[VeriLearn] ${text}`, sender: 'student' })
      });

      if (res.ok) {
        input.value = '';
        await this.loadHistory();
      } else {
        alert('שגיאה בשליחת ההודעה.');
      }
    } catch (e) {
      alert('שגיאת תקשורת.');
    }

    input.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    input.focus();
  }
}

window.VeriLearnChat = new VeriLearnChat();
