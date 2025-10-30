import { verifyToken } from "./auth";



/**
 * parseCookies(req) -> { cookieName: value, ... }
 */
export function parseCookies(req) {
  const header = req.headers.get("cookie") || "";
  return header.split(";").map(s => s.trim()).filter(Boolean)
    .map(p => p.split("="))
    .reduce((acc, [k, v]) => {
      acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
      return acc;
    }, {});
}

/**
 * serializeCookie(name, value, options)
 * minimal serializer for Set-Cookie header
 */
export function serializeCookie(name, value, opts = {}) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
  if (opts.maxAge) parts.push(`Max-Age=${opts.maxAge}`);
  if (opts.path) parts.push(`Path=${opts.path}`);
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}


/**
 * getUserFromReq(req) -> decoded user or null (if no/invalid token)
 */
export function getUserFromReq(req) {
  const auth = req.headers.get("Authorization");
  if (!auth) return null;
  const token = auth.split(" ")[1];
  if (!token) return null;
  return verifyToken(token);
}