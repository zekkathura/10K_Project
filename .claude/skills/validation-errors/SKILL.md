---
name: validation-errors
description: Use when validating user input, handling errors, or displaying error messages to users
---

# Validation & Error Handling Patterns

This Skill provides conventions for validating inputs and handling errors consistently.

## Input Validation

All validation functions are in `src/lib/validation.ts`. **Always use these** before database operations.

### Available Validators

```typescript
import {
  validateGameName,
  validatePlayerName,
  validateJoinCode,
  validateScore
} from '../lib/validation';

// Game name validation
const result = validateGameName(name);
if (!result.isValid) {
  throw new Error(result.error);
}
// Use result.sanitized for the cleaned value

// Player name validation
const result = validatePlayerName(name);
if (!result.isValid) {
  throw new Error(result.error);
}

// Join code validation
const result = validateJoinCode(code);
if (!result.isValid) {
  throw new Error(result.error);
}

// Score validation
const result = validateScore(score);
if (!result.isValid) {
  throw new Error(result.error);
}
```

### Validation Response Structure

```typescript
{
  isValid: boolean;
  error?: string;
  sanitized?: any; // Cleaned/normalized value
}
```

## Error Display Patterns

### Platform-Aware Error Alerts

```typescript
import { Alert, Platform } from 'react-native';

try {
  await someOperation();
} catch (error) {
  console.error('Operation failed', error);
  const message = error instanceof Error ? error.message : 'An error occurred';

  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert('Error', message);
  }
}
```

### User-Friendly Error Messages

Transform technical errors into user-friendly messages:

```typescript
try {
  await supabase.from('games').insert(data);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Failed to create game';

  // Make it user-friendly
  if (message.includes('duplicate')) {
    userMessage = 'A game with this name already exists';
  } else if (message.includes('permission')) {
    userMessage = 'You don't have permission to do that';
  } else {
    userMessage = 'Something went wrong. Please try again.';
  }

  if (Platform.OS === 'web') {
    window.alert(userMessage);
  } else {
    Alert.alert('Error', userMessage);
  }
}
```

## Input Validation Patterns

### Inline Validation with State

```typescript
const [value, setValue] = useState('');
const [error, setError] = useState('');

const handleChange = (text: string) => {
  setValue(text);
  const validation = validateGameName(text);
  setError(validation.isValid ? '' : validation.error || '');
};

const handleSubmit = () => {
  const validation = validateGameName(value);
  if (!validation.isValid) {
    setError(validation.error || 'Invalid input');
    return;
  }
  // Proceed with submission
};
```

### Trimming Inputs on Blur

```typescript
<TextInput
  value={displayName}
  onChangeText={setDisplayName}
  onBlur={() => setDisplayName(displayName.trim())}
/>
```

## Error State Management

### Loading and Error States

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await fetchData();
    // Handle success
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load';
    setError(message);
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Error', message);
    }
  } finally {
    setLoading(false);
  }
};
```

## Common Validation Rules

### Max Length
- Game names: 50 characters
- Player names: 50 characters
- Scores: Max 20,000

### Required Fields
- Display name cannot be empty
- Game name cannot be empty
- Join code must be valid format

### Sanitization
- Trim whitespace from inputs
- Convert join codes to uppercase
- Remove special characters where appropriate

## Confirmation Dialogs

### Delete Confirmation

```typescript
const handleDelete = () => {
  if (Platform.OS === 'web') {
    if (window.confirm('Are you sure you want to delete this?')) {
      performDelete();
    }
  } else {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDelete }
      ]
    );
  }
};
```

## Validation Before Critical Operations

Always validate before:
- Database inserts/updates
- Joining games
- Creating games
- Adding players
- Recording scores

## Error Recovery

Provide users with clear next steps:
- "Please try again"
- "Check your input and try again"
- "Contact support if the problem persists"

Don't just say "Error" - explain what happened and what to do next.