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

