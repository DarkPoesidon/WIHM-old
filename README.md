[English](/README.md) | [فارسی](/README.fa_IR.md)

<div align="center">

# <img src="./client/public/wihm-logo.svg" alt="WIHM" width="48" height="48"> WIHM

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)
[![Deploy on Cloudflare](https://img.shields.io/badge/Deploy%20on-Cloudflare-F38020?logo=cloudflare&logoColor=white)](/CLOUDFLARE_TUTORIAL.md)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/DarkPoesidon/WIHM)

**Secure, modern, and lightweight real-time communication platform with 100% free Cloudflare deployment**

</div>

---

## ⚡ Step-by-Step Cloudflare Deployment Tutorial

> 🚀 **[Click here to read the Step-by-Step Cloudflare Deployment Guide (100% Free Forever)](/CLOUDFLARE_TUTORIAL.md)**  
> Anyone can follow this guide and launch their self-hosted messenger in less than 10 minutes with zero coding required.

---

## Key Features

- 💬 **Rich Messaging**: Direct Messages (DMs), Groups, and Channels
- 📁 **Cloudflare R2 Media**: Direct browser-to-bucket uploads with Presigned URLs and zero egress bandwidth fees
- 📞 **Voice & Video Calls**: Native peer-to-peer WebRTC calling with Cloudflare Calls (TURN) support
- 🔔 **Push Notifications**: Standard Web Push via VAPID keys
- 🛡️ **Full Admin Dashboard**: Comprehensive controls for user roles, channel moderation, and maintenance
- 🔒 **Hardened Security**: Session encryption, bcrypt password hashing, and adaptive rate limiting
- 📱 **Installable PWA**: Install directly to home screen on iOS, Android, macOS, and Windows
- 🌍 **Native Multilingual UI**: Built-in support for English and Persian (RTL)

---

## Local Development

```bash
# Install dependencies
npm install
npm --prefix client install
npm --prefix server install

# Run frontend and backend concurrently
npm run dev
```

---

## License

This project is licensed under the [MIT License](/LICENSE).
