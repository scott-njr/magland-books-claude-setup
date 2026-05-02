# Magland Books — full project setup (Windows PowerShell).
# One command. Idempotent. Run on a fresh clone OR after `git pull` to refresh everything.
#
# What it does:
#   1. Installs (or updates) Claude Code agents and skills to $HOME\.claude\
#   2. Installs npm dependencies
#   3. Installs the pre-commit secret-scanning hook
#   4. Creates .env.local from the template if missing
#
# Usage:
#   .\setup.ps1
#   .\setup.ps1 -SkipClaude     # skip agent/skill install
#   .\setup.ps1 -SkipNpm        # skip npm install

param(
    [switch]$SkipClaude,
    [switch]$SkipNpm
)

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host ""
Write-Host "Magland Books — project setup" -ForegroundColor Cyan
Write-Host "Safe to re-run any time. Run after every 'git pull' to stay in sync." -ForegroundColor DarkGray
Write-Host ""

# ─── pre-flight ────────────────────────────────────────────────────────────
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "Node is not installed." -ForegroundColor Red
    Write-Host "  Install Node 20 or newer: https://nodejs.org/"
    exit 1
}
$nodeVersion = (node -v).TrimStart('v')
$nodeMajor = [int]($nodeVersion.Split('.')[0])
if ($nodeMajor -lt 20) {
    Write-Host "Node $nodeMajor.x detected. This project needs Node 20 or newer." -ForegroundColor Yellow
    exit 1
}
Write-Host "Node v$nodeVersion" -ForegroundColor Green

if (-not (Test-Path (Join-Path $ScriptDir '.git'))) {
    Write-Host "Not inside a git repository. Pre-commit hooks won't be installed." -ForegroundColor Yellow
}

Write-Host ""

# ─── 1. Claude Code agents + skills ────────────────────────────────────────
if (-not $SkipClaude) {
    Write-Host "[1/4] Claude Code agents and skills" -ForegroundColor White
    if (Test-Path (Join-Path $ScriptDir 'install.ps1')) {
        & (Join-Path $ScriptDir 'install.ps1') -Yes
    } else {
        Write-Host "  install.ps1 not found — skipping." -ForegroundColor Yellow
    }
} else {
    Write-Host "[1/4] Skipped (-SkipClaude)" -ForegroundColor DarkGray
}
Write-Host ""

# ─── 2. npm dependencies ───────────────────────────────────────────────────
if (-not $SkipNpm) {
    Write-Host "[2/4] Installing npm dependencies" -ForegroundColor White
    if (-not (Test-Path (Join-Path $ScriptDir 'package.json'))) {
        Write-Host "  package.json not found — skipping." -ForegroundColor Yellow
    } else {
        npm install --no-audit --no-fund | Select-Object -Last 3
        Write-Host "Dependencies installed" -ForegroundColor Green
    }
} else {
    Write-Host "[2/4] Skipped (-SkipNpm)" -ForegroundColor DarkGray
}
Write-Host ""

# ─── 3. Pre-commit hook ────────────────────────────────────────────────────
Write-Host "[3/4] Pre-commit secret-scanner hook" -ForegroundColor White
$hookInstaller = Join-Path $ScriptDir 'scripts\install-git-hooks.sh'
if ((Test-Path $hookInstaller) -and (Test-Path (Join-Path $ScriptDir '.git'))) {
    # The installer is bash. On Windows, prefer Git Bash.
    $bash = Get-Command bash -ErrorAction SilentlyContinue
    if ($bash) {
        bash $hookInstaller
    } else {
        Write-Host "  bash not found in PATH. Install Git for Windows (which includes Git Bash)" -ForegroundColor Yellow
        Write-Host "  then re-run setup.ps1, or manually copy scripts\git-hooks\pre-commit" -ForegroundColor Yellow
        Write-Host "  to .git\hooks\pre-commit." -ForegroundColor Yellow
    }
} else {
    Write-Host "  Skipped (not in a git repo or installer missing)" -ForegroundColor DarkGray
}
Write-Host ""

# ─── 4. .env.local ─────────────────────────────────────────────────────────
Write-Host "[4/4] Local environment file" -ForegroundColor White
$envLocal = Join-Path $ScriptDir '.env.local'
$envExample = Join-Path $ScriptDir '.env.local.example'
$envCreated = $false
if (Test-Path $envLocal) {
    Write-Host "  .env.local already exists - leaving it alone." -ForegroundColor DarkGray
} elseif (Test-Path $envExample) {
    Copy-Item $envExample $envLocal
    Write-Host "Created .env.local from .env.local.example" -ForegroundColor Green
    $envCreated = $true
} else {
    Write-Host "  No .env.local.example found - skipping." -ForegroundColor Yellow
}
Write-Host ""

# ─── done ──────────────────────────────────────────────────────────────────
Write-Host "Setup complete." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps" -ForegroundColor White
Write-Host ""

if ($envCreated) {
    Write-Host "  1. Fill in .env.local - open the file and add real values."
    Write-Host "       Resend (newsletter + contact):       https://resend.com - verify the maglandbooks.com domain, then create an API key + Audience"
    Write-Host "       Square (checkout):                   https://developer.squareup.com/apps"
    Write-Host "  Never paste these values into any other file. Never commit .env.local." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  2. Start the dev server"
} else {
    Write-Host "  1. Start the dev server"
}
Write-Host "       npm run dev    - http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "To update everything later: git pull; .\setup.ps1" -ForegroundColor DarkGray
Write-Host ""
