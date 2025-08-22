import mongoose, { Schema, Document } from "mongoose";

export interface ICameraRequest extends Document {
  requesterName: string;
  location: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const CameraRequestSchema = new Schema<ICameraRequest>({
  requesterName: { type: String, required: true },
  location: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

export default mongoose.model<ICameraRequest>("CameraRequest", CameraRequestSchema);
