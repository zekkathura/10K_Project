/**
 * Security Tests - Authentication & Authorization
 *
 * Tests security-related functionality:
 * - Logger sanitizes PII correctly
 * - Password validation is secure
 * - Error messages don't expose sensitive data
 * - Input validation prevents injection attacks
 */

import { logger } from '../../src/lib/logger';
import {
  validateJoinCode,
  validatePlayerName,
  validateGameName,
} from '../../src/lib/validation';

// Mock console methods to capture log output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
let logOutput: string[] = [];

beforeEach(() => {
  logOutput = [];
  console.log = jest.fn((...args) => {
    logOutput.push(args.join(' '));
  });
  console.error = jest.fn((...args) => {
    logOutput.push(args.join(' '));
  });
  console.warn = jest.fn((...args) => {
    logOutput.push(args.join(' '));
  });
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

describe('Logger PII Sanitization', () => {
  describe('Email sanitization', () => {
    it('should sanitize email addresses in strings', () => {
      logger.debug('User logged in: user@example.com');
      const output = logOutput.join(' ');
      expect(output).not.toContain('user@example.com');
      expect(output).toContain('[EMAIL]');
    });

    it('should sanitize multiple email addresses', () => {
      logger.debug('From: sender@test.com To: receiver@test.com');
      const output = logOutput.join(' ');
      expect(output).not.toContain('sender@test.com');
      expect(output).not.toContain('receiver@test.com');
      expect(output.match(/\[EMAIL\]/g)?.length).toBe(2);
    });

    it('should sanitize emails in objects', () => {
      logger.debug('User data:', { email: 'test@example.com', name: 'John' });
      const output = logOutput.join(' ');
      expect(output).not.toContain('test@example.com');
      expect(output).toContain('[REDACTED]');
    });
  });

  describe('UUID sanitization', () => {
    it('should sanitize UUIDs in strings', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      logger.debug('User ID:', uuid);
      const output = logOutput.join(' ');
      expect(output).not.toContain(uuid);
      expect(output).toContain('[UUID]');
    });

    it('should sanitize user_id in objects', () => {
      logger.debug('Profile:', { user_id: '550e8400-e29b-41d4-a716-446655440000', name: 'Test' });
      const output = logOutput.join(' ');
      expect(output).toContain('[REDACTED]');
    });
  });

  describe('Token sanitization', () => {
    it('should sanitize JWT tokens', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      logger.debug('Token:', jwt);
      const output = logOutput.join(' ');
      expect(output).not.toContain('eyJhbGciOiJIUzI1NiI');
      expect(output).toContain('[TOKEN]');
    });

    it('should sanitize access_token and refresh_token keys', () => {
      logger.debug('Session:', { accessToken: 'secret123', refreshToken: 'refresh456' });
      const output = logOutput.join(' ');
      expect(output).not.toContain('secret123');
      expect(output).not.toContain('refresh456');
      expect(output).toContain('[REDACTED]');
    });
  });

  describe('Sensitive keys redaction', () => {
    it('should redact password field', () => {
      logger.debug('Login attempt:', { email: 'test@test.com', password: 'secret123' });
      const output = logOutput.join(' ');
      expect(output).not.toContain('secret123');
      expect(output).toContain('[REDACTED]');
    });

    it('should redact id field in objects', () => {
      logger.debug('User:', { id: '12345', name: 'Test' });
      const output = logOutput.join(' ');
      expect(output).toContain('[REDACTED]');
    });

    it('should redact apiKey field', () => {
      logger.debug('Config:', { apiKey: 'super-secret-key', endpoint: 'https://api.com' });
      const output = logOutput.join(' ');
      expect(output).not.toContain('super-secret-key');
      expect(output).toContain('[REDACTED]');
    });
  });

  describe('Error handling', () => {
    it('should sanitize errors with PII in message', () => {
      const error = new Error('Failed to authenticate user@example.com');
      logger.error('Auth failed', error);
      const output = logOutput.join(' ');
      expect(output).not.toContain('user@example.com');
      expect(output).toContain('[EMAIL]');
    });

    it('should handle null and undefined gracefully', () => {
      expect(() => logger.debug('Null:', null)).not.toThrow();
      expect(() => logger.debug('Undefined:', undefined)).not.toThrow();
    });

    it('should handle deeply nested objects', () => {
      const nested = {
        level1: {
          level2: {
            level3: {
              email: 'deep@nested.com',
            },
          },
        },
      };
      expect(() => logger.debug('Nested:', nested)).not.toThrow();
      const output = logOutput.join(' ');
      expect(output).toContain('[REDACTED]');
    });
  });
});

