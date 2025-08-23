# Web App Starter Pack - Project Documentation

## For AI Assistants
**MANDATORY**: Read ALL files in `.project/` before starting work, especially:
1. `guidelines/ai-behavior.md` - Critical behavioral rules
2. `requirements/overview.md` - What we're building
3. `requirements/technical.md` - How we're building it
4. `guidelines/tdd-approach.md` - Testing philosophy
5. `guidelines/troubleshooting.md` - Common issues
6. `guidelines/typescript-standards.md` - TypeScript coding standards
7. `guidelines/react-standards.md` - React patterns and practices
8. `guidelines/python-standards.md` - Python coding standards (if backend in Python)

## For Humans
- Requirements: See `requirements/overview.md`  
- Tech Stack: See `requirements/technical.md`
- Common Issues: See `guidelines/troubleshooting.md`
- Development Workflow: See `specs/setup/development-workflow.md`

## Project Overview
A production-ready starter template for rapidly building modern web applications. This starter pack provides a solid foundation with authentication, routing, state management, and deployment infrastructure pre-configured.

## Key Commands
```bash
# Development
npm run dev              # Start local dev server
npm run dev:api          # Start local API with MSW mocking

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
npm run test:coverage   # Generate coverage report

# Build/Deploy
npm run build           # Build for production
npm run preview         # Preview production build
npm run deploy          # Deploy to Cloudflare Workers
npm run deploy:preview  # Deploy to preview environment
```

## Architecture
```
Frontend (React + Vite + TypeScript)
    ↓
Cloudflare Workers (Edge Runtime)
    ↓
External Services (Auth0, APIs)
```

- **Frontend**: React SPA with Vite bundling
- **Edge**: Cloudflare Workers for API and SSR
- **Auth**: Auth0 for authentication
- **State**: React Context + optional Zustand
- **Styling**: Tailwind CSS with component library

## Performance Targets
- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 200KB initial

## Security Considerations
- All secrets in environment variables
- Auth0 for authentication
- CORS properly configured
- Input validation on all forms
- XSS protection via React
- CSP headers configured