import { Router } from 'express';
import { createAlert, listAlerts } from '../controllers/alertController';

const router = Router();

router.get('/', listAlerts);
router.post('/', createAlert);

export default router;


