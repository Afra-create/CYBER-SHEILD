while ($true) {
    Write-Host "Syncing at $(Get-Date)..."
    
    # Fetch and Pull
    git fetch origin main
    git pull origin main --rebase
    
    # Stage and Commit local changes
    git add .
    if (git status --porcelain) {
        git commit -m "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git push origin main
    } else {
        Write-Host "No changes to commit."
    }
    
    Write-Host "Next sync in 60 seconds..."
    Start-Sleep -Seconds 60
}
