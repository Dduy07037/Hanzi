# Hán Ngữ Hub

Ứng dụng học tiếng Trung toàn diện với từ điển thông minh, flashcards SRS và hướng dẫn viết Hán tự chuẩn xác.

## 🌟 Tính năng chính

### 📚 Tra cứu từ điển thông minh
- Tìm kiếm bằng Hán tự, Pinyin (có/không dấu), hoặc nghĩa tiếng Việt
- Gợi ý từ khi đang gõ
- Hiển thị chi tiết: Hán tự, Pinyin, nghĩa Việt/Anh, cấp độ HSK
- Hỗ trợ dịch tiếng Việt real-time bằng AI

### ✍️ Học thứ tự nét viết
- Tích hợp Hanzi Writer để xem animation thứ tự nét
- Có thể tự luyện viết theo
- Chế độ ẩn/hiện nét mờ để luyện tập

### 🧠 Flashcards với SRS
- Hệ thống ôn tập lặp lại ngắt quãng (Spaced Repetition) giống Anki
- Thuật toán SM-2 tối ưu việc ghi nhớ
- Tạo và quản lý nhiều bộ thẻ khác nhau
- Theo dõi tiến độ học tập chi tiết
- **Tạo bộ thẻ tự động bằng AI** từ mô tả

### 🎯 Các cấp độ HSK
- Từ vựng được phân loại theo cấp độ HSK 1-6
- Có thể lọc và học theo từng cấp độ

### 📊 Thống kê học tập
- Dashboard thống kê chi tiết
- Theo dõi streak (chuỗi ngày học)
- Phân tích theo HSK level

### 🎮 Chế độ luyện tập
- **Quiz Mode**: Kiểm tra kiến thức với câu hỏi trắc nghiệm
- **Listening Practice**: Luyện nghe và chọn từ đúng
- **Writing Practice**: Luyện viết Hán tự với Hanzi Writer

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** với **TypeScript**
- **Vite** cho build tool nhanh chóng
- **Tailwind CSS** cho styling responsive
- **React Router DOM** cho routing
- **Axios** cho HTTP requests
- **Hanzi Writer** cho animation thứ tự nét
- **React Hot Toast** cho thông báo

### Backend
- **Node.js** với **Express.js**
- **TypeScript** cho type safety
- **PostgreSQL** làm database chính
- **Prisma ORM** cho database management
- **JWT** cho authentication
- **BcryptJS** cho mã hóa mật khẩu
- **Google Gemini AI** cho tính năng AI

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+
- PostgreSQL 14+

### Quick Start

1. Clone repository:
```bash
git clone <your-repo-url>
cd han-ngu-hub
```

2. Setup Backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env với thông tin database của bạn
npm run db:setup
npm run dev
```

3. Setup Frontend:
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env với API URL của bạn
npm run dev
```

Xem [DEPLOY.md](./DEPLOY.md) để deploy lên Render hoặc các platform khác.

## 🔧 Cấu hình Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/han_ngu_hub?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
GEMINI_API_KEY="your-gemini-api-key"  # Optional
```

### Frontend (.env)
```env
VITE_API_BASE_URL="http://localhost:3001/api"
```

## 🚀 Deploy

Xem hướng dẫn chi tiết trong [DEPLOY.md](./DEPLOY.md) để deploy lên:
- Render.com
- Vercel
- Railway
- Hoặc các platform khác

## 📖 Documentation

- [Backend Setup](./backend/SETUP.md)
- [Deploy Guide](./DEPLOY.md)
- [OpenSpec Workflow](./openspec/AGENTS.md)

## 📝 License

MIT
