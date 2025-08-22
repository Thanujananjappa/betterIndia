import mongoose, { Schema, Document } from "mongoose";

export interface ICommunityMember extends Document {
  name: string;
  role: "member" | "volunteer";
  location: string;
}

const CommunityMemberSchema = new Schema<ICommunityMember>({
  name: { type: String, required: true },
  role: { type: String, enum: ["member", "volunteer"], required: true },
  location: { type: String, required: true },
});

export default mongoose.model<ICommunityMember>("CommunityMember", CommunityMemberSchema);
