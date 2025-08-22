// src/routes/admin.ts
import { Router, Request, Response } from "express";
import User from "../models/User";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

/**
 * GET /api/admin/users
 * Segregate users by role
 */
router.get("/users", protect, adminOnly, async (_req: Request, res: Response) => {
  try {
    const ngos = await User.find({ role: "ngo" }).select("-password");
    const police = await User.find({ role: "police" }).select("-password");
    const community = await User.find({ role: "community" }).select("-password");
    const citizens = await User.find({ role: "citizen" }).select("-password");

    return res.json({
      ngos,
      police,
      community,
      citizens,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

/**
 * PATCH /api/admin/verify/:id
 * Verify NGO or Police
 */
router.patch("/verify/:id", protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.verificationStatus = "verified";
    await user.save();

    return res.json({ message: `${user.role} verified successfully`, user });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

/**
 * PATCH /api/admin/reject/:id
 * Reject NGO or Police
 */
router.patch("/reject/:id", protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.verificationStatus = "rejected";
    await user.save();

    return res.json({ message: `${user.role} rejected`, user });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;
