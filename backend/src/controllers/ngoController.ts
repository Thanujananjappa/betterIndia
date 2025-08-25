import { Request, Response } from "express";
import AdmZip from "adm-zip";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";
import Resident from "../models/Resident";

/* =========================
    Bulk Upload Residents ZIP
   ========================= */
export const uploadNgoBulkZip = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "ZIP file is required" });
    }
    if (!ngoId) {
      return res.status(400).json({ success: false, message: "NGO ID is required" });
    }

    // Unzip uploaded file
    const zip = new AdmZip(req.file.path);
    const extractPath = path.join(__dirname, "../uploads", Date.now().toString());
    zip.extractAllTo(extractPath, true);

    const residents: any[] = [];

    // Read all extracted files
    const files = fs.readdirSync(extractPath);
    for (const file of files) {
      if (file.endsWith(".csv")) {
        const filePath = path.join(extractPath, file);
        const rows: any[] = [];

        // Parse CSV
        await new Promise<void>((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => rows.push(row))
            .on("end", resolve)
            .on("error", reject);
        });

        // Map rows -> residents
        rows.forEach((row) => {
          residents.push({
            name: row.name,
            age: Number(row.age),
            gender: row.gender,
            status: row.status || "missing",
            description: row.description,
            lastSeenLocation: row.lastSeenLocation,
            photoFileName: row.photoFileName,
            ngoId: ngoId,
          });
        });
      }
    }

    // Save to DB
    if (residents.length > 0) {
      await Resident.insertMany(residents);
    }

    return res.status(200).json({
      success: true,
      message: "Residents uploaded successfully",
      count: residents.length,
    });
  } catch (err) {
    console.error("Error bulk uploading residents:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
    Fetch NGO Residents
   ========================= */
export const getNgoPeople = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;
    if (!ngoId) {
      return res.status(400).json({ success: false, message: "NGO ID is required" });
    }

    const residents = await Resident.find({ ngoId });
    return res.status(200).json({ success: true, residents });
  } catch (err) {
    console.error("Error fetching NGO people:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
    Upload NGO License (dummy)
   ========================= */
export const uploadNgoLicense = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "License file is required" });
    }

    return res.status(200).json({
      success: true,
      message: "License uploaded successfully",
      file: req.file.filename,
    });
  } catch (err) {
    console.error("Error uploading NGO license:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
