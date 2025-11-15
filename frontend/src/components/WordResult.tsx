import React from 'react';
import { Volume2, Plus } from 'lucide-react';
import { ChineseWord } from '../types';
import toast from 'react-hot-toast';

interface WordResultProps {
  word: ChineseWord;
  onClick?: () => void;
  showAddToFlashcard?: boolean;
  compact?: boolean;
}

const WordResult: React.FC<WordResultProps> = ({ 
  word, 
  onClick, 
  showAddToFlashcard = false,
  compact = false 
}) => {
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const addToFlashcard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Hiển thị popup chọn deck (sẽ implement sau)
      toast.success('Tính năng đang phát triển. Sẽ có trong bản cập nhật sắp tới!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm vào flashcard');
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
                p-4 hover:shadow-md transition-shadow cursor-pointer
                ${onClick ? 'hover:border-primary-300 dark:hover:border-primary-600' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Chinese Character */}
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {word.simplified}
            </h3>
            {word.traditional && word.traditional !== word.simplified && (
              <span className="text-lg text-gray-600 dark:text-gray-400">
                ({word.traditional})
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(word.simplified);
              }}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Phát âm"
            >
              <Volume2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Pinyin */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {word.pinyinTone || word.pinyin}
            </span>
            {word.hskLevel && (
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                HSK {word.hskLevel}
              </span>
            )}
          </div>

          {/* Meanings */}
          <div className="space-y-1">
            {word.vietnamese ? (
              <p className="text-base font-semibold text-green-600 dark:text-green-400 mb-1">
                {word.vietnamese}
              </p>
            ) : null}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400">English:</span> {word.english}
            </p>
            {word.vietnamese && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                Có tiếng Việt
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {showAddToFlashcard && (
            <button
              onClick={addToFlashcard}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Thêm vào flashcard"
            >
              <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordResult;