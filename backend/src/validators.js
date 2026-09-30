import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["admin", "user"])
    .withMessage("Role must be admin or user"),
  body("full_name").notEmpty().withMessage("Full name required").trim(),
  body("username")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Username: letters and numbers only")
    .isLength({ min: 3, max: 30 })
    .trim()
    .toLowerCase(),
  body("location").notEmpty().withMessage("Location required").trim(),
  body("profile_pic_url").optional({ nullable: true }).isURL(),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

export const updateProfileValidator = [
  body("full_name").optional().trim(),
  body("profile_pic_url").optional({ nullable: true }).isURL(),
  body("location").optional().trim(),
];

export const createEventValidator = [
  body("title").notEmpty().trim(),
  body("description").notEmpty().trim(),
  body("event_date")
    .isISO8601()
    .custom((v) => {
      if (new Date(v) <= new Date())
        throw new Error("Date must be in the future");
      return true;
    }),
  body("location_text").notEmpty().trim(),
  body("category").isIn(["Yoga", "Running", "Meditation", "Marathon", "Other"]),
  body("cover_image_url").optional({ nullable: true }).isURL(),
];
