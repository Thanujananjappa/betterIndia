import mongoose, { Schema, Document } from 'mongoose';

export interface IPolice extends Document {
  stationName: string;
  address: string;
  contactNumber: string;
  jurisdictionArea: string;
}

const policeSchema = new Schema<IPolice>({
  stationName: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  jurisdictionArea: { type: String, required: true }
});

export const Police = mongoose.model<IPolice>('Police', policeSchema);
