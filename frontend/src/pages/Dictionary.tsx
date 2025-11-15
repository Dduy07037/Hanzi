import React, { useState } from 'react';
import DictionarySearch from '../components/DictionarySearch';
import WordDetail from '../components/WordDetail';
import { ChineseWord } from '../types';

const Dictionary: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<ChineseWord | null>(null);

  const handleWordSelect = (word: ChineseWord) => {
    setSelectedWord(word);
  };

  const handleCloseDetail = () => {
    setSelectedWord(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tra cứu từ điển
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tìm kiếm từ vựng tiếng Trung bằng Hán tự, Pinyin, hoặc nghĩa tiếng Việt/Anh
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <DictionarySearch onWordSelect={handleWordSelect} showAddToFlashcard={true} />
      </div>

      {selectedWord && (
        <WordDetail word={selectedWord} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default Dictionary;
