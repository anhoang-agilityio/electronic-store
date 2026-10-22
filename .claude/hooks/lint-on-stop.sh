#!/usr/bin/env bash
# Stop: lint changed JS/TS files. On remaining errors, exit 2 so Claude fixes them.
set -euo pipefail

# Already retried once after this hook blocked; let Claude stop to avoid a loop
[[ "$(jq -r '.stop_hook_active // false')" == "true" ]] && exit 0

cd "$CLAUDE_PROJECT_DIR"

files=()
while IFS= read -r f; do
  [[ -f "$f" ]] && files+=("$f")
done < <(
  { git diff --name-only HEAD; git ls-files --others --exclude-standard; } |
    grep -E '\.(js|jsx|ts|tsx)$' | sort -u
)

[[ ${#files[@]} -eq 0 ]] && exit 0

if ! out=$(node_modules/.bin/eslint --fix "${files[@]}" 2>&1); then
  echo "ESLint found errors in changed files. Please fix them:" >&2
  echo "$out" >&2
  exit 2
fi
