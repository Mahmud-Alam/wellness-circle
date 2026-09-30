import { validationResult } from "express-validator";
import env from "../config/env.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

export const notFound = (req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: `Not found: ${req.method} ${req.originalUrl}`,
    });
};

export const errorHandler = (err, req, res, next) => {
  console.error("[error]", err.message);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({
    success: false,
    message,
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};
