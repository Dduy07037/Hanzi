import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { flashcardService } from '../services/flashcardService';
import { FlashcardDeck } from '../types';
import toast from 'react-hot-toast';

interface QuizQuestion {
  id: string;
  flashcardId: string;
  wordId: string;
  question: string;
  pinyin: string;
  answers: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    wordId: string;
  }>;
}

interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  grade: string;
  answers: any[];
}

const Quiz: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>('');
  const [selectedHSK, setSelectedHSK] = useState<number | ''>('');
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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

  const startQuiz = async () => {
    if (!selectedDeck && !selectedHSK) {
      toast.error('Vui lòng chọn bộ thẻ hoặc cấp độ HSK');
      return;
    }

    setIsCreating(true);
    try {
      const params: any = { count: questionCount };
      if (selectedDeck) params.deckId = selectedDeck;
      if (selectedHSK) params.hskLevel = selectedHSK;

      const data = await flashcardService.createQuiz(params);
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResult(false);
      setResult(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tạo quiz');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = async () => {
    setIsLoading(true);
    try {
      const answers = questions.map(q => {
        const selectedAnswerId = selectedAnswers[q.id];
        const selectedAnswer = q.answers.find(a => a.id === selectedAnswerId);
        return {
          questionId: q.id,
          selectedAnswerId: selectedAnswerId || null,
          isCorrect: selectedAnswer?.isCorrect || false
        };
      });

      const result = await flashcardService.submitQuiz(answers);
      setResult(result);
      setShowResult(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể submit quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResult(false);
    setResult(null);
  };

  if (questions.length === 0 && !showResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz từ vựng
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kiểm tra kiến thức từ vựng của bạn
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
              onClick={startQuiz}
              disabled={isCreating}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang tạo quiz...
                </>
              ) : (
                <>
                  Bắt đầu quiz
                  <ArrowRight className="w-5 h-5 ml-2" />
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
            Kết quả Quiz
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

          {/* Chi tiết từng câu */}
          <div className="mt-8 text-left space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chi tiết câu trả lời:
            </h3>
            {questions.map((q, index) => {
              const selectedAnswerId = selectedAnswers[q.id];
              const selectedAnswer = q.answers.find(a => a.id === selectedAnswerId);
              const isCorrect = selectedAnswer?.isCorrect || false;

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
                        Câu {index + 1}: {q.question}
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
                      Đáp án của bạn: {selectedAnswer?.text || 'Chưa chọn'}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Đáp án đúng: {q.answers.find(a => a.isCorrect)?.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={resetQuiz}
            className="mt-8 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Làm lại quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswerId = selectedAnswers[currentQuestion.id];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quiz từ vựng
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
        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 chinese-large">
            {currentQuestion.question}
          </h2>
          <p className="text-2xl text-primary-600 dark:text-primary-400 font-medium">
            {currentQuestion.pinyin}
          </p>
        </div>

        {/* Answers */}
        <div className="space-y-3 mb-8">
          {currentQuestion.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswerId === answer.id
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              <span className="text-gray-900 dark:text-white">{answer.text}</span>
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
            disabled={!selectedAnswerId}
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

export default Quiz;

