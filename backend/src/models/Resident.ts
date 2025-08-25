import { Schema, model, Document } from "mongoose";

export interface IResident extends Document {
  name: string;
  age: number;
  gender: string;
  address?: string;         // now optional
  contactNumber?: string;   // now optional
  ngoId: string; // linked NGO
}

const ResidentSchema = new Schema<IResident>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: false },        // ✅ optional
    contactNumber: { type: String, required: false },  // ✅ optional
    ngoId: { type: String, required: true },
  },
  { timestamps: true }
);

const Resident = model<IResident>("Resident", ResidentSchema);

export default Resident;
