---
name: pr-description
description: Writes pull request descriptions. Use when creating a PR, writing a PR, or when the user asks to summarize changes for a pull request.
---

# PR Description

Write a concise description that helps a reviewer understand the problem, resulting behavior, and evidence for the change.

## Inspect the changes

1. Read applicable repository instructions and any PR template in `.github/`.
2. Use the requested or existing PR's target branch as the base; otherwise default to `main`. Run `git diff main...HEAD` for the default base, substituting the actual base when different.
3. Also inspect `git diff --stat <base>...HEAD` and `git diff --name-status --find-renames <base>...HEAD` to catch the full scope, including deleted and renamed files. Read relevant code as needed; do not rely only on commit messages or a truncated diff.
4. Run `git status --short` to distinguish committed branch changes from staged, unstaged, and untracked work. Describe committed changes by default; include uncommitted work only when requested, clearly identifying it.

If the base ref is unavailable, check for its remote-tracking equivalent, such as `origin/main`. If no valid base can be established, ask for the target branch rather than guessing. If the branch diff is empty, report that instead of inventing a description.

## Write the description

Use the following format unless the repository PR template or the user requests a different structure. Keep the same information when adapting to a template.

```markdown
## What

One sentence explaining what this PR does and its resulting behavior.

## Why

Brief context on the problem or need this change addresses.

## Changes

- Specific changes, grouped by related behavior or feature.
- Significant files deleted or renamed, with their purpose or replacement.

## Testing

- Checks actually performed and their results.
- Checks not performed and the reason, when relevant.
```

## Writing conventions

- Use English by default for PR descriptions; follow an explicit language request or repository convention.
- Describe the final implementation for someone who has not read the conversation. Prefer concrete behavior and useful before/after examples over a chronological account of edits.
- Scale detail to the change. Group related edits; avoid listing every file or repeating the same point across sections.
- Base claims on the diff, inspected code, and available verification evidence. Do not invent motivations, issue IDs, links, test results, or performance improvements. If the reason is unclear, state only the purpose supported by the code or ask when necessary.
- Include issue or ticket links only when provided or verified. Use closing keywords such as `Closes` only when the PR actually resolves that issue.
- Add optional `## Breaking Changes`, `## Migration`, or `## Screenshots` sections only when relevant. Explain compatibility impacts and required consumer actions; attach screenshots only when available and useful for visual changes.
- In `Testing`, distinguish passing, failing, and unexecuted checks. Mention material limitations or known failures without claiming they passed. Suggested checks must be labeled as suggestions.
- For this repo, relevant checks may include `npx eslint .`, `npx tsc --noEmit`, and `npm run build`. Run checks appropriate to the change when verification is part of the task; a description-only request does not require running the full suite.
- Remove unused optional sections and template guidance from the final description.

Return the description as ready-to-paste Markdown when asked only to write it. Creating or updating a remote PR requires authorization from the user's task; this skill alone does not authorize publishing.
