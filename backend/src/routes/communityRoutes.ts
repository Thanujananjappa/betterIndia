import { Router } from 'express';
import { getCommunityFeed, postCommunityUpdate } from '../controllers/communityController';

const router = Router();

router.get('/', getCommunityFeed);
router.post('/', postCommunityUpdate);

export default router;


