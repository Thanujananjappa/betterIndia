import { Request, Response } from 'express';
import { socialService } from '../services/socialService';

export const getSocialPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await socialService.getLatest();
    res.status(200).json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch social media posts' });
  }
};

export const searchSocialPosts = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ success: false, message: 'Keyword is required' });
    }
    const results = await socialService.search(keyword as string);
    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to search social media posts' });
  }
};
