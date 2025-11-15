import { Router } from 'express';
import { StatsController } from '../controllers/statsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const statsController = new StatsController();

// Tất cả routes này cần xác thực
router.use(authMiddleware);

router.get('/learning', statsController.getLearningStats);

export default router;

