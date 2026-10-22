#!/usr/bin/env bash
# Stop: show a macOS notification banner when Claude finishes. Never blocks.

osascript -e 'display notification "Claude has finished" with title "Claude Code"' >/dev/null 2>&1 || true
