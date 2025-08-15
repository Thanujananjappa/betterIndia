import { Router } from 'express';
import { getMatchingStatus, getPotentialMatches } from '../controllers/matchingController';

const router = Router();

router.get('/status', getMatchingStatus);
router.get('/:reportId', getPotentialMatches);

export default router;


