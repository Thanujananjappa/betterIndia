// src/services/communityService.ts

interface Update {
  message: string;
  createdAt: Date;
}

interface Member {
  id: string;
  name: string;
  role: string;
  contact: string;
}

interface CameraRequest {
  id: string;
  location: string;
  reason: string;
  status: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

// TEMP in-memory storage (replace with DB later)
let feed: Update[] = [];
let members: Member[] = [
  { id: "1", name: "Rajesh Kumar", role: "Local Leader", contact: "9876543210" },
  { id: "2", name: "Priya Sharma", role: "NGO Volunteer", contact: "9876543211" },
];
let cameraRequests: CameraRequest[] = [];
let campaigns: Campaign[] = [];

// Community Feed
export const getFeed = async () => feed;

export const createUpdate = async (message: string) => {
  const newUpdate = { message, createdAt: new Date() };
  feed.push(newUpdate);
  return newUpdate;
};

// Members
export const getMembers = async () => members;

// Camera Requests
export const getCameraRequests = async () => cameraRequests;

export const addCameraRequest = async (location: string, reason: string) => {
  const newRequest = {
    id: String(cameraRequests.length + 1),
    location,
    reason,
    status: "pending",
  };
  cameraRequests.push(newRequest);
  return newRequest;
};

export const updateCameraRequestStatus = async (id: string, status: string) => {
  const request = cameraRequests.find((r) => r.id === id);
  if (request) {
    request.status = status;
  }
  return request;
};

// Campaigns
export const getCampaigns = async () => campaigns;

export const createCampaign = async (title: string, description: string) => {
  const newCampaign = {
    id: String(campaigns.length + 1),
    title,
    description,
    createdAt: new Date(),
  };
  campaigns.push(newCampaign);
  return newCampaign;
};
