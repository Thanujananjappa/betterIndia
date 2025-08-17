// src/routes/communityRoutes.ts
import { Router } from "express";
import {
  getCommunityFeed,
  postCommunityUpdate,
  getCommunityMembers,
  getCameraRequests,
  updateCameraRequestStatus,
  createCameraRequest,
  getCampaigns,
  createCampaign,
} from "../controllers/communityController";

const router = Router();

// Community feed
router.get("/feed", getCommunityFeed);
router.post("/feed", postCommunityUpdate);

// Community members
router.get("/members", getCommunityMembers);

// CCTV / camera access requests
router.get("/camera-requests", getCameraRequests);
router.post("/camera-requests", createCameraRequest);
router.put("/camera-requests/:id", updateCameraRequestStatus); // ✅ Added PUT

// Awareness campaigns
router.get("/campaigns", getCampaigns);
router.post("/campaigns", createCampaign);

export default router;
