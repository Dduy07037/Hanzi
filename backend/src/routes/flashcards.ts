import { Router } from 'express';
import { FlashcardController } from '../controllers/flashcardController';
import { QuizController } from '../controllers/quizController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const flashcardController = new FlashcardController();
const quizController = new QuizController();

// Tất cả routes này cần xác thực
router.use(authMiddleware);

router.post('/decks', flashcardController.createDeck);
router.get('/decks', flashcardController.getUserDecks);
router.post('/cards', flashcardController.addFlashcard);
router.get('/review', flashcardController.getReviewCards);
router.post('/review/update', flashcardController.updateReview);

// Quiz routes
router.get('/quiz', quizController.createQuiz);
router.post('/quiz/submit', quizController.submitQuiz);

export default router;