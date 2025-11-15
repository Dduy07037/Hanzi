import { apiClient } from '../config/api';

export interface ListeningQuestion {
  id: string;
  flashcardId: string;
  wordId: string;
  wordToListen: string;
  pinyin: string;
  options: Array<{
    id: string;
    simplified: string;
    pinyin: string;
    vietnamese: string;
    isCorrect: boolean;
    wordId: string;
  }>;
}

export interface ListeningSession {
  questions: ListeningQuestion[];
  totalQuestions: number;
  deckId: string | null;
  hskLevel: number | null;
}

export interface ListeningResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  grade: string;
  answers: any[];
}

export const listeningService = {
  async createSession(params?: { deckId?: string; hskLevel?: number; count?: number }): Promise<ListeningSession> {
    const response = await apiClient.get<ListeningSession>('/listening/session', { params });
    return response.data;
  },

  async submitListening(answers: any[]): Promise<ListeningResult> {
    const response = await apiClient.post<ListeningResult>('/listening/submit', { answers });
    return response.data;
  },
};

