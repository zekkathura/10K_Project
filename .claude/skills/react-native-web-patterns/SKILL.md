---
name: react-native-web-patterns
description: Use when working with React Native Web cross-platform code, alerts, modals, or platform-specific behavior
---

# React Native Web Patterns

This Skill provides conventions for writing cross-platform code that works on both native mobile and web.

## Platform-Specific Alerts

Always check `Platform.OS` when showing alerts to ensure web compatibility.

### Pattern

```typescript
import { Alert, Platform } from 'react-native';

// For simple alerts
if (Platform.OS === 'web') {
  window.alert('Your message here');
} else {
  Alert.alert('Title', 'Your message here');
}

// For confirmations
if (Platform.OS === 'web') {
  if (window.confirm('Are you sure?')) {
    // User confirmed
  }
} else {
  Alert.alert('Title', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', onPress: () => { /* User confirmed */ } }
  ]);
}
```

## Platform-Specific Imports

Always import Platform when you need it:

```typescript
import { Platform } from 'react-native';
```

## Examples from Codebase

See `GameScreen.tsx` `handleApplyRounds` function for example of Platform.OS usage with alerts.

## When to Use This Pattern

- Showing any alert or confirmation dialog
- Platform-specific UI behavior
- Web-specific workarounds (like `window.alert` instead of `Alert.alert`)

## Common Mistakes to Avoid

- Using `Alert.alert` without Platform check - it doesn't work on web
- Forgetting to import Platform from 'react-native'
- Not testing on both web and mobile platforms