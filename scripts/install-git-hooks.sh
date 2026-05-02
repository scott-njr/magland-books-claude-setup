#!/usr/bin/env bash
# install-git-hooks.sh — wires up the project's git hooks.
# Run once after cloning the repo. Safe to re-run.

set -e

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  echo "❌ Not inside a git repository. Run this from the repo root."
  exit 1
fi

cd "$REPO_ROOT"

HOOKS_SRC="$REPO_ROOT/scripts/git-hooks"
HOOKS_DEST="$REPO_ROOT/.git/hooks"

if [ ! -d "$HOOKS_SRC" ]; then
  echo "❌ scripts/git-hooks/ not found. Are you in the right repo?"
  exit 1
fi

mkdir -p "$HOOKS_DEST"

INSTALLED=0
for hook_file in "$HOOKS_SRC"/*; do
  [ -f "$hook_file" ] || continue
  hook_name=$(basename "$hook_file")
  dest="$HOOKS_DEST/$hook_name"

  # Back up any pre-existing hook that isn't ours
  if [ -f "$dest" ] && ! grep -q "scripts/check-secrets.sh\|scripts/git-hooks" "$dest" 2>/dev/null; then
    backup="$dest.backup-$(date +%Y%m%d-%H%M%S)"
    mv "$dest" "$backup"
    echo "↺  Existing $hook_name backed up to $backup"
  fi

  cp "$hook_file" "$dest"
  chmod +x "$dest"
  echo "✓  Installed $hook_name"
  INSTALLED=$((INSTALLED + 1))
done

if [ $INSTALLED -eq 0 ]; then
  echo "No hooks found in $HOOKS_SRC."
  exit 1
fi

echo ""
echo "Done. $INSTALLED hook(s) installed."
echo ""
echo "What this gives you:"
echo "  • Every 'git commit' first runs scripts/check-secrets.sh on the staged content."
echo "  • If anything looks like an API key, access token, or private key, the commit is blocked."
echo "  • To bypass in a true emergency: git commit --no-verify (use sparingly)."
