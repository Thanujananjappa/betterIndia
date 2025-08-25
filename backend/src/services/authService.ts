import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const signup = async (userData: Partial<IUser>) => {
  const user = new User(userData);
  await user.save();

  const token = generateToken(user._id.toString(), user.role);
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id.toString(), user.role);

  // ✅ Safe lastLogin update
  user.lastLogin = new Date();
  await user.save();

  return { user, token };
};

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export default { signup, login };
