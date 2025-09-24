#!/usr/bin/env bash
set -euo pipefail

# Ensure we run from the repository root
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BLOCKED_REGEX='^(AGENTS\.md|CLAUDE\.md|GEMINI\.md|docs/ai-local/)'

staged_blocked="$(git diff --cached --name-only | grep -E "$BLOCKED_REGEX" || true)"
if [[ -n "$staged_blocked" ]]; then
  echo "❌ Blocked files/folders are staged:"
  echo "$staged_blocked"
  echo "Remove them from the commit or move them under docs/ai-local/ before pushing."
  exit 1
fi

remote="${1:-origin}"
branch="${2:-master}"

echo "Pushing to $remote $branch (blocked paths guarded)..."
git push "$remote" "$branch"
