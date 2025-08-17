import { Request, Response } from 'express';
import { cctvService } from '../services/cctvService';

export const getCCTVFeeds = async (_req: Request, res: Response) => {
  try {
    const feeds = await cctvService.getAllFeeds();
    res.status(200).json({ success: true, feeds });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch CCTV feeds' });
  }
};

export const requestCCTVAccess = async (req: Request, res: Response) => {
  try {
    const { location, reason } = req.body;
    if (!location || !reason) {
      return res.status(400).json({ success: false, message: 'Location and reason are required' });
    }
    const request = await cctvService.requestAccess(location, reason);
    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to request CCTV access' });
  }
};

export const getCCTVByLocation = async (req: Request, res: Response) => {
  try {
    const { location } = req.params;
    const feed = await cctvService.getByLocation(location);
    res.status(200).json({ success: true, feed });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch CCTV feed' });
  }
};
