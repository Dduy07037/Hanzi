# Hướng dẫn dịch real-time với Gemini AI

## Tổng quan

Hệ thống sẽ **tự động dịch** từ tiếng Trung sang tiếng Việt **khi người dùng tra cứu**, và **lưu vào database** để lần sau không cần dịch lại.

## Cách hoạt động

1. **Người dùng tra cứu từ** → Hệ thống kiểm tra xem từ đã có tiếng Việt chưa
2. **Nếu chưa có** → Gọi Gemini AI để dịch
3. **Lưu kết quả vào database** (async, không block response)
4. **Trả về kết quả ngay** cho người dùng
5. **Lần sau tra cứu** → Lấy từ database, không cần dịch lại

## Cấu hình

### Bước 1: Lấy Gemini API Key

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập và tạo API key
3. Copy API key

### Bước 2: Thêm vào `.env`

Mở file `backend/.env` và thêm:

```env
GEMINI_API_KEY=AIzaSyYour_API_Key_Here
```

### Bước 3: Cài đặt package

```bash
cd backend
npm install @google/generative-ai
```

### Bước 4: Khởi động server

```bash
npm run dev
```

## Tính năng

### ✅ Dịch tự động khi tra cứu
- Khi user tra cứu từ chưa có tiếng Việt
- Hệ thống tự động dịch bằng Gemini AI
- Trả về kết quả ngay (không cần đợi)

### ✅ Cache vào database
- Kết quả dịch được lưu vào database
- Lần sau tra cứu sẽ lấy từ database
- Tiết kiệm API calls

### ✅ Dịch từ đầu tiên trong search results
- Tự động dịch từ đầu tiên trong kết quả tìm kiếm
- User thấy tiếng Việt ngay khi search

### ✅ Dịch khi xem chi tiết từ
- Khi user click vào từ để xem chi tiết
- Tự động dịch nếu chưa có tiếng Việt

## Luồng hoạt động

### Khi tra cứu từ (Search)

```
User search "你好" 
  ↓
Hệ thống tìm thấy từ
  ↓
Kiểm tra: Có tiếng Việt chưa?
  ├─ Có → Trả về ngay
  └─ Chưa → Gọi Gemini AI
            ↓
         Dịch và lưu vào DB (async)
            ↓
         Trả về kết quả cho user
```

### Khi xem chi tiết từ (Word Detail)

```
User click vào từ
  ↓
GET /api/dictionary/word/:id
  ↓
Kiểm tra: Có tiếng Việt chưa?
  ├─ Có → Trả về ngay
  └─ Chưa → Gọi Gemini AI
            ↓
         Dịch và lưu vào DB
            ↓
         Trả về word với tiếng Việt
```

## Lợi ích

### 🚀 Trải nghiệm người dùng tốt
- Không cần đợi batch processing
- Thấy tiếng Việt ngay khi tra cứu
- Tự động build database theo thời gian

### 💰 Tiết kiệm API calls
- Chỉ dịch khi cần (on-demand)
- Cache vào database
- Không dịch lại từ đã có

### 📈 Tự động mở rộng
- Database tự động được bổ sung tiếng Việt
- Càng nhiều người dùng tra cứu → Càng nhiều từ được dịch
- Không cần chạy script batch

## Giới hạn API

### Free tier Gemini
- **60 requests/phút**
- **1500 requests/ngày**

### Tối ưu hóa
- Chỉ dịch khi user thực sự tra cứu
- Cache vào database
- Không dịch lại từ đã có

## Xử lý lỗi

### Nếu Gemini API không sẵn sàng
- Hệ thống vẫn hoạt động bình thường
- Chỉ trả về từ không có tiếng Việt
- Không block response

### Nếu dịch lỗi
- Log lỗi nhưng không throw
- Trả về từ không có tiếng Việt
- User vẫn thấy kết quả (chỉ thiếu tiếng Việt)

## Monitoring

Để xem số từ đã được dịch:

```sql
SELECT COUNT(*) 
FROM chinese_words 
WHERE vietnamese IS NOT NULL 
AND vietnamese != '';
```

## Tắt tính năng dịch real-time

Nếu không muốn dịch tự động, chỉ cần:
- Không thêm `GEMINI_API_KEY` vào `.env`
- Hoặc xóa `GEMINI_API_KEY` khỏi `.env`

Hệ thống sẽ hoạt động bình thường, chỉ không dịch tự động.

