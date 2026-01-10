---
description: Pull and fix a GitHub issue by number
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Fix GitHub Issue

Fix the GitHub issue: $ARGUMENTS

## Steps

1. Fetch the issue details using `gh issue view $ARGUMENTS`
2. Understand the issue requirements and acceptance criteria
3. Search the codebase to find relevant files
4. Implement the fix following project conventions
5. Add or update tests as needed
6. Run verification: `npm run type-check && npm run lint && npm run test`
7. Summarize the changes made
