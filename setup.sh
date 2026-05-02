#!/usr/bin/env bash
# Magland Books — full project setup.
# One command. Idempotent. Run on a fresh clone OR after `git pull` to refresh everything.
#
# What it does:
#   1. Installs (or updates) Claude Code agents and skills to ~/.claude/
#   2. Installs npm dependencies
#   3. Installs the pre-commit secret-scanning hook
#   4. Creates .env.local from the template if missing
#
# Usage:
#   bash setup.sh
#   bash setup.sh --skip-claude     # skip agent/skill install (e.g. you don't use Claude Code)
#   bash setup.sh --skip-npm        # skip npm install (rare — only for a partial refresh)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# ─── colors ────────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  BOLD='\033[1m'; CYAN='\033[36m'; GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; DIM='\033[2m'; RESET='\033[0m'
else
  BOLD=''; CYAN=''; GREEN=''; YELLOW=''; RED=''; DIM=''; RESET=''
fi

# ─── flags ─────────────────────────────────────────────────────────────────
SKIP_CLAUDE=0
SKIP_NPM=0
for arg in "$@"; do
  case "$arg" in
    --skip-claude) SKIP_CLAUDE=1 ;;
    --skip-npm)    SKIP_NPM=1 ;;
    --help|-h)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
  esac
done

# ─── pre-flight ────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}Magland Books — project setup${RESET}"
echo -e "${DIM}Safe to re-run any time. Run after every 'git pull' to stay in sync.${RESET}"
echo ""

# Check Node version
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}❌ Node is not installed.${RESET}"
  echo "   Install Node 20 or newer: https://nodejs.org/"
  echo "   On macOS:  brew install node"
  exit 1
fi
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo -e "${YELLOW}⚠️  Node ${NODE_MAJOR}.x detected. This project needs Node 20 or newer.${RESET}"
  echo "   Update Node and re-run setup.sh."
  exit 1
fi
echo -e "${GREEN}✓${RESET} Node $(node -v)"

# Check git
if ! command -v git >/dev/null 2>&1 || [ ! -d "$SCRIPT_DIR/.git" ]; then
  echo -e "${YELLOW}⚠️  Not inside a git repository.${RESET} Pre-commit hooks won't be installed."
fi

echo ""

# ─── 1. Claude Code agents + skills ────────────────────────────────────────
if [ $SKIP_CLAUDE -eq 0 ]; then
  echo -e "${BOLD}[1/4] Claude Code agents and skills${RESET}"
  if [ -f "$SCRIPT_DIR/install.sh" ]; then
    bash "$SCRIPT_DIR/install.sh" --yes
  else
    echo -e "${YELLOW}  install.sh not found — skipping.${RESET}"
  fi
else
  echo -e "${DIM}[1/4] Skipped (--skip-claude)${RESET}"
fi
echo ""

# ─── 2. npm dependencies ───────────────────────────────────────────────────
if [ $SKIP_NPM -eq 0 ]; then
  echo -e "${BOLD}[2/4] Installing npm dependencies${RESET}"
  if [ ! -f "$SCRIPT_DIR/package.json" ]; then
    echo -e "${YELLOW}  package.json not found — skipping.${RESET}"
  else
    npm install --no-audit --no-fund 2>&1 | tail -3
    echo -e "${GREEN}✓${RESET} Dependencies installed"
  fi
else
  echo -e "${DIM}[2/4] Skipped (--skip-npm)${RESET}"
fi
echo ""

# ─── 3. Pre-commit secret-scanner hook ─────────────────────────────────────
echo -e "${BOLD}[3/4] Pre-commit secret-scanner hook${RESET}"
if [ -f "$SCRIPT_DIR/scripts/install-git-hooks.sh" ] && [ -d "$SCRIPT_DIR/.git" ]; then
  bash "$SCRIPT_DIR/scripts/install-git-hooks.sh"
else
  echo -e "${DIM}  Skipped (not in a git repo or installer missing)${RESET}"
fi
echo ""

# ─── 4. .env.local from template ───────────────────────────────────────────
echo -e "${BOLD}[4/4] Local environment file${RESET}"
if [ -f "$SCRIPT_DIR/.env.local" ]; then
  echo -e "${DIM}  .env.local already exists — leaving it alone.${RESET}"
elif [ -f "$SCRIPT_DIR/.env.local.example" ]; then
  cp "$SCRIPT_DIR/.env.local.example" "$SCRIPT_DIR/.env.local"
  echo -e "${GREEN}✓${RESET} Created .env.local from .env.local.example"
  ENV_CREATED=1
else
  echo -e "${YELLOW}  No .env.local.example found — skipping.${RESET}"
fi
echo ""

# ─── done ──────────────────────────────────────────────────────────────────
echo -e "${BOLD}${GREEN}Setup complete.${RESET}"
echo ""
echo -e "${BOLD}Next steps${RESET}"
echo ""

if [ "${ENV_CREATED:-0}" -eq 1 ]; then
  echo -e "  ${BOLD}1. Fill in .env.local${RESET} — open the file and add real values."
  echo -e "     ${DIM}• Apps Script (newsletter + contact):  see docs/apps-script/README.md${RESET}"
  echo -e "     ${DIM}• Square (checkout):                  https://developer.squareup.com/apps${RESET}"
  echo -e "     ${YELLOW}⚠️  Never paste these values into any other file. Never commit .env.local.${RESET}"
  echo ""
  echo -e "  ${BOLD}2. Start the dev server${RESET}"
else
  echo -e "  ${BOLD}1. Start the dev server${RESET}"
fi
echo -e "       ${CYAN}npm run dev${RESET}    ${DIM}— http://localhost:3000${RESET}"
echo ""
echo -e "  ${BOLD}Other useful commands${RESET}"
echo -e "       ${CYAN}npm test${RESET}                  Run unit tests"
echo -e "       ${CYAN}npm run lint${RESET}              ESLint"
echo -e "       ${CYAN}npm run lint:conventions${RESET}  Project rules (no any, no inline styles, etc.)"
echo -e "       ${CYAN}npm run build${RESET}             Production build"
echo ""
echo -e "${DIM}To update everything later: git pull && bash setup.sh${RESET}"
echo ""
