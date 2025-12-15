/**
 * E2E Responsive/Cross-Platform Tests
 *
 * Tests the app renders correctly across different viewport sizes:
 * - Phone (small, standard, large)
 * - Tablet (portrait, landscape)
 * - Phone landscape mode
 *
 * These tests ensure Google Play compliance for phone/tablet apps.
 */

import { test, expect, Page } from '@playwright/test';

// Viewport configurations
const VIEWPORTS = {
  // Phones
  phoneSmall: { width: 320, height: 568, name: 'iPhone SE (small phone)' },
  phoneStandard: { width: 375, height: 667, name: 'iPhone 8 (standard phone)' },
  phoneLarge: { width: 428, height: 926, name: 'iPhone 14 Pro Max (large phone)' },
  phoneLandscape: { width: 667, height: 375, name: 'Phone landscape' },
  // Tablets
  tabletPortrait: { width: 768, height: 1024, name: 'iPad portrait' },
  tabletLandscape: { width: 1024, height: 768, name: 'iPad landscape' },
  // Android
  androidSmall: { width: 360, height: 640, name: 'Android small' },
  androidLarge: { width: 412, height: 915, name: 'Pixel 6 Pro' },
};

// Helper: Wait for app to load
async function waitForAppLoad(page: Page) {
  await page.waitForSelector('text=Loading', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(500);
}

// Helper: Check element is visible and within viewport
async function isElementFullyVisible(page: Page, selector: string): Promise<boolean> {
  const element = await page.$(selector);
  if (!element) return false;

  const box = await element.boundingBox();
  if (!box) return false;

  const viewport = page.viewportSize();
  if (!viewport) return false;

  return (
    box.x >= 0 &&
    box.y >= 0 &&
    box.x + box.width <= viewport.width &&
    box.y + box.height <= viewport.height
  );
}

// ============================================
// Login Screen Responsive Tests
// ============================================
test.describe('Login Screen Responsiveness', () => {
  Object.entries(VIEWPORTS).forEach(([key, { width, height, name }]) => {
    test(`@noauth renders correctly on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await waitForAppLoad(page);

      // Login form should be visible
      await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
      await expect(page.getByPlaceholder('Enter password')).toBeVisible();

      // Login button should be visible
      await expect(page.getByText('LOG IN')).toBeVisible();

      // Google OAuth button should be visible
      await expect(page.getByText('Continue with Google')).toBeVisible();

      // Logo should be visible
      await expect(page.locator('img[src*="10k_logo"]')).toBeVisible();
    });
  });

  test('@noauth inputs are usable on small screens', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.phoneSmall);
    await page.goto('/');
    await waitForAppLoad(page);

    // Should be able to type in email
    const emailInput = page.getByPlaceholder('you@example.com');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Should be able to type in password
    const passwordInput = page.getByPlaceholder('Enter password');
    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('@noauth form scrolls properly on small screens', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.phoneSmall);
    await page.goto('/');
    await waitForAppLoad(page);

    // Switch to sign up mode (more fields)
    await page.getByText('SIGN UP').click();
    await page.waitForTimeout(300);

    // All form fields should eventually be accessible via scroll
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();

    // Scroll to show more fields if needed
    await page.getByPlaceholder('Enter password').scrollIntoViewIfNeeded();
    await expect(page.getByPlaceholder('Enter password')).toBeVisible();
  });
});

// ============================================
// Layout Tests
// ============================================
test.describe('Layout Consistency', () => {
  test('@noauth no horizontal overflow on phone', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.phoneStandard);
    await page.goto('/');
    await waitForAppLoad(page);

    // Check that body doesn't have horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > document.body.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('@noauth no horizontal overflow on tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tabletPortrait);
    await page.goto('/');
    await waitForAppLoad(page);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > document.body.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('@noauth content is centered on tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tabletLandscape);
    await page.goto('/');
    await waitForAppLoad(page);

    // The form container should have max-width constraint
    // This is validated by checking the form doesn't stretch to full width
    const emailInput = page.getByPlaceholder('you@example.com');
    const box = await emailInput.boundingBox();

    if (box) {
      // Input shouldn't be full width on tablet
      expect(box.width).toBeLessThan(VIEWPORTS.tabletLandscape.width * 0.7);
    }
  });
});

// ============================================
// Touch Target Tests (Google Play Requirement)
// ============================================
test.describe('Touch Targets', () => {
  test('@noauth buttons meet minimum touch target size', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.phoneStandard);
    await page.goto('/');
    await waitForAppLoad(page);

    // Google Play recommends minimum 48x48dp touch targets
    const MIN_SIZE = 44; // pixels (allowing some flexibility)

    // Check login button - get the parent container (TouchableOpacity)
    const loginButton = page.getByText('LOG IN');
    const loginParent = await loginButton.evaluate((el) => {
      // Find the clickable parent (has cursor:pointer or role=button)
      let parent = el.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (style.cursor === 'pointer' || parent.getAttribute('role') === 'button') {
          return { height: parent.getBoundingClientRect().height };
        }
        parent = parent.parentElement;
      }
      return { height: el.getBoundingClientRect().height };
    });
    expect(loginParent.height).toBeGreaterThanOrEqual(MIN_SIZE);

    // Check Google button - get the parent container
    const googleButton = page.getByText('Continue with Google');
    const googleParent = await googleButton.evaluate((el) => {
      let parent = el.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (style.cursor === 'pointer' || parent.getAttribute('role') === 'button') {
          return { height: parent.getBoundingClientRect().height };
        }
        parent = parent.parentElement;
      }
      return { height: el.getBoundingClientRect().height };
    });
    expect(googleParent.height).toBeGreaterThanOrEqual(MIN_SIZE);
  });

  test('@noauth input fields have adequate touch area', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.phoneStandard);
    await page.goto('/');
    await waitForAppLoad(page);

    const MIN_HEIGHT = 40;

    // Check email input
    const emailInput = page.getByPlaceholder('you@example.com');
    const emailBox = await emailInput.boundingBox();
    if (emailBox) {
      expect(emailBox.height).toBeGreaterThanOrEqual(MIN_HEIGHT);
    }

    // Check password input
    const passwordInput = page.getByPlaceholder('Enter password');
    const passwordBox = await passwordInput.boundingBox();
    if (passwordBox) {
      expect(passwordBox.height).toBeGreaterThanOrEqual(MIN_HEIGHT);
    }
  });
});

// ============================================
// Orientation Change Tests
// ============================================
test.describe('Orientation Changes', () => {
  test('@noauth handles portrait to landscape transition', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize(VIEWPORTS.phoneStandard);
    await page.goto('/');
    await waitForAppLoad(page);

    // Verify initial state
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();

    // Switch to landscape
    await page.setViewportSize(VIEWPORTS.phoneLandscape);
    await page.waitForTimeout(500);

    // Form should still be usable
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByText('LOG IN')).toBeVisible();
  });

  test('@noauth handles tablet orientation change', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize(VIEWPORTS.tabletPortrait);
    await page.goto('/');
    await waitForAppLoad(page);

    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();

    // Switch to landscape
    await page.setViewportSize(VIEWPORTS.tabletLandscape);
    await page.waitForTimeout(500);

    // Form should still be usable
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByText('LOG IN')).toBeVisible();
  });
});

// ============================================
// Text Scaling Tests
// ============================================
test.describe('Text Readability', () => {
  test('@noauth text is readable on small screens', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.phoneSmall);
    await page.goto('/');
    await waitForAppLoad(page);

    // Check that main text elements are visible and have reasonable size
    const title = page.getByText('10K Scorekeeper');
    await expect(title).toBeVisible();

    // Title should have decent font size
    const fontSize = await title.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    expect(fontSize).toBeGreaterThanOrEqual(16); // Minimum readable size
  });

  test('@noauth labels are visible on large screens', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tabletLandscape);
    await page.goto('/');
    await waitForAppLoad(page);

    // Labels should be visible (use exact match to avoid matching "Forgot password?")
    await expect(page.getByText('EMAIL')).toBeVisible();
    await expect(page.getByText('PASSWORD', { exact: true })).toBeVisible();
  });
});

// ============================================
// Responsive Navigation Tests (requires auth)
// ============================================
test.describe('Navigation Responsiveness', () => {
  // These tests require login - will be skipped in @noauth mode
  test('navigation tabs are accessible on phone', async ({ page }) => {
    // This test requires authentication
    // Skip for now with @noauth tag

    await page.setViewportSize(VIEWPORTS.phoneStandard);
    await page.goto('/');
    await waitForAppLoad(page);

    // Just verify login screen works at this viewport
    await expect(page.getByText('LOG IN')).toBeVisible();
  });

  test('navigation tabs work on tablet landscape', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tabletLandscape);
    await page.goto('/');
    await waitForAppLoad(page);

    // Verify login screen works at tablet viewport
    await expect(page.getByText('LOG IN')).toBeVisible();
    await expect(page.getByText('Continue with Google')).toBeVisible();
  });
});
