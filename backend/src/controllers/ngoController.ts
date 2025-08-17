import { Request, Response } from 'express';
import { ngoService } from '../services/ngoService';

export const getAllNGOs = async (_req: Request, res: Response) => {
  try {
    const ngos = await ngoService.getAll();
    res.status(200).json({ success: true, ngos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch NGOs' });
  }
};

export const getNGOById = async (req: Request, res: Response) => {
  try {
    const ngo = await ngoService.getById(req.params.id);
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found' });
    res.status(200).json({ success: true, ngo });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch NGO' });
  }
};

export const searchNGOs = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.query;
    const results = await ngoService.search(name as string, location as string);
    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to search NGOs' });
  }
};
