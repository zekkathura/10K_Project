/**
 * Unit Tests for Validation Functions
 *
 * Tests all validation functions in src/lib/validation.ts
 * These are pure function tests - no mocking required.
 */

import {
  validateJoinCode,
  validateGameName,
  validatePlayerName,
  validateDisplayName,
  validateScore,
  validateUUID,
  validateEmail,
  validateGameStatus,
  validateDeepLinkURL,
  sanitizeForDisplay,
  validateAll,
  ValidationResult,
} from '../../src/lib/validation';

// ============================================
// validateJoinCode
// ============================================
describe('validateJoinCode', () => {
  describe('valid inputs', () => {
    it('accepts valid 6-character uppercase alphanumeric code', () => {
      const result = validateJoinCode('ABC123');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('ABC123');
      expect(result.error).toBeUndefined();
    });

    it('accepts all letters', () => {
      const result = validateJoinCode('ABCDEF');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('ABCDEF');
    });

    it('accepts all numbers', () => {
      const result = validateJoinCode('123456');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('123456');
    });

    it('converts lowercase to uppercase', () => {
      const result = validateJoinCode('abc123');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('ABC123');
    });

    it('trims leading/trailing whitespace', () => {
      const result = validateJoinCode('  ABC123  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('ABC123');
    });

    it('handles mixed case with whitespace', () => {
      const result = validateJoinCode(' AbC123 ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('ABC123');
    });
  });

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = validateJoinCode('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Join code is required');
    });

    it('rejects whitespace only', () => {
      const result = validateJoinCode('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Join code must be exactly 6 characters');
    });

    it('rejects code shorter than 6 characters', () => {
      const result = validateJoinCode('ABC12');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Join code must be exactly 6 characters');
    });

    it('rejects code longer than 6 characters', () => {
      const result = validateJoinCode('ABC1234');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Join code must be exactly 6 characters');
    });

    it('rejects special characters', () => {
      const result = validateJoinCode('ABC!23');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Join code must contain only letters and numbers');
    });

    it('rejects spaces in the middle', () => {
      const result = validateJoinCode('ABC 23');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Join code must contain only letters and numbers');
    });

    it('rejects null', () => {
      const result = validateJoinCode(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Join code is required');
    });

    it('rejects undefined', () => {
      const result = validateJoinCode(undefined as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Join code is required');
    });

    it('rejects number type', () => {
      const result = validateJoinCode(123456 as any);
      expect(result.isValid).toBe(false);
    });
  });
});

