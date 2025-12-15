# Testing Patterns Skill

Use when writing tests for the 10K Scorekeeper application.

## Test Structure

```
__tests__/
  utils/
    testSupabase.ts    # Supabase test clients (anon + admin)
    testHelpers.ts     # Mock generators, utilities
  unit/
    validation.test.ts # Pure function tests
    database.test.ts   # Database ops with mocked Supabase
  integration/
    screens/           # Screen component tests
  e2e/
    lifecycle.test.ts  # Full user journey tests
```

## Environment Setup

### Files
- `.env` - Production Supabase (app runtime)
- `.env.test` - Test Supabase (separate project recommended)
- `.env.example` - Template for environment variables

### Test Supabase Clients

```typescript
import { testSupabase, adminSupabase } from '../utils/testSupabase';

// testSupabase - Uses anon key, respects RLS (test as user)
// adminSupabase - Uses service_role, bypasses RLS (setup/teardown)
```

## Unit Test Patterns

### Testing Validation Functions

```typescript
import {
  validateJoinCode,
  validatePlayerName,
  validateScore,
  validateEmail,
} from '../../src/lib/validation';

describe('validateJoinCode', () => {
  // Valid cases
  it('accepts valid 6-char alphanumeric code', () => {
    const result = validateJoinCode('ABC123');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('ABC123');
  });

  // Edge cases
  it('trims whitespace and uppercases', () => {
    const result = validateJoinCode('  abc123  ');
    expect(result.sanitized).toBe('ABC123');
  });

  // Invalid cases
  it('rejects codes with wrong length', () => {
    expect(validateJoinCode('ABC').isValid).toBe(false);
    expect(validateJoinCode('ABC12345').isValid).toBe(false);
  });

  it('rejects codes with special characters', () => {
    expect(validateJoinCode('ABC!23').isValid).toBe(false);
  });
});
```

### Testing with Mocked Supabase

```typescript
// Mock the supabase module
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

import { supabase } from '../../src/lib/supabase';
import { createGame } from '../../src/lib/database';

describe('createGame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates game with unique join code', async () => {
    const mockGame = { id: 'game-123', join_code: 'ABC123' };

    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockGame, error: null }),
        }),
      }),
    });

    const result = await createGame('user-123');
    expect(result).toEqual(mockGame);
  });
});
```

## Test Helpers

### Mock Generators

```typescript
import {
  generateUUID,
  generateJoinCode,
  generateTestEmail,
  generatePlayerName,
  createMockGame,
  createMockPlayer,
  createMockTurn,
} from '../utils/testHelpers';

// Generate random valid data
const uuid = generateUUID();           // 'a1b2c3d4-...'
const code = generateJoinCode();       // 'ABC123'
const email = generateTestEmail();     // 'test_xyz@test.example.com'
const name = generatePlayerName();     // 'QuickRoller42'

// Create full mock objects
const game = createMockGame({ status: 'active' });
const player = createMockPlayer({ game_id: game.id });
const turn = createMockTurn({ player_id: player.id, score: 500 });
```

### Test Data Cleanup

```typescript
import { cleanupTestData, adminSupabase } from '../utils/testSupabase';

describe('Integration tests', () => {
  const createdGameIds: string[] = [];

  afterAll(async () => {
    await cleanupTestData({ gameIds: createdGameIds });
  });

  it('creates a game', async () => {
    // ... test creates game
    createdGameIds.push(game.id); // Track for cleanup
  });
});
```

## Integration Test Patterns

### Testing Screens with React Testing Library

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '../../src/lib/theme';
import GameScreen from '../../src/screens/GameScreen';

// Wrap component with required providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('GameScreen', () => {
  it('displays loading state initially', () => {
    const { getByText } = renderWithProviders(
      <GameScreen route={{ params: { gameId: 'test' } }} />
    );
    expect(getByText('Loading game...')).toBeTruthy();
  });
});
```

## E2E Test Patterns (Playwright)

### Full Lifecycle Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Game Lifecycle', () => {
  test('complete game from creation to finish', async ({ page }) => {
    // 1. Login
    await page.goto('/');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // 2. Create game
    await page.click('[data-testid="create-game"]');
    await expect(page.locator('[data-testid="join-code"]')).toBeVisible();

    // 3. Add players, play rounds, finish game...
  });
});
```

## Test Categories

### 1. Unit Tests (Fast, Isolated)
- Validation functions
- Utility functions
- Pure calculations

### 2. Integration Tests (Component Level)
- Screen rendering
- User interactions
- State management
- Mocked backend

### 3. E2E Tests (Full System)
- Complete user journeys
- Real database operations
- Multi-user scenarios

### 4. Annoyance Tests (Edge Cases)
- Invalid inputs (empty, too long, special chars)
- Network failures
- Auth expiration
- Rapid interactions
- Race conditions
- Boundary values (0, max, negative)

## Running Tests

```bash
# Unit tests (Jest)
npm test                    # Run all unit tests
npm run test:unit           # Run unit tests only
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage

# E2E tests (Playwright)
npm run test:e2e            # Run E2E tests (headless)
npm run test:e2e:ui         # Run with Playwright UI
npm run test:e2e:headed     # Run with visible browser

# All tests
npm run test:all            # Unit + E2E
```

## Test Naming Conventions

```typescript
describe('functionName or ComponentName', () => {
  describe('when [condition]', () => {
    it('should [expected behavior]', () => {});
  });

  // Or simpler:
  it('[action] [expected result]', () => {});
  it('accepts valid input', () => {});
  it('rejects empty string', () => {});
  it('handles network error gracefully', () => {});
});
```

## Common Assertions

```typescript
// Validation results
expect(result.isValid).toBe(true);
expect(result.error).toBeUndefined();
expect(result.sanitized).toBe('expected');

// Database operations
expect(game).toBeDefined();
expect(game.id).toMatch(/^[0-9a-f-]{36}$/);

// Errors
await expect(fn()).rejects.toThrow('error message');
expect(result.error).toContain('Invalid');

// Arrays
expect(players).toHaveLength(3);
expect(scores).toContain(500);

// React Native
expect(getByText('Loading...')).toBeTruthy();
expect(queryByText('Error')).toBeNull();
```
