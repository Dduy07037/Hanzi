export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface ExampleSentence {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  english: string;
}

export interface ChineseWord {
  id: string;
  simplified: string;
  traditional?: string;
  pinyin: string;
  pinyinTone?: string;
  english: string;
  vietnamese?: string;
  examples?: ExampleSentence[];
  hskLevel?: number;
  frequency?: number;
  createdAt?: Date;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
  _count?: {
    flashcards: number;
  };
  user?: {
    name: string;
  };
}

export interface Flashcard {
  id: string;
  deckId: string;
  wordId: string;
  createdAt: Date;
  updatedAt?: Date;
  word?: ChineseWord;
  deck?: {
    name: string;
  };
}

export interface FlashcardReview {
  id: string;
  interval: number;
  easeFactor: number;
  dueDate: Date;
  userId: string;
  flashcardId: string;
  createdAt?: Date;
  updatedAt?: Date;
  flashcard?: Flashcard;
}

export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
}

export interface DictionarySearchResponse {
  query: string;
  results: ChineseWord[];
  count: number;
}

export interface HSKWordsResponse {
  hskLevel: number;
  words: ChineseWord[];
  count: number;
}
