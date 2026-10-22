#!/usr/bin/env bash
# Stop: lint changed JS/TS files. On errors, exit 2 so Claude fixes them.
# Report only (no --fix): changed files may include the user's own uncommitted work.
set -euo pipefail

# Skip quietly when the tools are missing; Claude cannot fix that itself
command -v jq >/dev/null 2>&1 || exit 0

# Already retried once after this hook blocked; let Claude stop to avoid a loop
[[ "$(jq -r '.stop_hook_active // false')" == "true" ]] && exit 0

cd "$CLAUDE_PROJECT_DIR"
[[ -x node_modules/.bin/eslint ]] || exit 0

files=()
while IFS= read -r f; do
  [[ -f "$f" ]] && files+=("$f")
done < <(
  { git diff --name-only HEAD; git ls-files --others --exclude-standard; } |
    grep -E '\.(js|jsx|ts|tsx)$' | sort -u
)

[[ ${#files[@]} -eq 0 ]] && exit 0

if ! out=$(node_modules/.bin/eslint "${files[@]}" 2>&1); then
  echo "ESLint found errors in changed files. Please fix them:" >&2
  echo "$out" >&2
  exit 2
fi
