[English](/README.md) | [فارسی](/README.fa_IR.md)

<div align="center">

# <img src="./client/public/wihm-logo.svg" alt="WIHM" width="48" height="48"> WIHM

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)
[![Deploy on Cloudflare](https://img.shields.io/badge/Deploy%20on-Cloudflare-F38020?logo=cloudflare&logoColor=white)](/CLOUDFLARE_TUTORIAL.fa.md)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/DarkPoesidon/WIHM)

**پیام‌رسان امن، مدرن، سبک و مستقل با قابلیت استقرار کاملاً رایگان روی Cloudflare**

</div>

---

## ⚡ آموزش سریع و گام‌به‌گام راه‌اندازی رایگان روی Cloudflare

> 🚀 **[برای مشاهده آموزش تصویری و قدم‌به‌قدم نصب روی کلادفلر (کاملاً رایگان) اینجا کلیک کنید](/CLOUDFLARE_TUTORIAL.fa.md)**  
> این آموزش به صورتی نگارش شده است که در کمتر از ۱۰ دقیقه بدون هیچ دانش فنی بتوانید پیام‌رسان را راه‌اندازی کنید.

---

## قابلیت‌های کلیدی

- 💬 **انواع گفتگو**: گفتگوی دونفره (PV)، گروه‌ها و کانال‌ها
- 📁 **پشتیبانی کامل از فایل و عکس**: آپلود مستقیم به فضای ابری Cloudflare R2 با Presigned URL بدون بار روی سرور
- 📞 **تماس صوتی و تصویری**: بر پایه پروتکل WebRTC نظیر‌به‌نظیر (P2P) با پشتیبانی اختیاری از Cloudflare Calls (TURN)
- 🔔 **Push Notification**: اعلان وب از طریق استانداردهای VAPID
- 🛡️ **پنل مدیریت اختصاصی**: مدیریت کاربران، تغییر نقش‌ها، محدودیت‌ها و لاگ‌ها
- 🔒 **امنیت بالا**: رمزنگاری سرتاسری نشست‌ها، هش امن رمزعبور با bcrypt، کنترل نرخ درخواست (Rate Limit)
- 📱 **نرم‌افزار وب پیش‌رونده (PWA)**: قابلیت نصب مستقیم به شکل اپلیکیشن روی اندروید، iOS، ویندوز و مک
- 🌍 **پشتیبانی دوزبانه بومی**: رابط کاربری کامل با پشتیبانی از فارسی (راست‌چین RTL) و انگلیسی

---

## راه‌اندازی و توسعه محلی (Local Development)

```bash
# نصب پیش‌نیازها
npm install
npm --prefix client install
npm --prefix server install

# اجرای همزمان فرانت‌اند و بک‌اند
npm run dev
```

---

## مجوز (License)

این پروژه تحت مجوز [MIT](/LICENSE) منتشر شده است.
