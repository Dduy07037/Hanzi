## Why
Hiện tại từ điển chỉ hiển thị nghĩa tiếng Anh cho hầu hết các từ, trong khi người dùng Việt Nam cần nghĩa tiếng Việt để học hiệu quả hơn. Ngoài ra, các tính năng học tập hiện tại còn thiếu nhiều công cụ hữu ích như ví dụ sử dụng, thống kê tiến độ, và các chế độ luyện tập đa dạng.

## What Changes
- **ADDED**: Cải thiện coverage tiếng Việt cho từ điển
  - Tích hợp nguồn dữ liệu tiếng Việt từ CC-CEDICT hoặc API dịch thuật
  - Tự động thêm nghĩa tiếng Việt cho các từ thông dụng (HSK 1-6)
  - Ưu tiên hiển thị tiếng Việt khi có sẵn
- **ADDED**: Tính năng ví dụ sử dụng cho từ vựng
  - Thêm field `examples` vào database schema
  - Hiển thị ví dụ câu sử dụng từ trong WordDetail
  - Tìm kiếm theo ví dụ sử dụng
- **ADDED**: Thống kê tiến độ học tập
  - Dashboard hiển thị số từ đã học, số thẻ đã ôn
  - Biểu đồ tiến độ theo thời gian
  - Thống kê theo cấp độ HSK
- **ADDED**: Chế độ luyện tập đa dạng
  - Quiz mode: Trắc nghiệm từ vựng
  - Listening practice: Luyện nghe và chọn từ đúng
  - Writing practice: Luyện viết Hán tự
- **MODIFIED**: Cải thiện UI/UX cho dictionary search
  - Hiển thị rõ ràng nghĩa tiếng Việt (nếu có) trước tiếng Anh
  - Thêm filter theo ngôn ngữ nghĩa (chỉ hiển thị từ có tiếng Việt)
  - Cải thiện sorting để ưu tiên từ có tiếng Việt

## Impact
- **Affected specs**: 
  - `dictionary` - Thêm tiếng Việt và ví dụ sử dụng
  - `learning` - Thêm thống kê và chế độ luyện tập mới
- **Affected code**: 
  - `backend/prisma/schema.prisma` - Thêm field `examples` cho ChineseWord
  - `backend/src/controllers/dictionaryController.ts` - Cải thiện search và sorting
  - `backend/scripts/add-vietnamese.ts` - Mở rộng mapping tiếng Việt
  - `frontend/src/components/WordResult.tsx` - Ưu tiên hiển thị tiếng Việt
  - `frontend/src/components/WordDetail.tsx` - Thêm section ví dụ
  - `frontend/src/pages/Home.tsx` - Thêm dashboard thống kê
  - `frontend/src/pages/` - Thêm các trang quiz và practice
- **Breaking changes**: Không có (tất cả là tính năng mới hoặc cải thiện)

