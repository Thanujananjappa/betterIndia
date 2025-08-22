// src/controllers/communityController.ts
import { Request, Response } from "express";
import * as communityService from "../services/communityService";
import User from "../models/User"; // ✅ Import real User model

// Community feed
export const getCommunityFeed = async (_: Request, res: Response) => {
  try {
    const feed = await communityService.getFeed();
    res.json(feed);
  } catch (error) {
    console.error("Error fetching community feed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const postCommunityUpdate = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ message: "Message is required" });
      return;
    }
    const update = await communityService.createUpdate(message);
    res.json(update);
  } catch (error) {
    console.error("Error posting community update:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Members (fetch from DB, not static)
export const getCommunityMembers = async (_: Request, res: Response) => {
  try {
    const members = await User.find({ role: "community" })
      .select("name email phone role location createdAt"); // ✅ exclude password

    res.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Camera requests
export const getCameraRequests = async (_: Request, res: Response) => {
  try {
    const requests = await communityService.getCameraRequests();
    res.json(requests);
  } catch (error) {
    console.error("Error fetching camera requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCameraRequest = async (req: Request, res: Response) => {
  try {
    const { location, reason } = req.body;
    if (!location || !reason) {
      res.status(400).json({ message: "Location and reason are required" });
      return;
    }
    const request = await communityService.addCameraRequest(location, reason);
    res.json(request);
  } catch (error) {
    console.error("Error creating camera request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCameraRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // always string in Express
    const { status } = req.body;

    if (!id || !status) {
      res.status(400).json({ message: "ID and status are required" });
      return;
    }

    const updated = await communityService.updateCameraRequestStatus(id, status);
    res.json(updated);
  } catch (error) {
    console.error("Error updating camera request status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Campaigns
export const getCampaigns = async (_: Request, res: Response) => {
  try {
    const campaigns = await communityService.getCampaigns();
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      res.status(400).json({ message: "Title and description are required" });
      return;
    }
    const campaign = await communityService.createCampaign(title, description);
    res.json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
};
