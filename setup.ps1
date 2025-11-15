# Setup Script cho Hán Ngữ Hub
# Chạy script này: .\setup.ps1

Write-Host "🚀 Bắt đầu setup Hán Ngữ Hub..." -ForegroundColor Green

# Kiểm tra Node.js
Write-Host "`n📦 Kiểm tra Node.js..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng cài Node.js 18+ từ: https://nodejs.org" -ForegroundColor Yellow
    Write-Host "Sau khi cài xong, chạy lại script này." -ForegroundColor Yellow
    exit 1
}
$nodeVersion = node --version
Write-Host "✅ Node.js đã cài: $nodeVersion" -ForegroundColor Green

# Kiểm tra npm
Write-Host "`n📦 Kiểm tra npm..." -ForegroundColor Yellow
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm chưa được cài đặt!" -ForegroundColor Red
    exit 1
}
$npmVersion = npm --version
Write-Host "✅ npm đã cài: $npmVersion" -ForegroundColor Green

# Kiểm tra PostgreSQL
Write-Host "`n🐘 Kiểm tra PostgreSQL..." -ForegroundColor Yellow
$pgPath = "C:\Program Files\PostgreSQL\14\bin\psql.exe"
if (!(Test-Path $pgPath)) {
    $pgPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
}
if (!(Test-Path $pgPath)) {
    $pgPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
}

if (!(Test-Path $pgPath) -and !(Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  PostgreSQL chưa được tìm thấy!" -ForegroundColor Yellow
    Write-Host "Vui lòng cài PostgreSQL từ: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "Hoặc dùng Docker: docker run --name han-ngu-hub-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=han_ngu_hub -p 5432:5432 -d postgres:14" -ForegroundColor Yellow
    Write-Host "`nBạn có muốn tiếp tục setup phần còn lại không? (y/n)" -ForegroundColor Yellow
    $continue = Read-Host
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
} else {
    Write-Host "✅ PostgreSQL đã được cài đặt" -ForegroundColor Green
}

# Cài đặt dependencies Backend
Write-Host "`n📦 Cài đặt dependencies Backend..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path node_modules) {
    Write-Host "⚠️  node_modules đã tồn tại, bỏ qua npm install" -ForegroundColor Yellow
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Lỗi khi cài đặt dependencies backend!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Backend dependencies đã cài xong" -ForegroundColor Green

# Kiểm tra file .env
Write-Host "`n⚙️  Kiểm tra file .env..." -ForegroundColor Yellow
if (!(Test-Path .env)) {
    Write-Host "⚠️  File .env chưa tồn tại, đang tạo..." -ForegroundColor Yellow
    @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/han_ngu_hub?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
FRONTEND_URL="http://localhost:5173"
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ Đã tạo file .env" -ForegroundColor Green
    Write-Host "⚠️  VUI LÒNG SỬA FILE backend/.env nếu password PostgreSQL khác 'postgres'!" -ForegroundColor Yellow
} else {
    Write-Host "✅ File .env đã tồn tại" -ForegroundColor Green
}

# Setup database
Write-Host "`n🗄️  Setup database..." -ForegroundColor Yellow
Write-Host "Đang generate Prisma Client..." -ForegroundColor Cyan
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Lỗi khi generate Prisma Client!" -ForegroundColor Red
    exit 1
}

Write-Host "Đang push schema to database..." -ForegroundColor Cyan
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Lỗi khi push schema. Có thể database chưa được tạo." -ForegroundColor Yellow
    Write-Host "Vui lòng tạo database 'han_ngu_hub' trước:" -ForegroundColor Yellow
    Write-Host "  psql -U postgres -c 'CREATE DATABASE han_ngu_hub;'" -ForegroundColor Cyan
    Write-Host "Sau đó chạy lại: npm run db:push" -ForegroundColor Yellow
}

Write-Host "Đang seed dữ liệu mẫu..." -ForegroundColor Cyan
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Lỗi khi seed data. Có thể database chưa sẵn sàng." -ForegroundColor Yellow
}

Set-Location ..

# Cài đặt dependencies Frontend
Write-Host "`n📦 Cài đặt dependencies Frontend..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path node_modules) {
    Write-Host "⚠️  node_modules đã tồn tại, bỏ qua npm install" -ForegroundColor Yellow
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Lỗi khi cài đặt dependencies frontend!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Frontend dependencies đã cài xong" -ForegroundColor Green

Set-Location ..

# Hoàn tất
Write-Host "`n✅ Setup hoàn tất!" -ForegroundColor Green
Write-Host "`n📝 Các bước tiếp theo:" -ForegroundColor Yellow
Write-Host "1. Đảm bảo PostgreSQL đang chạy" -ForegroundColor White
Write-Host "2. Tạo database nếu chưa có:" -ForegroundColor White
Write-Host "   psql -U postgres -c 'CREATE DATABASE han_ngu_hub;'" -ForegroundColor Cyan
Write-Host "3. Sua file backend/.env neu password PostgreSQL khac 'postgres'" -ForegroundColor White
Write-Host "4. Chay backend (Terminal 1):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host "5. Chay frontend (Terminal 2):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host "6. Mo trinh duyet: http://localhost:5173" -ForegroundColor White
Write-Host "`nSetup hoan tat! Chuc ban hoc tieng Trung vui ve!" -ForegroundColor Green

