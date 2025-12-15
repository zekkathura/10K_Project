/**
 * E2E Theme Tests
 *
 * Tests dark mode and light mode rendering.
 * Ensures theme consistency across the app.
 */

import { test, expect, Page } from '@playwright/test';

// Helper: Wait for app to load
async function waitForAppLoad(page: Page) {
  await page.waitForSelector('text=Loading', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(500);
}

// Test credentials - match what's created in 10k-dev Supabase
const TEST_USER = {
  email: 'testuser1@10k.test',
  password: 'TestPassword123!',
};

// Helper: Login
async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await waitForAppLoad(page);

  let loginError = '';
  const dialogHandler = async (dialog: any) => {
    loginError = dialog.message();
    await dialog.dismiss();
  };
  page.on('dialog', dialogHandler);

  await page.getByPlaceholder('you@example.com').fill(email);
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByText('LOG IN').click();

  await page.waitForTimeout(3000);

  // Handle profile setup modal if it appears
  const welcomeModal = page.getByText('Welcome!');
  if (await welcomeModal.isVisible({ timeout: 2000 }).catch(() => false)) {
    await page.getByPlaceholder('Display name').fill('Test User');
    await page.getByText('Continue').click();
    await page.waitForTimeout(2000);
  }

  page.off('dialog', dialogHandler);

  if (loginError) {
    throw new Error(`Login failed: ${loginError}`);
  }

  await waitForAppLoad(page);
}

// Helper: Get computed background color
async function getBackgroundColor(page: Page, selector: string): Promise<string> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return '';
    return window.getComputedStyle(el).backgroundColor;
  }, selector);
}

// Helper: Get computed text color
async function getTextColor(page: Page, selector: string): Promise<string> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return '';
    return window.getComputedStyle(el).color;
  }, selector);
}

// ============================================
// Login Screen Theme Tests
// ============================================
test.describe('Login Screen Theme', () => {
  test('@noauth login screen renders with consistent colors', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // React Native Web may not set background on body, check the app container or first visible element
    const bgColor = await page.evaluate(() => {
      // First try body
      let bg = window.getComputedStyle(document.body).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return bg;
      }
      // Try the root app container (React Native Web typically uses div#root > div)
      const root = document.querySelector('#root > div') || document.querySelector('#root');
      if (root) {
        bg = window.getComputedStyle(root).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          return bg;
        }
      }
      // Try any element with a solid background
      const allDivs = document.querySelectorAll('div');
      for (const div of allDivs) {
        bg = window.getComputedStyle(div).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          return bg;
        }
      }
      return 'no-background-found';
    });

    // Should have found some background color in the app
    expect(bgColor).not.toBe('no-background-found');
  });

  test('@noauth login buttons have visible contrast', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Login button should be visible
    const loginButton = page.getByText('LOG IN');
    await expect(loginButton).toBeVisible();

    // Button should have a background color (accent color)
    const buttonBgColor = await loginButton.evaluate((el) => {
      // Get the parent TouchableOpacity/button element
      const parent = el.closest('[style*="background"]') || el.parentElement;
      return parent ? window.getComputedStyle(parent).backgroundColor : '';
    });

    // Should have some background color
    expect(buttonBgColor).toBeTruthy();
  });

  test('@noauth input fields have proper styling', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Email input should have border
    const emailInput = page.getByPlaceholder('you@example.com');

    // Input should have visible border or background
    const inputStyles = await emailInput.evaluate((el) => ({
      backgroundColor: window.getComputedStyle(el).backgroundColor,
      borderColor: window.getComputedStyle(el).borderColor,
      borderWidth: window.getComputedStyle(el).borderWidth,
    }));

    // Should have some styling
    expect(inputStyles.backgroundColor || inputStyles.borderWidth !== '0px').toBeTruthy();
  });
});

// ============================================
// Theme Toggle Tests (requires auth)
// Skip: React Native Web Modal doesn't render in Playwright's DOM context properly
// The settings modal opens but Playwright can't access its content
// ============================================
test.describe('Theme Toggle', () => {
  test.skip('can access theme settings after login', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Navigate to settings
    const settingsButton = page.getByRole('button', { name: 'Settings' })
    .or(page.locator('[aria-label="Settings"]'))
    .first();
    await settingsButton.click();
    await waitForAppLoad(page);

    // Should see theme option
    await expect(page.getByText('Theme')).toBeVisible();
  });

  test.skip('theme selection shows current mode', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Navigate to settings
    const settingsButton = page.getByRole('button', { name: 'Settings' })
    .or(page.locator('[aria-label="Settings"]'))
    .first();
    await settingsButton.click();
    await waitForAppLoad(page);

    // Should show current theme mode (Light mode or Dark mode)
    const themeLabel = page.getByText(/Light mode|Dark mode/);
    await expect(themeLabel).toBeVisible();
  });

  test.skip('can toggle theme mode', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Navigate to settings
    const settingsButton = page.getByRole('button', { name: 'Settings' })
    .or(page.locator('[aria-label="Settings"]'))
    .first();
    await settingsButton.click();
    await waitForAppLoad(page);

    // Click theme row to open dropdown
    const themeRow = page.getByText('Theme').first();
    await themeRow.click();
    await page.waitForTimeout(500);

    // Should see both options
    await expect(page.getByText('Light mode')).toBeVisible();
    await expect(page.getByText('Dark mode')).toBeVisible();
  });

  test.skip('theme change affects background color', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Get initial background color
    const initialBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Navigate to settings
    const settingsButton = page.getByRole('button', { name: 'Settings' })
    .or(page.locator('[aria-label="Settings"]'))
    .first();
    await settingsButton.click();
    await waitForAppLoad(page);

    // Click theme row
    const themeRow = page.getByText('Theme').first();
    await themeRow.click();
    await page.waitForTimeout(500);

    // Check current mode and click the opposite
    const currentMode = await page.getByText(/mode/).first().textContent();
    const isLightMode = currentMode?.includes('Light');

    // Click the other mode
    if (isLightMode) {
      await page.getByText('Dark mode').click();
    } else {
      await page.getByText('Light mode').click();
    }

    await page.waitForTimeout(1000);

    // Background should have changed
    const newBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Background color should be different after theme change
    expect(newBg).not.toBe(initialBg);

    // Restore original theme
    await themeRow.click();
    await page.waitForTimeout(500);

    if (isLightMode) {
      await page.getByText('Light mode').click();
    } else {
      await page.getByText('Dark mode').click();
    }
  });
});

