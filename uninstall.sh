#!/usr/bin/env bash
# Magland Books Redesign — uninstall script
# Removes the agents + skills installed from this repo's claude-config/
set -e

if [ -t 1 ]; then
  BOLD='\033[1m'; CYAN='\033[36m'; GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; DIM='\033[2m'; RESET='\033[0m'
else
  BOLD=''; CYAN=''; GREEN=''; YELLOW=''; RED=''; DIM=''; RESET=''
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC="$SCRIPT_DIR/claude-config"
DEST="$HOME/.claude"

echo ""
echo -e "${BOLD}${CYAN}Magland Books Redesign — uninstaller${RESET}"
echo ""

if [ ! -d "$SRC" ]; then
  echo -e "${RED}Error:${RESET} claude-config/ not found. Run from repo root."
  exit 1
fi

# What we'll remove
TO_REMOVE=()
for f in "$SRC/agents"/*.md; do
  [ -e "$f" ] || continue
  name=$(basename "$f")
  [ -e "$DEST/agents/$name" ] && TO_REMOVE+=("agents/$name")
done
for d in "$SRC/skills"/*/; do
  [ -d "$d" ] || continue
  name=$(basename "$d")
  [ -e "$DEST/skills/$name" ] && TO_REMOVE+=("skills/$name")
done

if [ ${#TO_REMOVE[@]} -eq 0 ]; then
  echo "Nothing to uninstall — none of these files are present in $DEST."
  exit 0
fi

echo "Will remove from $DEST:"
for item in "${TO_REMOVE[@]}"; do
  echo -e "    ${RED}-${RESET} $item"
done
echo ""
echo -e "${YELLOW}Note:${RESET} backups from prior installs (if any) remain in $DEST/.backup-* — restore manually if needed."
echo ""

read -p "Proceed with uninstall? [y/N] " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

for item in "${TO_REMOVE[@]}"; do
  rm -rf "$DEST/$item"
done

echo -e "${GREEN}${BOLD}Removed.${RESET}"
echo ""
