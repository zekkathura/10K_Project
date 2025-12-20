/**
 * Async Utilities
 * Helper functions for async operations, retries, and timeouts
 */

import { logger } from './logger';

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Options for retry operations
 */
export interface RetryOptions {
  /** Maximum number of attempts (default: 3) */
  maxAttempts?: number;
  /** Base delay between retries in ms (default: 1000) */
  delayMs?: number;
  /** Whether to use exponential backoff (default: true) */
  exponentialBackoff?: boolean;
  /** Function to determine if error is retryable (default: always true) */
  isRetryable?: (error: unknown) => boolean;
  /** Label for logging purposes */
  label?: string;
}

/**
 * Execute a function with retry logic
 * Uses exponential backoff by default
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    exponentialBackoff = true,
    isRetryable = () => true,
    label = 'operation',
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        logger.error(`${label} failed after ${maxAttempts} attempts:`, error);
        throw error;
      }

      if (!isRetryable(error)) {
        logger.debug(`${label} error is not retryable, throwing immediately`);
        throw error;
      }

      const delay = exponentialBackoff ? delayMs * attempt : delayMs;
      logger.debug(`${label} attempt ${attempt} failed, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Options for timeout operations
 */
export interface TimeoutOptions {
  /** Timeout duration in ms */
  timeoutMs: number;
  /** Error message when timeout occurs */
  errorMessage?: string;
  /** Label for logging purposes */
  label?: string;
}

/**
 * Timeout error class for identification
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Execute a function with a timeout
 * Throws TimeoutError if the operation takes too long
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  options: TimeoutOptions
): Promise<T> {
  const { timeoutMs, errorMessage, label = 'operation' } = options;

  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const msg = errorMessage || `${label} timed out after ${timeoutMs}ms`;
      logger.warn(msg);
      reject(new TimeoutError(msg));
    }, timeoutMs);

    fn()
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Execute a function with both retry and timeout
 */
export async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  retryOptions: RetryOptions,
  timeoutOptions: TimeoutOptions
): Promise<T> {
  return withRetry(
    () => withTimeout(fn, timeoutOptions),
    {
      ...retryOptions,
      isRetryable: (error) => {
        // Timeout errors are retryable
        if (error instanceof TimeoutError) return true;
        // Use custom isRetryable if provided
        return retryOptions.isRetryable?.(error) ?? true;
      },
    }
  );
}

/**
 * Race a promise against a timeout, returning a result type instead of throwing
 */
export async function raceWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<{ data: T; timedOut: false } | { data: null; timedOut: true }> {
  const timeoutPromise = new Promise<{ data: null; timedOut: true }>((resolve) =>
    setTimeout(() => resolve({ data: null, timedOut: true }), timeoutMs)
  );

  const dataPromise = promise.then(data => ({ data, timedOut: false as const }));

  return Promise.race([dataPromise, timeoutPromise]);
}
