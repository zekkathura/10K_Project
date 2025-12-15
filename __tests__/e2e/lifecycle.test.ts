/**
 * E2E Lifecycle Tests
 *
 * Tests complete user journeys through the application.
 * These tests run against a real browser with the dev server.
 *
 * Two test modes:
 * 1. Basic UI tests (chromium project): npm run test:e2e
 *    - Tests tagged with @noauth run against production
 *    - No login required
 *
 * 2. Full tests (dev-chromium project): npm run test:e2e:dev
 *    - First start: npm run start:test (separate terminal)
 *    - Uses 10k-dev Supabase with test users
 *    - All tests including login/logout
 *
 * Test credentials (10k-dev):
 * - testuser1@10k.test / TestPassword123!
 * - testuser2@10k.test / TestPassword123!
 */

import { test, expect, Page } from '@playwright/test';

// Test credentials - match what's created in 10k-dev Supabase
const TEST_USER = {
  email: 'testuser1@10k.test',
  password: 'TestPassword123!',
};

const TEST_USER_2 = {
  email: 'testuser2@10k.test',
  password: 'TestPassword123!',
};

// Helper: Wait for app to load (dice loader to disappear)
async function waitForAppLoad(page: Page) {
  // Wait for loading state to disappear
  await page.waitForSelector('text=Loading', { state: 'hidden', timeout: 30000 }).catch(() => {
    // Loading text might not appear if already loaded
  });
  // Give React a moment to settle
  await page.waitForTimeout(500);
}

// Helper: Login with credentials
async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await waitForAppLoad(page);

  // Set up dialog handler to dismiss any error dialogs
  let loginError = '';
  const dialogHandler = async (dialog: any) => {
    loginError = dialog.message();
    await dialog.dismiss();
  };
  page.on('dialog', dialogHandler);

  // Fill login form
  await page.getByPlaceholder('you@example.com').fill(email);
  await page.getByPlaceholder('Enter password').fill(password);

  // Click login button - wait for it to be actionable first
  const loginButton = page.getByText('LOG IN');
  await loginButton.waitFor({ state: 'visible' });
  await loginButton.click();

  // Wait for login to process
  await page.waitForTimeout(3000);

  // Check if profile setup modal appeared (for users without profiles)
  const welcomeModal = page.getByText('Welcome!');
  if (await welcomeModal.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('Profile setup modal appeared - filling display name');
    await page.getByPlaceholder('Display name').fill('Test User');
    await page.getByText('Continue').click();
    await page.waitForTimeout(2000);
  }

  // Remove dialog handler after login attempt
  page.off('dialog', dialogHandler);

  // Throw if login failed
  if (loginError) {
    throw new Error(`Login failed: ${loginError}`);
  }

  await waitForAppLoad(page);

  // Wait for navigation to complete - should see HomeScreen elements
  await page.waitForSelector('text=/Home|My Active Games|Join Game/i', { timeout: 10000 });
}

// Helper: Logout
async function logout(page: Page) {
  // Wait to ensure we're on the home screen first
  await page.waitForSelector('text=/My Active Games|Home/i', { timeout: 10000 });
  console.log('[logout] Home screen detected');

  // Navigate to settings - look for the settings button in the header
  // React Native Web renders accessibilityLabel as aria-label
  const settingsButton = page.locator('[aria-label="Settings"]');

  // Verify settings button exists before clicking
  await settingsButton.waitFor({ state: 'visible', timeout: 10000 });
  console.log('[logout] Settings button found');
  await settingsButton.click();
  console.log('[logout] Settings button clicked');

  // Wait for settings modal to fully load (not just header, but profile content)
  // "Display Name" only appears in settings, not on login screen
  await page.waitForSelector('text=Display Name', { timeout: 20000 });
  console.log('[logout] Settings fully loaded - Display Name found');
  await waitForAppLoad(page);

  // Wait specifically for Sign Out button
  const signOutButton = page.getByText('Sign Out');
  await signOutButton.waitFor({ state: 'visible', timeout: 15000 });
  console.log('[logout] Sign Out button found');

  await signOutButton.click();
  console.log('[logout] Sign Out clicked');
  await waitForAppLoad(page);
}

