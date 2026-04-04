import jwt from "jsonwebtoken";

/**
 * Middleware that validates a signed JWT sent by the admin frontend.
 * The token is issued by POST /api/auth/admin/login and stored in
 * the browser's sessionStorage — never embedded in the JS bundle.
 *
 * Expected header:  Authorization: Bearer <token>
 */
export default function requireAdminJWT(req, res, next) {
  const auth = req.header("Authorization") || "";

  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const token = auth.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res
      .status(500)
      .json({ success: false, error: "JWT_SECRET is not configured on the server" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.admin = decoded; // { username, name, role, iat, exp }
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}
