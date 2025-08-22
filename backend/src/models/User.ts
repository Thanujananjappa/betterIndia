// src/models/User.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

/* -------------------- User Types -------------------- */
export type AppRole = "admin" | "ngo" | "police" | "citizen" | "community";
export type VerificationStatus = "pending" | "verified";
export type PoliceRole = "main" | "officer";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: AppRole;

  // Generic
  organization?: string;
  location?: string;

  // Police-only
  stationId?: string;
  policeRole?: PoliceRole;
  officialEmail?: string;
  badgeNumber?: string;
  idCardUrl?: string;
  emailVerified?: boolean;

  // NGO-only
  ngoName?: string;
  ngoRegNumber?: string;
  ngoLicenseUrl?: string;

  // Shared
  verificationStatus?: VerificationStatus;
}

export interface IUserDocument extends IUser, Document<Types.ObjectId> {
  _id: Types.ObjectId;
  password: string; // always available internally
  comparePassword(candidatePassword: string): Promise<boolean>;

  // Helper for auth middleware
  isVerified: boolean;
}

/* -------------------- Schema -------------------- */
const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },

    phone: { type: String, required: true, trim: true },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      required: true,
      enum: ["admin", "ngo", "police", "citizen", "community"],
    },

    organization: { type: String },
    location: { type: String },

    /* --- Police-only fields --- */
    stationId: { type: String },
    policeRole: { type: String, enum: ["main", "officer"] },
    officialEmail: { type: String, lowercase: true, trim: true },
    badgeNumber: { type: String, trim: true },
    idCardUrl: { type: String },
    emailVerified: { type: Boolean, default: false },

    /* --- NGO-only fields --- */
    ngoName: { type: String, trim: true },
    ngoRegNumber: { type: String, trim: true },
    ngoLicenseUrl: { type: String },

    /* --- Common Verification --- */
    verificationStatus: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending",
    },
  },
  { timestamps: true }
);

/* Constraint: Only one "main" police per station */
userSchema.index(
  { stationId: 1, policeRole: 1 },
  {
    unique: true,
    partialFilterExpression: { policeRole: "main" },
    name: "unique_main_police_per_station",
  }
);

/* -------------------- Middleware -------------------- */
userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* -------------------- Methods -------------------- */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/* -------------------- Virtual / Getter -------------------- */
userSchema.virtual("isVerified").get(function (this: IUserDocument) {
  return this.verificationStatus === "verified";
});

/* -------------------- Export -------------------- */
const User: Model<IUserDocument> =
  mongoose.models.User ||
  mongoose.model<IUserDocument>("User", userSchema, "users");

export default User;
