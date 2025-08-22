import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUserDocument } from "../models/User";

/* -------------------- Helpers -------------------- */
const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });

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
    const file = (req as any).file as Express.Multer.File | undefined;

    /* --- Police --- */
    if (role === "police") {
      const idCardFile = file && file.fieldname === "idCard" ? file : undefined;
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
      const licenseFile = file && file.fieldname === "license" ? file : undefined;
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

    return res.status(201).json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      if (error?.keyPattern?.email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (error?.keyPattern?.stationId) {
        return res.status(400).json({ message: "This station already has a Main Police account." });
      }
    }
    if (error?.name === "ValidationError" && error?.errors?.role) {
      return res.status(400).json({ message: "Invalid role" });
    }
    console.error("Registration error:", error);
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

    if (user.role === "police" && user.verificationStatus !== "verified") {
      return res.status(403).json({
        message: "Your police account is not approved yet.",
        verificationStatus: user.verificationStatus,
      });
    }

    if (user.role === "ngo" && user.verificationStatus !== "verified") {
      return res.status(403).json({
        message: "Your NGO account is not approved yet. Please wait for admin approval.",
        verificationStatus: user.verificationStatus,
      });
    }

    return res.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req: Request & { user?: any }, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 🔥 user already attached in protect middleware without password
    return res.json(req.user);
  } catch (error: any) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/auth/ngo/upload-license
 */
export const uploadNgoLicense = async (req: Request & { user?: any }, res: Response): Promise<Response> => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const licenseFile = (req as any).file as Express.Multer.File | undefined;
    if (!licenseFile) {
      return res.status(400).json({ message: "License file required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGO accounts can upload a license" });
    }

    user.ngoLicenseUrl = `/uploads/licenses/${licenseFile.filename}`;
    user.verificationStatus = "verified";
    user.emailVerified = true;
    await user.save();

    return res.json({
      message: "License uploaded. Account approved.",
      ngoLicenseUrl: user.ngoLicenseUrl,
    });
  } catch (error: any) {
    console.error("Upload NGO license error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
