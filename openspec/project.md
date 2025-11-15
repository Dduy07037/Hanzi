# Project Context

## Purpose
Hán Ngữ Hub là ứng dụng web học tiếng Trung toàn diện với các tính năng:
- Tra cứu từ điển thông minh (Hán tự, Pinyin, nghĩa tiếng Việt/Anh)
- Học thứ tự nét viết Hán tự với Hanzi Writer
- Flashcards với hệ thống SRS (Spaced Repetition System) sử dụng thuật toán SM-2
- Phân loại từ vựng theo cấp độ HSK 1-6

Mục tiêu: Giúp người học tiếng Trung tra cứu từ vựng nhanh chóng, học viết chữ Hán đúng thứ tự nét, và ôn tập hiệu quả với flashcards.

## Tech Stack

### Frontend
- **React 18** với **TypeScript** - UI framework
- **Vite** - Build tool và dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client cho API calls
- **Hanzi Writer** - Thư viện animation thứ tự nét viết Hán tự
- **React Hot Toast** - Thông báo toast
- **Lucide React** - Icon library

### Backend
- **Node.js** với **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit và ORM
- **JWT** (jsonwebtoken) - Authentication
- **BcryptJS** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Conventions

### Code Style
- Sử dụng TypeScript với strict mode
- Naming conventions:
  - Components: PascalCase (ví dụ: `DictionarySearch.tsx`)
  - Functions/variables: camelCase (ví dụ: `handleSearch`)
  - Constants: UPPER_SNAKE_CASE
  - Files: PascalCase cho components, camelCase cho utilities
- Format code với ESLint và Prettier (nếu có)
- Sử dụng functional components với React hooks
- Async/await thay vì promises chains
- Error handling: try-catch blocks với thông báo lỗi tiếng Việt

### Architecture Patterns
- **Frontend**: Component-based architecture với React
  - Context API cho state management (AuthContext)
  - Custom hooks cho reusable logic (useDarkMode)
  - Services layer cho API calls (authService, dictionaryService)
  - Protected routes với ProtectedRoute component
- **Backend**: MVC pattern
  - Controllers: Xử lý business logic (authController, dictionaryController, flashcardController)
  - Routes: Định nghĩa API endpoints
  - Middleware: Authentication middleware (authMiddleware)
  - Types: Shared TypeScript interfaces
- **Database**: Prisma ORM với PostgreSQL
  - Schema định nghĩa trong `schema.prisma`
  - Migrations với `prisma db push`
  - Seed data với `prisma db seed`

### File Structure
```
frontend/src/
├── components/     # React components
├── pages/          # Page components
├── context/        # React Context providers
├── hooks/          # Custom React hooks
├── services/       # API service functions
├── types/          # TypeScript type definitions
└── App.tsx         # Main app component

backend/src/
├── controllers/    # Request handlers
├── routes/         # API routes
├── middleware/     # Express middleware
├── types/          # TypeScript types
└── index.ts        # Server entry point
```

### API Conventions
- Base URL: `http://localhost:3001/api` (development)
- Authentication: JWT token trong header `Authorization: Bearer <token>`
- Response format: JSON
- Error responses: `{ error: string }`
- Success responses: `{ message?: string, data: any }`

### Testing Strategy
- Hiện tại chưa có test setup
- Tương lai: Unit tests với Jest, Integration tests cho API endpoints

### Git Workflow
- Main branch: `main` hoặc `master`
- Feature branches: `feature/<feature-name>`
- Commit messages: Tiếng Việt hoặc tiếng Anh, mô tả rõ ràng
- Pull requests: Review trước khi merge

## Domain Context

### Chinese Language Learning
- **HSK Levels**: Hanyu Shuiping Kaoshi (HSK) là kỳ thi trình độ tiếng Trung, có 6 cấp độ từ cơ bản đến nâng cao
- **Simplified vs Traditional**: Hán tự có thể là giản thể (simplified) hoặc phồn thể (traditional)
- **Pinyin**: Hệ thống phiên âm tiếng Trung bằng chữ Latin, có thể có hoặc không có dấu thanh điệu (tone marks)
- **Stroke Order**: Thứ tự viết các nét trong chữ Hán rất quan trọng, cần viết đúng thứ tự

### Spaced Repetition System (SRS)
- **SM-2 Algorithm**: Thuật toán SuperMemo 2 để tính toán khoảng thời gian ôn tập
- **Ease Factor**: Hệ số độ dễ, ban đầu là 2.5
- **Interval**: Khoảng thời gian (ngày) giữa các lần ôn tập
- **Quality**: Đánh giá mức độ nhớ (0=Again, 1=Hard, 2=Good, 3=Easy)

### Database Schema
- **Users**: Người dùng hệ thống
- **ChineseWords**: Từ vựng tiếng Trung
- **FlashcardDecks**: Bộ thẻ flashcards
- **Flashcards**: Thẻ flashcard (liên kết word với deck)
- **FlashcardReviews**: Bản ghi ôn tập với thông tin SRS

## Important Constraints
- **Hanzi Writer**: Yêu cầu kết nối internet để tải dữ liệu Hán tự
- **Database**: Cần PostgreSQL 14+ và cấu hình DATABASE_URL trong .env
- **JWT Secret**: Cần JWT_SECRET trong .env để bảo mật
- **CORS**: Backend cấu hình CORS để cho phép frontend gọi API
- **Browser Support**: Modern browsers hỗ trợ ES6+

## External Dependencies
- **Hanzi Writer**: Thư viện JavaScript cho animation thứ tự nét viết Hán tự
  - URL: https://github.com/chanind/hanzi-writer
  - Yêu cầu kết nối internet
- **CC-CEDICT**: Từ điển tiếng Trung (đã có script import)
  - File: `backend/prisma/cedict_1_0_ts_utf-8_mdbg.txt`
  - Chứa hơn 100,000 từ với nghĩa tiếng Anh
  - Có script `add-vietnamese.ts` để thêm nghĩa tiếng Việt
- **PostgreSQL**: Database server
- **Prisma**: ORM và migration tool

## Current State & Known Limitations
- **Vietnamese Translations**: Hầu hết từ vựng chỉ có nghĩa tiếng Anh. Script `add-vietnamese.ts` hiện chỉ có mapping cho ~70 từ thông dụng. Cần mở rộng để cover nhiều từ hơn, đặc biệt là các từ HSK 1-6.
- **Example Sentences**: Chưa có tính năng hiển thị ví dụ sử dụng cho từ vựng.
- **Learning Statistics**: Chưa có dashboard thống kê tiến độ học tập.
- **Practice Modes**: Chưa có các chế độ luyện tập như quiz, listening, writing practice.
