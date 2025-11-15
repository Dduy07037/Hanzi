import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../types';

export class FlashcardController {
  // Tạo bộ thẻ mới
  async createDeck(req: AuthRequest, res: Response) {
    try {
      const { name, description, isPublic = false } = req.body;
      const userId = req.user!.id;

      if (!name) {
        return res.status(400).json({ 
          error: 'Vui lòng nhập tên bộ thẻ' 
        });
      }

      const deck = await prisma.flashcardDeck.create({
        data: {
          name,
          description,
          isPublic,
          userId
        }
      });

      res.status(201).json({
        message: 'Tạo bộ thẻ thành công',
        deck
      });
    } catch (error) {
      console.error('Lỗi tạo bộ thẻ:', error);
      res.status(500).json({ 
        error: 'Có lỗi xảy ra khi tạo bộ thẻ' 
      });
    }
  }

  // Lấy danh sách bộ thẻ của ngưởi dùng
  async getUserDecks(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const decks = await prisma.flashcardDeck.findMany({
        where: { 
          OR: [
            { userId },
            { isPublic: true }
          ]
        },
        include: {
          _count: {
            select: { flashcards: true }
          },
          user: {
            select: { name: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      res.json(decks);
    } catch (error) {
      console.error('Lỗi lấy danh sách bộ thẻ:', error);
      res.status(500).json({ 
        error: 'Có lỗi xảy ra khi lấy danh sách bộ thẻ' 
      });
    }
  }

  // Thêm thẻ mới vào bộ
  async addFlashcard(req: AuthRequest, res: Response) {
    try {
      const { deckId, wordId } = req.body;
      const userId = req.user!.id;

      // Kiểm tra quyền sở hữu bộ thẻ
      const deck = await prisma.flashcardDeck.findUnique({
        where: { id: deckId }
      });

      if (!deck || deck.userId !== userId) {
        return res.status(403).json({ 
          error: 'Bạn không có quyền thêm thẻ vào bộ này' 
        });
      }

      // Kiểm tra xem thẻ đã tồn tại chưa
      const existingFlashcard = await prisma.flashcard.findFirst({
        where: {
          deckId,
          wordId
        }
      });

      if (existingFlashcard) {
        return res.status(400).json({ 
          error: 'Thẻ này đã tồn tại trong bộ' 
        });
      }

      // Tạo thẻ mới
      const flashcard = await prisma.flashcard.create({
        data: {
          deckId,
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

      res.status(201).json({
        message: 'Thêm thẻ thành công',
        flashcard
      });
    } catch (error) {
      console.error('Lỗi thêm thẻ:', error);
      res.status(500).json({ 
        error: 'Có lỗi xảy ra khi thêm thẻ' 
      });
    }
  }

  // Lấy thẻ cần ôn tập hôm nay (SRS)
  async getReviewCards(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { deckId } = req.query;

      const whereClause: any = {
        userId,
        dueDate: {
          lte: new Date()
        }
      };

      if (deckId) {
        whereClause.flashcard = {
          deckId: deckId as string
        };
      }

      const reviews = await prisma.flashcardReview.findMany({
        where: whereClause,
        include: {
          flashcard: {
            include: {
              word: true,
              deck: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { dueDate: 'asc' }
      });

      res.json(reviews);
    } catch (error) {
      console.error('Lỗi lấy thẻ ôn tập:', error);
      res.status(500).json({ 
        error: 'Có lỗi xảy ra khi lấy thẻ ôn tập' 
      });
    }
  }

  // Cập nhật kết quả ôn tập (SM-2 algorithm)
  async updateReview(req: AuthRequest, res: Response) {
    try {
      const { reviewId, quality } = req.body;
      const userId = req.user!.id;

      // quality: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
      if (quality < 0 || quality > 3) {
        return res.status(400).json({ 
          error: 'Quality phải từ 0 đến 3' 
        });
      }

      const review = await prisma.flashcardReview.findUnique({
        where: { id: reviewId }
      });

      if (!review || review.userId !== userId) {
        return res.status(403).json({ 
          error: 'Không tìm thấy bản ghi ôn tập' 
        });
      }

      // Áp dụng thuật toán SM-2
      let { interval, easeFactor } = review;
      let newInterval: number;
      let newEaseFactor: number;

      if (quality < 2) {
        // Again or Hard
        newInterval = quality === 0 ? 1 : Math.round(interval * 1.2);
        newEaseFactor = Math.max(1.3, easeFactor - 0.15);
      } else if (quality === 2) {
        // Good
        newInterval = Math.round(interval * easeFactor);
        newEaseFactor = easeFactor;
      } else {
        // Easy
        newInterval = Math.round(interval * easeFactor * 1.3);
        newEaseFactor = easeFactor + 0.15;
      }

      // Tính toán ngày ôn tập tiếp theo
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + newInterval);

      // Cập nhật bản ghi review
      const updatedReview = await prisma.flashcardReview.update({
        where: { id: reviewId },
        data: {
          interval: newInterval,
          easeFactor: newEaseFactor,
          dueDate
        }
      });

      res.json({
        message: 'Cập nhật ôn tập thành công',
        review: updatedReview
      });
    } catch (error) {
      console.error('Lỗi cập nhật ôn tập:', error);
      res.status(500).json({ 
        error: 'Có lỗi xảy ra khi cập nhật ôn tập' 
      });
    }
  }
}