# Hướng dẫn Setup Hoàn Chỉnh - Hán Ngữ Hub

## Bước 1: Cài đặt PostgreSQL

### Windows

1. **Tải PostgreSQL:**
   - Truy cập: https://www.postgresql.org/download/windows/
   - Hoặc dùng installer: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Chọn phiên bản PostgreSQL 14 hoặc mới hơn

2. **Cài đặt:**
   - Chạy installer
   - **Quan trọng:** Ghi nhớ password bạn đặt cho user `postgres` (mặc định)
   - Port mặc định: `5432` (giữ nguyên nếu không có xung đột)
   - Chọn locale: `Vietnamese, Vietnam` hoặc `English, United States`

3. **Kiểm tra cài đặt:**
   - Mở Command Prompt hoặc PowerShell
   - Chạy: `psql --version`
   - Nếu hiển thị version thì đã cài thành công

### Alternative: Dùng Docker (Dễ hơn)

Nếu bạn đã cài Docker Desktop:

```bash
docker run --name han-ngu-hub-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=han_ngu_hub -p 5432:5432 -d postgres:14
```

## Bước 2: Tạo Database

### Cách 1: Dùng pgAdmin (GUI - Dễ nhất)

1. Mở **pgAdmin 4** (đã cài cùng PostgreSQL)
2. Kết nối với server (nhập password postgres)
3. Right-click vào **Databases** → **Create** → **Database**
4. Tên database: `han_ngu_hub`
5. Click **Save**

### Cách 2: Dùng Command Line

Mở Command Prompt hoặc PowerShell:

```bash
# Kết nối PostgreSQL (nhập password khi được hỏi)
psql -U postgres

# Trong psql prompt, chạy:
CREATE DATABASE han_ngu_hub;

# Thoát
\q
```

### Cách 3: Dùng SQL Script

Tạo file `create-db.sql`:
```sql
CREATE DATABASE han_ngu_hub;
```

Chạy:
```bash
psql -U postgres -f create-db.sql
```

## Bước 3: Cập nhật file .env

Mở file `backend/.env` và sửa `DATABASE_URL`:

```env
# Nếu password postgres là "postgres" (mặc định)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/han_ngu_hub?schema=public"

# Nếu bạn đã đổi password, thay "postgres" bằng password của bạn
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/han_ngu_hub?schema=public"

JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

## Bước 4: Cài đặt Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Bước 5: Setup Database Schema và Seed Data

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed dữ liệu mẫu (10 từ tiếng Trung)
npm run db:seed
```

Hoặc chạy tất cả cùng lúc:
```bash
npm run db:setup
```

## Bước 6: Chạy Ứng dụng

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3001`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## Kiểm tra

1. Mở trình duyệt: `http://localhost:5173`
2. Bạn sẽ thấy trang chủ Hán Ngữ Hub
3. Thử đăng ký tài khoản mới
4. Thử tra cứu từ: "你好" hoặc "hello"

## Troubleshooting

### Lỗi: "psql: command not found"
- Thêm PostgreSQL vào PATH:
  - Windows: Thêm `C:\Program Files\PostgreSQL\14\bin` vào System PATH
  - Hoặc dùng full path: `"C:\Program Files\PostgreSQL\14\bin\psql.exe"`

### Lỗi: "password authentication failed"
- Kiểm tra password trong file `.env` đúng với password bạn đặt khi cài PostgreSQL
- Hoặc reset password:
  ```sql
  ALTER USER postgres PASSWORD 'newpassword';
  ```

### Lỗi: "database does not exist"
- Tạo database theo Bước 2

### Lỗi: "port 5432 already in use"
- PostgreSQL đã chạy rồi (tốt!)
- Hoặc có service khác đang dùng port 5432

### Lỗi: "Prisma Client not generated"
```bash
cd backend
npm run db:generate
```

### Lỗi kết nối database
- Kiểm tra PostgreSQL service đang chạy:
  - Windows: Services → PostgreSQL
- Kiểm tra file `.env` có đúng format không
- Kiểm tra database `han_ngu_hub` đã được tạo chưa

## Quick Start Script (Windows PowerShell)

Tạo file `setup.ps1` trong thư mục gốc và chạy:

```powershell
# Kiểm tra Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js chưa được cài đặt. Vui lòng cài Node.js 18+ từ https://nodejs.org"
    exit
}

# Kiểm tra PostgreSQL
if (!(Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Host "❌ PostgreSQL chưa được cài đặt. Vui lòng cài PostgreSQL từ https://www.postgresql.org/download/"
    exit
}

Write-Host "✅ Đang cài đặt dependencies..."
cd backend
npm install
cd ../frontend
npm install

Write-Host "✅ Đang setup database..."
cd ../backend
npm run db:setup

Write-Host "✅ Setup hoàn tất!"
Write-Host "Chạy backend: cd backend && npm run dev"
Write-Host "Chạy frontend: cd frontend && npm run dev"
```


