import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

export const signup = async (userData: Partial<IUser>) => {
  const user = new User(userData);
  await user.save();

  const token = generateToken(user._id, user.role);
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id, user.role);
  user.lastLogin = new Date();
  await user.save();

  return { user, token };
};

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "7d"
  });
};
