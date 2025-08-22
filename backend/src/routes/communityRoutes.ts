// src/routes/communityRoutes.ts
import { Router } from "express";
import {
  getCommunityFeed,
  postCommunityUpdate,
  getCommunityMembers,
  getCameraRequests,
  createCameraRequest,
  updateCameraRequestStatus,
  getCampaigns,
  createCampaign,
} from "../controllers/communityController";

const router = Router();

/**
 * @route   /api/community/feed
 * @desc    Community feed routes
 */
router.get("/feed", getCommunityFeed);
router.post("/feed", postCommunityUpdate);

/**
 * @route   /api/community/members
 * @desc    Community members list
 */
router.get("/members", getCommunityMembers);

/**
 * @route   /api/community/camera-requests
 * @desc    CCTV / Camera access requests
 */
router.get("/camera-requests", getCameraRequests);
router.post("/camera-requests", createCameraRequest);
router.put("/camera-requests/:id", updateCameraRequestStatus);

/**
 * @route   /api/community/campaigns
 * @desc    Awareness campaigns
 */
router.get("/campaigns", getCampaigns);
router.post("/campaigns", createCampaign);

export default router;
