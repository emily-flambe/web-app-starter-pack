---
description: Run all checks, stage changes, and generate a commit message
allowed-tools: Bash, Read, Glob, Grep
---

# PR Preparation

Prepare changes for commit and PR.

## Steps

1. Run all verification checks:
   ```bash
   npm run type-check
   npm run lint
   npm run test
   npm run test:e2e
   ```

2. Show git status and diff:
   ```bash
   git status
   git diff --stat
   ```

3. Stage all changes:
   ```bash
   git add -A
   ```

4. Generate a commit message based on the staged changes (following conventional commits style)

5. Show the suggested commit command (do not execute without confirmation)
