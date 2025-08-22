import axios, { InternalAxiosRequestConfig } from "axios";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// ====== Request interceptor: attach bearer token ======
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ====== Response interceptor ======
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* =========================
        Auth APIs
   ========================= */
export const registerUser = (data: Record<string, any>) =>
  api.post("/auth/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");

export const uploadNgoLicense = (formData: FormData) =>
  api.post("/auth/ngo/upload-license", formData);

/* =========================
   Community / Campaign APIs
   ========================= */
export const getCommunityMembers = () => api.get("/community/members");
export const getCameraRequests = () => api.get("/community/camera-requests");
export const createCameraRequest = (data: {
  cameraType?: string;
  location?: string;
  description?: string;
}) => api.post("/community/camera-requests", data);
export const updateCameraRequestStatus = (id: string, status: string) =>
  api.put(`/community/camera-requests/${id}`, { status });
export const getAwarenessCampaigns = () => api.get("/community/campaigns");
export const createCampaign = (data: {
  title: string;
  location: string;
  startDate?: string;
  endDate?: string;
  participants?: number;
}) => api.post("/community/campaigns", data);

/* =========================
        Police APIs
   ========================= */
export const uploadBulkMissingPersons = (formData: FormData) =>
  api.post("/police/upload-bulk", formData);

export const getMissingPersons = () => api.get("/police/missing-persons");

/* =========================
       Default export
   ========================= */
export default api;
