# ==============================================================================
# n8n Social OmniFlow - 1-Click Easy Mode Auto-Setup & Launcher
# ==============================================================================

$ErrorActionPreference = "Continue"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "         ___  __  __ _  _ ___ ___ _    _____      __" -ForegroundColor Cyan
Write-Host "        / _ \|  \/  | \| |_ _| __| |  / _ \ \    / /" -ForegroundColor Cyan
Write-Host "       | (_) | |\/| | .\` || || _|| |__ (_) \ \/\/ / " -ForegroundColor Cyan
Write-Host "        \___/|_|  |_|_|\_|___|_| |____\___/ \_/\_/  " -ForegroundColor Cyan
Write-Host "       Autonomous Social OmniFlow - 1-Click Easy Mode Setup" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = $PSScriptRoot
Set-Location $ProjectRoot

# -----------------------------------------------------------------------------
# Step 1: Check Node.js Runtime
# -----------------------------------------------------------------------------
Write-Host "[1/6] Checking Node.js environment..." -ForegroundColor White
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  [!] Node.js not detected. Auto-installing via winget..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    $nodeVersion = node --version
    Write-Host "  [OK] Node.js is ready: $nodeVersion" -ForegroundColor Green
}

# -----------------------------------------------------------------------------
# Step 2: Auto-Generate .env Configuration
# -----------------------------------------------------------------------------
Write-Host "[2/6] Verifying environment secrets (.env)..." -ForegroundColor White
$envPath = Join-Path $ProjectRoot ".env"

if (-not (Test-Path $envPath)) {
    Write-Host "  [*] Creating new .env from template..." -ForegroundColor Yellow
    
    # Generate secure random 32-character hex key
    $bytes = New-Object byte[] 16
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $encryptionKey = ($bytes | ForEach-Object { "{0:x2}" -f $_ }) -join ''

    $geminiKey = if ($env:GEMINI_API_KEY) { $env:GEMINI_API_KEY } elseif ($env:GOOGLE_API_KEY) { $env:GOOGLE_API_KEY } else { "" }
    $googleClientId = if ($env:GOOGLE_CLIENT_ID) { $env:GOOGLE_CLIENT_ID } else { "" }
    $googleClientSecret = if ($env:GOOGLE_CLIENT_SECRET) { $env:GOOGLE_CLIENT_SECRET } else { "" }

    $lines = @(
        "# ==============================================================================",
        "# n8n Social OmniFlow - Environment Configuration (Auto-Generated)",
        "# ==============================================================================",
        "",
        "# --- AI & Application Hosting ---",
        "GEMINI_API_KEY=`"$geminiKey`"",
        "VITE_GEMINI_API_KEY=`"$geminiKey`"",
        "APP_URL=`"http://localhost:3000`"",
        "PORT=3000",
        "HOST=`"0.0.0.0`"",
        "",
        "# --- n8n Core Engine (Self-Hosted Docker / Local) ---",
        "N8N_HOST=`"localhost`"",
        "N8N_PORT=5678",
        "N8N_PROTOCOL=`"http`"",
        "N8N_ENCRYPTION_KEY=`"$encryptionKey`"",
        "WEBHOOK_URL=`"http://localhost:5678/`"",
        "N8N_DEFAULT_BINARY_DATA_MODE=`"filesystem`"",
        "",
        "# --- Webhook Security ---",
        "OMNIFLOW_WEBHOOK_SECRET=`"omniflow_sec_$encryptionKey`"",
        "",
        "# --- YouTube Data API v3 Credentials ---",
        "YOUTUBE_CLIENT_ID=`"$googleClientId`"",
        "YOUTUBE_CLIENT_SECRET=`"$googleClientSecret`"",
        "YOUTUBE_REFRESH_TOKEN=`"`"",
        "",
        "# --- TikTok Open API v2 Credentials ---",
        "TIKTOK_CLIENT_KEY=`"`"",
        "TIKTOK_CLIENT_SECRET=`"`"",
        "TIKTOK_ACCESS_TOKEN=`"`"",
        "",
        "# --- Meta Instagram Graph API v21.0 Credentials ---",
        "INSTAGRAM_ACCOUNT_ID=`"`"",
        "META_APP_ID=`"`"",
        "META_APP_SECRET=`"`"",
        "INSTAGRAM_USER_ACCESS_TOKEN=`"`"",
        "",
        "# --- Notifications & Dispatch Alerts ---",
        "DISCORD_WEBHOOK_URL=`"`"",
        "SLACK_WEBHOOK_URL=`"`""
    )
    $lines | Set-Content -Path $envPath -Encoding UTF8
    Write-Host "  [OK] Created .env with auto-generated encryption keys and detected API secrets" -ForegroundColor Green
} else {
    Write-Host "  [OK] Existing .env file found" -ForegroundColor Green
}

