import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

const CampaignSchema = new Schema<ICampaign>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

export default mongoose.model<ICampaign>("Campaign", CampaignSchema);
