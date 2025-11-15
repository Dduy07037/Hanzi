import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Eye, Sparkles } from 'lucide-react';
import { flashcardService } from '../services/flashcardService';
import { FlashcardDeck } from '../types';
import toast from 'react-hot-toast';
import DictionarySearch from '../components/DictionarySearch';
import { ChineseWord } from '../types';
import AIFlashcardGenerator from '../components/AIFlashcardGenerator';

const Flashcards: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setIsLoading(true);
      const data = await flashcardService.getUserDecks();
      setDecks(data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tải danh sách bộ thẻ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) {
      toast.error('Vui lòng nhập tên bộ thẻ');
      return;
    }

    try {
      await flashcardService.createDeck({
        name: newDeckName,
        description: newDeckDescription || undefined,
        isPublic: false,
      });
      toast.success('Tạo bộ thẻ thành công!');
      setNewDeckName('');
      setNewDeckDescription('');
      setShowCreateDeck(false);
      loadDecks();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tạo bộ thẻ');
    }
  };

  const handleAddCard = async (word: ChineseWord) => {
    if (!selectedDeck) return;

    try {
      await flashcardService.addFlashcard({
        deckId: selectedDeck.id,
        wordId: word.id,
      });
      toast.success('Thêm thẻ thành công!');
      setShowAddCard(false);
      setSelectedDeck(null);
      loadDecks();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể thêm thẻ');
    }
  };

  if (showAddCard && selectedDeck) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => {
              setShowAddCard(false);
              setSelectedDeck(null);
            }}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 mb-4"
          >
            ← Quay lại
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Thêm thẻ vào: {selectedDeck.name}
          </h2>
        </div>
        <DictionarySearch
          onWordSelect={handleAddCard}
          showAddToFlashcard={false}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Flashcards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý các bộ thẻ flashcard của bạn
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAIGenerator(!showAIGenerator)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            <span>Tạo bằng AI</span>
          </button>
          <button
            onClick={() => setShowCreateDeck(!showCreateDeck)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo bộ thẻ mới</span>
          </button>
        </div>
      </div>

      {showAIGenerator && (
        <div className="mb-6">
          <AIFlashcardGenerator
            onDeckCreated={loadDecks}
            onClose={() => setShowAIGenerator(false)}
          />
        </div>
      )}

      {showCreateDeck && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Tạo bộ thẻ mới
          </h2>
          <form onSubmit={handleCreateDeck}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tên bộ thẻ *
                </label>
                <input
                  type="text"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="Ví dụ: HSK 1, Từ vựng hàng ngày..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  value={newDeckDescription}
                  onChange={(e) => setNewDeckDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Mô tả về bộ thẻ này..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Tạo bộ thẻ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateDeck(false);
                    setNewDeckName('');
                    setNewDeckDescription('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bạn chưa có bộ thẻ nào. Hãy tạo bộ thẻ đầu tiên!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {deck.name}
                  </h3>
                  {deck.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {deck.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {deck._count?.flashcards || 0} thẻ
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedDeck(deck);
                    setShowAddCard(true);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm thẻ</span>
                </button>
                <button
                  className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
