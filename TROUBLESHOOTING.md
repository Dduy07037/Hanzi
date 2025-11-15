# Troubleshooting Guide

## Vấn đề: Không thể đăng nhập, đăng ký, tra cứu

### Bước 1: Kiểm tra Backend

1. **Truy cập Health Check:**
   - Mở: `https://your-backend-url.onrender.com/health`
   - Phải trả về: `{"status":"OK","message":"Hán Ngữ Hub API đang hoạt động",...}`

2. **Kiểm tra Logs trên Render:**
   - Vào Backend service → **Logs** tab
   - Tìm các dòng:
     - `🔧 Đang kiểm tra và setup database...`
     - `✅ Database đã có schema` hoặc `📦 Database chưa có schema`
     - `✅ Đã push schema thành công`
     - `✅ Đã seed dữ liệu thành công`

3. **Nếu thấy lỗi database:**
   - Kiểm tra `DATABASE_URL` trong Environment Variables
   - Đảm bảo database và backend cùng region
   - Kiểm tra Internal Database URL (không phải External)

### Bước 2: Kiểm tra Frontend

1. **Mở Browser Console (F12):**
   - Xem tab **Console** có lỗi gì không
   - Xem tab **Network** xem API calls có fail không

2. **Kiểm tra Environment Variable:**
   - Trên Render Dashboard → Frontend service → **Environment** tab
   - Đảm bảo có: `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`
   - **QUAN TRỌNG**: URL phải có `/api` ở cuối

3. **Kiểm tra CORS:**
   - Nếu thấy lỗi CORS trong console:
     - Vào Backend → **Environment** tab
     - Kiểm tra `FRONTEND_URL` đúng với frontend URL thực tế
     - Restart backend service

### Bước 3: Kiểm tra Database

1. **Kiểm tra xem database đã có schema chưa:**
   - Vào Backend logs
   - Tìm dòng: `✅ Database đã có schema` hoặc `📦 Database chưa có schema`

2. **Nếu database chưa có schema:**
   - Auto-setup có thể đã fail
   - Cần setup thủ công (nếu có Shell access) hoặc
   - Kiểm tra logs để xem lỗi gì

### Bước 4: Test API trực tiếp

1. **Test đăng ký:**
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"123456","name":"Test User"}'
   ```

2. **Test tra cứu:**
   ```bash
   curl https://your-backend-url.onrender.com/api/dictionary/search?q=你好
   ```

### Bước 5: Các lỗi thường gặp

#### Lỗi: "Cannot connect to database"
- **Nguyên nhân**: DATABASE_URL sai hoặc database chưa được tạo
- **Giải pháp**: 
  - Kiểm tra DATABASE_URL trong backend env vars
  - Đảm bảo database service đã được tạo trên Render

#### Lỗi: "CORS policy"
- **Nguyên nhân**: FRONTEND_URL không đúng
- **Giải pháp**:
  - Cập nhật FRONTEND_URL trong backend env vars
  - Restart backend service

#### Lỗi: "404 Not Found" khi gọi API
- **Nguyên nhân**: VITE_API_BASE_URL không đúng
- **Giải pháp**:
  - Kiểm tra VITE_API_BASE_URL trong frontend env vars
  - Đảm bảo có `/api` ở cuối
  - Rebuild frontend

#### Lỗi: "Database schema not found"
- **Nguyên nhân**: Auto-setup không chạy hoặc fail
- **Giải pháp**:
  - Kiểm tra logs xem auto-setup có chạy không
  - Nếu có Shell access, chạy thủ công:
    ```bash
    npx prisma generate
    npx prisma db push
    npm run db:seed
    ```

## Quick Fix Checklist

- [ ] Backend health check trả về OK
- [ ] Database đã có schema (check logs)
- [ ] DATABASE_URL đúng format
- [ ] FRONTEND_URL đúng với frontend URL
- [ ] VITE_API_BASE_URL có `/api` ở cuối
- [ ] Không có lỗi CORS trong browser console
- [ ] Backend và Frontend đều đang running trên Render

## Nếu vẫn không được

1. **Kiểm tra tất cả Environment Variables:**
   - Backend: DATABASE_URL, JWT_SECRET, PORT, FRONTEND_URL
   - Frontend: VITE_API_BASE_URL

2. **Restart cả 2 services:**
   - Backend: Manual Deploy → Clear build cache & Deploy
   - Frontend: Manual Deploy → Clear build cache & Deploy

3. **Kiểm tra Network tab trong browser:**
   - Xem API calls có được gửi không
   - Xem response là gì
   - Xem status code (200, 404, 500, etc.)

4. **Contact support:**
   - Cung cấp logs từ Render
   - Cung cấp errors từ browser console
   - Cung cấp Network tab screenshots

