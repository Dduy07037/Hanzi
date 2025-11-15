# Script tai file CC-CEDICT tu dong
# Chay: .\backend\scripts\download-cedict.ps1

$cedictUrl = "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz"
$outputDir = "backend\prisma"
$gzFile = "$outputDir\cedict_1_0_ts_utf-8_mdbg.txt.gz"
$txtFile = "$outputDir\cedict_1_0_ts_utf-8_mdbg.txt"

Write-Host "Dang tai file CC-CEDICT..." -ForegroundColor Yellow
Write-Host "URL: $cedictUrl" -ForegroundColor Cyan

# Tao thu muc neu chua co
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Tai file
try {
    Write-Host "Dang download..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $cedictUrl -OutFile $gzFile -UseBasicParsing
    Write-Host "Da tai file thanh cong!" -ForegroundColor Green
} catch {
    Write-Host "Loi khi tai file: $_" -ForegroundColor Red
    Write-Host "Vui long tai thu cong tu: https://www.mdbg.net/chinese/dictionary?page=cc-cedict" -ForegroundColor Yellow
    exit 1
}

# Giai nen file .gz
Write-Host "Dang giai nen file..." -ForegroundColor Yellow

# Kiem tra xem co 7-Zip khong
$7zipPath = "C:\Program Files\7-Zip\7z.exe"
if (Test-Path $7zipPath) {
    & $7zipPath x $gzFile -o"$outputDir" -y | Out-Null
    Write-Host "Da giai nen bang 7-Zip" -ForegroundColor Green
} else {
    # Thu dung .NET de giai nen
    try {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        $gzStream = New-Object System.IO.FileStream($gzFile, [System.IO.FileMode]::Open)
        $gzipStream = New-Object System.IO.Compression.GZipStream($gzStream, [System.IO.Compression.CompressionMode]::Decompress)
        $outputStream = New-Object System.IO.FileStream($txtFile, [System.IO.FileMode]::Create)
        $gzipStream.CopyTo($outputStream)
        $outputStream.Close()
        $gzipStream.Close()
        $gzStream.Close()
        Write-Host "Da giai nen bang .NET" -ForegroundColor Green
    } catch {
        Write-Host "Khong the giai nen tu dong. Vui long giai nen thu cong file:" -ForegroundColor Yellow
        Write-Host "   $gzFile" -ForegroundColor Cyan
        Write-Host "Va doi ten thanh: cedict_1_0_ts_utf-8_mdbg.txt" -ForegroundColor Yellow
        exit 1
    }
}

# Xoa file .gz sau khi giai nen
if (Test-Path $txtFile) {
    Remove-Item $gzFile -Force -ErrorAction SilentlyContinue
    Write-Host "Da giai nen thanh cong!" -ForegroundColor Green
    Write-Host "File da duoc luu tai: $txtFile" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Bay gio ban co the chay:" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor Cyan
    Write-Host "   npm run db:seed" -ForegroundColor Cyan
} else {
    Write-Host "Khong tim thay file sau khi giai nen!" -ForegroundColor Red
    Write-Host "Vui long kiem tra file: $gzFile" -ForegroundColor Yellow
}
