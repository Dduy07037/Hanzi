import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { dictionaryService } from '../services/dictionaryService';
import { ChineseWord } from '../types';
import WordResult from './WordResult';

interface DictionarySearchProps {
  onWordSelect?: (word: ChineseWord) => void;
  showAddToFlashcard?: boolean;
}

const DictionarySearch: React.FC<DictionarySearchProps> = ({ 
  onWordSelect, 
  showAddToFlashcard = false 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ChineseWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [vietnameseOnly, setVietnameseOnly] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await dictionaryService.search(query, vietnameseOnly ? 'vi' : undefined);
      setResults(response.results);
      setHasSearched(true);
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query.length > 1) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setHasSearched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, vietnameseOnly]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="w-full">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập từ cần tra cứu (Hán tự, Pinyin, hoặc nghĩa)..."
            className="w-full px-4 py-3 pl-12 pr-4 text-lg border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                           w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        {/* Filter Toggle */}
        <div className="mt-3 flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={vietnameseOnly}
              onChange={(e) => setVietnameseOnly(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Chỉ hiển thị từ có tiếng Việt
            </span>
          </label>
        </div>
      </form>

      {/* Results */}
      <div className="mt-6">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Không tìm thấy kết quả cho "{query}"
            </p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tìm thấy {results.length} kết quả
            </p>
            {results.map((word) => (
              <WordResult
                key={word.id}
                word={word}
                onClick={() => onWordSelect?.(word)}
                showAddToFlashcard={showAddToFlashcard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionarySearch;