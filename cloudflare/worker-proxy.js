/**
 * Cloudflare Worker Reverse Proxy for WIHM
 *
 * This Worker sits in front of your WIHM deployment:
 * 1. Routes WebSocket connections (`/ws`) directly to your backend server.
 * 2. Routes API requests (`/api/*`) directly to your backend server.
 * 3. Routes all other requests (UI assets) to Cloudflare Pages.
 *
 * This eliminates the need for Cross-Origin (CORS) setup and gives you a single domain.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const backendOrigin = (env.BACKEND_URL || "https://your-backend.onrender.com").replace(/\/+$/, "");
    const pagesOrigin = (env.PAGES_URL || "https://your-app.pages.dev").replace(/\/+$/, "");

    // 1. WebSocket Proxy (/ws)
    if (url.pathname === "/ws" || request.headers.get("Upgrade") === "websocket") {
      const backendWsUrl = new URL(url.pathname + url.search, backendOrigin);
      return fetch(backendWsUrl.toString(), {
        headers: request.headers,
      });
    }

    // 2. API Proxy (/api/*)
    if (url.pathname.startsWith("/api/")) {
      const backendApiUrl = new URL(url.pathname + url.search, backendOrigin);
      const newHeaders = new Headers(request.headers);
      newHeaders.set("X-Forwarded-Host", url.host);
      newHeaders.set("X-Forwarded-Proto", url.protocol.replace(":", ""));

      return fetch(backendApiUrl.toString(), {
        method: request.method,
        headers: newHeaders,
        body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
        redirect: "manual",
      });
    }

    // 3. Static UI Assets via Cloudflare Pages
    const pagesUrl = new URL(url.pathname + url.search, pagesOrigin);
    return fetch(pagesUrl.toString(), {
      method: request.method,
      headers: request.headers,
    });
  },
};
