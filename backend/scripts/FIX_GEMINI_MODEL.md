# Sửa lỗi Gemini Model Not Found

## Vấn đề

Lỗi: `models/gemini-1.5-flash is not found for API version v1`

Nguyên nhân: Tên model có thể khác nhau tùy theo:
- Loại API key (free tier vs paid)
- Region
- API version

## Giải pháp

### Bước 1: Kiểm tra models có sẵn

Chạy script để xem models nào có sẵn với API key của bạn:

```bash
cd backend
npm run db:list-gemini-models
```

Script này sẽ liệt kê tất cả models có sẵn và hỗ trợ `generateContent`.

### Bước 2: Chọn model phù hợp

Sau khi chạy script, bạn sẽ thấy danh sách models. Thường có các tên như:
- `gemini-pro`
- `gemini-1.5-pro-latest`
- `gemini-1.5-flash-latest`
- `models/gemini-pro` (với prefix)

### Bước 3: Cấu hình model

Thêm vào file `backend/.env`:

```env
# Thay MODEL_NAME bằng tên model từ bước 2
GEMINI_MODEL=MODEL_NAME
```

Ví dụ:
```env
GEMINI_MODEL=gemini-pro
```

Hoặc:
```env
GEMINI_MODEL=gemini-1.5-pro-latest
```

### Bước 4: Khởi động lại server

```bash
npm run dev
```

## Các model name phổ biến

Thử các tên sau (theo thứ tự ưu tiên):

1. `gemini-pro` - Model cũ, thường có sẵn
2. `gemini-1.5-pro-latest` - Model mới với latest
3. `gemini-1.5-flash-latest` - Flash model với latest
4. `gemini-1.5-pro` - Model mới không có latest
5. `gemini-1.5-flash` - Flash không có latest

## Nếu vẫn lỗi

### Kiểm tra API key

1. Đảm bảo API key hợp lệ
2. Kiểm tra API key có quyền truy cập Generative AI không
3. Thử tạo API key mới tại: https://makersuite.google.com/app/apikey

### Kiểm tra package version

```bash
npm list @google/generative-ai
```

Nếu version cũ, cập nhật:
```bash
npm install @google/generative-ai@latest
```

### Thử API trực tiếp

```bash
curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY"
```

Xem response để biết models nào có sẵn.

## Code tự động thử

Code đã được cập nhật để tự động thử model `gemini-pro` nếu model mới không hoạt động. Nhưng tốt nhất là chạy script `list-gemini-models` để biết chính xác model nào có sẵn.

