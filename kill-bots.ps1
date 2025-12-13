# Kill all node processes
Write-Host "🛑 Stopping all Node.js processes..." -ForegroundColor Yellow

$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✅ Stopped $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Green
} else {
    Write-Host "✅ No Node.js processes running" -ForegroundColor Green
}

Write-Host "`n✨ All clear! You can now run 'npm start' once." -ForegroundColor Cyan
