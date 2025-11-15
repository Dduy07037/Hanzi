import { Router } from 'express';
import { ListeningController } from '../controllers/listeningController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const listeningController = new ListeningController();

// Tất cả routes này cần xác thực
router.use(authMiddleware);

router.get('/session', listeningController.createListeningSession);
router.post('/submit', listeningController.submitListening);

export default router;

