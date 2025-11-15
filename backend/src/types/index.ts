import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface ChineseWord {
  id: string;
  simplified: string;
  traditional?: string;
  pinyin: string;
  pinyinTone?: string;
  english: string;
  vietnamese?: string;
  hskLevel?: number;
  frequency?: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
}

export interface Flashcard {
  id: string;
  deckId: string;
  wordId: string;
  createdAt: Date;
}

export interface FlashcardReview {
  id: string;
  interval: number;
  easeFactor: number;
  dueDate: Date;
  userId: string;
  flashcardId: string;
}

export interface AuthRequest extends Request {
  user?: User;
}