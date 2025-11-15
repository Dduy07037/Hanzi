# Checklist Sau Khi Deploy

## ✅ Đã Hoàn Thành

- [x] Sửa tất cả hardcode values → dùng environment variables
- [x] Tạo .env.example files cho backend và frontend
- [x] Cập nhật .gitignore để không commit .env files
- [x] Fix TypeScript configuration
- [x] Tạo auto database setup script (không cần Shell)
- [x] Push code lên GitHub
- [x] Deploy backend lên Render
- [x] Deploy frontend lên Render

## 🔍 Kiểm Tra Sau Deploy

### Backend
- [ ] Truy cập `https://your-backend-url.onrender.com/health` → phải trả về `{"status":"OK"}`
- [ ] Kiểm tra logs xem database đã được setup tự động chưa
- [ ] Kiểm tra xem có lỗi gì trong logs không

### Frontend
- [ ] Truy cập frontend URL → phải load được trang chủ
- [ ] Kiểm tra console browser xem có lỗi CORS không
- [ ] Thử đăng ký tài khoản mới
- [ ] Thử đăng nhập

### Database
- [ ] Kiểm tra xem có thể đăng ký/đăng nhập được không (database đã có schema)
- [ ] Thử tra cứu từ điển
- [ ] Thử tạo flashcard deck

## 🎯 Các Tính Năng Cần Test

### 1. Tra Cứu Từ Điển
- [ ] Tìm kiếm bằng Hán tự
- [ ] Tìm kiếm bằng Pinyin
- [ ] Tìm kiếm bằng tiếng Việt
- [ ] Xem chi tiết từ (stroke order, examples)

### 2. Flashcards
- [ ] Tạo bộ thẻ mới
- [ ] Thêm từ vào bộ thẻ
- [ ] Tạo bộ thẻ bằng AI
- [ ] Xem danh sách bộ thẻ

### 3. Ôn Tập SRS
- [ ] Xem thẻ cần ôn hôm nay
- [ ] Đánh giá thẻ (Again, Hard, Good, Easy)
- [ ] Kiểm tra lịch ôn tập tiếp theo

### 4. Thống Kê
- [ ] Xem dashboard thống kê
- [ ] Kiểm tra streak
- [ ] Xem phân bố HSK

### 5. Quiz Mode
- [ ] Tạo quiz
- [ ] Làm quiz
- [ ] Xem kết quả

### 6. Listening Practice
- [ ] Tạo listening session
- [ ] Nghe và chọn từ đúng
- [ ] Xem kết quả

### 7. Writing Practice
- [ ] Tạo writing session
- [ ] Luyện viết Hán tự
- [ ] Test cả 2 chế độ (Trace và Free)

## 🔧 Nếu Có Vấn Đề

### Backend không start
- Kiểm tra logs trên Render
- Kiểm tra DATABASE_URL đúng chưa
- Kiểm tra JWT_SECRET đã set chưa

### Database chưa có schema
- Kiểm tra logs xem auto-setup có chạy không
- Nếu không, có thể cần upgrade plan để có Shell access
- Hoặc dùng local machine để chạy migrations

### CORS errors
- Kiểm tra FRONTEND_URL trong backend env vars
- Đảm bảo URL không có trailing slash
- Restart backend service

### Frontend không gọi được API
- Kiểm tra VITE_API_BASE_URL
- Đảm bảo URL có `/api` ở cuối
- Rebuild frontend

## 📝 Các Cải Tiến Có Thể Làm Sau

- [ ] Thêm error tracking (Sentry, LogRocket)
- [ ] Thêm analytics (Google Analytics, Plausible)
- [ ] Optimize database queries
- [ ] Thêm caching (Redis)
- [ ] Thêm rate limiting
- [ ] Thêm email verification
- [ ] Thêm password reset
- [ ] Thêm social login (Google, Facebook)
- [ ] Thêm mobile app (React Native)
- [ ] Thêm offline support (PWA)

## 🎉 Chúc Mừng!

Nếu tất cả đã hoạt động, bạn đã có một ứng dụng học tiếng Trung hoàn chỉnh chạy trên production!

