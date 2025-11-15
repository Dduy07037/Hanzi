import { apiClient } from '../config/api';

export interface WritingWord {
  id: string;
  flashcardId: string;
  wordId: string;
  character: string;
  pinyin: string;
  vietnamese: string;
  traditional?: string;
}

export interface WritingSession {
  words: WritingWord[];
  totalWords: number;
  deckId: string | null;
  hskLevel: number | null;
}

export const writingService = {
  async createSession(params?: { deckId?: string; hskLevel?: number; count?: number }): Promise<WritingSession> {
    const response = await apiClient.get<WritingSession>('/writing/session', { params });
    return response.data;
  },

  async saveProgress(wordId: string, accuracy: number, strokesCorrect: number): Promise<any> {
    const response = await apiClient.post('/writing/progress', {
      wordId,
      accuracy,
      strokesCorrect
    });
    return response.data;
  },
};

