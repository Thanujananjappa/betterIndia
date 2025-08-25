import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
  uploadNgoLicense,
  uploadNgoBulk,
} from "../controllers/authController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Register (citizen, community, police, NGO)
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

// Get profile
router.get("/me", protect, getMe);

// NGO upload license
router.post("/ngo/upload-license", protect, upload.single("license"), uploadNgoLicense);

// NGO bulk resident upload (ZIP)
router.post("/ngo/bulk-upload", protect, upload.single("bulkZip"), uploadNgoBulk);

export default router;
