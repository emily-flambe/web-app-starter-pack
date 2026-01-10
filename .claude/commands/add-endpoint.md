---
description: Add a new API endpoint with validation
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Add API Endpoint

Create a new API endpoint: $ARGUMENTS

## Steps

1. Parse the endpoint description to determine:
   - HTTP method (GET, POST, PUT, DELETE)
   - Route path
   - Request/response schema

2. Create Zod validator in `worker/validators/` if needed

3. Add the endpoint to `worker/index.ts` following existing patterns:
   - Use validation middleware for request bodies
   - Return appropriate HTTP status codes
   - Include error handling

4. Add corresponding method to `src/lib/api/client.ts`

5. Add unit test in `src/__tests__/integration/`

6. Run verification:
   ```bash
   npm run type-check
   npm run lint
   npm run test
   ```
