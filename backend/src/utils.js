import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "./config/env.js";

// --- API Response helpers ---
export const success = (res, data = null, message = "OK", status = 200) =>
  res.status(status).json({ success: true, message, data });

export const error = (
  res,
  message = "Something went wrong",
  status = 500,
  details = null,
) =>
  res
    .status(status)
    .json({ success: false, message, ...(details && { details }) });

// --- Password hashing ---
const SALT_ROUNDS = 10;
export const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

// --- JWT ---
export const signToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
export const verifyToken = (token) => jwt.verify(token, env.jwt.secret);
