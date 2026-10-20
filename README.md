<div dir="rtl">

# ⚡ Unhook Social

**أعِد السيطرة على وقتك — أخفِ عناصر الإدمان من فيسبوك وانستغرام.**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)](https://developer.chrome.com/docs/extensions/reference/manifest)
[![Version](https://img.shields.io/badge/version-1.2.0-orange)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<br>

<a href="https://github.com/zakidri27/unhook-social/releases/latest/download/unhook-social-v1.2.0.zip">
  <img src="https://img.shields.io/badge/📥_تحميل_الإضافة_مجانًا-0078D4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="تحميل الإضافة">
</a>

<br>

> **👇 حمّل الإضافة من الزر أعلاه، ثم اتبع خطوات التثبيت السهلة في الأسفل**

</div>

---

<div dir="rtl">

## 🎯 ما هي Unhook Social؟

إضافة متصفح خفيفة وسريعة تُخفي العناصر المُصمَّمة لإبقائك أطول وقت ممكن على فيسبوك وانستغرام: الخلاصة، القصص، الريلز، الإعلانات، والتعليقات — **بدون حسابات، بدون تتبّع، بدون خوادم**.

كل شيء يعمل محليًا في متصفحك بالكامل.

</div>

---

## ✨ الميزات

<div dir="rtl">

### فيسبوك
| الميزة | الوصف |
|---|---|
| 📰 إخفاء الخلاصة | إخفاء المنشورات من الصفحة الرئيسية |
| 📖 إخفاء القصص | إخفاء شريط القصص بالكامل |
| 📌 العمود الجانبي | إخفاء القائمة الجانبية والاقتراحات |
| 🎬 حظر Reels / Watch | منع الوصول لصفحات الريلز والفيديو |
| 🔒 الريل المُرسل فقط | فتح الريل ثم قفل التنقل — لا تمرير تلقائي |
| 🚫 حظر الإعلانات | كشف وإخفاء المنشورات المُعلَّمة كـ"ممول" |
| 💬 إخفاء التعليقات | إخفاء قسم التعليقات وأزرارها |
| 🛒 Marketplace والألعاب | إخفاء اختصارات السوق والألعاب |

### انستغرام
| الميزة | الوصف |
|---|---|
| 📰 إخفاء الخلاصة | إخفاء المنشورات من الصفحة الرئيسية |
| 📖 إخفاء القصص | إخفاء شريط القصص |
| 🎬 حظر Reels | منع الوصول لصفحة الريلز |
| 🔒 الريل المُرسل فقط | قفل التنقل بعد فتح الريل |
| 🚫 حظر الإعلانات | كشف وإخفاء الإعلانات بالكلمات المفتاحية |
| 💬 إخفاء التعليقات | إخفاء التعليقات وصندوق الكتابة |
| 🧭 حظر Explore | منع الوصول لصفحة الاستكشاف |

</div>

---

## 🚀 التثبيت — خطوة بخطوة

<div dir="rtl">

### 📥 الطريقة السهلة (لجميع المستخدمين)

**1. حمّل ملف الإضافة:**

<a href="https://github.com/zakidri27/unhook-social/releases/latest/download/unhook-social-v1.2.0.zip">
  <img src="https://img.shields.io/badge/📥_اضغط_لتحميل_الملف-0078D4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="تحميل">
</a>

**2. فك ضغط الملف** — ستجد مجلدًا اسمه `unhook-social`

**3. افتح متصفح كروم** واكتب في شريط العنوان:
```
chrome://extensions
```

**4. فعّل زر Developer mode** (وضع المطوّر) — الزر الموجود في **الزاوية العلوية اليمنى**

**5. اضغط زر "Load unpacked"** (تحميل مُفكّك) واختر مجلد `unhook-social` الذي فككته

**6. جاهز! 🎉** — ستظهر الإضافة في شريط الإضافات

---

### 💻 للمطورين (من الكود المصدري)

```
git clone https://github.com/zakidri27/unhook-social.git
```

ثم اتبع الخطوات 3-6 أعلاه.

</div>

---

## 🎨 لقطات الشاشة

<div dir="rtl">

| واجهة التحكم | قبل | بعد |
|---|---|---|
| واجهة عربية RTL مع مفاتيح لكل ميزة | خلاصة مزدحمة | صفحة نظيفة وواضحة |

</div>

---

## 🛠️ التقنيات

<div dir="rtl">

- **Manifest V3** — أحدث معايير إضافات كروم
- **Content Scripts** — تعمل مباشرة على صفحات فيسبوك وانستغرام
- **CSS Injections** — إخفاء فوري بدون وميض (Flash of Content)
- **chrome.storage.sync** — مزامنة الإعدادات بين أجهزتك
- **MutationObserver** — تتبع تغييرات DOM في تطبيقات SPA
- **دعم لغات متعددة** — كشف الإعلانات بالعربية والإنجليزية والفرنسية والإسبانية والألمانية

</div>

---

## 📁 بنية المشروع

```
unhook-social/
├── manifest.json      # تعريف الإضافة
├── content.js         # السكربت الرئيسي (كشف العناصر)
├── content.css        # أنماط الإخفاء
├── popup.html         # واجهة التحكم
├── popup.js           # منطق الواجهة
├── popup.css          # تصميم الواجهة
└── icons/             # أيقونات الإضافة
```

---

## 🤝 المساهمة

<div dir="rtl">

مرحبًا بأي مساهمة! يمكنك:

- الإبلاغ عن مشكلة عبر [Issues](https://github.com/zakidri27/unhook-social/issues)
- فتح Pull Request
- اقتراح ميزات جديدة

</div>

---

## 📄 الرخصة

<div dir="rtl">

هذه الإضافة مرخصة تحت رخصة [MIT](LICENSE).

</div>

---

<div dir="rtl">

## ⭐ ادعم المشروع

إذا وجدت هذه الإضافة مفيدة، ضع ⭐ على المستودع!

**صُنع بـ ❤️ لمستخدمي الإنترنت العرب**

</div>
