module.exports = function (api) {
  // Invalidate cache when TEST_ENV changes (for switching between prod/dev Supabase)
  api.cache.using(() => process.env.TEST_ENV || 'prod');

  // Use .env.test.app when TEST_ENV=dev (for E2E testing against 10k-dev)
  const envPath = process.env.TEST_ENV === 'dev' ? '.env.test.app' : '.env';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['inline-dotenv', { path: envPath }],
    ],
  };
};
