import { Router } from 'express';
import {
  getAllNGOs,
  getNGOById,
  searchNGOs
} from '../controllers/ngoController';

const router = Router();

router.get('/', getAllNGOs);
router.get('/search', searchNGOs);
router.get('/:id', getNGOById);

export default router;
