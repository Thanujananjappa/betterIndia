import path from "path";
import fs from "fs";
import unzipper from "unzipper";
import Resident from "../models/Resident";

interface SaveMemberInput {
  ngoId: string;
  file?: Express.Multer.File;
  name: string;
  age?: number;
  gender?: string;
  role?: string;
  contactNumber?: string;
  address?: string;
}

export const memberService = {
  // Save one NGO resident
  async saveMember(data: SaveMemberInput) {
    try {
      let photoUrl: string | undefined;

      if (data.file) {
        // Save public-relative path to uploaded file
        photoUrl = `/uploads/${data.file.filename}`;
      }

      const member = new Resident({
        ngoId: data.ngoId,
        name: data.name,
        age: data.age,
        gender: data.gender,
        role: data.role,
        contactNumber: data.contactNumber,
        address: data.address,
        photoUrl,
      });

      return await member.save();
    } catch (error) {
      console.error("Error saving Resident:", error);
      throw error;
    }
  },

  // Process bulk ZIP of residents
  async processBulkZip(file: Express.Multer.File, ngoId: string) {
    try {
      // Extract into a unique folder under uploads
      const extractedDir = path.join(__dirname, "../../uploads", file.filename);
      fs.mkdirSync(extractedDir, { recursive: true });

      await fs
        .createReadStream(file.path)
        .pipe(unzipper.Extract({ path: extractedDir }))
        .promise();

      // Require a bulk.json file that contains members array
      const bulkJsonPath = path.join(extractedDir, "bulk.json");
      if (!fs.existsSync(bulkJsonPath)) {
        throw new Error("bulk.json not found inside ZIP file");
      }

      const rawData = fs.readFileSync(bulkJsonPath, "utf-8");
      const members = JSON.parse(rawData);

      if (!Array.isArray(members)) {
        throw new Error("bulk.json must contain an array of members");
      }

      // Normalize & attach photo paths if images are present
      const docs = members.map((m: any) => {
        const photoUrl =
          typeof m.photo === "string" && m.photo.length
            ? `/uploads/${file.filename}/photos/${m.photo}`
            : (m.photoUrl as string | undefined);

        return {
          ngoId, // still a string, mongoose will cast to ObjectId
          name: m.name,
          age: m.age,
          gender: m.gender,
          role: m.role,
          contactNumber: m.contactNumber,
          address: m.address,
          photoUrl,
        };
      });

      // ✅ Fix: cast to mongoose InsertManyInput (loosen typing)
      const saved = await Resident.insertMany(docs as any[], {
        ordered: false,
      });

      return { inserted: saved.length, items: saved };
    } catch (error) {
      console.error("Error processing bulk ZIP:", error);
      throw error;
    }
  },
};
