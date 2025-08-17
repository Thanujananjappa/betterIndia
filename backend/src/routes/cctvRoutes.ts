// src/routes/cctvRoutes.ts
import { Router } from "express";
import {
  getCCTVFeeds,
  requestCCTVAccess,
  getCCTVByLocation,
} from "../controllers/cctvController";

const router = Router();

router.get("/", getCCTVFeeds);
router.post("/request", requestCCTVAccess);
router.get("/:location", getCCTVByLocation);

export default router;
