// src/controllers/policeController.ts
import { Request, Response } from "express";
import { parse } from "csv-parse/sync";
import fs from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";
import MissingPerson from "../models/MissingPerson";
import { AuthRequest } from "../middleware/auth";
import {
  BlockchainService,
  MockBlockchainService,
} from "../blockchain/blockchainService";

/* -------------------- Blockchain init -------------------- */
const blockchain =
  process.env.NODE_ENV === "production"
    ? new BlockchainService({
        rpcUrl: process.env.RPC_URL!,
        privateKey: process.env.PRIVATE_KEY!,
        contractAddress: process.env.CONTRACT_ADDRESS!,
        chainId: Number(process.env.CHAIN_ID!),
      })
    : new MockBlockchainService();

/* -------------------- Helpers -------------------- */
async function ensureUploadsDir() {
  const dir = path.join(__dirname, "../../uploads");
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function saveToUploads(originalname: string, buffer: Uint8Array | Buffer) {
  const dir = await ensureUploadsDir();
  const filename = path.basename(originalname);
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);
  // if your frontend serves /uploads statically, this URL works:
  return `/uploads/${filename}`;
}

function pick(row: any, names: string[], def = ""): string {
  for (const n of names) {
    const v = row?.[n];
    if (v !== undefined && String(v).trim() !== "") return String(v).trim();
  }
  return def;
}
function pickNum(row: any, names: string[], def?: number): number | undefined {
  const s = pick(row, names, "");
  if (s === "") return def;
  const n = Number(s);
  return Number.isFinite(n) ? n : def;
}
function pickDate(row: any, names: string[], def?: Date): Date | undefined {
  const s = pick(row, names, "");
  if (s === "") return def;
  const d = new Date(s);
  return isNaN(d.getTime()) ? def : d;
}

/* =========================================================
   POST /api/police/upload-bulk  (expects a ZIP)
   ZIP must contain a CSV or JSON + the photo files.
   ========================================================= */
export const uploadBulkMissingPersons = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const mainFile = req.file;
    if (!mainFile) {
      return res.status(400).json({
        success: false,
        message: "ZIP file is required (field name: 'file')",
      });
    }
    if (!mainFile.originalname.toLowerCase().endsWith(".zip")) {
      return res
        .status(400)
        .json({ success: false, message: "Only ZIP files are allowed" });
    }

    const zip = new AdmZip(mainFile.buffer);
    const entries = zip.getEntries();

    let dataFileContent: string | undefined;
    let dataRows: any[] = [];
    const photoMap: Record<string, string> = {};

    // Extract CSV/JSON and photos
    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const lower = entry.entryName.toLowerCase();
      if (lower.endsWith(".csv")) {
        dataFileContent = entry.getData().toString("utf8");
        dataRows = parse(dataFileContent, { columns: true, skip_empty_lines: true });
      } else if (lower.endsWith(".json")) {
        dataFileContent = entry.getData().toString("utf8");
        const parsed = JSON.parse(dataFileContent);
        dataRows = Array.isArray(parsed) ? parsed : [];
      } else if (/\.(jpg|jpeg|png)$/i.test(lower)) {
        const fileBuffer = entry.getData();
        const url = await saveToUploads(path.basename(entry.entryName), fileBuffer);
        photoMap[path.basename(entry.entryName)] = url;
      }
    }

    if (!dataRows.length) {
      return res.status(400).json({
        success: false,
        message: "ZIP must contain a CSV or JSON file with records",
      });
    }

    // We accept either flat or nested headers. Build a per-row record
    const savedRecords: any[] = [];
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];

      // required basics
      const name = pick(row, ["name"]);
      const ageNum = pickNum(row, ["age"]);
      const gender = pick(row, ["gender"]);
      const lastSeen = pickDate(row, ["lastSeen"]);
      const lastSeenLocation = pick(row, ["lastSeenLocation", "location"]);
      const photoFilename = pick(row, ["photoFilename", "photo"]);

      if (!name || ageNum === undefined || !gender || !lastSeen || !lastSeenLocation || !photoFilename) {
        return res.status(400).json({
          success: false,
          message: `Row ${i + 1}: missing one of required fields: name, age, gender, lastSeen, lastSeenLocation, photoFilename`,
        });
      }

      const photoUrl = photoMap[photoFilename];
      if (!photoUrl) {
        return res.status(400).json({
          success: false,
          message: `Row ${i + 1}: photo '${photoFilename}' not found in ZIP.`,
        });
      }

      // map both header styles → nested schema, with safe defaults
      const physicalFeatures = {
        eyeColor: pick(row, ["physicalFeatures.eyeColor", "eyeColor"], "unknown"),
        hairColor: pick(row, ["physicalFeatures.hairColor", "hairColor"], "unknown"),
        height:   pick(row, ["physicalFeatures.height", "height"], "unknown"),
        weight:   pick(row, ["physicalFeatures.weight", "weight"], "unknown"),
        // optional distinguishing marks (support ; or , separators)
        distinguishingMarks: pick(row, ["physicalFeatures.distinguishingMarks", "distinguishingMarks"], "")
          .split(/[;,]/).map(s => s.trim()).filter(Boolean),
      };

      const clothing = {
        type:  pick(row, ["clothing.type", "clothingType"], "unknown"),
        color: pick(row, ["clothing.color", "clothingColor"], "unknown"),
        details: pick(row, ["clothing.details", "clothingDetails"], ""),
      };

      const description = pick(row, ["description"], "No description provided");
      const reportedByPhone = pick(row, ["reportedByPhone", "contactNumber"], "N/A");
      const languages =
        pick(row, ["languages"], "")
          .split(/[;,]/).map(s => s.trim()).filter(Boolean);
      const priority = pick(row, ["priority"], "medium");

      const newPersonData: any = {
  name,
  age: ageNum,
  gender,
  lastSeen,
  lastSeenLocation,
  photo: photoUrl,
  reportedBy: req.user!._id, // uploader
  reportedByRole: "police",  // 👈 default role
  status: "missing",
  blockchainHash: "",
  physicalFeatures,
  clothing,
  description,
  reportedByPhone,
  languages: languages.length ? languages : ["English"],
  priority,
};

      // Blockchain hash
      const dataHash = blockchain.generateDataHash(newPersonData);
      newPersonData.blockchainHash = dataHash;
      await blockchain.storeDataHash(dataHash, JSON.stringify(newPersonData));

      const saved = await MissingPerson.create(newPersonData);
      savedRecords.push(saved);
    }

    return res.status(201).json({
      success: true,
      message: "Bulk missing persons uploaded successfully",
      count: savedRecords.length,
    });
  } catch (err: any) {
    console.error("Bulk upload error:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server error",
    });
  }
};

/* =========================================================
   GET /api/police/missing-persons
   ========================================================= */
export const getAllMissingPersons = async (_req: Request, res: Response) => {
  try {
    const persons = await MissingPerson.find().sort({ createdAt: -1 });
    res.json({ success: true, persons });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || "Error fetching records",
    });
  }
};
