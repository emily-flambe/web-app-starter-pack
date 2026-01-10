---
description: Run tests for a specific file or pattern
allowed-tools: Bash, Read
---

# Run Tests for File

Run tests matching: $ARGUMENTS

## Steps

1. Determine test type based on file path:
   - `src/` files -> run vitest
   - `e2e/` files -> run playwright

2. For unit/integration tests:
   ```bash
   npm run test -- --run $ARGUMENTS
   ```

3. For e2e tests:
   ```bash
   npm run test:e2e -- $ARGUMENTS
   ```

4. Report results and any failures
