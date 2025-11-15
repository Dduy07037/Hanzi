import React, { useState } from 'react';
import { ChineseWord } from '../types';
import HanziWriter from './HanziWriter';
import WordResult from './WordResult';
import ExampleSentence from './ExampleSentence';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface WordDetailProps {
  word: ChineseWord | null;
  onClose: () => void;
}

const WordDetail: React.FC<WordDetailProps> = ({ word, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'stroke'>('info');

  if (!word) return null;

  const addToFlashcard = async () => {
    try {
      // Hiển thị thông báo feature sắp tới
      toast.success('Tính năng thêm vào flashcard sẽ có trong bản cập nhật sắp tới!');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chi tiết từ
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Thông tin
          </button>
          <button
            onClick={() => setActiveTab('stroke')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'stroke'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Thứ tự nét
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' ? (
            <div className="space-y-6">
              {/* Word Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <WordResult word={word} compact={true} />
              </div>

              {/* Actions */}
              <div className="flex justify-center">
                <button
                  onClick={addToFlashcard}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Thêm vào Flashcard</span>
                </button>
              </div>

              {/* Examples Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Ví dụ sử dụng
                </h3>
                {word.examples && word.examples.length > 0 ? (
                  <div className="space-y-3">
                    {word.examples.map((example, index) => (
                      <ExampleSentence key={index} example={example} />
                    ))}
                  </div>
                ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                      Chưa có ví dụ sử dụng cho từ này.
                  </p>
                </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stroke Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {word.simplified.split('').map((char, index) => (
                  <div key={index} className="text-center">
                    <HanziWriter
                      character={char}
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Ký tự {index + 1}: {char}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordDetail;