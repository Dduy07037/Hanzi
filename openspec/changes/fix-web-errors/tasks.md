## 1. Implementation

### 1.1 Frontend - Types
- [x] 1.1.1 Tạo thư mục `frontend/src/types/`
- [x] 1.1.2 Tạo file `frontend/src/types/index.ts` với các TypeScript interfaces:
  - User
  - ChineseWord
  - FlashcardDeck
  - Flashcard
  - FlashcardReview
  - AuthResponse

### 1.2 Frontend - API Configuration
- [x] 1.2.1 Tạo file `frontend/src/config/api.ts` với:
  - API_BASE_URL constant
  - axios instance với base URL và default config

### 1.3 Frontend - Services
- [x] 1.3.1 Tạo thư mục `frontend/src/services/`
- [x] 1.3.2 Tạo file `frontend/src/services/authService.ts` với:
  - login(email, password)
  - register(email, password, name)
- [x] 1.3.3 Tạo file `frontend/src/services/dictionaryService.ts` với:
  - search(query)
  - getWordById(id)
  - getWordsByHSK(level)
- [x] 1.3.4 Tạo file `frontend/src/services/flashcardService.ts` với:
  - createDeck(name, description, isPublic)
  - getUserDecks()
  - addFlashcard(deckId, wordId)
  - getReviewCards(deckId?)
  - updateReview(reviewId, quality)

### 1.4 Frontend - Pages
- [x] 1.4.1 Tạo thư mục `frontend/src/pages/`
- [x] 1.4.2 Tạo file `frontend/src/pages/Home.tsx` - Trang chủ với giới thiệu
- [x] 1.4.3 Tạo file `frontend/src/pages/Dictionary.tsx` - Trang tra cứu từ điển với DictionarySearch component
- [x] 1.4.4 Tạo file `frontend/src/pages/Login.tsx` - Trang đăng nhập với form
- [x] 1.4.5 Tạo file `frontend/src/pages/Register.tsx` - Trang đăng ký với form
- [x] 1.4.6 Tạo file `frontend/src/pages/Flashcards.tsx` - Trang quản lý flashcards với danh sách decks và cards
- [x] 1.4.7 Tạo file `frontend/src/pages/Review.tsx` - Trang ôn tập SRS với review cards

### 1.5 Backend - Fix Types
- [x] 1.5.1 Sửa file `backend/src/types/index.ts` để import `Request` từ express (đã có sẵn)

### 1.6 Testing
- [x] 1.6.1 Kiểm tra frontend compile không có lỗi (no linter errors)
- [x] 1.6.2 Kiểm tra backend compile không có lỗi (types đã đúng)
- [x] 1.6.3 Kiểm tra các imports đúng và không có missing modules (đã sửa WordResult)
- [ ] 1.6.4 Test các API endpoints hoạt động đúng (cần chạy server để test)

