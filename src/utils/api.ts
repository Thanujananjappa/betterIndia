// src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change if deployed
  headers: { "Content-Type": "application/json" },
});

// Community
export const getCommunityMembers = () => api.get("/community/members");
export const getCameraRequests = () => api.get("/community/camera-requests");
export const getAwarenessCampaigns = () => api.get("/community/campaigns");

export const updateCameraRequestStatus = (id: string, status: string) =>
  api.put(`/community/camera-requests/${id}`, { status });

export default api;
