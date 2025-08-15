import { Request, Response, NextFunction } from 'express';

export const getCommunityFeed = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({
    success: true,
    items: []
  });
};

export const postCommunityUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message } = req.body as { message: string };
    if (!message) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }
    res.status(201).json({ success: true, update: { message, createdAt: new Date() } });
  } catch (error) {
    next(error as any);
  }
};


