# Hướng dẫn Setup Backend

## Yêu cầu
- Node.js 18+
- PostgreSQL 14+
- npm hoặc yarn

## Các bước setup

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Database

Tạo file `.env` trong thư mục `backend/` với nội dung:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/han_ngu_hub?schema=public"

# JWT Secret (thay đổi thành secret key mạnh trong production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Port
PORT=3001

# Frontend URL (optional)
FRONTEND_URL="http://localhost:5173"
```

**Lưu ý:** Thay `username`, `password`, và `localhost:5432` bằng thông tin database của bạn.

### 3. Tạo Database

Tạo database PostgreSQL:
```sql
CREATE DATABASE han_ngu_hub;
```

### 4. Setup Database Schema và Seed Data

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database với dữ liệu mẫu
npm run db:seed
```

Hoặc chạy tất cả cùng lúc:
```bash
npm run db:setup
```

### 5. Chạy Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

Server sẽ chạy tại `http://localhost:3001`

## Kiểm tra

Kiểm tra server đang chạy:
```bash
curl http://localhost:3001/health
```

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra DATABASE_URL trong file .env
- Kiểm tra username/password đúng

### Lỗi Prisma Client
```bash
npm run db:generate
```

### Lỗi JWT_SECRET
Đảm bảo JWT_SECRET đã được cấu hình trong file .env

### Database chưa có dữ liệu
```bash
npm run db:seed
```


