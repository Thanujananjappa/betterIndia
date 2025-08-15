import { Request, Response, NextFunction } from 'express';
import MissingPerson from '../models/MissingPerson';

export const getPotentialMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reportId } = req.params as { reportId: string };
    const report = await MissingPerson.findById(reportId);
    if (!report) {
      res.status(404).json({ success: false, message: 'Report not found' });
      return;
    }

    // Placeholder simple heuristic for matches
    const matches = await MissingPerson.find({
      _id: { $ne: report._id },
      gender: report.gender,
      status: 'missing',
      age: { $gte: Math.max(0, report.age - 2), $lte: report.age + 2 }
    }).limit(10);

    res.status(200).json({ success: true, matches });
  } catch (error) {
    next(error as any);
  }
};

export const getMatchingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({ success: true, status: 'ready' });
};


