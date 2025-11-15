import { apiClient } from '../config/api';
import { FlashcardDeck, Flashcard, FlashcardReview } from '../types';

interface CreateDeckRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
}

interface CreateDeckResponse {
  message: string;
  deck: FlashcardDeck;
}

interface AddFlashcardRequest {
  deckId: string;
  wordId: string;
}

interface AddFlashcardResponse {
  message: string;
  flashcard: Flashcard;
}

interface UpdateReviewRequest {
  reviewId: string;
  quality: number; // 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
}

interface UpdateReviewResponse {
  message: string;
  review: FlashcardReview;
}

export const flashcardService = {
  async createDeck(data: CreateDeckRequest): Promise<CreateDeckResponse> {
    const response = await apiClient.post<CreateDeckResponse>('/flashcards/decks', data);
    return response.data;
  },

  async getUserDecks(): Promise<FlashcardDeck[]> {
    const response = await apiClient.get<FlashcardDeck[]>('/flashcards/decks');
    return response.data;
  },

  async addFlashcard(data: AddFlashcardRequest): Promise<AddFlashcardResponse> {
    const response = await apiClient.post<AddFlashcardResponse>('/flashcards/cards', data);
    return response.data;
  },

  async getReviewCards(deckId?: string): Promise<FlashcardReview[]> {
    const params = deckId ? { deckId } : {};
    const response = await apiClient.get<FlashcardReview[]>('/flashcards/review', { params });
    return response.data;
  },

  async updateReview(data: UpdateReviewRequest): Promise<UpdateReviewResponse> {
    const response = await apiClient.post<UpdateReviewResponse>('/flashcards/review/update', data);
    return response.data;
  },

  async createQuiz(params?: { deckId?: string; hskLevel?: number; count?: number }): Promise<any> {
    const response = await apiClient.get('/flashcards/quiz', { params });
    return response.data;
  },

  async submitQuiz(answers: any[]): Promise<any> {
    const response = await apiClient.post('/flashcards/quiz/submit', { answers });
    return response.data;
  },
};
