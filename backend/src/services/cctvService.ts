// src/services/cctvService.ts
import axios from 'axios';

const CCTV_API_URL = process.env.CCTV_API_URL as string | undefined;

export const cctvService = {
  getAvailableCameras: async () => {
    if (!CCTV_API_URL) {
      throw new Error('CCTV_API_URL is not defined in environment variables');
    }

    const { data } = await axios.get(CCTV_API_URL);
    return data;
  }
};
