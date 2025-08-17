// src/controllers/communityController.ts
import { Request, Response } from "express";
import { communityService } from "../services/communityService";

// Community feed
export const getCommunityFeed = async (_: Request, res: Response) => {
  res.json(await communityService.getFeed());
};
export const postCommunityUpdate = async (req: Request, res: Response) => {
  const { message } = req.body;
  res.json(await communityService.createUpdate(message));
};

// Members
export const getCommunityMembers = async (_: Request, res: Response) => {
  res.json(await communityService.getMembers());
};

// Camera requests
export const getCameraRequests = async (_: Request, res: Response) => {
  res.json(await communityService.getCameraRequests());
};
export const createCameraRequest = async (req: Request, res: Response) => {
  const { location, reason } = req.body;
  res.json(await communityService.addCameraRequest(location, reason));
};
export const updateCameraRequestStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  res.json(await communityService.updateCameraRequestStatus(id, status));
};

// Campaigns
export const getCampaigns = async (_: Request, res: Response) => {
  res.json(await communityService.getCampaigns());
};
export const createCampaign = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  res.json(await communityService.createCampaign(title, description));
};
