# Testing Quick Start Guide

## Step 1: Install Dependencies

Before running tests, you need to install the testing libraries:

```bash
cd 10k-scorekeeper-app
npm install
```

This will install all the testing dependencies that were added to package.json:
- `jest` - Testing framework
- `jest-expo` - Jest preset for Expo projects
- `@testing-library/react-native` - Testing utilities for React Native
- `@testing-library/jest-native` - Custom matchers for React Native
- `@types/jest` - TypeScript types for Jest

## Step 2: Run Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Files
```bash
# Backend tests only
npm test backend.test.ts

# Frontend tests only
npm test frontend.test.tsx
```

### Watch Mode (Auto-rerun on file changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Expected Output

When you run the tests, you should see clear console output:

```
🧪 Starting Backend Database Tests...

TEST 1: Create Game
Description: Verify game creation with correct initial state
✓ Game created successfully
  - Game ID: abc123-def456-...
  - Game Name: Test Game 1733507200000
  - Status: active
  - Created By: 00000000-0000-0000-0000-000000000001
RESULT: ✅ PASS - Game created with correct properties

-----------------------------------

TEST 2: Add Turn
Description: Verify turn addition updates player total score correctly
✓ Test player created
  - Player ID: xyz789-...
  - Initial Total Score: 0
✓ Turn added successfully
  - Turn ID: turn-123...
  - Score: 500
  - Is Bust: false
  - Is Closed: true
✓ Player score updated
  - New Total Score: 500
  - Is On Board: true
RESULT: ✅ PASS - Turn added and score calculated correctly

-----------------------------------

...
```

## Test Summary

### Backend Tests (5 tests)
1. ✅ Create Game
2. ✅ Add Turn with Score Calculation
3. ✅ Update Turn and Recalculate Score
4. ✅ Delete Turn and Recalculate Score
5. ✅ Bust Turn (doesn't count to total)

### Frontend Tests (5 tests)
1. ✅ Render GameScreen with Players
2. ✅ Score Modal Opens on Cell Click
3. ✅ Display Player Total Scores
4. ✅ Menu Modal Opens
5. ✅ Back Button Navigation

## Troubleshooting

### "Cannot find module" errors
Run `npm install` to ensure all dependencies are installed.

### Backend tests fail with RLS policy errors
The backend tests create real database entries. Ensure your Supabase RLS policies allow:
- INSERT on `games` table
- INSERT/UPDATE/DELETE on `game_players` table
- INSERT/UPDATE/DELETE on `turns` table

You may need to temporarily disable RLS or add a test user with proper permissions.

### Frontend tests fail
- Clear the Jest cache: `npx jest --clearCache`
- Ensure React Native Testing Library is properly installed
- Check that mocks are set up correctly

## Next Steps

Once the tests are running successfully:

1. **Run tests regularly** - Before making changes to verify everything works
2. **Add more tests** - Use the templates in README.md to add new tests
3. **Watch mode during development** - Use `npm run test:watch` while coding
4. **Check coverage** - Use `npm run test:coverage` to see what's tested

## Need Help?

- See [Testing/README.md](./README.md) for detailed test documentation
- Check test files for examples of how tests are structured
- Console output provides detailed pass/fail information for debugging
