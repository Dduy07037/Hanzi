## 1. Implementation

### 1.1 Database Schema Updates
- [ ] 1.1.1 Thêm field `examples` (JSON array) vào model `ChineseWord` trong `schema.prisma`
- [ ] 1.1.2 Chạy migration để cập nhật database schema
- [ ] 1.1.3 Cập nhật TypeScript types để bao gồm `examples`

### 1.2 Vietnamese Translation Enhancement
- [ ] 1.2.1 Mở rộng `backend/scripts/add-vietnamese.ts` với nhiều từ hơn (ít nhất 1000 từ thông dụng)
- [ ] 1.2.2 Tích hợp API dịch thuật hoặc nguồn dữ liệu tiếng Việt tự động
- [ ] 1.2.3 Tạo script batch update để thêm tiếng Việt cho tất cả từ HSK 1-6
- [ ] 1.2.4 Chạy script để populate tiếng Việt cho database

### 1.3 Dictionary Search Improvements
- [ ] 1.3.1 Cập nhật `dictionaryController.ts` để ưu tiên từ có tiếng Việt trong sorting
- [ ] 1.3.2 Thêm filter parameter `lang` để lọc theo ngôn ngữ nghĩa
- [ ] 1.3.3 Cải thiện search algorithm để match tốt hơn với tiếng Việt (có dấu/không dấu)

### 1.4 Frontend - Word Display Updates
- [ ] 1.4.1 Cập nhật `WordResult.tsx` để hiển thị tiếng Việt nổi bật hơn (màu xanh lá, font đậm)
- [ ] 1.4.2 Đảm bảo tiếng Việt luôn hiển thị trước tiếng Anh nếu có
- [ ] 1.4.3 Thêm badge "Có tiếng Việt" cho từ có nghĩa tiếng Việt

### 1.5 Example Sentences Feature
- [ ] 1.5.1 Thêm section "Ví dụ sử dụng" vào `WordDetail.tsx`
- [ ] 1.5.2 Tạo component `ExampleSentence.tsx` để hiển thị ví dụ
- [ ] 1.5.3 Thêm API endpoint để lấy/sửa ví dụ cho từ (nếu cần)
- [ ] 1.5.4 Seed một số ví dụ mẫu cho các từ thông dụng

### 1.6 Learning Statistics Dashboard
- [ ] 1.6.1 Tạo component `LearningStats.tsx` để hiển thị thống kê
- [ ] 1.6.2 Thêm API endpoint `/api/stats/learning` để lấy dữ liệu thống kê
- [ ] 1.6.3 Tạo controller `statsController.ts` với các metrics:
  - Tổng số từ đã học
  - Số thẻ đã ôn hôm nay/tuần này
  - Phân bố theo HSK level
  - Tiến độ theo thời gian
- [ ] 1.6.4 Thêm dashboard vào `Home.tsx` hoặc tạo trang `Stats.tsx` mới

### 1.7 Quiz Mode
- [ ] 1.7.1 Tạo trang `Quiz.tsx` với chế độ trắc nghiệm
- [ ] 1.7.2 Implement quiz logic: hiển thị Hán tự/Pinyin, chọn nghĩa đúng
- [ ] 1.7.3 Thêm scoring và feedback sau mỗi câu
- [ ] 1.7.4 Lưu kết quả quiz vào database (nếu cần)

### 1.8 Listening Practice Mode
- [ ] 1.8.1 Tạo trang `Listening.tsx` cho luyện nghe
- [ ] 1.8.2 Sử dụng Web Speech API để phát âm từ
- [ ] 1.8.3 Hiển thị multiple choice với nghĩa, người dùng chọn từ đúng
- [ ] 1.8.4 Thêm controls để điều chỉnh tốc độ phát âm

### 1.9 Writing Practice Mode
- [ ] 1.9.1 Tạo trang `Writing.tsx` cho luyện viết
- [ ] 1.9.2 Tích hợp Hanzi Writer với chế độ practice (người dùng tự viết)
- [ ] 1.9.3 Thêm feedback về độ chính xác khi viết
- [ ] 1.9.4 Lưu tiến độ luyện viết

### 1.10 UI/UX Improvements
- [ ] 1.10.1 Thêm filter toggle "Chỉ hiển thị từ có tiếng Việt" trong Dictionary search
- [ ] 1.10.2 Cải thiện responsive design cho các trang mới
- [ ] 1.10.3 Thêm loading states và error handling
- [ ] 1.10.4 Cập nhật navigation menu để bao gồm các tính năng mới

### 1.11 Testing
- [ ] 1.11.1 Test dictionary search với tiếng Việt
- [ ] 1.11.2 Test các chế độ luyện tập mới
- [ ] 1.11.3 Test thống kê hiển thị đúng
- [ ] 1.11.4 Test responsive trên mobile

