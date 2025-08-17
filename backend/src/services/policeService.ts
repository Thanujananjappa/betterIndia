// src/services/policeService.ts
import axios from "axios";

export const policeService = {
  getMissingPersons: async () => {
    const apiUrl = process.env.POLICE_API_URL; // Provided by state police IT
    const apiKey = process.env.POLICE_API_KEY;
    const { data } = await axios.get(`${apiUrl}/missing-persons`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return data.records || [];
  }
};
