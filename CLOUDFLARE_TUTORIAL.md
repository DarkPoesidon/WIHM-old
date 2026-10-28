# Step-by-Step Guide: Deploying WIHM on Cloudflare (100% Free)

> 💡 **This tutorial is designed so that anyone, even with zero technical knowledge, can deploy their own real-time messenger platform completely free of charge ($0 forever).**

---

## 🧭 Architecture at a Glance

Deploying WIHM is like assembling ready-made building blocks:
1. **Cloudflare R2**: Free object storage for files, voice notes, and photos (10 GB free, $0 egress fees).
2. **Neon PostgreSQL**: Free serverless SQL database for messages and user accounts.
3. **Render**: Free backend Web Service running the Node.js API and WebSocket gateway.
4. **Cloudflare Pages**: Free global hosting for the React web app UI with unlimited bandwidth and free SSL.

---

## 🛠️ Step 1: Create Object Storage (Cloudflare R2)

1. Sign in to your [Cloudflare Dashboard](https://dash.cloudflare.com).
2. In the left navigation, click on **R2** (or **Storage > R2**).
3. Click the blue **Create bucket** button.
4. Name your bucket (e.g., `wihm-uploads`) and click **Create bucket**.
5. Click **Manage R2 API Tokens** (top right) and then **Create API Token**.
6. Under Permissions, select **Object Read & Write**.
7. Scroll down and click **Create API Token**.
8. **Important:** Copy and save these three values to a text file:
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (found in your browser URL or on the main R2 page)

---

## 🗄️ Step 2: Create Free Database (Neon PostgreSQL)

1. Go to **[neon.tech](https://neon.tech)** and sign in with GitHub.
2. Click **Create Project**, name it `wihm-db`, and click **Create project**.
3. Copy the **Connection String** (starts with `postgres://...`). Save this in your text file.

---

## 🖥️ Step 3: Deploy Backend Server (Render)

1. Go to **[render.com](https://render.com)** and sign in with GitHub.
2. Click **+ New** > **Web Service**.
3. Connect your repository: **DarkPoesidon/WIHM**.
4. Configure the service:
   - **Name:** `wihm-api`
   - **Runtime:** `Node`
   - **Build Command:** `npm --prefix server install`
   - **Start Command:** `npm --prefix server run start`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   - `APP_ENV`: `production`
   - `DB_CLIENT`: `postgres`
   - `POSTGRES_URL`: *(your Neon database connection string)*
   - `POSTGRES_SSL`: `true`
   - `FILE_UPLOAD`: `true`
   - `FILE_UPLOAD_TRANSCODE_VIDEOS`: `false`
   - `STORAGE_DRIVER`: `remote`
   - `STORAGE_ENDPOINT`: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
   - `STORAGE_BUCKET`: `wihm-uploads`
   - `STORAGE_ACCESS_KEY_ID`: *(your R2 Access Key ID)*
   - `STORAGE_SECRET_ACCESS_KEY`: *(your R2 Secret Access Key)*
   - `STORAGE_AUTO_CORS`: `true`
   - `COOKIE_SAME_SITE`: `None`
   - `APP_PUBLIC_URL`: `*`
   - `CALL`: `true`
   - `CALL_VIDEO`: `true`
6. Click **Deploy Web Service** and wait ~2 minutes until status is **Live**.
7. Copy your backend URL (e.g., `https://wihm-api.onrender.com`).

---

## 🌐 Step 4: Deploy Frontend (Cloudflare Pages)

1. Return to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** > **Create application** > **Pages** tab.
3. Click **Connect to Git**, authorize GitHub, and select **DarkPoesidon/WIHM**.
4. Set Build Settings:
   - **Framework preset:** `Vite`
   - **Root directory:** `client`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. In **Environment variables**, add:
   - **Variable name:** `VITE_API_BASE`
   - **Value:** *(your backend URL from Step 3, e.g. `https://wihm-api.onrender.com`)*
6. Click **Save and Deploy**.

Your WIHM messenger is now live on `https://wihm.pages.dev`!

---

## 📱 First Login and Admin Claim
1. Open your Cloudflare Pages URL.
2. Click **Sign Up** and create an account. The very first user to register automatically becomes the **Owner / Admin**.
3. Enjoy your self-hosted, 100% free, real-time messaging platform!
