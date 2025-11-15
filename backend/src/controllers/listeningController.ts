import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../types';

export class ListeningController {
  // Tạo bài luyện nghe
  async createListeningSession(req: AuthRequest, res: Response) {
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
          error: 'Không tìm thấy thẻ nào để luyện nghe'
        });
      }

      // Shuffle và lấy số lượng cần thiết
      const shuffled = flashcards.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(countNum, shuffled.length));

      // Tạo listening questions
      const allWordIds = selected.map(f => f.word.id);
      const allWordsForOptions = await prisma.chineseWord.findMany({
        where: {
          id: { notIn: allWordIds },
          hskLevel: hskLevelNum || undefined
        },
        take: 50
      });

      const questions = await Promise.all(
        selected.map(async (flashcard, index) => {
          const word = flashcard.word;
          
          // Lấy distractors
          const distractors = allWordsForOptions
            .filter(w => w.hskLevel === (word.hskLevel || null))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => ({
              id: w.id,
              simplified: w.simplified,
              pinyin: w.pinyinTone || w.pinyin,
              vietnamese: w.vietnamese || w.english,
              isCorrect: false
            }));

          // Nếu không đủ distractors cùng HSK level, lấy từ level khác
          if (distractors.length < 3) {
            const additional = allWordsForOptions
              .filter(w => !distractors.some(d => d.id === w.id))
              .sort(() => Math.random() - 0.5)
              .slice(0, 3 - distractors.length)
              .map(w => ({
                id: w.id,
                simplified: w.simplified,
                pinyin: w.pinyinTone || w.pinyin,
                vietnamese: w.vietnamese || w.english,
                isCorrect: false
              }));
            distractors.push(...additional);
          }

          // Tạo đáp án đúng
          const correctAnswer = {
            id: word.id,
            simplified: word.simplified,
            pinyin: word.pinyinTone || word.pinyin,
            vietnamese: word.vietnamese || word.english,
            isCorrect: true
          };

          // Trộn các đáp án
          const options = [correctAnswer, ...distractors.slice(0, 3)]
            .sort(() => Math.random() - 0.5);

          return {
            id: `listening-${index}`,
            flashcardId: flashcard.id,
            wordId: word.id,
            wordToListen: word.simplified, // Từ cần nghe
            pinyin: word.pinyinTone || word.pinyin,
            options: options.map((opt, i) => ({
              id: `option-${index}-${i}`,
              simplified: opt.simplified,
              pinyin: opt.pinyin,
              vietnamese: opt.vietnamese,
              isCorrect: opt.isCorrect,
              wordId: opt.id
            }))
          };
        })
      );

      res.json({
        questions,
        totalQuestions: questions.length,
        deckId: deckId || null,
        hskLevel: hskLevelNum
      });
    } catch (error) {
      console.error('Lỗi tạo listening session:', error);
      res.status(500).json({
        error: 'Có lỗi xảy ra khi tạo listening session'
      });
    }
  }

  // Submit kết quả listening
  async submitListening(req: AuthRequest, res: Response) {
    try {
      const { answers } = req.body;
      const userId = req.user!.id;

      if (!Array.isArray(answers)) {
        return res.status(400).json({
          error: 'Answers phải là một array'
        });
      }

      // Tính điểm
      const totalQuestions = answers.length;
      const correctAnswers = answers.filter((a: any) => a.isCorrect).length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      let grade = 'Cần cố gắng';
      if (score >= 90) grade = 'Xuất sắc';
      else if (score >= 80) grade = 'Tốt';
      else if (score >= 70) grade = 'Khá';
      else if (score >= 60) grade = 'Trung bình';

      res.json({
        score,
        correctAnswers,
        totalQuestions,
        grade,
        answers
      });
    } catch (error) {
      console.error('Lỗi submit listening:', error);
      res.status(500).json({
        error: 'Có lỗi xảy ra khi submit listening'
      });
    }
  }
}

