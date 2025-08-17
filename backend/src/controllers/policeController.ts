// src/controllers/policeController.ts
import { Request, Response } from 'express';
import PoliceCase from '../models/PoliceCase';

export const getAllPoliceCases = async (req: Request, res: Response) => {
  try {
    const cases = await PoliceCase.find();
    res.json({ success: true, cases });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching police cases' });
  }
};

export const createPoliceCase = async (req: Request, res: Response) => {
  try {
    const newCase = await PoliceCase.create(req.body);
    res.status(201).json({ success: true, case: newCase });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating case' });
  }
};
