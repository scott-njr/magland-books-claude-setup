#!/usr/bin/env bash
# lint:conventions — generic project lint runner. Reads rules from .claude/conventions.json.
#
# Modes:
#   Hook mode: reads JSON on stdin, extracts tool_input.file_path
#   CLI mode:  pass file paths as args, or no args = sweep src/
#
# Output:
#   Plain CLI: prints report to stderr, exits 0 (advisory)
#   PostToolUse: emits {hookSpecificOutput: {hookEventName, additionalContext}}
#   Stop: emits {systemMessage} (set LINT_CONVENTIONS_EVENT=Stop)
#
# Per-file opt-out: include `lint-conventions: skip-file` in the first 10 lines.

set -uo pipefail

CONVENTIONS_FILE="${LINT_CONVENTIONS_FILE:-.claude/conventions.json}"

if [ ! -f "$CONVENTIONS_FILE" ]; then
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "lint:conventions — jq not installed, skipping" >&2
  exit 0
fi

# Resolve files to check
files=()
if [ $# -gt 0 ]; then
  files=("$@")
elif [ ! -t 0 ]; then
  payload=$(cat)
  fp=$(echo "$payload" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
  [ -n "$fp" ] && files+=("$fp")
fi

if [ ${#files[@]} -eq 0 ]; then
  while IFS= read -r f; do files+=("$f"); done < <(
    find src -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \) 2>/dev/null
  )
fi

[ ${#files[@]} -eq 0 ] && exit 0

# Match a file path against an array of bash-glob scope patterns
matches_any_scope() {
  local file="$1"
  shift
  local pattern
  for pattern in "$@"; do
    case "$file" in $pattern) return 0 ;; esac
  done
  return 1
}

violations=0
report=""

# Iterate rules
rule_count=$(jq -r '.rules | length' "$CONVENTIONS_FILE")
for ((i=0; i<rule_count; i++)); do
  rule_json=$(jq -c ".rules[$i]" "$CONVENTIONS_FILE")
  id=$(echo "$rule_json" | jq -r '.id')
  description=$(echo "$rule_json" | jq -r '.description')
  pattern=$(echo "$rule_json" | jq -r '.pattern')
  secondary_pattern=$(echo "$rule_json" | jq -r '.secondary_pattern // empty')

  # Read scope and exclude arrays into bash arrays
  scope=()
  while IFS= read -r s; do scope+=("$s"); done < <(echo "$rule_json" | jq -r '.scope[]?')
  exclude=()
  while IFS= read -r e; do exclude+=("$e"); done < <(echo "$rule_json" | jq -r '.exclude[]?')

  for file in "${files[@]}"; do
    [ -z "$file" ] && continue
    [ ! -f "$file" ] && continue

    # Per-file opt-out
    if head -n 10 "$file" 2>/dev/null | grep -q 'lint-conventions: skip-file'; then
      continue
    fi

    # Scope filter
    if [ ${#scope[@]} -gt 0 ]; then
      matches_any_scope "$file" "${scope[@]}" || continue
    fi
    if [ ${#exclude[@]} -gt 0 ] && matches_any_scope "$file" "${exclude[@]}"; then
      continue
    fi

    # Run primary pattern
    hits=$(grep -nE "$pattern" "$file" 2>/dev/null || true)
    [ -z "$hits" ] && continue

    # If secondary pattern, filter through it
    if [ -n "$secondary_pattern" ]; then
      hits=$(echo "$hits" | grep -E "$secondary_pattern" || true)
      [ -z "$hits" ] && continue
    fi

    violations=$((violations + 1))
    report="${report}[$id] $file
$description
$hits

"
  done
done

if [ "$violations" -eq 0 ]; then
  exit 0
fi

msg="lint:conventions — $violations violation(s):
$report"

event="${LINT_CONVENTIONS_EVENT:-}"
if [ "$event" = "Stop" ]; then
  summary="lint:conventions — $violations violation(s) at session stop. Run \`npm run lint:conventions\` for the full report."
  jq -n --arg msg "$summary" '{systemMessage: $msg}'
elif [ "$event" = "PostToolUse" ]; then
  jq -n --arg ctx "$msg" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $ctx}}'
else
  echo "$msg" >&2
fi

exit 0