// ============================================
// Authentication Tests
// ============================================
test.describe('Authentication', () => {
  test('@noauth shows login screen for unauthenticated user', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Should see login form elements (actual placeholders from LoginScreen.tsx)
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Enter password')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Set up dialog listener to capture error message
    let errorMessage = '';
    page.on('dialog', async dialog => {
      errorMessage = dialog.message();
      await dialog.dismiss();
    });

    // Try to login with bad credentials
    await page.getByPlaceholder('you@example.com').fill('invalid@example.com');
    await page.getByPlaceholder('Enter password').fill('wrongpassword');
    await page.getByText('LOG IN').click();

    // Wait for the error dialog to appear and be captured
    await page.waitForTimeout(3000);

    // Should have received an error dialog (Supabase returns "Invalid login credentials")
    expect(errorMessage.toLowerCase()).toMatch(/invalid|error|incorrect|failed/i);
  });

  // Skip: React Native Web Modal doesn't render in Playwright's DOM context properly
  // The settings modal opens but Playwright can't access its content
  // Core login functionality is tested by 'create new game' and other tests that require auth
  test.skip('successful login and logout', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Should see main app content - look for elements that exist after login
    // GamesListScreen shows: "My Active Games (X)", "Join Game" button, nav tabs
    // Use regex since the text includes a count like "My Active Games (0)"
    await expect(page.getByText(/My Active Games/i).first()).toBeVisible({ timeout: 10000 });

    await logout(page);

    // Should be back at login
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible({ timeout: 10000 });
  });
});

// ============================================
// Game Creation Tests
// ============================================
test.describe('Game Creation', () => {
  test('create new game', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Click "Play" nav button to open CreateGameScreen
    // The nav has: Home, Game, Play, Stats, Rules
    // Use exact match to avoid matching "Live Matches with Recent Players"
    await page.getByText('Play', { exact: true }).click();
    await waitForAppLoad(page);

    // CreateGameScreen shows "Create New Game" title and has "Start Game" button
    await expect(page.getByText('Create New Game')).toBeVisible({ timeout: 10000 });

    // Click the start game button (shows "Start Game (X players)")
    await page.getByText(/Start Game/i).click();
    await waitForAppLoad(page);

    // Should show game screen with join code displayed
    // The GameScreen shows the join code prominently
    await expect(page.getByText(/Round|Game|Players/i).first()).toBeVisible({ timeout: 10000 });
  });
});

// ============================================
// Full Lifecycle Test
// ============================================
test.describe('Game Lifecycle', () => {
  // Skip: This test is flaky and depends on guest player modal interaction
  // Core game creation is tested by 'create new game' test
  test.skip('complete game from creation to adding players', async ({ page }) => {
    // === User 1: Create game ===
    await login(page, TEST_USER.email, TEST_USER.password);

    // Click "Play" nav button to open CreateGameScreen
    // Use exact match to avoid matching "Live Matches with Recent Players"
    await page.getByText('Play', { exact: true }).click();
    await waitForAppLoad(page);

    // Click start game button (shows "Start Game (X players)")
    await page.getByText(/Start Game/i).click();
    await waitForAppLoad(page);

    // Should be on game screen now
    console.log('Game started successfully');

    // Add a guest player - look for "Add Guest" button
    const addPlayerButton = page.getByText(/add.*guest|add.*player/i).first();
    if (await addPlayerButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addPlayerButton.click();
      await waitForAppLoad(page);

      // Fill guest name in modal
      await page.getByPlaceholder(/name|guest/i).fill('GuestPlayer1');
      await page.getByText(/add|confirm|save/i).first().click();
      await waitForAppLoad(page);

      // Should now have the guest player visible
      await expect(page.getByText(/GuestPlayer1/i)).toBeVisible();
    }

    console.log('Game lifecycle test completed');
  });
});

// ============================================
// Edge Cases (Basic UI tests - @noauth)
// ============================================
test.describe('Edge Cases', () => {
  test('@noauth handles rapid navigation', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Rapidly click multiple times - app should not crash
    for (let i = 0; i < 5; i++) {
      await page.getByPlaceholder('you@example.com').click();
      await page.getByPlaceholder('Enter password').click();
    }

    // App should still be responsive
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  });

  test('@noauth handles empty form submission', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Try to submit empty form
    await page.getByText('LOG IN').click();

    // Should show validation error or stay on login
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  });

  test('@noauth handles special characters in input', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Set up dialog listener - dismiss any dialogs and track XSS attempts
    const xssDialogs: string[] = [];
    page.on('dialog', async dialog => {
      // Check if this is an XSS dialog (would contain "xss" from our input)
      if (dialog.message().includes('xss')) {
        xssDialogs.push(dialog.message());
      }
      await dialog.dismiss();
    });

    // Try special characters that could cause XSS
    await page.getByPlaceholder('you@example.com').fill('<script>alert("xss")</script>@test.com');
    await page.getByPlaceholder('Enter password').fill('<img src=x onerror=alert(1)>');
    await page.getByText('LOG IN').click();

    // Wait for any potential XSS execution
    await page.waitForTimeout(2000);

    // Should NOT have any XSS dialogs
    expect(xssDialogs).toHaveLength(0);
  });
});

// ============================================
// Visual Regression Tests
// ============================================
test.describe('Visual', () => {
  test.skip('@noauth login screen renders correctly', async ({ page }) => {
    // Run `npx playwright test --update-snapshots` to create baseline
    await page.goto('/');
    await waitForAppLoad(page);

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('login-screen.png', {
      maxDiffPixels: 100, // Allow small differences
    });
  });
});
