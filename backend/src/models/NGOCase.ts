import mongoose, { Schema, Document } from 'mongoose';

export interface INGO extends Document {
  name: string;
  focusArea: string;
  contactNumber: string;
  address: string;
}

const ngoSchema = new Schema<INGO>({
  name: { type: String, required: true },
  focusArea: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true }
});

export const NGO = mongoose.model<INGO>('NGO', ngoSchema);
