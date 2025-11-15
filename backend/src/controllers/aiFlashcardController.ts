import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../types';
import { geminiService } from '../services/geminiService';

export class AIFlashcardController {
  // Tạo bộ thẻ từ mô tả bằng AI
  async generateFromDescription(req: AuthRequest, res: Response) {
    try {
      const { description, count = 20, deckName } = req.body;
      const userId = req.user!.id;

      if (!description || !description.trim()) {
        return res.status(400).json({
          error: 'Vui lòng nhập mô tả cho bộ thẻ'
        });
      }

      if (!geminiService.isAvailable()) {
        return res.status(503).json({
          error: 'AI service chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào .env'
        });
      }

      // Generate words từ AI
      const aiWords = await geminiService.generateFlashcardsFromDescription(
        description,
        parseInt(count) || 20
      );

      if (!aiWords || aiWords.length === 0) {
        return res.status(500).json({
          error: 'Không thể tạo từ vựng từ mô tả. Vui lòng thử lại với mô tả khác.'
        });
      }

      // Tìm các từ trong database
      const foundWords: any[] = [];
      const notFoundWords: any[] = [];

      for (const aiWord of aiWords) {
        // Tìm theo simplified và pinyin
        const word = await prisma.chineseWord.findFirst({
          where: {
            simplified: aiWord.simplified,
            pinyin: {
              equals: aiWord.pinyin,
              mode: 'insensitive'
            }
          }
        });

        if (word) {
          foundWords.push({
            ...word,
            aiSuggested: true
          });
        } else {
          // Thử tìm chỉ theo simplified
          const wordBySimplified = await prisma.chineseWord.findFirst({
            where: {
              simplified: aiWord.simplified
            }
          });

          if (wordBySimplified) {
            foundWords.push({
              ...wordBySimplified,
              aiSuggested: true
            });
          } else {
            notFoundWords.push(aiWord);
          }
        }
      }

      // Trả về preview (chưa tạo deck)
      res.json({
        preview: true,
        description,
        suggestedDeckName: deckName || `Bộ thẻ: ${description}`,
        foundWords: foundWords.map(w => ({
          id: w.id,
          simplified: w.simplified,
          traditional: w.traditional,
          pinyin: w.pinyin,
          pinyinTone: w.pinyinTone,
          english: w.english,
          vietnamese: w.vietnamese,
          hskLevel: w.hskLevel,
          frequency: w.frequency
        })),
        notFoundWords,
        totalFound: foundWords.length,
        totalRequested: aiWords.length
      });
    } catch (error) {
      console.error('Lỗi generate flashcards từ AI:', error);
      res.status(500).json({
        error: 'Có lỗi xảy ra khi tạo bộ thẻ từ AI'
      });
    }
  }

  // Tạo deck và thêm flashcards từ preview
  async createDeckFromPreview(req: AuthRequest, res: Response) {
    try {
      const { deckName, description, wordIds } = req.body;
      const userId = req.user!.id;

      if (!deckName || !wordIds || !Array.isArray(wordIds) || wordIds.length === 0) {
        return res.status(400).json({
          error: 'Vui lòng nhập tên bộ thẻ và chọn ít nhất một từ'
        });
      }

      // Tạo deck
      const deck = await prisma.flashcardDeck.create({
        data: {
          name: deckName,
          description: description || null,
          userId
        }
      });

      // Tạo flashcards
      const flashcards = [];
      for (const wordId of wordIds) {
        // Kiểm tra xem từ đã có trong deck chưa
        const existing = await prisma.flashcard.findFirst({
          where: {
            deckId: deck.id,
            wordId
          }
        });

        if (!existing) {
          const flashcard = await prisma.flashcard.create({
            data: {
              deckId: deck.id,
              wordId
            },
            include: {
              word: true
            }
          });

          // Tạo bản ghi review ban đầu
          await prisma.flashcardReview.create({
            data: {
              interval: 1,
              easeFactor: 2.5,
              dueDate: new Date(),
              userId,
              flashcardId: flashcard.id
            }
          });

          flashcards.push(flashcard);
        }
      }

      res.status(201).json({
        message: 'Tạo bộ thẻ thành công',
        deck: {
          ...deck,
          _count: {
            flashcards: flashcards.length
          }
        },
        flashcardsCreated: flashcards.length,
        totalRequested: wordIds.length
      });
    } catch (error) {
      console.error('Lỗi tạo deck từ preview:', error);
      res.status(500).json({
        error: 'Có lỗi xảy ra khi tạo bộ thẻ'
      });
    }
  }
}

