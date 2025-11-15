# Hướng dẫn sử dụng Google Gemini AI để dịch tự động

## Tổng quan

Script `translate-with-gemini.ts` sẽ tự động:
1. Lấy danh sách từ chưa có tiếng Việt từ database
2. Gửi cho Gemini AI để dịch
3. Tự động cập nhật vào database
4. Lưu backup vào file JSON

## Bước 1: Lấy Gemini API Key

### Cách 1: Từ Google AI Studio (Khuyến nghị)

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Click "Create API Key"
4. Copy API key (dạng: `AIzaSy...`)

### Cách 2: Từ Google Cloud Console

1. Truy cập: https://console.cloud.google.com/
2. Tạo project mới (hoặc chọn project có sẵn)
3. Enable "Generative Language API"
4. Tạo API key từ "Credentials"

## Bước 2: Cấu hình API Key

Thêm API key vào file `backend/.env`:

```env
GEMINI_API_KEY=AIzaSyYour_API_Key_Here
```

**Lưu ý quan trọng:**
- Không commit file `.env` lên Git
- API key miễn phí có giới hạn: 60 requests/phút, 1500 requests/ngày
- Nếu vượt quá, sẽ phải đợi hoặc nâng cấp

## Bước 3: Cài đặt package

```bash
cd backend
npm install @google/generative-ai
```

## Bước 4: Chạy script dịch

```bash
npm run db:translate-gemini
```

Script sẽ:
- Tự động lấy 1000 từ chưa có tiếng Việt (ưu tiên HSK 1-6)
- Chia thành các batch 50 từ để dịch
- Dịch bằng Gemini AI
- Cập nhật vào database
- Lưu backup vào `vietnamese-mapping-gemini.json`

## Tính năng

### ✅ Tự động hóa hoàn toàn
- Không cần copy/paste thủ công
- Tự động lấy từ database
- Tự động cập nhật kết quả

### ✅ Xử lý batch thông minh
- Chia nhỏ thành batch 50 từ
- Delay giữa các batch để tránh rate limit
- Xử lý lỗi và tiếp tục với batch tiếp theo

### ✅ Backup tự động
- Lưu kết quả vào JSON file
- Có thể import lại nếu cần

### ✅ Thống kê chi tiết
- Hiển thị tiến độ dịch
- Thống kê số từ đã dịch
- Tỷ lệ từ có tiếng Việt

## Giới hạn và lưu ý

### Rate Limits (Free tier)
- **60 requests/phút**
- **1500 requests/ngày**
- Mỗi batch = 1 request
- Với 1000 từ = 20 batch = 20 requests

### Chi phí
- **Miễn phí** cho tier free
- Có thể dịch khoảng 1000-2000 từ/ngày miễn phí

### Chất lượng dịch
- Gemini dịch khá tốt, nhưng nên review một số từ quan trọng
- Có thể chạy lại script để dịch thêm từ nếu cần

## Chạy nhiều lần

Script có thể chạy nhiều lần an toàn:
- Chỉ dịch các từ chưa có tiếng Việt
- Không ghi đè dữ liệu đã có
- Mỗi lần chạy dịch thêm 1000 từ

```bash
# Lần 1: Dịch 1000 từ đầu tiên
npm run db:translate-gemini

# Lần 2: Dịch 1000 từ tiếp theo
npm run db:translate-gemini

# Tiếp tục cho đến khi hết từ
```

## Troubleshooting

### Lỗi: "GEMINI_API_KEY không được tìm thấy"
- Kiểm tra file `backend/.env` có chứa `GEMINI_API_KEY=...`
- Đảm bảo không có khoảng trắng thừa

### Lỗi: "API quota exceeded"
- Đã vượt quá giới hạn 1500 requests/ngày
- Đợi đến ngày hôm sau hoặc nâng cấp API key

### Lỗi: "Invalid API key"
- Kiểm tra API key có đúng không
- Đảm bảo đã enable Generative Language API

### Dịch không chính xác
- Một số từ có thể dịch không đúng ngữ cảnh
- Nên review và sửa thủ công các từ quan trọng
- Có thể chạy lại script để dịch lại (sẽ skip các từ đã có)

## So sánh với phương pháp thủ công

| Phương pháp | Tự động | Tốc độ | Chi phí | Chất lượng |
|------------|--------|--------|---------|-----------|
| **Gemini API** | ✅ Hoàn toàn | ⚡ Rất nhanh | 💰 Miễn phí (có giới hạn) | ⭐⭐⭐⭐ Tốt |
| ChatGPT/Claude | ❌ Thủ công | 🐌 Chậm | 💰 Phụ thuộc | ⭐⭐⭐⭐⭐ Rất tốt |
| Google Translate API | ✅ Hoàn toàn | ⚡ Rất nhanh | 💰 Có phí | ⭐⭐⭐ Khá |

## Kết luận

Sử dụng Gemini API là cách **nhanh nhất và tiện nhất** để dịch hàng nghìn từ tự động. Chỉ cần:
1. Lấy API key (miễn phí)
2. Thêm vào `.env`
3. Chạy script
4. Xong! 🎉

