import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../types';

export class StatsController {
  // Lấy thống kê học tập của người dùng
  async getLearningStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      // Tính toán các metrics
      const [
        totalFlashcards,
        totalDecks,
        reviewsToday,
        reviewsThisWeek,
        reviewsThisMonth,
        hskDistribution,
        wordsLearned,
        recentActivity
      ] = await Promise.all([
        // Tổng số thẻ flashcard
        prisma.flashcard.count({
          where: {
            deck: { userId }
          }
        }),

        // Tổng số bộ thẻ
        prisma.flashcardDeck.count({
          where: { userId }
        }),

        // Số thẻ đã ôn hôm nay
        prisma.flashcardReview.count({
          where: {
            userId,
            updatedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),

        // Số thẻ đã ôn tuần này
        prisma.flashcardReview.count({
          where: {
            userId,
            updatedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),

        // Số thẻ đã ôn tháng này
        prisma.flashcardReview.count({
          where: {
            userId,
            updatedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),

        // Phân bố theo HSK level
        prisma.flashcard.groupBy({
          by: ['wordId'],
          where: {
            deck: { userId }
          },
          _count: true
        }).then(async (grouped) => {
          const wordIds = grouped.map(g => g.wordId);
          const words = await prisma.chineseWord.findMany({
            where: { id: { in: wordIds } },
            select: { hskLevel: true }
          });

          const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 };
          words.forEach(word => {
            const level = word.hskLevel || 0;
            distribution[level] = (distribution[level] || 0) + 1;
          });
          return distribution;
        }),

        // Số từ đã học (có ít nhất 1 review)
        prisma.flashcardReview.findMany({
          where: { userId },
          select: { flashcardId: true },
          distinct: ['flashcardId']
        }).then(reviews => reviews.length),

        // Hoạt động gần đây (7 ngày qua)
        prisma.flashcardReview.findMany({
          where: {
            userId,
            updatedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          },
          select: {
            updatedAt: true
          },
          orderBy: { updatedAt: 'desc' }
        }).then(reviews => {
          // Nhóm theo ngày
          const activity: Record<string, number> = {};
          reviews.forEach(review => {
            const date = review.updatedAt.toISOString().split('T')[0];
            activity[date] = (activity[date] || 0) + 1;
          });
          return activity;
        })
      ]);

      // Tính streak (số ngày liên tiếp học)
      const allReviews = await prisma.flashcardReview.findMany({
        where: { userId },
        select: { updatedAt: true }
      });

      // Lấy danh sách ngày duy nhất đã học
      const studyDates = new Set<string>();
      allReviews.forEach(review => {
        const date = new Date(review.updatedAt);
        date.setHours(0, 0, 0, 0);
        studyDates.add(date.toISOString().split('T')[0]);
      });

      const sortedDates = Array.from(studyDates).sort().reverse(); // Từ mới đến cũ
      
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      
      // Nếu hôm nay đã học, bắt đầu từ hôm nay
      // Nếu chưa, bắt đầu từ hôm qua
      let currentDate = new Date(today);
      if (!sortedDates.includes(todayStr)) {
        currentDate.setDate(currentDate.getDate() - 1);
      }
      
      // Đếm số ngày liên tiếp
      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (sortedDates.includes(dateStr)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      res.json({
        totalFlashcards,
        totalDecks,
        wordsLearned,
        reviewsToday,
        reviewsThisWeek,
        reviewsThisMonth,
        streak,
        hskDistribution,
        recentActivity
      });
    } catch (error) {
      console.error('Lỗi lấy thống kê:', error);
      res.status(500).json({ 
        error: 'Có lỗi xảy ra khi lấy thống kê' 
      });
    }
  }
}

