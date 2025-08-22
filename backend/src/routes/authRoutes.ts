import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
  uploadNgoLicense,
} from "../controllers/authController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

/* -------- Auth Routes -------- */

/**
 * Register
 * Accept both optional file fields up-front. Do NOT branch on req.body.role
 * because req.body isn't populated for multipart until Multer runs.
 */
router.post(
  "/register",
  upload.fields([
    { name: "idCard", maxCount: 1 },   // Police ID card
    { name: "license", maxCount: 1 },  // NGO license
  ]),
  registerUser
);

// Login
router.post("/login", loginUser);

// Get logged-in user profile
router.get("/me", protect, getMe);

// NGO uploads license later (optional, before admin approval)
router.post(
  "/ngo/upload-license",
  protect,
  upload.single("license"),
  uploadNgoLicense
);

export default router;
