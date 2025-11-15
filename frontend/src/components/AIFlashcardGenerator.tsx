import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, Plus, X } from 'lucide-react';
import { aiFlashcardService, GenerateFlashcardsResponse } from '../services/aiFlashcardService';
import toast from 'react-hot-toast';

interface AIFlashcardGeneratorProps {
  onDeckCreated: () => void;
  onClose: () => void;
}

const AIFlashcardGenerator: React.FC<AIFlashcardGeneratorProps> = ({ onDeckCreated, onClose }) => {
  const [description, setDescription] = useState('');
  const [count, setCount] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<GenerateFlashcardsResponse | null>(null);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [deckName, setDeckName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả cho bộ thẻ');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiFlashcardService.generateFromDescription({
        description: description.trim(),
        count
      });
      setPreview(result);
      setDeckName(result.suggestedDeckName);
      // Tự động chọn tất cả từ tìm được
      setSelectedWords(new Set(result.foundWords.map(w => w.id)));
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tạo bộ thẻ từ AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleWordSelection = (wordId: string) => {
    const newSelected = new Set(selectedWords);
    if (newSelected.has(wordId)) {
      newSelected.delete(wordId);
    } else {
      newSelected.add(wordId);
    }
    setSelectedWords(newSelected);
  };

  const selectAll = () => {
    if (preview) {
      setSelectedWords(new Set(preview.foundWords.map(w => w.id)));
    }
  };

  const deselectAll = () => {
    setSelectedWords(new Set());
  };

  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      toast.error('Vui lòng nhập tên bộ thẻ');
      return;
    }

    if (selectedWords.size === 0) {
      toast.error('Vui lòng chọn ít nhất một từ');
      return;
    }

    setIsCreating(true);
    try {
      await aiFlashcardService.createDeckFromPreview({
        deckName: deckName.trim(),
        description: description.trim(),
        wordIds: Array.from(selectedWords)
      });
      toast.success('Tạo bộ thẻ thành công!');
      onDeckCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tạo bộ thẻ');
    } finally {
      setIsCreating(false);
    }
  };

  if (preview) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Xem trước bộ thẻ
          </h3>
          <button
            onClick={() => {
              setPreview(null);
              setSelectedWords(new Set());
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tìm thấy</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {preview.totalFound}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Đã chọn</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {selectedWords.size}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Không tìm thấy</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {preview.notFoundWords.length}
            </p>
          </div>
        </div>

        {/* Deck name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tên bộ thẻ
          </label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Nhập tên bộ thẻ"
          />
        </div>

        {/* Selection controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Chọn tất cả
            </button>
            <button
              onClick={deselectAll}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Bỏ chọn tất cả
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedWords.size} / {preview.foundWords.length} từ được chọn
          </p>
        </div>

        {/* Words list */}
        <div className="max-h-96 overflow-y-auto mb-6 space-y-2">
          {preview.foundWords.map((word) => (
            <div
              key={word.id}
              onClick={() => toggleWordSelection(word.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedWords.has(word.id)
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {word.simplified}
                    </span>
                    {selectedWords.has(word.id) && (
                      <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                    {word.pinyinTone || word.pinyin}
                  </p>
                  {word.vietnamese ? (
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                      {word.vietnamese}
                    </p>
                  ) : null}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {word.english}
                  </p>
                  {word.hskLevel && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                      HSK {word.hskLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Not found words */}
          {preview.notFoundWords.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Các từ không tìm thấy trong database:
              </p>
              <div className="space-y-1">
                {preview.notFoundWords.map((word, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm text-gray-600 dark:text-gray-400"
                  >
                    {word.simplified} ({word.pinyin}) - {word.english}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setPreview(null);
              setSelectedWords(new Set());
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleCreateDeck}
            disabled={isCreating || selectedWords.size === 0}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Tạo bộ thẻ ({selectedWords.size} từ)
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Tạo bộ thẻ bằng AI
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mô tả bộ thẻ bạn muốn tạo
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ví dụ: Từ vựng HSK 1 về gia đình, Từ vựng về màu sắc, Từ vựng HSK 2 về thời tiết..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={4}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Mô tả càng chi tiết, AI sẽ tạo bộ thẻ càng phù hợp
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Số lượng từ (5-50)
          </label>
          <input
            type="number"
            min="5"
            max="50"
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(5, parseInt(e.target.value) || 20)))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !description.trim()}
          className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tạo bộ thẻ...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Tạo bộ thẻ bằng AI
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIFlashcardGenerator;

