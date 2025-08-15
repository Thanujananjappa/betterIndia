import { Router } from 'express';
import { protect } from '../middleware/auth';
import { createReport, listReports, getReportById, updateReportStatus, addAgentActivity } from '../controllers/reportController';

const router = Router();

router.get('/', listReports);
router.get('/:id', getReportById);
router.post('/', protect, createReport);
router.patch('/:id/status', protect, updateReportStatus);
router.post('/:id/activity', protect, addAgentActivity);

export default router;


