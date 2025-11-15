# Gemini Models - Danh sách model hỗ trợ

## Models hiện có

### ✅ gemini-1.5-flash (Khuyến nghị)
- **Tốc độ**: Rất nhanh ⚡
- **Chi phí**: Rẻ nhất 💰
- **Chất lượng**: Tốt cho dịch thuật
- **Use case**: Dịch từ vựng, real-time translation
- **Rate limit**: 15 requests/second

### ✅ gemini-1.5-pro
- **Tốc độ**: Chậm hơn flash
- **Chi phí**: Đắt hơn
- **Chất lượng**: Tốt nhất ⭐
- **Use case**: Dịch phức tạp, cần độ chính xác cao
- **Rate limit**: 2 requests/second

### ❌ gemini-pro (Deprecated)
- **Trạng thái**: Đã bị Google ngừng hỗ trợ
- **Không sử dụng**: Sẽ gây lỗi 404

## Cấu hình model

### Cách 1: Sử dụng mặc định (gemini-1.5-flash)

Không cần cấu hình gì, hệ thống sẽ tự động dùng `gemini-1.5-flash`.

### Cách 2: Chọn model cụ thể

Thêm vào file `backend/.env`:

```env
# Sử dụng flash (nhanh, rẻ) - Khuyến nghị
GEMINI_MODEL=gemini-1.5-flash

# Hoặc sử dụng pro (tốt hơn, chậm hơn)
GEMINI_MODEL=gemini-1.5-pro
```

## So sánh

| Model | Tốc độ | Chi phí | Chất lượng | Rate Limit |
|-------|--------|---------|-----------|------------|
| **gemini-1.5-flash** | ⚡⚡⚡ Rất nhanh | 💰 Rẻ nhất | ⭐⭐⭐ Tốt | 15 req/s |
| **gemini-1.5-pro** | ⚡⚡ Nhanh | 💰💰 Đắt hơn | ⭐⭐⭐⭐⭐ Rất tốt | 2 req/s |
| ~~gemini-pro~~ | ❌ Deprecated | ❌ | ❌ | ❌ |

## Khuyến nghị

### Cho dịch từ vựng real-time:
✅ **Sử dụng `gemini-1.5-flash`**
- Đủ tốt cho dịch từ vựng
- Nhanh, không làm chậm response
- Rẻ, tiết kiệm API calls

### Cho dịch phức tạp:
✅ **Sử dụng `gemini-1.5-pro`**
- Chất lượng tốt hơn
- Phù hợp cho câu dài, ngữ cảnh phức tạp

## Kiểm tra model có sẵn

Để xem danh sách model có sẵn, có thể gọi API:

```bash
curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY"
```

## Lưu ý

- Model `gemini-pro` đã bị deprecated từ đầu năm 2024
- Luôn sử dụng model mới nhất (`gemini-1.5-*`)
- Flash model đủ tốt cho hầu hết use case dịch thuật

