import { Request, Response, NextFunction } from 'express';
import MissingPerson, { IMissingPerson } from '../models/MissingPerson';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body as Partial<IMissingPerson> & { photo?: string };

    if (!body.name || typeof body.age !== 'number' || !body.gender || !body.lastSeen || !body.lastSeenLocation || !body.description) {
      next(createError('Missing required report fields', 400));
      return;
    }

    const report = await MissingPerson.create({
      name: body.name,
      age: body.age,
      gender: body.gender,
      lastSeen: new Date(body.lastSeen),
      lastSeenLocation: body.lastSeenLocation,
      coordinates: body.coordinates,
      status: 'missing',
      reportedBy: req.user?.id,
      reportedByPhone: body.reportedByPhone || 'N/A',
      reportedByEmail: body.reportedByEmail,
      photo: body.photo || '',
      description: body.description,
      clothing: body.clothing || { color: 'unknown', type: 'unknown' },
      physicalFeatures: body.physicalFeatures || { height: 'unknown', weight: 'unknown', hairColor: 'unknown', eyeColor: 'unknown' },
      medicalInfo: body.medicalInfo,
      languages: body.languages || ['English'],
      priority: body.priority || 'medium',
      agentActivity: [
        {
          agent: 'report',
          action: 'created',
          timestamp: new Date(),
          details: 'Report created via API'
        }
      ]
    } as any);

    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error as any);
  }
};

export const listReports = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, priority, q } = req.query as { status?: string; priority?: string; q?: string };
    const filters: Record<string, any> = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (q) filters.$text = { $search: q };

    const reports = await MissingPerson.find(filters).sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    next(error as any);
  }
};

export const getReportById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const report = await MissingPerson.findById(req.params.id);
    if (!report) {
      next(createError('Report not found', 404));
      return;
    }
    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error as any);
  }
};

export const updateReportStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body as { status: IMissingPerson['status'] };
    if (!status) {
      next(createError('Status is required', 400));
      return;
    }
    const report = await MissingPerson.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) {
      next(createError('Report not found', 404));
      return;
    }
    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error as any);
  }
};

export const addAgentActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { agent, action, details } = req.body as { agent: string; action: string; details?: string };
    const report = await MissingPerson.findById(req.params.id);
    if (!report) {
      next(createError('Report not found', 404));
      return;
    }
    report.agentActivity.push({ agent, action, details, timestamp: new Date() } as any);
    await report.save();
    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error as any);
  }
};


