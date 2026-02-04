$frontendAngular = "c:/Users/shilp/Desktop/My Workspace/Github Repo/Human-in-the-loop-Response-Orchestrator/frontend/angular-responder"
$frontendReact = "c:/Users/shilp/Desktop/My Workspace/Github Repo/Human-in-the-loop-Response-Orchestrator/frontend/react-analytics/react-analytics"
$backendIngestion = "c:/Users/shilp/Desktop/My Workspace/Github Repo/Human-in-the-loop-Response-Orchestrator/backend/alert-ingestion-node"
$backendOrchestrator = "c:/Users/shilp/Desktop/My Workspace/Github Repo/Human-in-the-loop-Response-Orchestrator/backend/incident-orchestrator-node"
$backendDjango = "c:/Users/shilp/Desktop/My Workspace/Github Repo/Human-in-the-loop-Response-Orchestrator/backend/recommendation-django"
$realtimeHub = "c:/Users/shilp/Desktop/My Workspace/Github Repo/Human-in-the-loop-Response-Orchestrator/realtime/websocket-approval-hub"

Write-Host "🚀 Starting Human-in-the-Loop Orchestrator Stack..." -ForegroundColor Cyan

# 1. MongoDB & SQLite (Assumed running or embedded)
# 2. Start WebSocket Hub
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$realtimeHub'; npm start"
Start-Sleep 2

# 3. Start Alert Ingestion
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendIngestion'; npm start"
Start-Sleep 2

# 4. Start Orchestrator
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendOrchestrator'; npm start"
Start-Sleep 2

# 5. Start Django Recommendation Engine
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDjango'; python manage.py runserver 8000"
Start-Sleep 2

# 6. Start Angular Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendAngular'; npm start"

# 7. Start React Analytics
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendReact'; npm run dev"

Write-Host "✅ All services launched!" -ForegroundColor Green
Write-Host "👉 Angular Console: http://localhost:4200"
Write-Host "👉 React Analytics: http://localhost:5173"
