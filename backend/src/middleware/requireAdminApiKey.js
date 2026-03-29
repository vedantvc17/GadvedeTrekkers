export default function requireAdminApiKey(req, res, next) {
  const provided = req.header("x-admin-api-key");
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    return res.status(500).json({ success: false, error: "ADMIN_API_KEY is not configured" });
  }

  if (!provided || provided !== expected) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  next();
}
