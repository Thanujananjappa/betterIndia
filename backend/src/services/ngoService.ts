// src/services/ngoService.ts
import axios from 'axios';

interface NGOCase {
  id: string;
  name: string;
  age: number;
  lastSeen: string;
  description: string;
  contactInfo: string;
}

export const ngoService = {
  async getActiveCases(): Promise<NGOCase[]> {
    try {
      const response = await axios.get('https://your-ngo-api.org/missing-persons');
      return response.data.cases;
    } catch (error) {
      console.error('Error fetching NGO cases:', error);
      return [];
    }
  }
};
