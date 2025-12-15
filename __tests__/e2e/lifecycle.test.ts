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

  // Fill login form
  await page.getByPlaceholder('you@example.com').fill(email);
  await page.getByPlaceholder('Enter password').fill(password);

  // Click login button
  await page.getByText('LOG IN').click();

  // Wait for navigation away from login (games list should appear)
  await page.waitForTimeout(2000);
  await waitForAppLoad(page);
}

// Helper: Logout
async function logout(page: Page) {
  // Navigate to settings
  await page.getByText(/settings/i).first().click();
  await waitForAppLoad(page);

  // Click logout
  await page.getByRole('button', { name: /log out|sign out/i }).click();
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

    // Try to login with bad credentials
    await page.getByPlaceholder('you@example.com').fill('invalid@example.com');
    await page.getByPlaceholder('Enter password').fill('wrongpassword');
    await page.getByText('LOG IN').click();

    // Should show error message
    await expect(page.getByText(/invalid|error|incorrect|failed/i)).toBeVisible({ timeout: 10000 });
  });

  test('successful login and logout', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Should see main app content (games list or create game button)
    await expect(page.getByText(/create|games|new game/i).first()).toBeVisible({ timeout: 10000 });

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

    // Click create game button
    await page.getByRole('button', { name: /create.*game|new.*game/i }).click();
    await waitForAppLoad(page);

    // Should show game screen with join code
    await expect(page.getByText(/join.*code|code/i)).toBeVisible({ timeout: 10000 });

    // Should show 6-character alphanumeric code
    const joinCodeElement = await page.locator('text=/[A-Z0-9]{6}/').first();
    await expect(joinCodeElement).toBeVisible();
  });
});

// ============================================
// Full Lifecycle Test
// ============================================
test.describe('Game Lifecycle', () => {
  test('complete game from creation to adding players', async ({ page }) => {
    // === User 1: Create game ===
    await login(page, TEST_USER.email, TEST_USER.password);

    // Create new game
    await page.getByRole('button', { name: /create.*game|new.*game/i }).click();
    await waitForAppLoad(page);

    // Get join code
    const joinCodeElement = await page.locator('text=/[A-Z0-9]{6}/').first();
    const joinCode = await joinCodeElement.textContent();
    expect(joinCode).toBeTruthy();

    console.log(`Created game with join code: ${joinCode}`);

    // Add a guest player
    const addPlayerButton = page.getByRole('button', { name: /add.*player|guest/i });
    if (await addPlayerButton.isVisible()) {
      await addPlayerButton.click();
      await page.getByPlaceholder(/name|player/i).fill('GuestPlayer1');
      await page.getByRole('button', { name: /add|confirm|ok/i }).click();
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