// ============================================
// validateGameName
// ============================================
describe('validateGameName', () => {
  describe('valid inputs', () => {
    it('accepts valid game name', () => {
      const result = validateGameName('Friday Night Game');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Friday Night Game');
    });

    it('accepts null (optional field)', () => {
      const result = validateGameName(null);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(null);
    });

    it('accepts empty string as null', () => {
      const result = validateGameName('');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(null);
    });

    it('accepts single character', () => {
      const result = validateGameName('A');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('A');
    });

    it('accepts 50 characters (max length)', () => {
      const maxName = 'A'.repeat(50);
      const result = validateGameName(maxName);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(maxName);
    });

    it('trims whitespace', () => {
      const result = validateGameName('  Game Name  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Game Name');
    });

    it('converts whitespace-only to null', () => {
      const result = validateGameName('   ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(null);
    });

    it('removes control characters', () => {
      const result = validateGameName('Game\x00Name\x1F');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('GameName');
    });
  });

  describe('invalid inputs', () => {
    it('rejects name longer than 50 characters', () => {
      const longName = 'A'.repeat(51);
      const result = validateGameName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Game name must be 50 characters or less');
    });

    it('rejects non-string type (number)', () => {
      const result = validateGameName(123 as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Game name must be text');
    });
  });
});

// ============================================
// validatePlayerName
// ============================================
describe('validatePlayerName', () => {
  describe('valid inputs', () => {
    it('accepts valid player name', () => {
      const result = validatePlayerName('John');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('John');
    });

    it('accepts name with spaces', () => {
      const result = validatePlayerName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('John Doe');
    });

    it('accepts single character', () => {
      const result = validatePlayerName('J');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('J');
    });

    it('accepts 30 characters (max length)', () => {
      const maxName = 'A'.repeat(30);
      const result = validatePlayerName(maxName);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(maxName);
    });

    it('trims whitespace', () => {
      const result = validatePlayerName('  John  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('John');
    });

    it('removes control characters', () => {
      const result = validatePlayerName('John\x00Doe');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('JohnDoe');
    });

    it('accepts special characters in names', () => {
      const result = validatePlayerName("O'Brien");
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe("O'Brien");
    });

    it('accepts unicode characters', () => {
      const result = validatePlayerName('José');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('José');
    });
  });

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = validatePlayerName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player name is required');
    });

    it('rejects whitespace only', () => {
      const result = validatePlayerName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player name cannot be empty');
    });

    it('rejects name longer than 30 characters', () => {
      const longName = 'A'.repeat(31);
      const result = validatePlayerName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player name must be 30 characters or less');
    });

    it('rejects null', () => {
      const result = validatePlayerName(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player name is required');
    });

    it('rejects undefined', () => {
      const result = validatePlayerName(undefined as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player name is required');
    });

    it('rejects control-chars-only string', () => {
      const result = validatePlayerName('\x00\x1F');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player name cannot be empty');
    });
  });
});

// ============================================
// validateDisplayName
// ============================================
describe('validateDisplayName', () => {
  describe('valid inputs', () => {
    it('accepts valid display name', () => {
      const result = validateDisplayName('JohnDoe123');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('JohnDoe123');
    });

    it('accepts null (optional field)', () => {
      const result = validateDisplayName(null);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(null);
    });

    it('accepts empty string as null', () => {
      const result = validateDisplayName('');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(null);
    });

    it('accepts 30 characters (max length)', () => {
      const maxName = 'A'.repeat(30);
      const result = validateDisplayName(maxName);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(maxName);
    });

    it('trims whitespace', () => {
      const result = validateDisplayName('  Nickname  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Nickname');
    });

    it('converts whitespace-only to null', () => {
      const result = validateDisplayName('   ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(null);
    });
  });

  describe('invalid inputs', () => {
    it('rejects name longer than 30 characters', () => {
      const longName = 'A'.repeat(31);
      const result = validateDisplayName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Display name must be 30 characters or less');
    });

    it('rejects non-string type', () => {
      const result = validateDisplayName(123 as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Display name must be text');
    });
  });
});

// ============================================
// validateScore
// ============================================
describe('validateScore', () => {
  describe('valid inputs', () => {
    it('accepts zero', () => {
      const result = validateScore(0);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('0');
    });

    it('accepts positive integer', () => {
      const result = validateScore(500);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('500');
    });

    it('accepts max score (20000)', () => {
      const result = validateScore(20000);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('20000');
    });

    it('accepts string number', () => {
      const result = validateScore('1500');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('1500');
    });

    it('accepts string zero', () => {
      const result = validateScore('0');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('0');
    });
  });

  describe('invalid inputs', () => {
    it('rejects negative number', () => {
      const result = validateScore(-100);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Score cannot be negative');
    });

    it('rejects score over 20000', () => {
      const result = validateScore(20001);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Score cannot exceed 20,000');
    });

    it('rejects decimal number', () => {
      const result = validateScore(500.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Score must be a whole number');
    });

    it('rejects non-numeric string', () => {
      const result = validateScore('abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Score must be a number');
    });

    it('rejects empty string', () => {
      const result = validateScore('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Score must be a number');
    });

    it('rejects NaN', () => {
      const result = validateScore(NaN);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Score must be a number');
    });

    it('rejects Infinity', () => {
      const result = validateScore(Infinity);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Score cannot exceed 20,000');
    });
  });

  describe('boundary tests', () => {
    it('accepts 1 (minimum positive)', () => {
      const result = validateScore(1);
      expect(result.isValid).toBe(true);
    });

    it('accepts 19999 (just under max)', () => {
      const result = validateScore(19999);
      expect(result.isValid).toBe(true);
    });

    it('accepts common scores', () => {
      [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 1000, 1500].forEach(score => {
        expect(validateScore(score).isValid).toBe(true);
      });
    });
  });
});

// ============================================
// validateUUID
// ============================================
describe('validateUUID', () => {
  describe('valid inputs', () => {
    it('accepts valid UUID v4', () => {
      const result = validateUUID('550e8400-e29b-41d4-a716-446655440000');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('accepts uppercase UUID and lowercases it', () => {
      const result = validateUUID('550E8400-E29B-41D4-A716-446655440000');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('accepts mixed case UUID', () => {
      const result = validateUUID('550e8400-E29B-41d4-A716-446655440000');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('550e8400-e29b-41d4-a716-446655440000');
    });
  });

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = validateUUID('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('ID is required');
    });

    it('rejects null', () => {
      const result = validateUUID(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('ID is required');
    });

    it('rejects UUID with wrong format', () => {
      const result = validateUUID('550e8400-e29b-41d4-a716');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid ID format');
    });

    it('rejects UUID without hyphens', () => {
      const result = validateUUID('550e8400e29b41d4a716446655440000');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid ID format');
    });

    it('rejects UUID with invalid characters', () => {
      const result = validateUUID('550e8400-e29b-41d4-a716-44665544000g');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid ID format');
    });

    it('rejects random string', () => {
      const result = validateUUID('not-a-uuid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid ID format');
    });
  });
});

// ============================================
// validateEmail
// ============================================
describe('validateEmail', () => {
  describe('valid inputs', () => {
    it('accepts standard email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });

    it('lowercases email', () => {
      const result = validateEmail('TEST@EXAMPLE.COM');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });

    it('trims whitespace', () => {
      const result = validateEmail('  test@example.com  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });

    it('accepts email with subdomain', () => {
      const result = validateEmail('test@mail.example.com');
      expect(result.isValid).toBe(true);
    });

    it('accepts email with plus sign', () => {
      const result = validateEmail('test+tag@example.com');
      expect(result.isValid).toBe(true);
    });

    it('accepts email with numbers', () => {
      const result = validateEmail('test123@example123.com');
      expect(result.isValid).toBe(true);
    });

    it('accepts email with dots in local part', () => {
      const result = validateEmail('first.last@example.com');
      expect(result.isValid).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('rejects null', () => {
      const result = validateEmail(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('rejects email without @', () => {
      const result = validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('rejects email without domain', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('rejects email without local part', () => {
      const result = validateEmail('@example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('rejects email without TLD', () => {
      const result = validateEmail('test@example');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('rejects email with spaces', () => {
      const result = validateEmail('test @example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('rejects email over 100 characters', () => {
      const longEmail = 'a'.repeat(90) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email must be 100 characters or less');
    });
  });
});

// ============================================
// validateGameStatus
// ============================================
describe('validateGameStatus', () => {
  describe('valid inputs', () => {
    it('accepts "active"', () => {
      const result = validateGameStatus('active');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('active');
    });

    it('accepts "ended"', () => {
      const result = validateGameStatus('ended');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('ended');
    });

    it('accepts "ACTIVE" (case insensitive)', () => {
      const result = validateGameStatus('ACTIVE');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('active');
    });

    it('accepts "ENDED" (case insensitive)', () => {
      const result = validateGameStatus('ENDED');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('ended');
    });

    it('accepts mixed case', () => {
      const result = validateGameStatus('AcTiVe');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('active');
    });
  });

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = validateGameStatus('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Game status is required');
    });

    it('rejects null', () => {
      const result = validateGameStatus(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Game status is required');
    });

    it('rejects invalid status', () => {
      const result = validateGameStatus('pending');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Game status must be "active" or "ended"');
    });

    it('rejects "completed"', () => {
      const result = validateGameStatus('completed');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Game status must be "active" or "ended"');
    });
  });
});

// ============================================
// validateDeepLinkURL
// ============================================
describe('validateDeepLinkURL', () => {
  describe('valid inputs', () => {
    it('accepts https URL', () => {
      const result = validateDeepLinkURL('https://example.com/game/ABC123');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('https://example.com/game/ABC123');
    });

    it('accepts http URL', () => {
      const result = validateDeepLinkURL('http://localhost:3000/game');
      expect(result.isValid).toBe(true);
    });

    it('accepts app deep link', () => {
      const result = validateDeepLinkURL('com.10kscorekeeper://game/ABC123');
      expect(result.isValid).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = validateDeepLinkURL('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('URL is required');
    });

    it('rejects null', () => {
      const result = validateDeepLinkURL(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('URL is required');
    });

    it('rejects invalid URL format', () => {
      const result = validateDeepLinkURL('not-a-url');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid URL format');
    });

    it('rejects file:// scheme', () => {
      const result = validateDeepLinkURL('file:///etc/passwd');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid URL scheme');
    });

    it('rejects javascript: scheme', () => {
      const result = validateDeepLinkURL('javascript:alert(1)');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid URL scheme');
    });

    it('rejects ftp:// scheme', () => {
      const result = validateDeepLinkURL('ftp://example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid URL scheme');
    });
  });
});

// ============================================
// sanitizeForDisplay
// ============================================
describe('sanitizeForDisplay', () => {
  it('escapes < character', () => {
    expect(sanitizeForDisplay('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes > character', () => {
    expect(sanitizeForDisplay('a > b')).toBe('a &gt; b');
  });

  it('escapes double quotes', () => {
    expect(sanitizeForDisplay('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(sanitizeForDisplay("it's")).toBe('it&#x27;s');
  });

  it('escapes forward slash', () => {
    expect(sanitizeForDisplay('a/b')).toBe('a&#x2F;b');
  });

  it('escapes multiple special characters', () => {
    const input = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;';
    expect(sanitizeForDisplay(input)).toBe(expected);
  });

  it('returns empty string for null', () => {
    expect(sanitizeForDisplay(null as any)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(sanitizeForDisplay(undefined as any)).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeForDisplay('')).toBe('');
  });

  it('passes through normal text unchanged', () => {
    expect(sanitizeForDisplay('Hello World 123')).toBe('Hello World 123');
  });
});

// ============================================
// validateAll
// ============================================
describe('validateAll', () => {
  it('returns valid when all validations pass', () => {
    const result = validateAll([
      { name: 'joinCode', result: validateJoinCode('ABC123') },
      { name: 'playerName', result: validatePlayerName('John') },
      { name: 'score', result: validateScore(500) },
    ]);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns invalid with all errors when multiple validations fail', () => {
    const result = validateAll([
      { name: 'joinCode', result: validateJoinCode('') },
      { name: 'playerName', result: validatePlayerName('') },
      { name: 'score', result: validateScore(-100) },
    ]);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('joinCode');
    expect(result.errors).toHaveProperty('playerName');
    expect(result.errors).toHaveProperty('score');
  });

  it('returns partial errors when some validations fail', () => {
    const result = validateAll([
      { name: 'joinCode', result: validateJoinCode('ABC123') }, // valid
      { name: 'playerName', result: validatePlayerName('') },   // invalid
      { name: 'score', result: validateScore(500) },            // valid
    ]);

    expect(result.isValid).toBe(false);
    expect(result.errors).not.toHaveProperty('joinCode');
    expect(result.errors).toHaveProperty('playerName');
    expect(result.errors).not.toHaveProperty('score');
  });

  it('handles empty validation array', () => {
    const result = validateAll([]);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
