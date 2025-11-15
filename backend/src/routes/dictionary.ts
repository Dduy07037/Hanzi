import { Router } from 'express';
import { DictionaryController } from '../controllers/dictionaryController';

const router = Router();
const dictionaryController = new DictionaryController();

router.get('/search', dictionaryController.search);
router.get('/hsk/:level', dictionaryController.getWordsByHSK);
router.get('/word/:id', dictionaryController.getWordById);

export default router;