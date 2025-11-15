# Script kill process dang dung port
# Su dung: .\backend\scripts\kill-port.ps1 3001

param(
    [Parameter(Mandatory=$true)]
    [int]$Port
)

Write-Host "Tim process dang dung port $Port..." -ForegroundColor Yellow

$connections = netstat -ano | findstr ":$Port"
if ($connections) {
    $pids = $connections | ForEach-Object {
        if ($_ -match '\s+(\d+)$') {
            $matches[1]
        }
    } | Select-Object -Unique
    
    foreach ($pid in $pids) {
        Write-Host "Kill process PID: $pid" -ForegroundColor Yellow
        taskkill /PID $pid /F 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Da kill process $pid" -ForegroundColor Green
        } else {
            Write-Host "Khong the kill process $pid (co the da bi kill hoac khong co quyen)" -ForegroundColor Yellow
        }
    }
    Write-Host "Port $Port da duoc giai phong!" -ForegroundColor Green
} else {
    Write-Host "Khong co process nao dang dung port $Port" -ForegroundColor Green
}

