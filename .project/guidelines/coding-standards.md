# Coding Standards

TypeScript and React coding standards for the web app starter pack.

## TypeScript Configuration

### Strict Type Checking
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Definitions

#### Interface Naming
```typescript
// Use PascalCase for interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Use descriptive names for props interfaces
interface UserCardProps {
  user: UserProfile;
  onEdit?: (user: UserProfile) => void;
  className?: string;
}

// Use generic constraints appropriately
interface ApiResponse<TData = unknown> {
  data: TData;
  message: string;
  timestamp: number;
}
```

#### Enum Usage
```typescript
// Use const enums for performance
const enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

// Use string unions for simple cases
type Theme = 'light' | 'dark' | 'system';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

#### Utility Types
```typescript
// Leverage TypeScript utility types
type PartialUser = Partial<UserProfile>;
type UserEmail = Pick<UserProfile, 'email'>;
type CreateUserRequest = Omit<UserProfile, 'id'>;

// Create custom utility types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
```

## React Component Standards

### Functional Components
```typescript
// Use React.FC with explicit props interface
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};
```

### Component Organization
```typescript
// components/UserCard/index.ts
export { UserCard } from './UserCard';
export type { UserCardProps } from './UserCard';

// components/UserCard/UserCard.tsx
import { useState } from 'react';
import type { UserProfile } from '@/types/user';

interface UserCardProps {
  user: UserProfile;
  onEdit?: (user: UserProfile) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  // Component implementation
};

// Export props type for testing and parent components
export type { UserCardProps };
```

### Hooks Standards
```typescript
// Custom hooks should start with 'use' and return object with descriptive names
export const useUser = (userId: string) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getUser(userId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    user,
    loading,
    error,
    refetch
  };
};

// Hook with cleanup
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);
    setConnectionState('connecting');

    ws.onopen = () => setConnectionState('connected');
    ws.onclose = () => setConnectionState('disconnected');

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [url]);

  return { socket, connectionState };
};
```

## File Naming Conventions

### Directory Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button/
│   │   │   ├── index.ts
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   └── Modal/
│   └── features/        # Feature-specific components
│       ├── auth/
│       └── dashboard/
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   └── useLocalStorage.ts
├── services/           # API and external services
│   ├── api/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   └── users.ts
│   └── storage.ts
├── types/              # TypeScript type definitions
│   ├── index.ts
│   ├── api.ts
│   └── user.ts
└── utils/              # Utility functions
    ├── cn.ts           # className utility
    ├── formatters.ts
    └── validators.ts
```

### File Naming Rules
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: camelCase (`userTypes.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)

## Code Formatting

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## Import/Export Standards

### Import Order
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { clsx } from 'clsx';
import { z } from 'zod';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/common';
import { useAuth } from '@/hooks';
import { userService } from '@/services';
import type { UserProfile } from '@/types';

// 4. Relative imports
import { UserCard } from './UserCard';
import type { LocalComponentProps } from './types';
```

### Export Standards
```typescript
// Prefer named exports
export const UserService = {
  getUser: async (id: string): Promise<UserProfile> => {
    // Implementation
  }
};

// Use default exports sparingly (mainly for components)
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  // Component implementation
};

export default UserProfile;

// Re-export from index files
// components/index.ts
export { Button } from './Button';
export { Modal } from './Modal';
export type { ButtonProps } from './Button';
export type { ModalProps } from './Modal';
```

## Error Handling Patterns

### Custom Error Classes
```typescript
// utils/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint?: string,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Error Boundaries
```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Performance Standards

### Optimization Patterns
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
  ({ data, onUpdate }) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison function if needed
    return prevProps.data.id === nextProps.data.id;
  }
);

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return data.map(item => ({
    ...item,
    processed: expensiveCalculation(item)
  }));
}, [data]);

// Use useCallback for stable function references
const handleSubmit = useCallback(
  async (formData: FormData) => {
    await onSubmit(formData);
    reset();
  },
  [onSubmit, reset]
);
```

### Bundle Optimization
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

// Code splitting with dynamic imports
const loadFeature = async () => {
  const { FeatureComponent } = await import('./FeatureComponent');
  return FeatureComponent;
};
```

## Documentation Standards

### Component Documentation
```typescript
/**
 * A reusable button component with multiple variants and sizes.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps {
  /** The content to display inside the button */
  children: React.ReactNode;
  /** The visual style variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** The size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Click event handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}
```

### Function Documentation
```typescript
/**
 * Validates user input data and returns sanitized result
 * @param input - Raw user input data
 * @param schema - Zod validation schema
 * @returns Promise resolving to validated data
 * @throws {ValidationError} When validation fails
 */
export const validateUserInput = async <T>(
  input: unknown,
  schema: z.ZodSchema<T>
): Promise<T> => {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        error.errors[0].message,
        error.errors[0].path.join('.'),
        input
      );
    }
    throw error;
  }
};
```

---

These coding standards ensure consistency, maintainability, and performance across the entire codebase.