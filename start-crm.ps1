$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Backend = Join-Path $Root "crm-backend"
$Frontend = Join-Path $Root "crm-frontend"

Write-Host "Starting Support CRM backend on http://127.0.0.1:8000 ..."
Start-Process -FilePath python `
  -ArgumentList "-m uvicorn app.main:app --host 127.0.0.1 --port 8000" `
  -WorkingDirectory $Backend `
  -WindowStyle Hidden

Start-Sleep -Seconds 2

try {
  $health = Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/health
  Write-Host "Backend ready: $($health.Content)"
} catch {
  Write-Host "Backend did not respond on port 8000. Check Python dependencies or port usage."
}

Write-Host "Starting Support CRM frontend on http://127.0.0.1:3000 ..."
Start-Process -FilePath npm `
  -ArgumentList "start" `
  -WorkingDirectory $Frontend `
  -WindowStyle Hidden

Start-Sleep -Seconds 4

try {
  $frontend = Invoke-WebRequest -UseBasicParsing -Headers @{ Accept = "text/html" } http://127.0.0.1:3000/
  Write-Host "Frontend ready: HTTP $($frontend.StatusCode)"
} catch {
  Write-Host "Frontend did not respond on port 3000. Check npm install or port usage."
}

Write-Host ""
Write-Host "Open http://127.0.0.1:3000/ in your browser."
