import { Router } from 'express';
import { AIFlashcardController } from '../controllers/aiFlashcardController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const aiFlashcardController = new AIFlashcardController();

// Tất cả routes này cần xác thực
router.use(authMiddleware);

router.post('/generate', aiFlashcardController.generateFromDescription);
router.post('/create', aiFlashcardController.createDeckFromPreview);

export default router;

