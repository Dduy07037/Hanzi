import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Play, Pause } from 'lucide-react';
import { listeningService, ListeningQuestion, ListeningResult } from '../services/listeningService';
import { flashcardService } from '../services/flashcardService';
import { FlashcardDeck } from '../types';
import toast from 'react-hot-toast';

const Listening: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>('');
  const [selectedHSK, setSelectedHSK] = useState<number | ''>('');
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ListeningResult | null>(null);
  const [, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.8);

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

  const startListening = async () => {
    if (!selectedDeck && !selectedHSK) {
      toast.error('Vui lòng chọn bộ thẻ hoặc cấp độ HSK');
      return;
    }

    setIsCreating(true);
    try {
      const params: any = { count: questionCount };
      if (selectedDeck) params.deckId = selectedDeck;
      if (selectedHSK) params.hskLevel = selectedHSK;

      const data = await listeningService.createSession(params);
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResult(false);
      setResult(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tạo listening session');
    } finally {
      setIsCreating(false);
    }
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      // Dừng audio hiện tại nếu có
      speechSynthesis.cancel();
      
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = playbackSpeed;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error('Không thể phát âm. Vui lòng thử lại.');
      };
      
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Trình duyệt không hỗ trợ phát âm');
    }
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      stopAudio(); // Dừng audio khi chuyển câu
    } else {
      submitListening();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      stopAudio();
    }
  };

  const submitListening = async () => {
    setIsLoading(true);
    try {
      const answers = questions.map(q => {
        const selectedOptionId = selectedAnswers[q.id];
        const selectedOption = q.options.find(o => o.id === selectedOptionId);
        return {
          questionId: q.id,
          selectedOptionId: selectedOptionId || null,
          isCorrect: selectedOption?.isCorrect || false
        };
      });

      const result = await listeningService.submitListening(answers);
      setResult(result);
      setShowResult(true);
      stopAudio();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể submit listening');
    } finally {
      setIsLoading(false);
    }
  };

  const resetListening = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResult(false);
    setResult(null);
    stopAudio();
  };

  if (questions.length === 0 && !showResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Luyện nghe
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Nghe và chọn từ đúng
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

            {/* Số câu hỏi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số câu hỏi
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={startListening}
              disabled={isCreating}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang tạo bài luyện nghe...
                </>
              ) : (
                <>
                  Bắt đầu luyện nghe
                  <Volume2 className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Kết quả Luyện nghe
          </h2>
          <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            {result.score}%
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {result.grade}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Đúng {result.correctAnswers} / {result.totalQuestions} câu
          </p>

          {/* Chi tiết */}
          <div className="mt-8 text-left space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chi tiết câu trả lời:
            </h3>
            {questions.map((q, index) => {
              const selectedOptionId = selectedAnswers[q.id];
              const selectedOption = q.options.find(o => o.id === selectedOptionId);
              const isCorrect = selectedOption?.isCorrect || false;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Câu {index + 1}: {q.wordToListen}
                      </p>
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        {q.pinyin}
                      </p>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Đáp án của bạn: {selectedOption?.simplified || 'Chưa chọn'} ({selectedOption?.vietnamese || ''})
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Đáp án đúng: {q.options.find(o => o.isCorrect)?.simplified} ({q.options.find(o => o.isCorrect)?.vietnamese})
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={resetListening}
            className="mt-8 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionId = selectedAnswers[currentQuestion.id];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Luyện nghe
          </h1>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Câu {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        {/* Audio Controls */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={() => isPlaying ? stopAudio() : playAudio(currentQuestion.wordToListen)}
              className="p-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Nhấn để nghe từ
          </p>
          
          {/* Speed control */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tốc độ:</span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{playbackSpeed.toFixed(1)}x</span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedOptionId === option.id
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {option.simplified}
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    {option.pinyin}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {option.vietnamese}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Câu trước
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedOptionId}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {currentQuestionIndex === questions.length - 1 ? (
              <>
                Nộp bài
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Câu tiếp
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listening;

