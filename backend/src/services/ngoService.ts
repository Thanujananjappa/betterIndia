// src/services/ngoService.ts
import { NGO } from '../models/NGOCase';


export const ngoService = {
  async getAll() {
    return await NGO.find();
  },
  async getById(id: string) {
    return await NGO.findById(id);
  },
  async search(name?: string, location?: string) {
    const query: any = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (location) query.address = { $regex: location, $options: 'i' };
    return await NGO.find(query);
  }
};