# -----------------------------------------------------------------------------
# Step 3: Install NPM Dependencies
# -----------------------------------------------------------------------------
Write-Host "[3/6] Checking project dependencies..." -ForegroundColor White
$nodeModulesPath = Join-Path $ProjectRoot "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "  [*] Installing packages (npm install --legacy-peer-deps)..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    Write-Host "  [OK] Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  [OK] Dependencies up to date" -ForegroundColor Green
}

# -----------------------------------------------------------------------------
# Step 4: Verify or Start n8n Engine
# -----------------------------------------------------------------------------
Write-Host "[4/6] Connecting to n8n Automation Engine (http://localhost:5678)..." -ForegroundColor White
$n8nRunning = $false
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:5678/healthz" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($resp.StatusCode -eq 200) { $n8nRunning = $true }
} catch {
    $n8nRunning = $false
}

if ($n8nRunning) {
    Write-Host "  [OK] Local n8n instance is ALIVE and reachable on port 5678!" -ForegroundColor Green
} else {
    Write-Host "  [!] n8n is not currently running on port 5678." -ForegroundColor Yellow
    
    # Check if Docker is available
    $dockerOk = $false
    try {
        $null = docker info 2>&1
        if ($LASTEXITCODE -eq 0) { $dockerOk = $true }
    } catch {
        $dockerOk = $false
    }

    if ($dockerOk) {
        Write-Host "  [+] Docker detected! Starting n8n container in background..." -ForegroundColor Cyan
        docker compose up -d n8n
        Start-Sleep -Seconds 3
    } else {
        Write-Host "  [i] Tip: Start n8n in another terminal with: npx n8n" -ForegroundColor Cyan
        Write-Host "      or start Docker Desktop to run: docker compose up -d" -ForegroundColor Cyan
    }
}

# -----------------------------------------------------------------------------
# Step 5: Check or Start OmniFlow Studio Frontend
# -----------------------------------------------------------------------------
Write-Host "[5/6] Checking OmniFlow Visual Studio (http://localhost:3000)..." -ForegroundColor White
$studioRunning = $false
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($resp.StatusCode -eq 200) { $studioRunning = $true }
} catch {
    $studioRunning = $false
}

if ($studioRunning) {
    Write-Host "  [OK] OmniFlow Visual Studio is already running on port 3000!" -ForegroundColor Green
} else {
    Write-Host "  [+] Starting Vite development server on port 3000..." -ForegroundColor Cyan
    Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory $ProjectRoot -WindowStyle Minimized
    Start-Sleep -Seconds 2
}

# -----------------------------------------------------------------------------
# Step 6: Launch Browser & Easy Mode Dashboard
# -----------------------------------------------------------------------------
Write-Host "[6/6] Launching OmniFlow Studio..." -ForegroundColor White
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  OmniFlow is ready to rock!" -ForegroundColor Green
Write-Host "  - Visual Studio:   http://localhost:3000" -ForegroundColor White
Write-Host "  - Cloud Mirror:    https://algebraic-inn-473617-m5.web.app" -ForegroundColor White
Write-Host "  - n8n Engine:      http://localhost:5678" -ForegroundColor White
Write-Host "  - Workflows Dir:   $ProjectRoot\workflows" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""
