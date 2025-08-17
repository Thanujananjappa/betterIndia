// src/routes/policeRoutes.ts
import express from 'express';
import { getAllPoliceCases, createPoliceCase } from '../controllers/policeController';

const router = express.Router();

router.get('/', getAllPoliceCases);
router.post('/', createPoliceCase);

export default router;
