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
if [ "$1" = "--dry-run" ] || [ "$1" = "-n" ]; then DRY_RUN=1; fi

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

# Confirm
read -p "Proceed with install? [y/N] " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
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
echo -e "${GREEN}${BOLD}Installed.${RESET}"
echo ""
echo -e "${BOLD}Next steps${RESET}"
echo ""
echo -e "  1. ${BOLD}View the mockups${RESET} (no Claude needed):"
echo -e "       ${DIM}open mockups/homepage/index.html${RESET}"
echo ""
echo -e "  2. ${BOLD}Open this project in Claude Code${RESET}:"
echo -e "       ${DIM}claude${RESET}"
echo -e "     Then try one of:"
echo -e "       ${CYAN}/design-explore${RESET} — regenerate three contrasting layout directions"
echo -e "       ${CYAN}/mockup${RESET}         — riff on a single direction"
echo ""
echo -e "  3. ${BOLD}If you need to undo:${RESET}"
echo -e "       ${DIM}./uninstall.sh${RESET}"
echo ""
