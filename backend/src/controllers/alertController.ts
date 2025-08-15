import { Request, Response, NextFunction } from 'express';

export const createAlert = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, message, level } = req.body as { title: string; message: string; level?: 'info' | 'warning' | 'critical' };
    if (!title || !message) {
      res.status(400).json({ success: false, message: 'Title and message are required' });
      return;
    }
    res.status(201).json({ success: true, alert: { title, message, level: level || 'info', createdAt: new Date() } });
  } catch (error) {
    next(error as any);
  }
};

export const listAlerts = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({ success: true, alerts: [] });
};


