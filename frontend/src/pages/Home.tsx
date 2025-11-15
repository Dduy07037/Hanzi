import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, CreditCard, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hán Ngữ Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Ứng dụng học tiếng Trung toàn diện với từ điển thông minh và flashcards SRS
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dictionary"
                className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Tra cứu từ điển
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-flex items-center justify-center"
                >
                  Bắt đầu học ngay
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Tra cứu từ điển thông minh
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tìm kiếm bằng Hán tự, Pinyin (có/không dấu), hoặc nghĩa tiếng Việt/Anh. 
                Gợi ý từ khi đang gõ với kết quả tức thì.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Học thứ tự nét viết
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Xem animation thứ tự nét viết Hán tự chuẩn xác với Hanzi Writer. 
                Tự luyện viết theo với chế độ ẩn/hiện nét mờ.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Flashcards với SRS
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hệ thống ôn tập lặp lại ngắt quãng (Spaced Repetition) với thuật toán SM-2 
                giúp ghi nhớ từ vựng hiệu quả nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HSK Levels Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Học theo cấp độ HSK
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <Link
                key={level}
                to={`/dictionary?hsk=${level}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  HSK {level}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {level === 1 && 'Cơ bản'}
                  {level === 2 && 'Sơ cấp'}
                  {level === 3 && 'Trung cấp'}
                  {level === 4 && 'Trung cao cấp'}
                  {level === 5 && 'Cao cấp'}
                  {level === 6 && 'Thành thạo'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Sẵn sàng bắt đầu học tiếng Trung?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Đăng ký ngay để tạo flashcards và theo dõi tiến độ học tập của bạn
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Đăng ký miễn phí
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
