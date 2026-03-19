const TelegramAnalytics = {

  BOT_TOKEN: '6238470351:AAEIrglYe2-V5BVK_ME3g3S04iZSuFQ7oKU',
  CHAT_ID:   '1350971290',

  // ✅ تم إصلاحها (كانت توقف السكربت)
  _ok() {
    return !!this.BOT_TOKEN && !!this.CHAT_ID;
  },

  async init() {
    if (!this._ok()) {
      console.log('[Analytics] Bot not configured');
      return;
    }

    // إرسال مرة واحدة فقط
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
             : /Edge/i.test(ua)    ? 'Edge'
             : 'Unknown',

      screen: `${screen.width}×${screen.height}`,
      lang:   navigator.language || '?',
      tz:     Intl.DateTimeFormat().resolvedOptions().timeZone || '?',

      date: new Date().toLocaleDateString('ar'),
      time: new Date().toLocaleTimeString('ar', {
        hour: '2-digit',
        minute: '2-digit'
      }),

      // ✅ تم إصلاح مشكلة Session
      sid: localStorage.getItem('tg_sid') ||
           (function () {
             const id = 'user_' + Math.random().toString(36).slice(2, 10);
             localStorage.setItem('tg_sid', id);
             return id;
           })()
    };
  },

  async _sendVisit() {
    const i = this._info();

    const text = `
🏥 تمريض عملي 1 — زيارة جديدة

📅 ${i.date} ⏰ ${i.time}
${i.device} 🌐 ${i.browser}
🖥️ ${i.screen} 🗣️ ${i.lang}
🌍 ${i.tz}

🆔 ${i.sid}
`;

    await this._send(text);
  },

  async sendPWAInstall() {
    if (!this._ok()) return;

    const i = this._info();

    const text = `
📲 تمريض عملي 1 — تثبيت التطبيق

${i.device} 🌐 ${i.browser}
📅 ${i.date} ⏰ ${i.time}
🌍 ${i.tz}
`;

    await this._send(text);
  },

  // ✅ تم تبسيط الإرسال (بدون Markdown مشاكل)
  async _send(text) {
    try {
      const url = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: this.CHAT_ID,
          text: text
        })
      });

      const json = await res.json();

      if (!json.ok) {
        console.warn('Telegram Error:', json.description);
      } else {
        console.log('✅ Sent to Telegram');
      }

    } catch (e) {
      console.error('❌ Network Error:', e);
    }
  }
};

// ✅ مهم جدًا تشغل السكربت
TelegramAnalytics.init();

// ✅ تتبع تثبيت التطبيق
window.addEventListener('appinstalled', () => {
  TelegramAnalytics.sendPWAInstall();
});
