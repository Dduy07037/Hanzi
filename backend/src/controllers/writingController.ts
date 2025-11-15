import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../types';

export class WritingController {
  // Tạo bài luyện viết
  async createWritingSession(req: AuthRequest, res: Response) {
    try {
      const { deckId, hskLevel, count = 10 } = req.query;
      const userId = req.user!.id;

      const countNum = parseInt(count as string) || 10;
      const hskLevelNum = hskLevel ? parseInt(hskLevel as string) : null;

      // Build where clause
      const whereClause: any = {
        deck: {
          OR: [
            { userId },
            { isPublic: true }
          ]
        }
      };

      if (deckId) {
        whereClause.deckId = deckId as string;
      }

      // Lấy flashcards
      let flashcards = await prisma.flashcard.findMany({
        where: whereClause,
        include: {
          word: true
        }
      });

      // Filter theo HSK level nếu có
      if (hskLevelNum) {
        flashcards = flashcards.filter(f => f.word.hskLevel === hskLevelNum);
      }

      if (flashcards.length === 0) {
        return res.status(404).json({
          error: 'Không tìm thấy thẻ nào để luyện viết'
        });
      }

      // Shuffle và lấy số lượng cần thiết
      const shuffled = flashcards.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(countNum, shuffled.length));

      // Tạo writing practice words
      const words = selected.map((flashcard, index) => {
        const word = flashcard.word;
        return {
          id: `writing-${index}`,
          flashcardId: flashcard.id,
          wordId: word.id,
          character: word.simplified,
          pinyin: word.pinyinTone || word.pinyin,
          vietnamese: word.vietnamese || word.english,
          traditional: word.traditional
        };
      });

      res.json({
        words,
        totalWords: words.length,
        deckId: deckId || null,
        hskLevel: hskLevelNum
      });
    } catch (error) {
      console.error('Lỗi tạo writing session:', error);
      res.status(500).json({
        error: 'Có lỗi xảy ra khi tạo writing session'
      });
    }
  }

  // Lưu tiến độ luyện viết (optional)
  async saveWritingProgress(req: AuthRequest, res: Response) {
    try {
      const { wordId, accuracy, strokesCorrect } = req.body;
      const userId = req.user!.id;

      // Có thể lưu vào database nếu cần track progress
      // Hiện tại chỉ return success
      res.json({
        message: 'Đã lưu tiến độ luyện viết',
        wordId,
        accuracy,
        strokesCorrect
      });
    } catch (error) {
      console.error('Lỗi lưu writing progress:', error);
      res.status(500).json({
        error: 'Có lỗi xảy ra khi lưu tiến độ'
      });
    }
  }
}

