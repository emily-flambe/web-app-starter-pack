# Technical Requirements

## Core Technology Stack

### Frontend Framework
- **React 19.0+**
  - New hooks: `useOptimistic`, `useActionState`, `useFormStatus`, `use`
  - Concurrent features and Suspense improvements
  - Server Components compatibility (future-ready)
  - Enhanced error boundaries and error handling
  - Improved hydration and streaming SSR support

### Build System & Tooling
- **Vite 6.0+**
  - Requires Node.js 20.19+ or 22.12+
  - Native ESM with rollup 4.x
  - Lightning-fast HMR with instant updates
  - Built-in TypeScript support
  - Optimized production builds with tree-shaking

### Language & Type System
- **TypeScript 5.8+**
  - Strict mode configuration
  - Enhanced inference and performance
  - Latest ECMAScript features support
  - Bundler module resolution
  - Path mapping and absolute imports

### Styling & Design System
- **Tailwind CSS 4.0 Beta**
  - Vite plugin integration (`@tailwindcss/vite`)
  - No configuration file needed
  - 5x faster builds than v3
  - CSS-first approach with theme functions
  - Built-in container queries and modern CSS features

### Testing Framework
- **Vitest 3.2.x**
  - Native ESM and TypeScript support
  - 10x faster than Jest
  - Built-in code coverage with v8
  - Watch mode with intelligent re-runs
  - Snapshot testing and mocking utilities

- **React Testing Library 16.3.0**
  - React 19 compatibility
  - Accessibility-focused testing
  - User-centric test patterns
  - Integration with Vitest

- **Playwright 1.50+**
  - Cross-browser E2E testing
  - Visual regression testing
  - Performance monitoring
  - Mobile device emulation
  - CI/CD integration

### Authentication & Security
- **Auth0 React SDK 2.4.0+**
  - OAuth 2.0 / OpenID Connect
  - Social login providers
  - Multi-factor authentication
  - Role-based access control
  - Token management and refresh

### Development Tools
- **ESLint 9.x** with flat config
- **Prettier 3.x** for code formatting  
- **Husky** for Git hooks
- **lint-staged** for pre-commit validation
- **commitizen** for conventional commits

### API Mocking & Development
- **MSW (Mock Service Worker) 2.10.x**
  - Browser and Node.js request interception
  - Development and testing mocking
  - TypeScript-first API definitions
  - Seamless production/mock switching

## Database Architecture

### Database Stack
- **Database**: Cloudflare D1 (SQLite at the edge)
- **ORM**: Drizzle ORM with type-safe queries
- **Migrations**: Drizzle Kit for schema management
- **Development**: Drizzle Studio for visual database management

### Database Design Principles
- **Portability First**: Use standard SQL features only
- **Repository Pattern**: All database access through repository classes
- **Type Safety**: Leverage Drizzle's TypeScript integration
- **Migration Strategy**: Version-controlled schema migrations
- **No Direct Queries**: Components never access database directly

### Schema Example
```typescript
// drizzle/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  states: text('states', { mode: 'json' }).$type<string[]>(),
  dataTypes: text('data_types', { mode: 'json' }).$type<string[]>(),
  credits: integer('credits').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
```

### Repository Pattern
```typescript
// src/lib/db/repositories/subscription.repository.ts
export class SubscriptionRepository {
  constructor(private db: Database) {}
  
  async create(data: NewSubscription) {
    return this.db.insert(subscriptions).values(data).returning()
  }
  
  async findById(id: string) {
    return this.db.select().from(subscriptions).where(eq(subscriptions.id, id))
  }
}
```

## Deployment Platform

### Primary: Cloudflare Workers
- **Runtime**: V8 isolates with Web API compatibility
- **Performance**: <10ms cold starts, global edge deployment
- **Scalability**: Auto-scaling to handle traffic spikes
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: KV storage for cache, R2 for objects
- **Cost**: Generous free tier, pay-per-request pricing

### Platform Abstraction Layer
- **Deployment Agnostic**: Works with Vercel, Netlify, AWS Lambda
- **API Abstraction**: Platform-independent request/response handling
- **Environment Variables**: Unified configuration across platforms
- **Database Abstraction**: Repository pattern with Drizzle ORM
- **Portability**: Avoid platform-specific APIs, use standard SQL

