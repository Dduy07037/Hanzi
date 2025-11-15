import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle, ArrowRight, Volume2 } from 'lucide-react';
import { writingService, WritingWord } from '../services/writingService';
import { flashcardService } from '../services/flashcardService';
import { FlashcardDeck } from '../types';
import HanziWriter from '../components/HanziWriter';
import toast from 'react-hot-toast';

const Writing: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>('');
  const [selectedHSK, setSelectedHSK] = useState<number | ''>('');
  const [wordCount, setWordCount] = useState(10);
  const [words, setWords] = useState<WritingWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'trace' | 'free'>('trace');

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const data = await flashcardService.getUserDecks();
      setDecks(data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tải danh sách bộ thẻ');
    }
  };

  const startWriting = async () => {
    if (!selectedDeck && !selectedHSK) {
      toast.error('Vui lòng chọn bộ thẻ hoặc cấp độ HSK');
      return;
    }

    setIsCreating(true);
    try {
      const params: any = { count: wordCount };
      if (selectedDeck) params.deckId = selectedDeck;
      if (selectedHSK) params.hskLevel = selectedHSK;

      const data = await writingService.createSession(params);
      setWords(data.words);
      setCurrentWordIndex(0);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tạo writing session');
    } finally {
      setIsCreating(false);
    }
  };

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      toast.success('Bạn đã hoàn thành tất cả từ!');
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  const handleReset = () => {
    // Reset sẽ được xử lý bởi component re-render
    setCurrentWordIndex(currentWordIndex); // Trigger re-render
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const resetWriting = () => {
    setWords([]);
    setCurrentWordIndex(0);
  };

  if (words.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Luyện viết Hán tự
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Luyện viết chữ Hán đúng thứ tự nét
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            {/* Chọn bộ thẻ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chọn bộ thẻ (tùy chọn)
              </label>
              <select
                value={selectedDeck}
                onChange={(e) => setSelectedDeck(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Tất cả bộ thẻ</option>
                {decks.map(deck => (
                  <option key={deck.id} value={deck.id}>
                    {deck.name} ({deck._count?.flashcards || 0} thẻ)
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn HSK level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cấp độ HSK (tùy chọn)
              </label>
              <select
                value={selectedHSK}
                onChange={(e) => setSelectedHSK(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Tất cả cấp độ</option>
                {[1, 2, 3, 4, 5, 6].map(level => (
                  <option key={level} value={level}>
                    HSK {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Số từ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số từ
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Practice mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chế độ luyện tập
              </label>
              <select
                value={practiceMode}
                onChange={(e) => setPracticeMode(e.target.value as 'trace' | 'free')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="trace">Viết theo nét mờ (Trace)</option>
                <option value="free">Viết tự do (Free)</option>
              </select>
            </div>

            <button
              onClick={startWriting}
              disabled={isCreating}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang tạo bài luyện viết...
                </>
              ) : (
                <>
                  Bắt đầu luyện viết
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const characters = currentWord.character.split('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Luyện viết Hán tự
          </h1>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Từ {currentWordIndex + 1} / {words.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        {/* Word Info */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white chinese-large">
              {currentWord.character}
            </h2>
            <button
              onClick={() => speak(currentWord.character)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Phát âm"
            >
              <Volume2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <p className="text-2xl text-primary-600 dark:text-primary-400 font-medium mb-2">
            {currentWord.pinyin}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {currentWord.vietnamese}
          </p>
          {currentWord.traditional && currentWord.traditional !== currentWord.character && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Phồn thể: {currentWord.traditional}
            </p>
          )}
        </div>

        {/* Writing Area */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Viết theo thứ tự nét
            </h3>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <HanziWriter
                    character={char}
                    width={200}
                    height={200}
                    className="mx-auto"
                    showOutline={practiceMode === 'trace'}
                    quiz={practiceMode === 'free'}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Ký tự {index + 1}: {char}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentWordIndex === 0}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Từ trước
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            {currentWordIndex === words.length - 1 ? (
              <>
                Hoàn thành
                <CheckCircle className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Từ tiếp
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Writing;

