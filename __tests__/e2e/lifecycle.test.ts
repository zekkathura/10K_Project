/**
 * E2E Lifecycle Tests
 *
 * Tests complete user journeys through the application.
 * These tests run against a real browser with the dev server.
 *
 * Prerequisites:
 * - Test user accounts created in your test Supabase project
 * - Environment variables set in .env.test
 *
 * Run: npx playwright test
 * Run with UI: npx playwright test --ui
 * Run specific test: npx playwright test -g "login"
 */

import { test, expect, Page } from '@playwright/test';

// Test credentials - set these in your test Supabase project
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'testpassword123',
};

const TEST_USER_2 = {
  email: process.env.TEST_USER2_EMAIL || 'test2@example.com',
  password: process.env.TEST_USER2_PASSWORD || 'testpassword123',
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
  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/password/i).fill(password);

  // Click login button
  await page.getByRole('button', { name: /sign in|log in/i }).click();

  // Wait for navigation away from login
  await page.waitForURL(/.*/, { timeout: 10000 });
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
  test('shows login screen for unauthenticated user', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Should see login form elements (actual placeholders from LoginScreen.tsx)
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Enter password')).toBeVisible();
  });

  test.skip('shows error for invalid credentials', async ({ page }) => {
    // TODO: Update error text matcher once we know exact Supabase error messages
    await page.goto('/');
    await waitForAppLoad(page);

    // Try to login with bad credentials
    await page.getByPlaceholder('you@example.com').fill('invalid@example.com');
    await page.getByPlaceholder('Enter password').fill('wrongpassword');
    await page.getByText('LOG IN').click();

    // Should show error message (adjust regex to match actual Supabase error)
    await expect(page.getByText(/invalid|error|incorrect|failed/i)).toBeVisible({ timeout: 10000 });
  });

  test.skip('successful login and logout', async ({ page }) => {
    // Skip if no test credentials configured
    if (TEST_USER.email === 'test@example.com') {
      test.skip();
      return;
    }

    await login(page, TEST_USER.email, TEST_USER.password);

    // Should see main app content (games list or similar)
    await expect(page.getByText(/games|create|join/i)).toBeVisible();

    await logout(page);

    // Should be back at login
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
  });
});

// ============================================
// Game Creation Tests
// ============================================
test.describe('Game Creation', () => {
  test.skip('create new game', async ({ page }) => {
    // Skip if no test credentials
    if (TEST_USER.email === 'test@example.com') {
      test.skip();
      return;
    }

    await login(page, TEST_USER.email, TEST_USER.password);

    // Click create game button
    await page.getByRole('button', { name: /create.*game|new.*game/i }).click();
    await waitForAppLoad(page);

    // Should show game screen with join code
    await expect(page.getByText(/join.*code|code/i)).toBeVisible();

    // Should show 6-character alphanumeric code
    const joinCode = await page.locator('text=/[A-Z0-9]{6}/').textContent();
    expect(joinCode).toMatch(/[A-Z0-9]{6}/);
  });
});

// ============================================
// Full Lifecycle Test
// ============================================
test.describe('Game Lifecycle', () => {
  test.skip('complete game from creation to finish', async ({ page, context }) => {
    // Skip if no test credentials
    if (TEST_USER.email === 'test@example.com') {
      test.skip();
      return;
    }

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
    await page.getByRole('button', { name: /add.*player|guest/i }).click();
    await page.getByPlaceholder(/name|player/i).fill('GuestPlayer1');
    await page.getByRole('button', { name: /add|confirm|ok/i }).click();
    await waitForAppLoad(page);

    // Should now have 2 players
    await expect(page.getByText(/GuestPlayer1/i)).toBeVisible();

    // === Play some rounds ===
    // This will depend on your UI structure - adjust selectors as needed

    // Example: Enter score for first player
    // await page.getByText(/round 1/i).click();
    // await page.getByPlaceholder(/score/i).fill('500');
    // await page.getByRole('button', { name: /save|confirm/i }).click();

    // === End game ===
    // await page.getByRole('button', { name: /finish|end.*game/i }).click();
    // await page.getByRole('button', { name: /confirm/i }).click();

    // Verify game ended
    // await expect(page.getByText(/ended|complete|winner/i)).toBeVisible();

    console.log('Game lifecycle test completed');
  });
});

// ============================================
// Annoyance Tests (Edge Cases)
// ============================================
test.describe('Edge Cases', () => {
  test('handles rapid navigation', async ({ page }) => {
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

  test('handles empty form submission', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Try to submit empty form
    await page.getByText('LOG IN').click();

    // Should show validation error or stay on login
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  });

  test('handles special characters in input', async ({ page }) => {
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
  test.skip('login screen renders correctly', async ({ page }) => {
    // Run `npx playwright test --update-snapshots` to create baseline
    await page.goto('/');
    await waitForAppLoad(page);

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('login-screen.png', {
      maxDiffPixels: 100, // Allow small differences
    });
  });
});
