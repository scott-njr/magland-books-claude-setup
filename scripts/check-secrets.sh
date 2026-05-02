#!/usr/bin/env bash
# check-secrets.sh — scan content for things that look like secrets.
#
# Usage:
#   scripts/check-secrets.sh --staged       # scan staged content (used by pre-commit hook)
#   scripts/check-secrets.sh --diff <ref>   # scan everything new since <ref> (used by CI)
#   scripts/check-secrets.sh --all          # scan the entire working tree (manual audit)
#
# Exits 0 if clean, 1 if a possible secret was found.
#
# False positives can be overridden:
#   • Pre-commit:  git commit --no-verify   (use sparingly — only after you've confirmed it's not a real secret)
#   • CI:          adjust the patterns below or rename the example value to be obviously fake
#
# This is a defense layer, not a guarantee. The first defense is .env.local + .gitignore.
# The second is your eyes on `git diff` before staging. This script is the third.

set -uo pipefail

MODE="${1:---staged}"
DIFF_REF="${2:-origin/main}"

# Patterns that indicate a likely secret. Conservative — false positives prefered to false negatives.
PATTERNS=(
  # Square
  'sq0atb-[A-Za-z0-9_-]{20,}'        # Square sandbox access token
  'EAAAE[A-Za-z0-9_-]{40,}'          # Square production access token format
  'sq0csp-[A-Za-z0-9_-]+'            # Square OAuth client secret
  # Stripe
  'sk_live_[A-Za-z0-9]{20,}'
  'sk_test_[A-Za-z0-9]{20,}'
  'rk_live_[A-Za-z0-9]{20,}'
  # Resend / SendGrid / common API key prefixes
  're_[A-Za-z0-9]{30,}'
  'SG\.[A-Za-z0-9._-]{40,}'
  # AWS
  'AKIA[0-9A-Z]{16}'
  'aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}'
  # GitHub PATs
  'ghp_[A-Za-z0-9]{30,}'
  'gho_[A-Za-z0-9]{30,}'
  'ghs_[A-Za-z0-9]{30,}'
  # Google service account / OAuth
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'
  'AIza[0-9A-Za-z_-]{35}'
  # Anthropic
  'sk-ant-api[0-9]+-[A-Za-z0-9_-]{40,}'
  # OpenAI
  'sk-[A-Za-z0-9]{40,}'
  # Slack
  'xox[baprs]-[A-Za-z0-9-]{20,}'
  # Generic env-var assignments with non-empty values for known sensitive keys
  '(SECRET|TOKEN|API_KEY|PASSWORD|ACCESS_TOKEN|PRIVATE_KEY|SIGNING_KEY|WEBHOOK_KEY|SHARED_SECRET)\s*[:=]\s*['\''"][^'\''"]{12,}['\''"]'
)

# Files to skip — known-safe templates and binaries.
EXCLUDE_PATTERNS=(
  '\.env\.local\.example$'
  'package-lock\.json$'
  '\.png$' '\.jpg$' '\.jpeg$' '\.gif$' '\.webp$' '\.ico$' '\.svg$'
  '\.pdf$' '\.zip$' '\.gz$'
  'check-secrets\.sh$'                  # this file documents the patterns
  'CLAUDE\.md$' 'DEVELOPER\.md$' 'README\.md$' 'PRODUCT\.md$'  # docs reference patterns by name
)

# ─── helpers ────────────────────────────────────────────────────────────────

is_excluded() {
  local file="$1"
  for pat in "${EXCLUDE_PATTERNS[@]}"; do
    if echo "$file" | grep -qE "$pat"; then
      return 0
    fi
  done
  return 1
}

scan_content() {
  local label="$1"
  local content="$2"
  local found=0
  for pattern in "${PATTERNS[@]}"; do
    matches=$(echo "$content" | grep -nE -e "$pattern" || true)
    if [ -n "$matches" ]; then
      if [ $found -eq 0 ]; then
        echo "❌ $label"
      fi
      echo "   pattern: $pattern"
      echo "$matches" | head -3 | sed 's/^/     /'
      found=1
    fi
  done
  return $found
}

# ─── modes ──────────────────────────────────────────────────────────────────

scan_staged() {
  local files
  files=$(git diff --cached --name-only --diff-filter=AM)
  [ -z "$files" ] && return 0

  local violations=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    is_excluded "$file" && continue
    [ ! -f "$file" ] && continue

    local content
    content=$(git show ":$file" 2>/dev/null || true)
    if ! scan_content "$file (staged)" "$content"; then
      violations=$((violations + 1))
    fi
  done <<< "$files"

  return $violations
}

scan_diff() {
  local ref="$1"
  local files
  files=$(git diff --name-only --diff-filter=AM "$ref"...HEAD 2>/dev/null || git ls-files)
  [ -z "$files" ] && return 0

  local violations=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    is_excluded "$file" && continue
    [ ! -f "$file" ] && continue

    local content
    content=$(cat "$file" 2>/dev/null || true)
    if ! scan_content "$file" "$content"; then
      violations=$((violations + 1))
    fi
  done <<< "$files"

  return $violations
}

scan_all() {
  local files
  files=$(git ls-files)
  local violations=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    is_excluded "$file" && continue
    [ ! -f "$file" ] && continue

    local content
    content=$(cat "$file" 2>/dev/null || true)
    if ! scan_content "$file" "$content"; then
      violations=$((violations + 1))
    fi
  done <<< "$files"

  return $violations
}

# ─── main ───────────────────────────────────────────────────────────────────

case "$MODE" in
  --staged)
    scan_staged
    result=$?
    ;;
  --diff)
    scan_diff "$DIFF_REF"
    result=$?
    ;;
  --all)
    scan_all
    result=$?
    ;;
  *)
    echo "Usage: $0 [--staged | --diff <ref> | --all]"
    exit 2
    ;;
esac

if [ "$result" -ne 0 ]; then
  echo ""
  echo "──────────────────────────────────────────────────────────────"
  echo "🛑 Possible secret detected. Commit/PR BLOCKED."
  echo ""
  echo "What to do:"
  echo ""
  echo "  IF this is a real secret you accidentally pasted:"
  echo "    1. Remove it from the file. Do not just stage a deletion —"
  echo "       once a secret is in git history it is leaked even if removed."
  echo "    2. Rotate the secret immediately at the issuing service"
  echo "       (Square dashboard, Resend dashboard, etc.)."
  echo "    3. Move the value into .env.local (which is gitignored)"
  echo "       and reference it in code via process.env.<NAME>."
  echo ""
  echo "  IF this is a false positive (a docs example, an obviously fake value):"
  echo "    • Make it visibly fake (e.g. EXAMPLE_NOT_A_REAL_KEY)"
  echo "    • Or, only if you are CERTAIN: git commit --no-verify"
  echo ""
  echo "  WHEN IN DOUBT: rotate the credential and ask Scott."
  echo "──────────────────────────────────────────────────────────────"
  exit 1
fi

exit 0
