import { apiClient } from '../config/api';
import { ChineseWord } from '../types';

export interface GenerateFlashcardsRequest {
  description: string;
  count?: number;
  deckName?: string;
}

export interface GenerateFlashcardsResponse {
  preview: boolean;
  description: string;
  suggestedDeckName: string;
  foundWords: ChineseWord[];
  notFoundWords: Array<{
    simplified: string;
    pinyin: string;
    english: string;
    hskLevel?: number;
  }>;
  totalFound: number;
  totalRequested: number;
}

export interface CreateDeckFromPreviewRequest {
  deckName: string;
  description?: string;
  wordIds: string[];
}

export interface CreateDeckFromPreviewResponse {
  message: string;
  deck: {
    id: string;
    name: string;
    description?: string;
    _count: {
      flashcards: number;
    };
  };
  flashcardsCreated: number;
  totalRequested: number;
}

export const aiFlashcardService = {
  async generateFromDescription(data: GenerateFlashcardsRequest): Promise<GenerateFlashcardsResponse> {
    const response = await apiClient.post<GenerateFlashcardsResponse>('/ai-flashcards/generate', data);
    return response.data;
  },

  async createDeckFromPreview(data: CreateDeckFromPreviewRequest): Promise<CreateDeckFromPreviewResponse> {
    const response = await apiClient.post<CreateDeckFromPreviewResponse>('/ai-flashcards/create', data);
    return response.data;
  },
};

