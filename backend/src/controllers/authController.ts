import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUserDocument } from "../models/User";
import { memberService } from "../services/memberService";

/* -------------------- Helpers -------------------- */
const generateToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });

/* -------------------- Controllers -------------------- */

/**
 * POST /api/auth/register
 */
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    email,
    phone,
    password,
    role,
    organization,
    location,

    // police
    stationId,
    policeRole,
    officialEmail,
    badgeNumber,

    // ngo
    ngoName,
    ngoRegNumber,
  } = req.body;

  try {
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        message: "Missing required fields: name, email, phone, password, role",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    let extra: Partial<IUserDocument> = {};

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    /* --- Police --- */
    if (role === "police") {
      const idCardFile = files?.idCard?.[0];
      extra = {
        stationId,
        policeRole,
        officialEmail,
        badgeNumber,
        ...(idCardFile && { idCardUrl: `/uploads/idcards/${idCardFile.filename}` }),
        verificationStatus: "verified",
        emailVerified: true,
      };
    }

    /* --- NGO --- */
    if (role === "ngo") {
      const licenseFile = files?.license?.[0];
      extra = {
        ngoName,
        ngoRegNumber,
        ...(licenseFile && { ngoLicenseUrl: `/uploads/licenses/${licenseFile.filename}` }),
        verificationStatus: "verified",
        emailVerified: true,
      };
    }

    const user: IUserDocument = await User.create({
      name,
      email,
      phone,
      password,
      role,
      organization,
      location,
      ...extra,
    });

    const payload: any = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      token: generateToken(user._id.toString(), user.role),
    };

    if (user.role === "ngo") {
      payload.ngoId = user._id.toString();
      payload.ngoName = user.ngoName;
    }

    return res.status(201).json(payload);
  } catch (error: any) {
    if (error?.code === 11000) {
      if (error?.keyPattern?.email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (error?.keyPattern?.stationId) {
        return res
          .status(400)
          .json({ message: "This station already has a Main Police account." });
      }
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/auth/login
 */
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = (await User.findOne({ email }).select("+password")) as IUserDocument | null;

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (["police", "ngo"].includes(user.role) && user.verificationStatus !== "verified") {
      return res.status(403).json({
        message: `Your ${user.role} account is not approved yet.`,
        verificationStatus: user.verificationStatus,
      });
    }

    const payload: any = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      token: generateToken(user._id.toString(), user.role),
    };

    if (user.role === "ngo") {
      payload.ngoId = user._id.toString();
      payload.ngoName = user.ngoName;
    }

    return res.json(payload);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  return res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    verificationStatus: req.user.verificationStatus,
    ngoId: req.user.role === "ngo" ? req.user._id : undefined,
    ngoName: req.user.role === "ngo" ? req.user.ngoName : undefined,
  });
};

/**
 * POST /api/auth/ngo/upload-license
 */
export const uploadNgoLicense = async (req: Request & { user?: any }, res: Response) => {
  if (!req.user?._id) return res.status(401).json({ message: "Not authorized" });

  const licenseFile = (req as any).file as Express.Multer.File | undefined;
  if (!licenseFile) return res.status(400).json({ message: "License file required" });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role !== "ngo") return res.status(403).json({ message: "Only NGO accounts allowed" });

  user.ngoLicenseUrl = `/uploads/licenses/${licenseFile.filename}`;
  user.verificationStatus = "verified";
  user.emailVerified = true;
  await user.save();

  return res.json({
    message: "License uploaded. Account approved.",
    ngoLicenseUrl: user.ngoLicenseUrl,
    ngoId: user._id.toString(),
    ngoName: user.ngoName,
  });
};

/**
 * POST /api/auth/ngo/bulk-upload
 */
export const uploadNgoBulk = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Not authorized" });
    if (!req.file) return res.status(400).json({ message: "ZIP file required" });

    const result = await memberService.processBulkZip(req.file, req.user._id);
    return res.json({ message: "Bulk upload completed", ...result });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Bulk upload failed" });
  }
};
