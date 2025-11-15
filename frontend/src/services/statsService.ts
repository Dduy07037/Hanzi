import { apiClient } from '../config/api';

export interface LearningStats {
  totalFlashcards: number;
  totalDecks: number;
  wordsLearned: number;
  reviewsToday: number;
  reviewsThisWeek: number;
  reviewsThisMonth: number;
  streak: number;
  hskDistribution: {
    [key: number]: number;
  };
  recentActivity: {
    [date: string]: number;
  };
}

export const statsService = {
  async getLearningStats(): Promise<LearningStats> {
    const response = await apiClient.get<LearningStats>('/stats/learning');
    return response.data;
  },
};

