# 10K Scorekeeper - Testing Suite

This folder contains automated tests for the 10K Scorekeeper app to verify both backend database operations and frontend component behavior.

## Test Files

### 1. `backend.test.ts`
Tests for database operations from `lib/database.ts`:
- ✅ Game creation
- ✅ Turn addition with score calculation
- ✅ Turn update with score recalculation
- ✅ Turn deletion with score recalculation
- ✅ Bust turn (verifies bust scores don't count)

### 2. `frontend.test.tsx`
Tests for React components from `screens/GameScreen.tsx`:
- ✅ Component rendering with player names
- ✅ Score modal opening on cell click
- ✅ Player total score display
- ✅ Menu modal opening
- ✅ Back button navigation

## Prerequisites

Install required testing dependencies:

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Backend Tests Only
```bash
npm test backend.test.ts
```

### Run Frontend Tests Only
```bash
npm test frontend.test.tsx
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

## Test Output

Tests provide clear console output with emojis and formatted messages:

```
🧪 Starting Backend Database Tests...

TEST 1: Create Game
Description: Verify game creation with correct initial state
✓ Game created successfully
  - Game ID: abc123...
  - Game Name: Test Game 1234567890
  - Status: active
  - Created By: 00000000-0000-0000-0000-000000000001
RESULT: ✅ PASS - Game created with correct properties

-----------------------------------
```

## Test Structure

### Backend Tests
Each backend test follows this pattern:
1. **Setup**: Create test data (games, players, turns)
2. **Execute**: Call the database function being tested
3. **Verify**: Check database state and scores
4. **Log**: Clear console output showing pass/fail
5. **Cleanup**: Remove test data

### Frontend Tests
Each frontend test follows this pattern:
1. **Setup**: Mock data and functions
2. **Render**: Render the component
3. **Interact**: Simulate user actions (clicks, input)
4. **Assert**: Verify expected behavior
5. **Log**: Clear console output showing pass/fail

## Adding New Tests

### Backend Test Template
```typescript
test('N. TEST NAME: Should do something', async () => {
  console.log('TEST N: Test Name');
  console.log('Description: What this test verifies');

  try {
    // Test logic here

    console.log('RESULT: ✅ PASS - Success message\n');
  } catch (error: any) {
    console.log('RESULT: ❌ FAIL - Error message');
    console.log(`Error: ${error.message}\n`);
    throw error;
  }
});
```

### Frontend Test Template
```typescript
test('N. TEST NAME: Should do something', async () => {
  console.log('TEST N: Test Name');
  console.log('Description: What this test verifies');

  try {
    const mockOnBack = jest.fn();
    const { getByText } = render(
      <GameScreen gameId="game-1" onBack={mockOnBack} />
    );

    // Test logic here

    console.log('RESULT: ✅ PASS - Success message\n');
  } catch (error: any) {
    console.log('RESULT: ❌ FAIL - Error message');
    console.log(`Error: ${error.message}\n`);
    throw error;
  }
});
```

## Common Issues

### Database Connection
- Ensure `.env` file has correct Supabase credentials
- Check that RLS policies allow test operations
- Use test user IDs that have proper permissions

### Mock Data
- Update mock data in `frontend.test.tsx` if schema changes
- Keep mock data consistent with actual database structure

### Test Cleanup
- Backend tests create real database entries
- Cleanup code runs after each test
- If tests fail mid-execution, manual cleanup may be needed

## Future Test Ideas

### Backend
- [ ] Round deletion removes all turns
- [ ] Player removal deletes all associated turns
- [ ] Duplicate player prevention
- [ ] Join code validation
- [ ] Game status updates

### Frontend
- [ ] Score input validation (non-numeric)
- [ ] Player name editing
- [ ] Player reordering functionality
- [ ] Add player modal search
- [ ] Remove player selection

## Notes

- Tests use `console.log()` for clear debugging output
- Each test is independent and can run in isolation
- Backend tests may fail if RLS policies are too restrictive
- Frontend tests use mocked Supabase to avoid database calls
