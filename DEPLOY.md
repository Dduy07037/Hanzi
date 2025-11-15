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
3. Connect repository GitHub của bạn: `Dduy07037/Hanzi`
4. Cấu hình:
   - **Name**: `han-ngu-hub-backend`
   - **Root Directory**: `backend` ⚠️ **QUAN TRỌNG**
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `18` hoặc `20` (không dùng 22)

5. Thêm Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<Internal Database URL từ bước 1>
   JWT_SECRET=<Generate một secret key mạnh - dùng: openssl rand -base64 32>
   PORT=10000
   FRONTEND_URL=https://han-ngu-hub-frontend.onrender.com
   GEMINI_API_KEY=<Nếu dùng AI features>
   GEMINI_MODEL=gemini-2.5-flash
   ```

6. Click **Create Web Service**

7. **Database sẽ tự động được setup** khi server start lần đầu (nếu chưa có schema)
   - Server sẽ tự động chạy `prisma db push` và `db:seed` khi start
   - Nếu muốn tắt tính năng này, thêm env var: `AUTO_SETUP_DB=false`
   
   **Lưu ý**: Nếu bạn có Shell access, có thể chạy thủ công:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

## Bước 3: Deploy Frontend

1. Vào Render Dashboard
2. Chọn **New +** → **Static Site**
3. Connect repository GitHub của bạn: `Dduy07037/Hanzi`
4. Cấu hình:
   - **Name**: `han-ngu-hub-frontend`
   - **Root Directory**: `frontend` ⚠️ **QUAN TRỌNG**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. Thêm Environment Variable:
   ```
   VITE_API_BASE_URL=https://han-ngu-hub-backend.onrender.com/api
   ```
   (Thay `han-ngu-hub-backend` bằng tên backend service thực tế của bạn)

6. Click **Create Static Site**

## Bước 4: Cập nhật CORS

1. Vào Backend service
2. Vào **Environment** tab
3. Cập nhật `FRONTEND_URL` thành URL frontend thực tế:
   ```
   FRONTEND_URL=https://hanzi-q503.onrender.com
   ```
   (Thay bằng URL frontend thực tế của bạn)
   
   **Lưu ý**: Nếu có nhiều frontend URLs, dùng dấu phẩy để phân cách:
   ```
   FRONTEND_URL=https://hanzi-q503.onrender.com,https://han-ngu-hub-frontend.onrender.com
   ```
4. Click **Save Changes** - Service sẽ tự động restart

## Bước 5: Kiểm tra

1. Truy cập frontend URL
2. Thử đăng ký tài khoản mới
3. Kiểm tra các tính năng hoạt động

## Lưu ý quan trọng

### Root Directory
- **Backend**: Phải set `backend` trong Root Directory
- **Frontend**: Phải set `frontend` trong Root Directory

### Build Commands
- **Backend**: `npm install && npm run build` (không cần `cd backend` vì đã set Root Directory)
- **Frontend**: `npm install && npm run build` (không cần `cd frontend` vì đã set Root Directory)

### Node Version
- Không dùng Node.js 22 (có thể có vấn đề)
- Dùng Node.js 18 hoặc 20

### Database Setup
- **BẮT BUỘC** phải chạy migrations sau khi deploy backend lần đầu
- Vào Shell tab và chạy:
  ```bash
  npx prisma generate
  npx prisma db push
  npm run db:seed
  ```

## Troubleshooting

### Backend không kết nối được database
- Kiểm tra `DATABASE_URL` đúng format
- Đảm bảo database và backend cùng region
- Kiểm tra Internal Database URL (không phải External)
- Đảm bảo đã chạy `prisma db push` trong Shell

### CORS errors
- Kiểm tra `FRONTEND_URL` trong backend env vars
- Đảm bảo URL không có trailing slash
- Restart backend service sau khi thay đổi

### Frontend không gọi được API
- Kiểm tra `VITE_API_BASE_URL` trong frontend env vars
- Đảm bảo URL có `/api` ở cuối
- Rebuild frontend sau khi thay đổi env vars

### Build fails
- Kiểm tra Root Directory đã set đúng chưa
- Kiểm tra Node version (dùng 18 hoặc 20)
- Xem build logs để biết lỗi cụ thể

### Module not found errors
- Đảm bảo Root Directory đã set đúng
- Kiểm tra build command có chạy thành công không
- Đảm bảo `npm run build` tạo ra thư mục `dist`

## Free Tier Limitations

- **Free tier** có thể bị sleep sau 15 phút không hoạt động
- Database free tier có giới hạn 90 ngày
- Để production thực sự, nên upgrade lên paid plan
- Backup database thường xuyên
