/**
 * Accessibility Tests
 *
 * Tests for Google Play Store compliance and general accessibility.
 * Validates that interactive elements have proper accessibility attributes.
 */

import * as fs from 'fs';
import * as path from 'path';

// Screen files to check for accessibility attributes
const SCREEN_FILES = [
  'src/screens/LoginScreen.tsx',
  'src/screens/HomeScreen.tsx',
  'src/screens/SettingsScreen.tsx',
  'src/screens/GamesListScreen.tsx',
  'src/screens/CreateGameScreen.tsx',
  'src/screens/GameScreen.tsx',
];

// Read file content helper
function readScreenFile(filename: string): string {
  const fullPath = path.join(process.cwd(), filename);
  return fs.readFileSync(fullPath, 'utf-8');
}

// Count occurrences of a pattern
function countPattern(content: string, pattern: RegExp): number {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

describe('Accessibility Attributes', () => {
  describe('TouchableOpacity components', () => {
    SCREEN_FILES.forEach((file) => {
      it(`${file} should have accessibilityLabel on TouchableOpacity`, () => {
        const content = readScreenFile(file);

        // Count TouchableOpacity instances
        const touchableCount = countPattern(content, /<TouchableOpacity/g);

        // Count accessibilityLabel instances
        const labelCount = countPattern(content, /accessibilityLabel=/g);

        // Most TouchableOpacity components should have labels
        // Allow some flexibility for decorative elements
        const coverage = touchableCount > 0 ? labelCount / touchableCount : 1;

        expect(coverage).toBeGreaterThanOrEqual(0.5);
      });
    });
  });

  describe('TextInput components', () => {
    SCREEN_FILES.forEach((file) => {
      it(`${file} should have accessibilityLabel on TextInput`, () => {
        const content = readScreenFile(file);

        // Count TextInput instances
        const inputCount = countPattern(content, /<TextInput/g);

        if (inputCount === 0) {
          // No inputs in this file, skip
          return;
        }

        // Count accessibilityLabel instances near TextInput
        // This is a simplified check
        const labelCount = countPattern(content, /accessibilityLabel=/g);

        // Should have at least some labels if there are inputs
        expect(labelCount).toBeGreaterThan(0);
      });
    });
  });

  describe('Button roles', () => {
    SCREEN_FILES.forEach((file) => {
      it(`${file} should use accessibilityRole for interactive elements`, () => {
        const content = readScreenFile(file);

        // Check for accessibilityRole usage
        const roleCount = countPattern(content, /accessibilityRole=/g);

        // Should have at least some roles defined
        expect(roleCount).toBeGreaterThan(0);
      });
    });
  });
});

/**
 * Behavioral Accessibility Tests
 *
 * These tests verify that screens have appropriate accessibility coverage
 * without checking exact label text (which would be fragile to label changes).
 *
 * Tests focus on:
 * - Minimum coverage ratios (interactive elements with labels)
 * - Presence of accessibility roles
 * - Presence of accessibility hints for complex actions
 */
describe('Accessibility Best Practices', () => {
  it('LoginScreen should have accessible form fields', () => {
    const content = readScreenFile('src/screens/LoginScreen.tsx');

    // Email input should have accessibility (check for any email-related label)
    expect(content).toMatch(/accessibilityLabel=.*[Ee]mail/);

    // Password input should have accessibility
    expect(content).toMatch(/accessibilityLabel=.*[Pp]assword/);

    // Login/Sign up buttons should have accessibility
    const authButtonLabels = countPattern(content, /accessibilityLabel=.*(([Ll]og|[Ss]ign))/g);
    expect(authButtonLabels).toBeGreaterThanOrEqual(2);
  });

  it('LoginScreen should have accessible OAuth buttons', () => {
    const content = readScreenFile('src/screens/LoginScreen.tsx');

    // OAuth button should have accessibility (any OAuth-related label)
    expect(content).toMatch(/accessibilityLabel=.*(Google|OAuth|[Ss]ign in with)/);
  });

  it('HomeScreen should have accessible navigation', () => {
    const content = readScreenFile('src/screens/HomeScreen.tsx');

    // Nav buttons should have role="tab"
    expect(content).toContain('accessibilityRole="tab"');

    // Settings button should be accessible (any settings-related label)
    expect(content).toMatch(/accessibilityLabel=.*[Ss]etting/);
  });

  it('SettingsScreen should have accessible controls', () => {
    const content = readScreenFile('src/screens/SettingsScreen.tsx');

    // Theme selector should be accessible (any theme/mode related label)
    expect(content).toMatch(/accessibilityLabel=.*(([Tt]heme|[Mm]ode|[Ll]ight|[Dd]ark))/);

    // Sign out button should be accessible
    expect(content).toMatch(/accessibilityLabel=.*([Ss]ign\s*[Oo]ut|[Ll]og\s*[Oo]ut)/);
  });

  it('GameScreen should have accessible score interactions', () => {
    const content = readScreenFile('src/screens/GameScreen.tsx');

    // Score-related accessibility labels should exist
    const scoreLabels = countPattern(content, /accessibilityLabel=.*(([Ss]core|[Rr]ound|[Aa]dd|[Ss]ubtract))/g);
    expect(scoreLabels).toBeGreaterThanOrEqual(3);
  });

  it('CreateGameScreen should have accessible player selection', () => {
    const content = readScreenFile('src/screens/CreateGameScreen.tsx');

    // Should have checkbox role for player selection
    expect(content).toMatch(/accessibilityRole=.*checkbox/);

    // Should have guest-related accessibility
    expect(content).toMatch(/accessibilityLabel=.*([Gg]uest|[Pp]layer)/);

    // Should have start/create game accessibility
    expect(content).toMatch(/accessibilityLabel=.*(([Ss]tart|[Cc]reate).*[Gg]ame)/);
  });

  it('GamesListScreen should have accessible game cards', () => {
    const content = readScreenFile('src/screens/GamesListScreen.tsx');

    // Join-related accessibility
    expect(content).toMatch(/accessibilityLabel=.*[Jj]oin/);

    // Game code input accessibility
    expect(content).toMatch(/accessibilityLabel=.*(([Gg]ame|[Cc]ode))/);
  });
});

describe('Accessibility State Management', () => {
  it('should use accessibilityState for disabled states', () => {
    SCREEN_FILES.forEach((file) => {
      const content = readScreenFile(file);

      // If file has disabled prop, it should have accessibilityState
      if (content.includes('disabled={')) {
        expect(content).toContain('accessibilityState');
      }
    });
  });

  it('should use accessibilityState for selected states', () => {
    // Check files that have selection UI
    const filesWithSelection = [
      'src/screens/LoginScreen.tsx', // tabs
      'src/screens/HomeScreen.tsx', // nav tabs
      'src/screens/SettingsScreen.tsx', // theme options
    ];

    filesWithSelection.forEach((file) => {
      const content = readScreenFile(file);
      expect(content).toContain('accessibilityState');
    });
  });
});

describe('Screen Reader Hints', () => {
  it('should provide accessibilityHint for complex actions', () => {
    // GameScreen has complex interactions
    const gameContent = readScreenFile('src/screens/GameScreen.tsx');
    expect(gameContent).toContain('accessibilityHint');

    // LoginScreen has form actions
    const loginContent = readScreenFile('src/screens/LoginScreen.tsx');
    expect(loginContent).toContain('accessibilityHint');
  });
});
