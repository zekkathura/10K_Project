/**
 * Input Validation and Sanitization Functions
 *
 * These functions validate and sanitize all user inputs to prevent:
 * - SQL injection (already prevented by Supabase, but good practice)
 * - XSS attacks
 * - Invalid data formats
 * - Malicious inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validate and sanitize join code
 * - Must be exactly 6 alphanumeric characters
 * - Converted to uppercase
 * - Whitespace trimmed
 */
export function validateJoinCode(code: string): ValidationResult & { valid?: boolean } {
  if (!code || typeof code !== 'string') {
    return { isValid: false, valid: false, error: 'Join code is required' };
  }

  const trimmed = code.trim().toUpperCase();

  if (trimmed.length !== 6) {
    return { isValid: false, valid: false, error: 'Join code must be exactly 6 characters' };
  }

  if (!/^[A-Z0-9]{6}$/.test(trimmed)) {
    return { isValid: false, valid: false, error: 'Join code must contain only letters and numbers' };
  }

  return { isValid: true, valid: true, sanitized: trimmed };
}

/**
 * Validate and sanitize game name
 * - Length between 1 and 50 characters
 * - Trim whitespace
 * - Remove control characters
 * - Reject HTML tags (XSS prevention)
 */
export function validateGameName(name: string | null): ValidationResult & { valid?: boolean } {
  if (!name) {
    // Game names are optional
    return { isValid: true, valid: true, sanitized: null as any };
  }

  if (typeof name !== 'string') {
    return { isValid: false, valid: false, error: 'Game name must be text' };
  }

  // Remove control characters
  const sanitized = name.replace(/[\x00-\x1F\x7F]/g, '').trim();

  if (sanitized.length === 0) {
    return { isValid: true, valid: true, sanitized: null as any };
  }

  if (sanitized.length > 50) {
    return { isValid: false, valid: false, error: 'Game name must be 50 characters or less' };
  }

  // Reject HTML tags (XSS prevention)
  if (/<[^>]*>/g.test(sanitized)) {
    return { isValid: false, valid: false, error: 'Game name cannot contain HTML tags' };
  }

  return { isValid: true, valid: true, sanitized };
}

/**
 * Validate and sanitize player name
 * - Length between 1 and 30 characters
 * - Trim whitespace
 * - Remove control characters
 * - Reject HTML tags (XSS prevention)
 */
export function validatePlayerName(name: string): ValidationResult & { valid?: boolean } {
  if (!name || typeof name !== 'string') {
    return { isValid: false, valid: false, error: 'Player name is required' };
  }

  // Remove control characters
  const sanitized = name.replace(/[\x00-\x1F\x7F]/g, '').trim();

  if (sanitized.length === 0) {
    return { isValid: false, valid: false, error: 'Player name cannot be empty' };
  }

  if (sanitized.length > 30) {
    return { isValid: false, valid: false, error: 'Player name must be 30 characters or less' };
  }

  // Reject HTML tags (XSS prevention)
  if (/<[^>]*>/g.test(sanitized)) {
    return { isValid: false, valid: false, error: 'Player name cannot contain HTML tags' };
  }

  return { isValid: true, valid: true, sanitized };
}

/**
 * Validate and sanitize display name (for profiles)
 * - Length between 1 and 30 characters
 * - Trim whitespace
 * - Remove control characters
 */
export function validateDisplayName(name: string | null): ValidationResult {
  if (!name) {
    // Display names are optional (can fall back to email)
    return { isValid: true, sanitized: null as any };
  }

  if (typeof name !== 'string') {
    return { isValid: false, error: 'Display name must be text' };
  }

  // Remove control characters
  const sanitized = name.replace(/[\x00-\x1F\x7F]/g, '').trim();

  if (sanitized.length === 0) {
    return { isValid: true, sanitized: null as any };
  }

  if (sanitized.length > 30) {
    return { isValid: false, error: 'Display name must be 30 characters or less' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate score
 * - Must be a non-negative integer
 * - Maximum value: 20000 (game limit)
 */
export function validateScore(score: number | string): ValidationResult {
  const numScore = typeof score === 'string' ? parseInt(score, 10) : score;

  if (isNaN(numScore)) {
    return { isValid: false, error: 'Score must be a number' };
  }

  if (numScore < 0) {
    return { isValid: false, error: 'Score cannot be negative' };
  }

  if (numScore > 20000) {
    return { isValid: false, error: 'Score cannot exceed 20,000' };
  }

  if (!Number.isInteger(numScore)) {
    return { isValid: false, error: 'Score must be a whole number' };
  }

  return { isValid: true, sanitized: numScore.toString() };
}


