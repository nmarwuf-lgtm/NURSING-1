// ═══════════════════════════════════════════════════════════════
// TELEGRAM ANALYTICS — GitHub Pages Compatible
// ═══════════════════════════════════════════════════════════════
//
// 🔧 خطوات الإعداد:
// 1. افتح Telegram وتحدث مع @BotFather
// 2. أرسل: /newbot  ← اختار اسم ← خذ الـ TOKEN
// 3. تحدث مع @userinfobot ← خذ الـ id رقمك
// 4. ضع القيم أدناه واحفظ الملف
// ═══════════════════════════════════════════════════════════════

const TelegramAnalytics = {

  // ▼▼▼ ضع بياناتك هنا ▼▼▼
  BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
  CHAT_ID:   'YOUR_CHAT_ID_HERE',
  // ▲▲▲ ▲▲▲ ▲▲▲ ▲▲▲ ▲▲▲

  _ok() {
    return this.BOT_TOKEN !== '6238470351:AAEnXpTDD3fGPaj4X7lW_79GxC06FM1Xv8s' &&
           this.CHAT_ID   !== '1350971290'   &&
           this.BOT_TOKEN.length > 10;
  },

  async init() {
    if (!this._ok()) {
      console.log('[Analytics] Bot not configured — skipping');
      return;
    }
    // Only on first visit
    if (!localStorage.getItem('tg_sent')) {
      localStorage.setItem('tg_sent', '1');
      await this._sendVisit();
    }
  },

  _info() {
    const ua = navigator.userAgent;
    return {
      device: /iPhone|iPad/i.test(ua) ? '📱 iOS'
            : /Android/i.test(ua)     ? '📱 Android'
            : '💻 Desktop',
      browser: /Chrome/i.test(ua)  ? 'Chrome'
             : /Firefox/i.test(ua) ? 'Firefox'
             : /Safari/i.test(ua)  ? 'Safari'
             : /Edge/i.test(ua)    ? 'Edge' : '?',
      screen: `${screen.width}×${screen.height}`,
      lang:   navigator.language || '?',
      tz:     Intl.DateTimeFormat().resolvedOptions().timeZone || '?',
      date:   new Date().toLocaleDateString('ar'),
      time:   new Date().toLocaleTimeString('ar', { hour:'2-digit', minute:'2-digit' }),
      sid:    Session?.get()?.id || '?'
    };
  },

  async _sendVisit() {
    const i = this._info();
    const text =
`🏥 *تمريض عملي 1 — زيارة جديدة*

📅 ${i.date}  ⏰ ${i.time}
${i.device}  🌐 ${i.browser}
🖥️ ${i.screen}  🗣️ ${i.lang}
🌍 ${i.tz}

🆔 \`${i.sid}\``;
    await this._send(text);
  },

  async sendPWAInstall() {
    if (!this._ok()) return;
    const i = this._info();
    const text =
`📲 *تمريض عملي 1 — تثبيت PWA* ✅

${i.device}  🌐 ${i.browser}
📅 ${i.date}  ⏰ ${i.time}
🌍 ${i.tz}`;
    await this._send(text);
  },

  async _send(text) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            chat_id:    this.CHAT_ID,
            text,
            parse_mode: 'Markdown'
          })
        }
      );
      const json = await res.json();
      if (!json.ok) console.warn('[Analytics] Telegram error:', json.description);
    } catch(e) {
      console.warn('[Analytics] Network error:', e.message);
    }
  }
};
