import { verifyToken } from "../utils.js";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (!token || scheme !== "Bearer") {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required." });
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required." });
  }
  next();
};

export const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (!token || scheme !== "Bearer") return next();

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
  } catch (err) {
    // ignore
  }
  next();
};
