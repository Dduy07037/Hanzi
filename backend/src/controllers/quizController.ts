import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../types';

export class QuizController {
  // Tạo quiz với các câu hỏi ngẫu nhiên
  async createQuiz(req: AuthRequest, res: Response) {
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
          error: 'Không tìm thấy thẻ nào để tạo quiz'
        });
      }

      // Shuffle và lấy số lượng cần thiết
      const shuffled = flashcards.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(countNum, shuffled.length));

      // Lấy tất cả từ để làm distractors (một lần query)
      const allWordIds = selected.map(f => f.word.id);
      const allWordsForDistractors = await prisma.chineseWord.findMany({
        where: {
          id: { notIn: allWordIds },
          hskLevel: hskLevelNum || undefined
        },
        take: 50 // Lấy nhiều hơn để có đủ distractors
      });

      // Tạo quiz questions
      const questions = await Promise.all(
        selected.map(async (flashcard, index) => {
          const word = flashcard.word;
          
          // Lấy distractors từ pool đã lấy
          const distractors = allWordsForDistractors
            .filter(w => w.hskLevel === (word.hskLevel || null))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => ({
              id: w.id,
              text: w.vietnamese || w.english,
              isCorrect: false
            }));

          // Nếu không đủ distractors cùng HSK level, lấy từ level khác
          if (distractors.length < 3) {
            const additional = allWordsForDistractors
              .filter(w => !distractors.some(d => d.id === w.id))
              .sort(() => Math.random() - 0.5)
              .slice(0, 3 - distractors.length)
              .map(w => ({
                id: w.id,
                text: w.vietnamese || w.english,
                isCorrect: false
              }));
            distractors.push(...additional);
          }

          // Tạo đáp án đúng
          const correctAnswer = {
            id: word.id,
            text: word.vietnamese || word.english,
            isCorrect: true
          };

          // Trộn các đáp án
          const answers = [correctAnswer, ...distractors.slice(0, 3)]
            .sort(() => Math.random() - 0.5);

          return {
            id: `question-${index}`,
            flashcardId: flashcard.id,
            wordId: word.id,
            question: word.simplified,
            pinyin: word.pinyinTone || word.pinyin,
            answers: answers.map((a, i) => ({
              id: `answer-${index}-${i}`,
              text: a.text,
              isCorrect: a.isCorrect,
              wordId: a.id
            }))
          };
        })
      );

      // Lưu quiz session (optional, có thể bỏ qua nếu không cần lưu)
      res.json({
        questions,
        totalQuestions: questions.length,
        deckId: deckId || null,
        hskLevel: hskLevelNum
      });
    } catch (error) {
      console.error('Lỗi tạo quiz:', error);
      res.status(500).json({
        error: 'Có lỗi xảy ra khi tạo quiz'
      });
    }
  }

  // Submit kết quả quiz
  async submitQuiz(req: AuthRequest, res: Response) {
    try {
      const { answers } = req.body; // Array of { questionId, selectedAnswerId, isCorrect }
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

      // Phân loại kết quả
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
      console.error('Lỗi submit quiz:', error);
      res.status(500).json({
        error: 'Có lỗi xảy ra khi submit quiz'
      });
    }
  }
}

