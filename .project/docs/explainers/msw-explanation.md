# How MSW (Mock Service Worker) Works

## The Problem MSW Solves

When testing frontend code that makes API calls, you have three options:

1. **Hit the real backend** - Slow, requires backend to be running, tests can fail due to network issues
2. **Mock fetch/axios directly** - Messy, couples tests to implementation details
3. **Use MSW** - Intercepts at network level, tests remain realistic

## How MSW Works

```javascript
// When your code does this:
fetch('http://localhost:8787/api/todos')

// MSW intercepts it BEFORE it goes to the network
// and returns your mock response instead
```

## The Magic in Our Test

```javascript
// 1. We define mock handlers - these are like "fake endpoints"
const server = setupServer(
  http.get('http://localhost:8787/api/todos', () => {
    // This function runs when anyone tries to GET /api/todos
    // It returns fake data instead of hitting the real backend
    return HttpResponse.json([
      { id: 1, text: 'Test todo', completed: false }
    ]);
  })
);

// 2. Start the interception before tests
beforeAll(() => server.listen());  // MSW starts intercepting

// 3. In your test, fetch works normally
const response = await fetch('http://localhost:8787/api/todos');
// But MSW intercepts it and returns the mock data!

// 4. Clean up after tests
afterAll(() => server.close());  // Stop intercepting
```

## Why This Is Powerful

1. **Your app code doesn't change** - It still uses `fetch()` normally
2. **Tests are realistic** - They test the actual HTTP layer
3. **No backend needed** - Tests run anywhere, anytime
4. **Full control** - You can simulate errors, delays, any response

## Real Example: Testing Error Handling

```javascript
// You can override handlers to test error scenarios
server.use(
  http.get('http://localhost:8787/api/todos', () => {
    // Simulate a server error
    return new HttpResponse(null, { status: 500 });
  })
);

// Now when your code fetches, it gets a 500 error
// Perfect for testing error handling!
```

## The Network Tab Illusion

If you opened Chrome DevTools during these tests, you'd see:
- NO actual network requests to localhost:8787
- MSW intercepts BEFORE the network layer
- Your code thinks it made a real HTTP call
- But it never left your test environment

## Think of MSW Like This

```
Normal Flow:
Your Code → fetch() → Network → Real Server → Response

With MSW:
Your Code → fetch() → MSW Intercepts → Mock Handler → Fake Response
                        ↓
                    (Network never touched)
```

## Why Not Just Mock fetch()?

```javascript
// You could do this (bad):
global.fetch = jest.fn(() => 
  Promise.resolve({ json: () => Promise.resolve(mockData) })
);

// But then you're:
// - Mocking implementation details
// - Not testing the real fetch API
// - Making brittle tests that break easily
```

MSW is better because it intercepts at the right level - after your code has done all its real work (headers, body serialization, etc.) but before it hits the network.