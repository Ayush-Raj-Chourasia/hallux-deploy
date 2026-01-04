# 🔄 Auto-Sync Script for Deployment Repo
# Run this whenever you make changes to push to both repos

Write-Host "`n🔄 HALLUX AUTO-SYNC TO DEPLOYMENT REPO" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we have uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Found uncommitted changes, committing..." -ForegroundColor Yellow
    git add -A
    $message = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($message)) {
        $message = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    git commit -m $message
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✅ No uncommitted changes" -ForegroundColor Green
}

Write-Host ""
Write-Host "📤 Pushing to main repo (ByteQuest-2025/GFGBQ-Team-idiotics)..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pushed to main repo" -ForegroundColor Green
} else {
    Write-Host "⚠️  Failed to push to main repo" -ForegroundColor Red
}

Write-Host ""
Write-Host "📤 Pushing to deployment repo (Ayush-Raj-Chourasia/hallux-deploy)..." -ForegroundColor Yellow

# Create orphan branch to avoid history issues
git checkout --orphan temp-deploy 2>$null
git add -A
git commit -m "Sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 2>$null
git push deploy temp-deploy:main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pushed to deployment repo" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 SYNC COMPLETE!" -ForegroundColor Green
    Write-Host "   Main repo: https://github.com/ByteQuest-2025/GFGBQ-Team-idiotics" -ForegroundColor White
    Write-Host "   Deploy repo: https://github.com/Ayush-Raj-Chourasia/hallux-deploy" -ForegroundColor White
    Write-Host "   Azure will auto-deploy from: hallux-deploy" -ForegroundColor White
} else {
    Write-Host "⚠️  Failed to push to deployment repo" -ForegroundColor Red
}

# Go back to main branch
git checkout main 2>$null
git branch -D temp-deploy 2>$null

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Done! Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
