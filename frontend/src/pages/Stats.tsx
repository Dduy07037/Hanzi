import React, { useState, useEffect } from 'react';
import { BarChart3, BookOpen, TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { statsService, LearningStats } from '../services/statsService';
import toast from 'react-hot-toast';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await statsService.getLearningStats();
      setStats(data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tải thống kê');
    } finally {
      setIsLoading(false);
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

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Không thể tải thống kê
          </p>
        </div>
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho biểu đồ HSK
  const hskData = [
    { level: 'HSK 1', count: stats.hskDistribution[1] || 0 },
    { level: 'HSK 2', count: stats.hskDistribution[2] || 0 },
    { level: 'HSK 3', count: stats.hskDistribution[3] || 0 },
    { level: 'HSK 4', count: stats.hskDistribution[4] || 0 },
    { level: 'HSK 5', count: stats.hskDistribution[5] || 0 },
    { level: 'HSK 6', count: stats.hskDistribution[6] || 0 },
    { level: 'Khác', count: stats.hskDistribution[0] || 0 },
  ];

  const maxHskCount = Math.max(...hskData.map(d => d.count), 1);

  // Chuẩn bị dữ liệu cho biểu đồ hoạt động
  const activityDates = Object.keys(stats.recentActivity).sort();
  const activityData = activityDates.map(date => ({
    date: new Date(date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' }),
    count: stats.recentActivity[date]
  }));

  const maxActivityCount = Math.max(...activityData.map(d => d.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Thống kê học tập
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Theo dõi tiến độ học tập của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Flashcards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng số thẻ</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalFlashcards}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Words Learned */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Từ đã học</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.wordsLearned}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Reviews Today */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ôn tập hôm nay</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.reviewsToday}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chuỗi ngày</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.streak} ngày
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tuần này</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.reviewsThisWeek}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">thẻ đã ôn</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tháng này</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.reviewsThisMonth}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">thẻ đã ôn</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tổng số bộ thẻ</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalDecks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">bộ thẻ</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HSK Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Phân bố theo HSK
            </h2>
          </div>
          <div className="space-y-3">
            {hskData.map((item) => (
              <div key={item.level}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{item.level}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${(item.count / maxHskCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hoạt động 7 ngày qua
            </h2>
          </div>
          {activityData.length > 0 ? (
            <div className="space-y-3">
              {activityData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{item.date}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.count} thẻ</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${(item.count / maxActivityCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Chưa có hoạt động trong 7 ngày qua
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;

