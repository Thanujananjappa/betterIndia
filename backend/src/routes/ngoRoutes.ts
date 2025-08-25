import { Router } from "express";
import multer from "multer";
import { getNgoPeople, uploadNgoLicense, uploadNgoBulkZip } from "../controllers/ngoController";

const router = Router();
const upload = multer({ dest: "uploads/" });

/* =========================
        NGO Routes
   ========================= */

// Fetch NGO Residents
router.get("/:ngoId/people", getNgoPeople);

// Upload NGO License
router.post("/upload-license", upload.single("license"), uploadNgoLicense);

// Bulk Upload Residents ZIP
router.post("/:ngoId/bulk-upload", upload.single("zip"), uploadNgoBulkZip);

export default router;
