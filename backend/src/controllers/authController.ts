import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { generateToken, AuthRequest } from '../middleware/auth';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, password, role, organization, location } = req.body as Partial<IUser> & { password?: string };

    if (!name || !email || !phone || !password || !location) {
      next(createError('Missing required fields', 400));
      return;
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      next(createError('User with this email or phone already exists', 400));
      return;
    }

    const user = await User.create({ name, email, phone, password, role, organization, location } as any);
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
        location: user.location,
        isVerified: user.isVerified,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error as any);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { emailOrPhone, password } = req.body as { emailOrPhone: string; password: string };

    if (!emailOrPhone || !password) {
      next(createError('Please provide email/phone and password', 400));
      return;
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    }).select('+password');

    if (!user) {
      next(createError('Invalid credentials', 401));
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      next(createError('Invalid credentials', 401));
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken((user._id as any).toString());
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
        location: user.location,
        isVerified: user.isVerified,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error as any);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      next(createError('Not authorized', 401));
      return;
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      next(createError('User not found', 404));
      return;
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
        location: user.location,
        isVerified: user.isVerified,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error as any);
  }
};


