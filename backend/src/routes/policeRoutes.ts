// src/routes/policeRoutes.ts
import express from "express";
import multer from "multer";
import {
  uploadBulkMissingPersons,
  getAllMissingPersons,
} from "../controllers/policeController";
import { protect, requireVerified } from "../middleware/auth";

const router = express.Router();

// Multer: use memory storage (we handle saving in controller)
// Add limits so huge files don’t crash server
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max (tweak if needed)
});

// ✅ Get all missing persons (verified police only)
router.get(
  "/missing-persons",
  protect,
  requireVerified,
  getAllMissingPersons
);

// ✅ Bulk ZIP upload (CSV/JSON + photos inside ZIP)
// Frontend sends: formData.append("file", zipFile)
router.post(
  "/upload-bulk",
  protect,
  requireVerified,
  upload.single("file"),
  uploadBulkMissingPersons
);

export default router;
