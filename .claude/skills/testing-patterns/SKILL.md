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
    lifecycle.test.ts  # Full user journey tests (Playwright - web)
  e2e-mobile/
    .maestro/
      config.yaml      # Maestro config, app IDs, test credentials
    helpers/
      _login.yaml      # Reusable login helper (not run as test)
    flows/
      01-smoke-test.yaml         # Quick health check (~30s)
      02-full-user-journey.yaml  # Complete game lifecycle (~3-4min)
      03-settings-and-theme.yaml # Settings and theme toggle (~1min)
      04-edge-cases.yaml         # Error handling tests (~1min)
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

## E2E Test Patterns (Playwright - Web)

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

## Mobile E2E Test Patterns (Maestro - Android)

Maestro uses YAML-based test flows for Android devices/emulators.

### Prerequisites
- **Maestro CLI** installed
- **Android Studio** with emulator (or physical device)
- **Java 17** (JAVA_HOME set correctly)
- **APK installed** on device/emulator (preview-dev profile for testing)

### Optimized Test Strategy

**4 focused flows instead of many small tests:**

| Flow | Purpose | Time |
|------|---------|------|
| `01-smoke-test.yaml` | Quick health check - app launches, login works | ~30s |
| `02-full-user-journey.yaml` | Complete lifecycle - login, navigate, create game, score entry | ~3-4min |
| `03-settings-and-theme.yaml` | Settings modal, theme toggle | ~1min |
| `04-edge-cases.yaml` | Error handling, invalid inputs | ~1min |

**Key principles:**
- Login ONCE per flow, test multiple features
- Use helper flows (in `helpers/`) for reusable sequences
- Handle error dialogs with `optional: true`
- Total run time: ~6 minutes

### Basic Flow Structure

```yaml
# flows/example.yaml
appId: com.tenk.scorekeeper.previewdev
---
- launchApp:
    clearState: true

# Use helper for login (in helpers/ directory)
- runFlow: "../helpers/_login.yaml"

# Test multiple features without re-logging in
- tapOn: "Stats"
- takeScreenshot: "stats-screen"
- tapOn: "Home"
```

### Common Maestro Commands

```yaml
# Launch app
- launchApp:
    clearState: true  # Clear app data before launch

# Assertions
- assertVisible: "Button Text"
- extendedWaitUntil:
    visible: "Text to find"
    timeout: 10000  # Wait up to 10 seconds

# Interactions
- tapOn: "Button Text"
- tapOn:
    text: "Text"
    index: 0  # If multiple matches
- tapOn:
    point: "50%,80%"  # Coordinate tap (fragile, use sparingly)
- inputText: "text to type"
- scroll  # Scroll down
- back    # Android back button

# Optional interactions (won't fail if not found)
- tapOn:
    text: "OK"
    optional: true
    retryTapIfNoChange: false

# Screenshots
- takeScreenshot: "descriptive-name"

# Helper flows
- runFlow: "../helpers/_login.yaml"
```

### Running Maestro Tests

```bash
# Run all flows (from project root)
cd __tests__/e2e-mobile && maestro test flows/

# Run single flow
maestro test __tests__/e2e-mobile/flows/01-smoke-test.yaml

# Interactive builder (great for creating new tests)
maestro studio
```

### App IDs
| Build Profile | App ID | Supabase |
|---------------|--------|----------|
| Development | `com.tenk.scorekeeper.dev` | 10k-dev |
| Preview-Dev | `com.tenk.scorekeeper.previewdev` | 10k-dev (E2E testing) |
| Preview | `com.tenk.scorekeeper.preview` | 10k-prod |
| Production | `com.tenk.scorekeeper` | 10k-prod |

### Maestro Lessons Learned

1. **Single login per journey** - Don't `clearState` + login for every small test. Chain related tests after one login.

2. **Helper flows go in `helpers/`** - Prefix with `_` and put in separate directory so they don't run as standalone tests.

3. **Handle error dialogs** - App may show error dialogs (e.g., "Failed to load users"). Use `optional: true`:
   ```yaml
   - tapOn:
       text: "OK"
       optional: true
       retryTapIfNoChange: false
   ```

4. **React Native text matching issues** - Buttons with parentheses like "Start Game (1 players)" may not match partial text. Use coordinate taps as fallback or look for unique text portions.

5. **Avoid excessive scrolls** - Scrolling can move content unexpectedly. Only scroll when necessary.

6. **Use `extendedWaitUntil`** - More reliable than `assertVisible` for elements that take time to load:
   ```yaml
   - extendedWaitUntil:
       visible: "Home"
       timeout: 15000
   ```

7. **Screenshots for debugging** - Take screenshots at key points. Failed test screenshots are in `~/.maestro/tests/[date]/`

8. **Test users** - Create dedicated test users in the dev Supabase project:
   - `testuser1@10k.test` / `TestPassword123!`
   - Must have profile in profiles table for returning user flow

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

# Web E2E tests (Playwright)
npm run test:e2e            # Run E2E tests (headless)
npm run test:e2e:ui         # Run with Playwright UI
npm run test:e2e:headed     # Run with visible browser

# Mobile E2E tests (Maestro - requires emulator/device)
npm run test:e2e:mobile     # Run all Maestro flows
npm run test:e2e:mobile:flow <path>  # Run single flow
npm run test:e2e:mobile:record       # Record video
npm run test:e2e:mobile:studio       # Interactive builder

# All tests
npm run test:all            # Unit + Web E2E
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
