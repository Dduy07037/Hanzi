import { Router } from 'express';
import { WritingController } from '../controllers/writingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const writingController = new WritingController();

// Tất cả routes này cần xác thực
router.use(authMiddleware);

router.get('/session', writingController.createWritingSession);
router.post('/progress', writingController.saveWritingProgress);

export default router;

