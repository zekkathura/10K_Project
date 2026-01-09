/**
 * Async Utilities
 * Helper functions for async operations, retries, and timeouts
 */

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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