## Architecture Requirements

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (buttons, inputs)
│   └── feature/        # Feature-specific components
├── features/           # Feature-specific modules
│   ├── subscription/   # Subscription wizard
│   └── templates/      # Template management
├── lib/
│   ├── db/            # Database abstraction layer
│   ├── api/           # API client and types
│   └── auth/          # Authentication setup
├── hooks/              # Custom React hooks
├── types/              # Shared TypeScript types
├── mocks/              # MSW mock handlers
└── routes/             # React Router setup
worker/                 # Cloudflare Worker backend
├── index.ts           # Worker entry point
└── db/                # Database access layer
drizzle/
├── schema.ts          # Drizzle schema definitions
└── migrations/        # Database migrations
```

### Component Architecture
- **Composition over Inheritance**: Use React composition patterns
- **Props Interface Design**: Clear, typed component APIs
- **Accessibility First**: WCAG 2.1 AA compliance by default
- **Performance Optimized**: Lazy loading and code splitting
- **Testable Components**: Easy to unit test and mock

### State Management
- **React Built-ins**: useState, useReducer, useContext
- **Server State**: TanStack Query for API data caching
- **Form State**: React Hook Form for complex forms
- **Local Storage**: Custom hooks for persistence
- **URL State**: React Router v6 with type-safe navigation

## Performance Requirements

### Build Performance
- **Development Start**: Fast startup from npm run dev
- **Hot Module Replacement**: Instant component updates
- **Production Build**: Fast full builds
- **Bundle Analysis**: Automated bundle size monitoring
- **Tree Shaking**: Eliminate unused code automatically

### Runtime Performance
- **Initial Bundle**: Optimized bundle sizes
- **Total Bundle**: Efficient loading of all features
- **Core Web Vitals**: Optimized for Core Web Vitals
- **Time to Interactive**: Fast interaction readiness

### Optimization Strategies
- **Code Splitting**: Route-based and feature-based lazy loading
- **Image Optimization**: WebP/AVIF with responsive images
- **Font Loading**: Efficient web font loading strategies
- **Caching**: Service worker and HTTP caching
- **Prefetching**: Intelligent resource prefetching

## Security Requirements

### Authentication & Authorization
- **JWT Token Handling**: Secure token storage and refresh
- **Role-Based Access Control**: Granular permission system
- **Session Management**: Secure session handling
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Prevention**: Content Security Policy implementation

### Data Protection
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **Data Encryption**: Sensitive data encryption at rest
- **HTTPS Only**: Force HTTPS in production
- **Security Headers**: Comprehensive security header configuration

### Development Security
- **Dependency Scanning**: Automated vulnerability scanning
- **Secret Management**: Environment-based secret handling
- **Code Analysis**: Static security analysis tools
- **Audit Logging**: Security event logging
- **Regular Updates**: Automated dependency updates

## Browser Support

### Modern Browser Targets
- **Chrome**: 120+ (95% market coverage)
- **Firefox**: 120+ (90% market coverage)  
- **Safari**: 17+ (iOS 17+, macOS Sonoma+)
- **Edge**: 120+ (Chromium-based)

### Feature Requirements
- **ES2022 Support**: Native async/await, optional chaining, nullish coalescing
- **Web APIs**: Fetch, Web Workers, Service Workers, Web Streams
- **CSS Features**: CSS Grid, Flexbox, Custom Properties, Container Queries
- **No IE Support**: Modern browsers only, no legacy polyfills

## Development Environment

### Required Software
- **Node.js**: 20.19+ or 22.12+ (LTS recommended)
- **npm**: 10+ or **pnpm**: 9+ (preferred for performance)
- **Git**: 2.40+ with modern CLI features
- **VS Code**: Latest with recommended extensions

### System Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space for node_modules and builds
- **OS**: macOS 12+, Ubuntu 20.04+, Windows 11
- **Network**: Reliable internet for package downloads and deployments

### VS Code Configuration
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next", 
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-playwright.playwright",
    "vitest.explorer",
    "ms-vscode.vscode-json"
  ]
}
```

## Quality Assurance

### Code Quality Standards
- **TypeScript Strict Mode**: No any types, strict null checks
- **ESLint Configuration**: Airbnb + React + TypeScript rules
- **Prettier Integration**: Automatic code formatting
- **Git Hooks**: Pre-commit linting and testing
- **Import Organization**: Automatic import sorting and grouping

### Testing Requirements
- **Unit Test Coverage**: >85% line coverage
- **Integration Tests**: >70% critical path coverage  
- **E2E Tests**: 100% critical user journey coverage
- **Performance Tests**: Core Web Vitals monitoring
- **Accessibility Tests**: WCAG 2.1 AA compliance validation

### Monitoring & Observability
- **Error Tracking**: Comprehensive error reporting
- **Performance Monitoring**: Real-time monitoring capabilities
- **User Analytics**: Privacy-focused usage analytics
- **Build Monitoring**: CI/CD pipeline health tracking
- **Security Scanning**: Automated security vulnerability detection

## Version Management

### Package Management
- **Lock Files**: Committed package-lock.json/pnpm-lock.yaml
- **Security Updates**: Automated dependency vulnerability patching
- **Version Pinning**: Exact versions for critical dependencies
- **Peer Dependencies**: Explicit peer dependency management
- **Bundle Analysis**: Regular bundle size monitoring

### Release Management
- **Semantic Versioning**: Conventional commit-based releases
- **Automated Releases**: GitHub Actions-based release pipeline
- **Changelog Generation**: Automated changelog from commits
- **Migration Guides**: Version upgrade documentation
- **Backward Compatibility**: Clear breaking change communication

## Infrastructure Requirements

### Development Infrastructure
- **Local Development**: Vite dev server + Wrangler for backend
- **Hot Reloading**: Sub-second development feedback
- **Database Management**: Drizzle Kit Studio for visual DB management
- **Database Migrations**: Drizzle Kit for schema migrations
- **API Mocking**: MSW for offline development and testing
- **Environment Files**: `.env.local` (Vite) and `.dev.vars` (Wrangler)

### Production Infrastructure
- **Global CDN**: Edge-deployed static assets
- **Auto-scaling**: Automatic traffic-based scaling
- **Health Monitoring**: Uptime and performance monitoring
- **Error Tracking**: Real-time error reporting and alerting
- **Backup Systems**: Automated backup and recovery procedures

This technical specification provides the foundation for building a modern, performant, and maintainable web application using 2025's best practices and technologies.