# 🚀 دليل الرفع على GitHub Pages

## الخطوة 1 — إعداد Telegram (اختياري)

### أ. إنشاء Bot:
1. افتح Telegram → ابحث عن **@BotFather**
2. أرسل: `/newbot`
3. اختر اسم للبوت (مثل: `NursingAppBot`)
4. اختر username ينتهي بـ `bot` (مثل: `my_nursing_bot`)
5. **انسخ الـ Token** — يبدو هكذا: `1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ`

### ب. الحصول على Chat ID:
1. افتح Telegram → ابحث عن **@userinfobot**
2. اضغط Start أو أرسل أي رسالة
3. **انسخ الرقم** الذي يظهر في `Id:` — مثل: `123456789`

### ج. إضافة البيانات:
افتح الملف: `js/core/analytics.js`

```javascript
BOT_TOKEN: '1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ',  // الـ Token
CHAT_ID:   '123456789',                                 // Chat ID رقمك
```

---

## الخطوة 2 — رفع على GitHub

```bash
# 1. افتح مجلد المشروع
cd nursing-v3

# 2. أنشئ Git repo
git init
git add .
git commit -m "🏥 Nursing App v4"

# 3. أنشئ repository على github.com ثم:
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## الخطوة 3 — تفعيل GitHub Pages

1. افتح الـ Repository على GitHub
2. اضغط **Settings** (في الأعلى)
3. من القائمة اليسار: **Pages**
4. تحت **Source**: اختر **Deploy from a branch**
5. Branch: **main** | Folder: **/ (root)**
6. اضغط **Save**

✅ انتظر 1-2 دقيقة ثم افتح:
```
https://USERNAME.github.io/REPO_NAME/
```

---

## ✅ تأكد من:
- [ ] الملف `index.html` موجود في الـ root (مش في مجلد)
- [ ] الملف `.nojekyll` موجود
- [ ] رابط الصفحة يفتح بدون error 404
- [ ] بعد الفتح: يظهر السؤال عن الإشعارات (consent)
- [ ] بعد الموافقة: يوصلك رسالة على Telegram

## 🔧 مشاكل شائعة:

**404 Error:**
→ تأكد إن index.html في الـ root مباشرة مش في مجلد فرعي

**التطبيق ما بيفتح:**
→ تأكد إن Pages مفعّل وانتظر 2 دقيقة بعد الـ push

**Telegram ما بيبعث:**
→ تأكد من الـ Token و Chat ID صحيحين
→ ابعث رسالة للبوت أولاً من حسابك (/start)

---
