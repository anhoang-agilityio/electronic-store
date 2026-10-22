#!/usr/bin/env bash
# PreToolUse (Bash): hard-block destructive rm commands.
# exit 2 blocks the call and sends stderr back to Claude.
set -uo pipefail

# Fail closed: without jq we cannot read the command, so do not run it.
if ! command -v jq >/dev/null 2>&1; then
  echo "BLOCKED: jq is required by block-forbidden-command.sh but is not installed." >&2
  exit 2
fi

command=$(jq -r '.tool_input.command // empty')
[[ -z "$command" ]] && exit 0

# Collapse newlines and repeated spaces so patterns match reliably.
normalized=$(printf '%s' "$command" | tr '\n\t' '  ' | tr -s ' ')

block() {
  echo "BLOCKED: $1" >&2
  echo "Command: $command" >&2
  exit 2
}

# rm -r/-f style flags against root, home, parent dir, or a bare wildcard
if grep -Eq '(^|[;&|] *)rm +(-[a-zA-Z]*[rR][a-zA-Z]*[fF]?|-[a-zA-Z]*[fF][a-zA-Z]*[rR]?|--recursive|--force)[^;&|]* +(/|~|\$HOME|\.\.|\*)( |$|/)' <<<"$normalized"; then
  block "recursive delete of root, home, parent dir, or a wildcard. Delete the specific paths instead."
fi

exit 0
