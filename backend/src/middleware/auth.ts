import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUserDocument } from "../models/User";

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: IUserDocument | null;
}

// Structure of decoded JWT token
interface DecodedToken extends JwtPayload {
  id: string;
}

// ✅ Ensure JWT_SECRET exists at startup, not runtime
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in environment variables");
}

// Middleware to protect routes
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Not authorized, no token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token missing" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (!decoded?.id) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware to require verified users only
export const requireVerified = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.isVerified) {
    res.status(403).json({ message: "User not verified" });
    return;
  }
  next();
};
