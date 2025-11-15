# Hướng dẫn Deploy lên Render

## Chuẩn bị

1. Đảm bảo code đã được push lên GitHub
2. Có tài khoản Render (https://render.com)

## Bước 1: Tạo PostgreSQL Database

1. Vào Render Dashboard
2. Chọn **New +** → **PostgreSQL**
3. Đặt tên: `han-ngu-hub-db`
4. Chọn plan (Starter miễn phí)
5. Chọn region gần bạn nhất
6. Click **Create Database**
7. **Lưu lại Internal Database URL** (sẽ dùng cho backend)

## Bước 2: Deploy Backend

1. Vào Render Dashboard
2. Chọn **New +** → **Web Service**
3. Connect repository GitHub của bạn
4. Cấu hình:
   - **Name**: `han-ngu-hub-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: (để trống hoặc `backend`)

5. Thêm Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<Internal Database URL từ bước 1>
   JWT_SECRET=<Generate một secret key mạnh>
   PORT=10000
   FRONTEND_URL=https://your-frontend-url.onrender.com
   GEMINI_API_KEY=<Nếu dùng AI features>
   GEMINI_MODEL=gemini-2.5-flash
   ```

6. Click **Create Web Service**

7. Sau khi deploy xong, chạy migrations:
   - Vào **Shell** tab của service
   - Chạy:
     ```bash
     cd backend
     npx prisma generate
     npx prisma db push
     npm run db:seed
     ```

## Bước 3: Deploy Frontend

1. Vào Render Dashboard
2. Chọn **New +** → **Static Site**
3. Connect repository GitHub của bạn
4. Cấu hình:
   - **Name**: `han-ngu-hub-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

5. Thêm Environment Variable:
   ```
   VITE_API_BASE_URL=https://han-ngu-hub-backend.onrender.com/api
   ```
   (Thay bằng URL backend thực tế của bạn)

6. Click **Create Static Site**

## Bước 4: Cập nhật CORS

1. Vào Backend service
2. Vào **Environment** tab
3. Cập nhật `FRONTEND_URL` thành URL frontend thực tế:
   ```
   FRONTEND_URL=https://han-ngu-hub-frontend.onrender.com
   ```
4. Restart service

## Bước 5: Kiểm tra

1. Truy cập frontend URL
2. Thử đăng ký tài khoản mới
3. Kiểm tra các tính năng hoạt động

## Lưu ý

- **Free tier** có thể bị sleep sau 15 phút không hoạt động
- Database free tier có giới hạn 90 ngày
- Để production thực sự, nên upgrade lên paid plan
- Backup database thường xuyên

## Troubleshooting

### Backend không kết nối được database
- Kiểm tra `DATABASE_URL` đúng format
- Đảm bảo database và backend cùng region
- Kiểm tra Internal Database URL (không phải External)

### CORS errors
- Kiểm tra `FRONTEND_URL` trong backend env vars
- Đảm bảo URL không có trailing slash
- Restart backend service sau khi thay đổi

### Frontend không gọi được API
- Kiểm tra `VITE_API_BASE_URL` trong frontend env vars
- Đảm bảo URL có `/api` ở cuối
- Rebuild frontend sau khi thay đổi env vars