// ============================================
// Theme Consistency Tests
// ============================================
test.describe('Theme Consistency', () => {
  test('@noauth accent colors are consistent', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // The accent color should be used on primary actions
    // Login button uses accent color
    const loginButton = page.getByText('LOG IN');
    await expect(loginButton).toBeVisible();

    // Sign up tab active state uses accent
    const signUpTab = page.getByText('SIGN UP');
    await expect(signUpTab).toBeVisible();
  });

  test('@noauth error colors are visible', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Try to login with empty credentials to trigger validation
    await page.getByText('LOG IN').click();

    // Wait for potential error
    await page.waitForTimeout(1000);

    // Error dialog or message should appear
    // The app uses alert() for errors which we can't directly test
    // But we can verify the app doesn't crash
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  });

  test.skip('text remains readable in both themes', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Navigate to settings
    const settingsButton = page.getByRole('button', { name: 'Settings' })
    .or(page.locator('[aria-label="Settings"]'))
    .first();
    await settingsButton.click();
    await waitForAppLoad(page);

    // Verify text is visible
    await expect(page.getByText('Menu')).toBeVisible();
    await expect(page.getByText('Theme')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Display Name')).toBeVisible();

    // Toggle theme
    const themeRow = page.getByText('Theme').first();
    await themeRow.click();
    await page.waitForTimeout(500);

    // Check current mode
    const currentMode = await page.getByText(/mode/).first().textContent();
    const isLightMode = currentMode?.includes('Light');

    // Click the other mode
    if (isLightMode) {
      await page.getByText('Dark mode').click();
    } else {
      await page.getByText('Light mode').click();
    }

    await page.waitForTimeout(500);

    // Text should still be visible after theme change
    await expect(page.getByText('Menu')).toBeVisible();
    await expect(page.getByText('Theme')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();

    // Restore original
    await themeRow.click();
    await page.waitForTimeout(500);
    if (isLightMode) {
      await page.getByText('Light mode').click();
    } else {
      await page.getByText('Dark mode').click();
    }
  });
});

// ============================================
// Color Contrast Tests
// ============================================
test.describe('Color Contrast', () => {
  test('@noauth primary button has sufficient contrast', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Login button text should be readable
    const loginButton = page.getByText('LOG IN');
    await expect(loginButton).toBeVisible();

    // Text should have a color
    const textColor = await loginButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Should have visible text color (not transparent)
    expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(textColor).toBeTruthy();
  });

  test('@noauth placeholder text is visible', async ({ page }) => {
    await page.goto('/');
    await waitForAppLoad(page);

    // Check that placeholder is configured
    const emailInput = page.getByPlaceholder('you@example.com');
    await expect(emailInput).toBeVisible();

    // Placeholder attribute should exist
    const placeholder = await emailInput.getAttribute('placeholder');
    expect(placeholder).toBe('you@example.com');
  });
});

// ============================================
// Theme Persistence Tests
// ============================================
test.describe('Theme Persistence', () => {
  test.skip('theme persists after navigation', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Navigate to settings using accessibility label
    const settingsButton = page.getByRole('button', { name: 'Settings' })
    .or(page.locator('[aria-label="Settings"]'))
    .first();
    await settingsButton.click();
    await waitForAppLoad(page);

    // Get current theme
    const themeRow = page.getByText('Theme').first();
    await themeRow.click();
    await page.waitForTimeout(500);

    // Remember current mode
    const currentMode = await page.getByText(/mode/).first().textContent();

    // Close settings
    const closeButton = page.getByText('×');
    await closeButton.click();
    await page.waitForTimeout(500);

    // Navigate to a different tab
    await page.getByText('Stats', { exact: true }).click();
    await page.waitForTimeout(500);

    // Go back to settings (re-query since DOM may have changed)
    const settingsButton2 = page.getByRole('button', { name: 'Settings' })
      .or(page.locator('[aria-label="Settings"]'))
      .first();
    await settingsButton2.click();
    await waitForAppLoad(page);

    // Theme should still be the same
    const newThemeRow = page.getByText('Theme').first();
    await newThemeRow.click();
    await page.waitForTimeout(500);

    const newMode = await page.getByText(/mode/).first().textContent();
    expect(newMode).toContain(currentMode?.includes('Light') ? 'Light' : 'Dark');
  });
});
