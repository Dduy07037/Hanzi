import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle, XCircle, AlertCircle, ThumbsUp } from 'lucide-react';
import { flashcardService } from '../services/flashcardService';
import { FlashcardReview } from '../types';
import toast from 'react-hot-toast';
import WordDetail from '../components/WordDetail';
import { ChineseWord } from '../types';

const Review: React.FC = () => {
  const [reviews, setReviews] = useState<FlashcardReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedWord, setSelectedWord] = useState<ChineseWord | null>(null);

  useEffect(() => {
    loadReviewCards();
  }, []);

  const loadReviewCards = async () => {
    try {
      setIsLoading(true);
      const data = await flashcardService.getReviewCards();
      setReviews(data);
      setCurrentIndex(0);
      setShowAnswer(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tải thẻ ôn tập');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuality = async (quality: number) => {
    if (currentIndex >= reviews.length) return;

    const currentReview = reviews[currentIndex];
    try {
      await flashcardService.updateReview({
        reviewId: currentReview.id,
        quality,
      });

      // Chuyển sang thẻ tiếp theo
      if (currentIndex < reviews.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Đã hết thẻ
        toast.success('Bạn đã hoàn thành tất cả thẻ ôn tập hôm nay!');
        loadReviewCards(); // Tải lại để xem có thẻ mới không
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể cập nhật kết quả ôn tập');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tuyệt vời!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bạn đã hoàn thành tất cả thẻ ôn tập hôm nay.
          </p>
          <button
            onClick={loadReviewCards}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Kiểm tra lại
          </button>
        </div>
      </div>
    );
  }

  const currentReview = reviews[currentIndex];
  const currentWord = currentReview.flashcard?.word;

  if (!currentWord) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy thông tin từ vựng
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ôn tập
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Thẻ {currentIndex + 1} / {reviews.length}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / reviews.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card Content */}
        <div className="text-center mb-8">
          {!showAnswer ? (
            // Question Side
            <div>
              <div className="mb-6">
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 chinese-large">
                  {currentWord.simplified}
                </h2>
                {currentWord.traditional && currentWord.traditional !== currentWord.simplified && (
                  <p className="text-2xl text-gray-600 dark:text-gray-400">
                    {currentWord.traditional}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowAnswer(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Xem đáp án
              </button>
            </div>
          ) : (
            // Answer Side
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-2 chinese-large">
                  {currentWord.simplified}
                </h2>
                {currentWord.traditional && currentWord.traditional !== currentWord.simplified && (
                  <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
                    {currentWord.traditional}
                  </p>
                )}
                <p className="text-2xl text-primary-600 dark:text-primary-400 font-medium mb-2">
                  {currentWord.pinyinTone || currentWord.pinyin}
                </p>
                {currentWord.vietnamese && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-medium">Tiếng Việt:</span> {currentWord.vietnamese}
                  </p>
                )}
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  <span className="font-medium">English:</span> {currentWord.english}
                </p>
                {currentWord.hskLevel && (
                  <span className="inline-block mt-2 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    HSK {currentWord.hskLevel}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedWord(currentWord)}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Xem chi tiết và thứ tự nét →
              </button>

              {/* Quality Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                <button
                  onClick={() => handleQuality(0)}
                  className="flex flex-col items-center space-y-2 px-4 py-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                  <span className="text-sm font-medium">Lại</span>
                </button>
                <button
                  onClick={() => handleQuality(1)}
                  className="flex flex-col items-center space-y-2 px-4 py-3 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                >
                  <AlertCircle className="w-6 h-6" />
                  <span className="text-sm font-medium">Khó</span>
                </button>
                <button
                  onClick={() => handleQuality(2)}
                  className="flex flex-col items-center space-y-2 px-4 py-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-sm font-medium">Tốt</span>
                </button>
                <button
                  onClick={() => handleQuality(3)}
                  className="flex flex-col items-center space-y-2 px-4 py-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <ThumbsUp className="w-6 h-6" />
                  <span className="text-sm font-medium">Dễ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedWord && (
        <WordDetail word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}
    </div>
  );
};

export default Review;
