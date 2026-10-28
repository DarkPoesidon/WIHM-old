# راهنمای جامع استقرار WIHM با امکانات رایگان Cloudflare

این راهنما نحوه راه‌اندازی و اجرای پیام‌رسان WIHM را به کمک سرویس‌های ابری رایگان Cloudflare (شامل **Pages**، **R2**، **Calls** و **CDN**) و یک بک‌اند رایگان به شکل گام‌به‌گام توضیح می‌دهد.

---

## 🎯 وضعیت قابلیت‌ها در این شیوه استقرار

| قابلیت | پشتیبانی در پلن رایگان | نحوه کارکرد |
|---|---|---|
| **چت متنی، کانال و گروه‌ها** | ✅ ۱۰۰٪ رایگان | ذخیره در دیتابیس رایگان (PostgreSQL یا SQLite) و انتقال از طریق WebSocket/SSE |
| **ارسال عکس و فایل** | ✅ ۱۰۰٪ رایگان | ذخیره‌سازی روی **Cloudflare R2** (تا ۱۰ گیگابایت رایگان، هزینه دانلود صفر) با آپلود مستقیم از مرورگر (Presigned URL) |
| **تماس صوتی و تصویری** | ✅ ۱۰۰٪ رایگان | اتصال مستقیم Peer-to-Peer کاربران با پروتکل WebRTC + رله اختیاری با **Cloudflare Calls (TURN)** |
| **میزبانی رابط کاربری (فرانت‌اند)** | ✅ ۱۰۰٪ رایگان | مستقر روی **Cloudflare Pages** (ترافیک و پهنای باند نامحدود و گواهی SSL رایگان) |

---

## 🚀 گام ۱: ساخت فضای ذخیره‌سازی ابری فایل و عکس (Cloudflare R2)

1. وارد داشبورد کلادفلر شوید و از منوی چپ به بخش **R2** بروید.
2. روی **Create Bucket** کلیک کرده و نام باکت را مثلاً `WIHM-uploads` بگذارید.
3. در تب **Settings** باکت:
   - در بخش **CORS Policy** مطمئن شوید که متدهای `GET`, `PUT`, `POST`, `HEAD` مجاز باشند (یا متغیر `STORAGE_AUTO_CORS=true` را در سرور قرار دهید تا خودکار تنظیم شود).
4. از صفحه اصلی R2، روی گزینه **Manage R2 API Tokens** کلیک کنید و یک توکن جدید با دسترسی خواندن و نوشتن (Object Read & Write) ایجاد کنید:
   - مقدار **Access Key ID** و **Secret Access Key** را ذخیره کنید.
   - شناسه اکانت (**Account ID**) خود را نیز کپی کنید.

---

## 📞 گام ۲: فعال‌سازی تماس صوتی و تصویری (اختیاری اما پیشنهادی)

1. تماس‌های صوتی و تصویری به صورت پیش‌فرض از سرور STUN رایگان گوگل استفاده کرده و به شکل نظیربه‌نظیر (P2P) بدون بارگذاری روی سرور شما کار می‌کنند.
2. برای تضمین اتصال کاربرانی که پشت فیلترینگ یا فایروال‌های سختگیرانه هستند، می‌توانید از **Cloudflare Calls (TURN)** استفاده کنید:
   - در داشبورد کلادفلر به بخش **Calls** بروید.
   - یک کلید TURN ایجاد کنید و مقادیر `TURN_TOKEN_ID` و `TURN_API_TOKEN` را کپی نمایید.

---

## 💻 گام ۳: استقرار کلاینت (فرانت‌اند) روی Cloudflare Pages

1. وارد بخش **Workers & Pages** در داشبورد کلادفلر شوید.
2. روی **Create Application** و سپس تب **Pages** کلیک کنید.
3. گیت‌هاب خود را متصل کرده و مخزن WIHM را انتخاب کنید:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
4. در بخش **Environment Variables (متغیرهای محیطی بیلد)**:
   - `VITE_API_BASE`: آدرس بک‌اند شما (مثلاً `https://api.yourdomain.com` یا آدرس سرور روی Render/Koyeb).
   - `VITE_WS_URL`: آدرس وب‌سوکت بک‌اند شما (مثلاً `wss://api.yourdomain.com/ws`).
5. روی **Save and Deploy** کلیک کنید. فایل `_redirects` موجود در پوشه `client/public` به صورت خودکار روت‌های برنامه را برای SPA بدون خطای 404 مدیریت می‌کند.

---

## ⚙️ گام ۴: استقرار بک‌اند (Server)

از آنجا که فرانت‌اند و تمام فایل‌ها و تماس‌ها از دوش سرور برداشته شده، بک‌اند فقط پیام‌های سبک JSON و وب‌سوکت را هدایت می‌کند و مصرف رم آن زیر ۱۰۰ مگابایت است. می‌توانید آن را روی هر بستر رایگانی اجرا کنید (مانند **Render Free Web Service**، **Koyeb**، یا یک سرور شخصی/VPS).

متغیرهای محیطی سرور را طبق الگوی زیر (از روی فایل `cloudflare/.env.cloudflare.example`) تنظیم کنید:

```env
APP_ENV=production
BIND_ADDRESS=0.0.0.0
SERVER_PORT=5174

# آدرس فرانت‌اند شما در Cloudflare Pages برای فعال‌سازی CORS
APP_PUBLIC_URL=https://your-WIHM.pages.dev
CORS_ORIGIN=https://your-WIHM.pages.dev
COOKIE_SAME_SITE=None

# دیتابیس (مثلاً PostgreSQL رایگان روی Neon یا Supabase)
DB_CLIENT=postgres
POSTGRES_URL=postgres://user:password@host:5432/WIHM
POSTGRES_SSL=true

# ذخیره‌سازی فایل و عکس در Cloudflare R2
FILE_UPLOAD=true
FILE_UPLOAD_TRANSCODE_VIDEOS=false
STORAGE_DRIVER=remote
STORAGE_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
STORAGE_BUCKET=WIHM-uploads
STORAGE_ACCESS_KEY_ID=<YOUR_R2_KEY>
STORAGE_SECRET_ACCESS_KEY=<YOUR_R2_SECRET>
STORAGE_REGION=auto
STORAGE_FORCE_PATH_STYLE=true
STORAGE_AUTO_CORS=true

# تماس صوتی و تصویری
CALL=true
CALL_VIDEO=true
TURN_TOKEN_ID=<CLOUDFLARE_TURN_TOKEN_ID>
TURN_API_TOKEN=<CLOUDFLARE_TURN_API_TOKEN>
```
