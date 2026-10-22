#!/usr/bin/env bash
# PostToolUse: format the file Claude just edited with Prettier.
# File types are filtered by .prettierignore (same set as .lintstagedrc).
set -euo pipefail

# Skip quietly when the tools are missing instead of failing on every edit
command -v jq >/dev/null 2>&1 || exit 0

file=$(jq -r '.tool_input.file_path // empty')
[[ -z "$file" || ! -f "$file" ]] && exit 0

# Only touch files inside this project
case "$file" in
  "$CLAUDE_PROJECT_DIR"/*) ;;
  *) exit 0 ;;
esac

cd "$CLAUDE_PROJECT_DIR"
[[ -x node_modules/.bin/prettier ]] || exit 0
node_modules/.bin/prettier --write --ignore-unknown --log-level warn "$file" >/dev/null
