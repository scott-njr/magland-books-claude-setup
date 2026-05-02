#!/usr/bin/env bash
# Magland Books Redesign — install script
# Copies skills + agents from ./claude-config/ to ~/.claude/
# Safe to re-run; existing files are backed up to ~/.claude/.backup-YYYYMMDD-HHMMSS/
set -e

# Color output if terminal supports it
if [ -t 1 ]; then
  BOLD='\033[1m'; CYAN='\033[36m'; GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; DIM='\033[2m'; RESET='\033[0m'
else
  BOLD=''; CYAN=''; GREEN=''; YELLOW=''; RED=''; DIM=''; RESET=''
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC="$SCRIPT_DIR/claude-config"
DEST="$HOME/.claude"
BACKUP_DIR="$DEST/.backup-$(date +%Y%m%d-%H%M%S)"

DRY_RUN=0
ASSUME_YES=0
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY_RUN=1 ;;
    --yes|-y)     ASSUME_YES=1 ;;
  esac
done

echo ""
echo -e "${BOLD}${CYAN}Magland Books Redesign — Claude Code installer${RESET}"
echo ""
echo -e "  Source:      ${DIM}$SRC${RESET}"
echo -e "  Destination: ${DIM}$DEST${RESET}"
if [ $DRY_RUN -eq 1 ]; then
  echo -e "  Mode:        ${YELLOW}DRY RUN — no files will be written${RESET}"
fi
echo ""

# Sanity check
if [ ! -d "$SRC" ]; then
  echo -e "${RED}Error:${RESET} claude-config/ not found next to install.sh."
  echo "Are you running this from the repo root? Try: cd <repo> && ./install.sh"
  exit 1
fi

# Detect existing installs
NEEDS_BACKUP=()
for f in "$SRC/agents"/*.md; do
  [ -e "$f" ] || continue
  name=$(basename "$f")
  if [ -e "$DEST/agents/$name" ]; then NEEDS_BACKUP+=("agents/$name"); fi
done
for d in "$SRC/skills"/*/; do
  [ -d "$d" ] || continue
  name=$(basename "$d")
  if [ -e "$DEST/skills/$name" ]; then NEEDS_BACKUP+=("skills/$name"); fi
done

# Show what will happen
echo -e "${BOLD}Plan${RESET}"
echo ""
echo "  Agents to install:"
for f in "$SRC/agents"/*.md; do
  [ -e "$f" ] || continue
  echo -e "    ${GREEN}+${RESET} $(basename "$f")"
done
echo ""
echo "  Skills to install:"
for d in "$SRC/skills"/*/; do
  [ -d "$d" ] || continue
  echo -e "    ${GREEN}+${RESET} $(basename "$d")"
done

if [ ${#NEEDS_BACKUP[@]} -gt 0 ]; then
  echo ""
  echo -e "  ${YELLOW}Existing files that will be backed up to:${RESET}"
  echo -e "  ${DIM}$BACKUP_DIR${RESET}"
  for item in "${NEEDS_BACKUP[@]}"; do
    echo -e "    ${YELLOW}~${RESET} $item"
  done
fi
echo ""

if [ $DRY_RUN -eq 1 ]; then
  echo -e "${YELLOW}Dry run — exiting without changes.${RESET}"
  echo "Run without --dry-run to install."
  exit 0
fi

# Confirm (skipped with --yes / -y, e.g. when called from setup.sh)
if [ $ASSUME_YES -eq 0 ]; then
  read -p "Proceed with install? [y/N] " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
  fi
fi

# Backup existing
if [ ${#NEEDS_BACKUP[@]} -gt 0 ]; then
  mkdir -p "$BACKUP_DIR/agents" "$BACKUP_DIR/skills"
  for item in "${NEEDS_BACKUP[@]}"; do
    if [ -e "$DEST/$item" ]; then
      cp -R "$DEST/$item" "$BACKUP_DIR/$(dirname "$item")/" 2>/dev/null || true
    fi
  done
  echo -e "${DIM}Backed up to $BACKUP_DIR${RESET}"
fi

# Install
mkdir -p "$DEST/agents" "$DEST/skills"
cp "$SRC/agents/"*.md "$DEST/agents/"
for d in "$SRC/skills"/*/; do
  [ -d "$d" ] || continue
  name=$(basename "$d")
  rm -rf "$DEST/skills/$name"
  cp -R "$d" "$DEST/skills/$name"
done

echo ""
echo -e "${GREEN}${BOLD}Agents and skills installed to ~/.claude/${RESET}"
echo ""
echo -e "${DIM}This script only installs the Claude Code agents and skills."
echo -e "For full project setup (npm install, git hooks, .env.local), run:"
echo -e "  ./setup.sh${RESET}"
echo ""
echo -e "${DIM}To undo just the agents/skills: ./uninstall.sh${RESET}"
echo ""
