export function createSessionHelpers({
  getSession,
  touchSession,
  isProduction,
}) {
  const parseCookies = (req) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return {};

    return cookieHeader.split(";").reduce((acc, cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      if (!name) return acc;

      acc[name] = decodeURIComponent(rest.join("="));

      return acc;
    }, {});
  };

  const isHttpsRequest = (req) => {
    if (!req) return false;
    if (req.secure) return true;

    const proto = String(req.headers?.["x-forwarded-proto"] || "")
      .split(",")[0]
      .trim()
      .toLowerCase();

    return proto === "https";
  };

  const shouldUseSecureCookie = (req) => {
    // Only mark cookies Secure on actual HTTPS requests.
    // This keeps local HTTP development working even if APP_ENV is production.
    return isProduction && isHttpsRequest(req);
  };

  const setSessionCookie = (req, res, token) => {
    const configuredSameSite = String(process.env.COOKIE_SAME_SITE || "Lax").trim();
    const isSameSiteNone = configuredSameSite.toLowerCase() === "none";
    const sameSiteValue = isSameSiteNone ? "None" : configuredSameSite;

    const parts = [
      `sid=${encodeURIComponent(token)}`,
      "Path=/",
      "HttpOnly",
      `SameSite=${sameSiteValue}`,
      "Max-Age=1209600",
    ];

    if (isSameSiteNone || shouldUseSecureCookie(req)) {
      parts.push("Secure");
    }

    res.setHeader("Set-Cookie", parts.join("; "));
  };

  const clearSessionCookie = (req, res) => {
    const configuredSameSite = String(process.env.COOKIE_SAME_SITE || "Lax").trim();
    const isSameSiteNone = configuredSameSite.toLowerCase() === "none";
    const sameSiteValue = isSameSiteNone ? "None" : configuredSameSite;

    const parts = [`sid=`, "Path=/", "HttpOnly", `SameSite=${sameSiteValue}`, "Max-Age=0"];

    if (isSameSiteNone || shouldUseSecureCookie(req)) {
      parts.push("Secure");
    }

    res.setHeader("Set-Cookie", parts.join("; "));
  };

  const getSessionFromRequest = (req) => {
    const cookies = parseCookies(req);
    if (!cookies.sid) return null;

    const rawSession = getSession(cookies.sid);
    if (rawSession && typeof rawSession.then === "function") {
      return rawSession.then((session) => {
        if (session) {
          touchSession(cookies.sid);
        }
        return session;
      });
    }

    if (rawSession) {
      touchSession(cookies.sid);
    }

    return rawSession;
  };

  const requireSession = (req, res) => {
    const rawSession = getSessionFromRequest(req);
    if (rawSession && typeof rawSession.then === "function") {
      return rawSession.then((session) => {
        if (!session) {
          res.status(401).json({ error: "Not authenticated." });
          return null;
        }
        return session;
      });
    }

    if (!rawSession) {
      res.status(401).json({ error: "Not authenticated." });
      return null;
    }

    return rawSession;
  };

  const requireSessionUsernameMatch = (res, session, suppliedUsername) => {
    const supplied = String(suppliedUsername || "")
      .trim()
      .toLowerCase();

    if (supplied && supplied !== String(session.username || "").toLowerCase()) {
      res
        .status(403)
        .json({ error: "Username does not match authenticated user." });
      return false;
    }

    return true;
  };

  return {
    parseCookies,
    isHttpsRequest,
    shouldUseSecureCookie,
    setSessionCookie,
    clearSessionCookie,
    getSessionFromRequest,
    requireSession,
    requireSessionUsernameMatch,
  };
}
