import multer from "multer";
import path from "path";
import fs from "fs";

const baseDir = path.join(__dirname, "../../uploads");

// Ensure subdirectories exist
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let targetDir = baseDir;

    if (file.fieldname === "idCard") {
      targetDir = path.join(baseDir, "idcards");
    } else if (file.fieldname === "license") {
      targetDir = path.join(baseDir, "licenses");
    } else {
      // ❌ FIX: must send both params (error + fallback path)
      return cb(new Error("Invalid field name. Use 'idCard' or 'license'."), baseDir);
    }

    ensureDir(targetDir);
    cb(null, targetDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, JPG, and PNG allowed."));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
