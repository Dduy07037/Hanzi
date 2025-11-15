## Why
Ứng dụng hiện tại không thể hoạt động vì thiếu nhiều file và module cần thiết:
- Frontend thiếu thư mục `pages` với các page components (Home, Dictionary, Login, Register, Flashcards, Review)
- Frontend thiếu thư mục `services` với các service functions (authService, dictionaryService)
- Frontend thiếu thư mục `types` với TypeScript type definitions
- Frontend thiếu cấu hình API base URL
- Backend thiếu import `Request` từ express trong types/index.ts
- Các component hiện tại import các module không tồn tại, gây lỗi compile và runtime

## What Changes
- **ADDED**: Tạo thư mục `frontend/src/pages/` với các page components:
  - `Home.tsx` - Trang chủ
  - `Dictionary.tsx` - Trang tra cứu từ điển
  - `Login.tsx` - Trang đăng nhập
  - `Register.tsx` - Trang đăng ký
  - `Flashcards.tsx` - Trang quản lý flashcards
  - `Review.tsx` - Trang ôn tập SRS
- **ADDED**: Tạo thư mục `frontend/src/services/` với các service functions:
  - `authService.ts` - API calls cho authentication
  - `dictionaryService.ts` - API calls cho dictionary
  - `flashcardService.ts` - API calls cho flashcards
- **ADDED**: Tạo thư mục `frontend/src/types/` với file `index.ts` chứa TypeScript type definitions
- **ADDED**: Tạo file `frontend/src/config/api.ts` để cấu hình API base URL
- **FIXED**: Sửa import trong `backend/src/types/index.ts` để import `Request` từ express
- **MODIFIED**: Cập nhật các components để sử dụng đúng imports từ services và types

## Impact
- **Affected specs**: Không có (đây là bug fix, không thay đổi spec)
- **Affected code**: 
  - `frontend/src/App.tsx` - Đã import pages nhưng chưa tồn tại
  - `frontend/src/context/AuthContext.tsx` - Import authService và types chưa tồn tại
  - `frontend/src/components/DictionarySearch.tsx` - Import dictionaryService và types chưa tồn tại
  - `backend/src/types/index.ts` - Thiếu import Request từ express
- **Breaking changes**: Không có (đây là bug fix)

