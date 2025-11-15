import { apiClient } from '../config/api';
import { ChineseWord, DictionarySearchResponse, HSKWordsResponse } from '../types';

export const dictionaryService = {
  async search(query: string, lang?: string): Promise<DictionarySearchResponse> {
    const params: any = { q: query };
    if (lang) {
      params.lang = lang;
    }
    const response = await apiClient.get<DictionarySearchResponse>('/dictionary/search', {
      params,
    });
    return response.data;
  },

  async getWordById(id: string): Promise<ChineseWord> {
    const response = await apiClient.get<ChineseWord>(`/dictionary/word/${id}`);
    return response.data;
  },

  async getWordsByHSK(level: number): Promise<HSKWordsResponse> {
    const response = await apiClient.get<HSKWordsResponse>(`/dictionary/hsk/${level}`);
    return response.data;
  },
};
