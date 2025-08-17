import { Router } from 'express';
import {
  getSocialPosts,
  searchSocialPosts
} from '../controllers/socialController';

const router = Router();

router.get('/', getSocialPosts);
router.get('/search', searchSocialPosts);

export default router;
