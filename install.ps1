# Magland Books Redesign — install script (Windows PowerShell)
# Copies skills + agents from .\claude-config\ to $HOME\.claude\
# Safe to re-run; existing files are backed up to $HOME\.claude\.backup-yyyyMMdd-HHmmss\

param(
    [switch]$DryRun,
    [switch]$Yes
)

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Src = Join-Path $ScriptDir 'claude-config'
$Dest = Join-Path $HOME '.claude'
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$BackupDir = Join-Path $Dest ".backup-$Timestamp"

Write-Host ""
Write-Host "Magland Books Redesign — Claude Code installer" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Source:      $Src"
Write-Host "  Destination: $Dest"
if ($DryRun) {
    Write-Host "  Mode:        DRY RUN — no files will be written" -ForegroundColor Yellow
}
Write-Host ""

if (-not (Test-Path $Src)) {
    Write-Host "Error: claude-config\ not found next to install.ps1." -ForegroundColor Red
    Write-Host "Are you running this from the repo root? Try: cd <repo>; .\install.ps1"
    exit 1
}

# Detect existing
$NeedsBackup = @()
Get-ChildItem (Join-Path $Src 'agents') -Filter '*.md' -ErrorAction SilentlyContinue | ForEach-Object {
    $existing = Join-Path (Join-Path $Dest 'agents') $_.Name
    if (Test-Path $existing) { $NeedsBackup += "agents\$($_.Name)" }
}
Get-ChildItem (Join-Path $Src 'skills') -Directory -ErrorAction SilentlyContinue | ForEach-Object {
    $existing = Join-Path (Join-Path $Dest 'skills') $_.Name
    if (Test-Path $existing) { $NeedsBackup += "skills\$($_.Name)" }
}

# Plan
Write-Host "Plan" -ForegroundColor White
Write-Host ""
Write-Host "  Agents to install:"
Get-ChildItem (Join-Path $Src 'agents') -Filter '*.md' -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "    + $($_.Name)" -ForegroundColor Green
}
Write-Host ""
Write-Host "  Skills to install:"
Get-ChildItem (Join-Path $Src 'skills') -Directory -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "    + $($_.Name)" -ForegroundColor Green
}

if ($NeedsBackup.Count -gt 0) {
    Write-Host ""
    Write-Host "  Existing files that will be backed up to:" -ForegroundColor Yellow
    Write-Host "  $BackupDir"
    foreach ($item in $NeedsBackup) {
        Write-Host "    ~ $item" -ForegroundColor Yellow
    }
}
Write-Host ""

if ($DryRun) {
    Write-Host "Dry run — exiting without changes." -ForegroundColor Yellow
    Write-Host "Run without -DryRun to install."
    exit 0
}

if (-not $Yes) {
    $confirm = Read-Host "Proceed with install? [y/N]"
    if ($confirm -notmatch '^[Yy]') {
        Write-Host "Cancelled."
        exit 0
    }
}

# Backup
if ($NeedsBackup.Count -gt 0) {
    New-Item -ItemType Directory -Force -Path (Join-Path $BackupDir 'agents') | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $BackupDir 'skills') | Out-Null
    foreach ($item in $NeedsBackup) {
        $existing = Join-Path $Dest $item
        if (Test-Path $existing) {
            $backupTarget = Join-Path $BackupDir (Split-Path -Parent $item)
            Copy-Item -Path $existing -Destination $backupTarget -Recurse -Force
        }
    }
    Write-Host "Backed up to $BackupDir"
}

# Install
New-Item -ItemType Directory -Force -Path (Join-Path $Dest 'agents') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Dest 'skills') | Out-Null

Get-ChildItem (Join-Path $Src 'agents') -Filter '*.md' | ForEach-Object {
    Copy-Item $_.FullName -Destination (Join-Path $Dest 'agents') -Force
}
Get-ChildItem (Join-Path $Src 'skills') -Directory | ForEach-Object {
    $target = Join-Path (Join-Path $Dest 'skills') $_.Name
    if (Test-Path $target) { Remove-Item $target -Recurse -Force }
    Copy-Item -Path $_.FullName -Destination (Join-Path $Dest 'skills') -Recurse -Force
}

Write-Host ""
Write-Host "Agents and skills installed to $HOME\.claude\" -ForegroundColor Green
Write-Host ""
Write-Host "This script only installs the Claude Code agents and skills."
Write-Host "For full project setup (npm install, git hooks, .env.local), run:"
Write-Host "  .\setup.ps1"
Write-Host ""
Write-Host "To undo just the agents/skills: .\uninstall.sh (or remove from $HOME\.claude\)"
Write-Host ""
