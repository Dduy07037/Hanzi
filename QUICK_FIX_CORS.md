# Quick Fix CORS

## Vấn đề
CORS error: `No 'Access-Control-Allow-Origin' header is present`

## Giải pháp NGAY LẬP TỨC

### Bước 1: Cập nhật FRONTEND_URL trên Render

1. Vào **Backend service** trên Render Dashboard
2. Vào tab **Environment**
3. Tìm biến `FRONTEND_URL`
4. **XÓA** giá trị cũ và **THAY** bằng:
   ```
   https://hanzi-q503.onrender.com
   ```
   (URL frontend thực tế của bạn, KHÔNG có dấu `/` ở cuối)
5. Click **Save Changes**
6. Đợi backend restart (khoảng 30 giây)

### Bước 2: Kiểm tra Logs

Sau khi restart, vào **Logs** tab và tìm:
```
🌐 CORS Allowed Origins: [ 'https://hanzi-q503.onrender.com' ]
```

Nếu thấy dòng này với URL đúng → CORS đã được cấu hình đúng.

### Bước 3: Test lại

1. Refresh frontend (Ctrl+F5 để clear cache)
2. Mở Browser Console (F12)
3. Thử đăng ký lại
4. Xem logs có dòng `✅ CORS allowed: https://hanzi-q503.onrender.com` không

## Nếu vẫn lỗi

### Kiểm tra lại:
- [ ] FRONTEND_URL đúng với frontend URL thực tế
- [ ] Không có dấu `/` ở cuối URL
- [ ] Backend đã restart xong
- [ ] Xem logs có thông báo CORS không

### Thử cách khác:

Nếu vẫn không được, có thể tạm thời cho phép tất cả origins (CHỈ để test):

1. Vào Backend → Environment
2. Thêm biến mới:
   ```
   CORS_ALLOW_ALL=true
   ```
3. Restart backend

**LƯU Ý**: Chỉ dùng để test, không nên dùng trong production!

## Debug

Mở Browser Console và xem:
- Network tab → Xem request có được gửi không
- Response headers có `Access-Control-Allow-Origin` không
- Status code là gì (200, 404, 500?)

