import mongoose, { Schema, Document } from 'mongoose';

export interface ICCTV extends Document {
  location: string;
  type: string; // railway, bus, community
  ipAddress?: string;
  accessURL?: string;
}

const cctvSchema = new Schema<ICCTV>({
  location: { type: String, required: true },
  type: { type: String, required: true },
  ipAddress: { type: String },
  accessURL: { type: String }
});

export const CCTV = mongoose.model<ICCTV>('CCTV', cctvSchema);
