// src/scripts/seedData.ts
import mongoose from "mongoose";
import { connectDB } from "../utils/database";
import CommunityMember from "../models/CommunityMember";
import Campaign from "../models/Campaign";
import CameraRequest from "../models/CameraRequest";

const seed = async () => {
  try {
    await connectDB();

    // Clear old data
    await CommunityMember.deleteMany({});
    await Campaign.deleteMany({});
    await CameraRequest.deleteMany({});

    // Insert community members
    await CommunityMember.insertMany([
      { name: "Alice", role: "volunteer", location: "Mumbai" },
      { name: "Bob", role: "member", location: "Delhi" },
    ]);

    // Insert campaigns
    await Campaign.insertMany([
      { title: "Child Safety Awareness", location: "Hyderabad", participants: 50 },
      { title: "Cyber Safety Training", location: "Pune", participants: 30 },
    ]);

    // Insert camera requests
    await CameraRequest.insertMany([
      { cameraType: "CCTV", location: "Chennai", description: "Street corner", status: "pending" },
      { cameraType: "Drone", location: "Bangalore", description: "Public park", status: "approved" },
    ]);

    console.log("✅ Community Data seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