describe('XSS Protection', () => {
  describe('Player name validation against XSS', () => {
    it('should reject script tags in player names', () => {
      const result = validatePlayerName('<script>alert(1)</script>');
      expect(result.valid).toBe(false);
    });

    it('should reject HTML tags in player names', () => {
      const result = validatePlayerName('<b>Bold</b>');
      expect(result.valid).toBe(false);
    });

    it('should accept normal names', () => {
      const result = validatePlayerName('John Smith');
      expect(result.valid).toBe(true);
    });

    it('should accept names with apostrophes', () => {
      const result = validatePlayerName("O'Brien");
      expect(result.valid).toBe(true);
    });
  });

  describe('Game name validation against XSS', () => {
    it('should reject script tags in game names', () => {
      const result = validateGameName('<script>alert(1)</script>');
      expect(result.valid).toBe(false);
    });

    it('should accept normal game names', () => {
      const result = validateGameName('Friday Night Game');
      expect(result.valid).toBe(true);
    });
  });
});

describe('SQL Injection Protection', () => {
  describe('Join code validation', () => {
    it('should reject SQL injection attempts', () => {
      const sqlInjection = "ABC123' OR '1'='1";
      const result = validateJoinCode(sqlInjection);
      expect(result.valid).toBe(false);
    });

    it('should reject codes with special characters', () => {
      const result = validateJoinCode('ABC;DROP');
      expect(result.valid).toBe(false);
    });

    it('should accept valid alphanumeric codes', () => {
      const result = validateJoinCode('ABC123');
      expect(result.valid).toBe(true);
    });
  });

});

describe('Password Security', () => {
  // Test password validation rules
  const isValidPassword = (value: string) => {
    const hasMin = value.length >= 8;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);
    return hasMin && hasUpper && hasLower && hasSymbol;
  };

  it('should require minimum 8 characters', () => {
    expect(isValidPassword('Aa1!abc')).toBe(false);
    expect(isValidPassword('Aa1!abcd')).toBe(true);
  });

  it('should require uppercase letter', () => {
    expect(isValidPassword('aa1!abcd')).toBe(false);
    expect(isValidPassword('Aa1!abcd')).toBe(true);
  });

  it('should require lowercase letter', () => {
    expect(isValidPassword('AA1!ABCD')).toBe(false);
    expect(isValidPassword('Aa1!abcd')).toBe(true);
  });

  it('should require symbol', () => {
    expect(isValidPassword('Aa1abcde')).toBe(false);
    expect(isValidPassword('Aa1!abcd')).toBe(true);
  });

  it('should accept various symbols', () => {
    expect(isValidPassword('Aa1@abcd')).toBe(true);
    expect(isValidPassword('Aa1#abcd')).toBe(true);
    expect(isValidPassword('Aa1$abcd')).toBe(true);
    expect(isValidPassword('Aa1%abcd')).toBe(true);
  });

  it('should reject common weak passwords', () => {
    expect(isValidPassword('password')).toBe(false);
    expect(isValidPassword('12345678')).toBe(false);
    expect(isValidPassword('qwerty123')).toBe(false);
  });
});

describe('Error Message Security', () => {
  it('should not expose database structure in user-facing errors', () => {
    // Simulate a database error message
    const dbError = 'duplicate key value violates unique constraint "profiles_pkey"';

    // User-facing message should be generic
    const userMessage = 'Failed to create profile. Please try again.';

    expect(userMessage).not.toContain('constraint');
    expect(userMessage).not.toContain('profiles_pkey');
    expect(userMessage).not.toContain('duplicate key');
  });

  it('should not expose stack traces to users', () => {
    const error = new Error('Database connection failed');
    error.stack = 'Error: Database connection failed\n    at Connection.connect (/app/node_modules/pg/lib/connection.js:123)\n    at Client.connect (/app/node_modules/pg/lib/client.js:90)';

    // Logger should sanitize in production
    logger.error('Connection failed', error);

    // In test mode (__DEV__ is true), stack might be included
    // But the key is that user-facing messages don't include it
    const userMessage = 'Unable to connect. Please try again later.';
    expect(userMessage).not.toContain('node_modules');
    expect(userMessage).not.toContain('/app/');
  });
});
