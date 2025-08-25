import mongoose, { Document, Schema } from "mongoose";

export interface IMissingPerson extends Document {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  lastSeen: Date;
  lastSeenLocation: string;
  coordinates?: { lat: number; lng: number };
  status: "missing" | "investigating" | "found" | "closed";
  reportedBy: mongoose.Types.ObjectId;
  reportedByRole: "police" | "ngo" | "community" | "family";
  reportedByPhone: string;
  reportedByEmail?: string; // ✅ optional now
  photo: string;
  description: string;
  clothing: { color: string; type: string; details?: string };
  physicalFeatures: {
    height: string;
    weight: string;
    hairColor: string;
    eyeColor: string;
    distinguishingMarks?: string[];
  };
  medicalInfo?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  languages: string[];
  priority: "low" | "medium" | "high" | "critical";
  blockchainHash?: string;
  agentActivity: Array<{
    agent: "report" | "matching" | "community" | "alert";
    action: string;
    timestamp: Date;
    details?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const missingPersonSchema = new Schema<IMissingPerson>(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    lastSeen: { type: Date, required: true },
    lastSeenLocation: { type: String, required: true, trim: true },
    coordinates: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 },
    },
    status: {
      type: String,
      enum: ["missing", "investigating", "found", "closed"],
      default: "missing",
      required: true,
    },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reportedByRole: {
      type: String,
      enum: ["police", "ngo", "community", "family"],
      required: true,
    },
    reportedByPhone: { type: String, required: true },
    reportedByEmail: { type: String }, // ✅ optional in schema
    photo: { type: String, required: true },
    description: { type: String, required: true },
    clothing: {
      color: { type: String, required: true },
      type: { type: String, required: true },
      details: String,
    },
    physicalFeatures: {
      height: { type: String, required: true },
      weight: { type: String, required: true },
      hairColor: { type: String, required: true },
      eyeColor: { type: String, required: true },
      distinguishingMarks: [String],
    },
    medicalInfo: {
      conditions: [String],
      medications: [String],
      allergies: [String],
    },
    languages: { type: [String], required: true, default: ["English"] },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
      default: "medium",
    },
    blockchainHash: { type: String, unique: true, sparse: true },
    agentActivity: {
      type: [
        {
          agent: {
            type: String,
            enum: ["report", "matching", "community", "alert"],
            required: true,
          },
          action: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
          details: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true, collection: "missingpersons" }
);

export default mongoose.model<IMissingPerson>(
  "MissingPerson",
  missingPersonSchema
);
