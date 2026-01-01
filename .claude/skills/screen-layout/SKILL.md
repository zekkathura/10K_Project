---
name: screen-layout
description: Use when creating new screens, handling safe areas, or understanding the app's layout architecture
---

# Screen Layout Patterns

This skill documents the app's layout architecture and safe area handling patterns.

## App Layout Hierarchy

```
App.tsx (SafeAreaProvider)
├── LoginScreen (standalone, handles own insets)
└── HomeScreen (main navigation container)
    ├── topHeader (paddingTop: insets.top)
    ├── contentWrapper (paddingBottom: NAV_BAR_HEIGHT + insets.bottom)
    │   ├── GamesListScreen
    │   ├── GameScreen
    │   ├── GameStatsScreen
    │   └── RulesScreen
    └── navWrapper (position: absolute, paddingBottom: insets.bottom)
```

## Screen Types

### 1. Screens Inside HomeScreen's contentWrapper

These screens **don't need safe area handling** - the parent handles it:

```typescript
// GamesListScreen, GameStatsScreen, RulesScreen, CreateGameScreen
export default function MyScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {/* Content - no safe area needed */}
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
  });
```

### 2. Standalone Screens (LoginScreen, SettingsScreen)

These screens **must handle their own safe areas**:

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StandaloneScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Content */}
    </View>
  );
}
```

### 3. Full-Screen Modals (pageSheet)

Screens displayed in `presentationStyle="pageSheet"` modals handle their own safe areas:

```typescript
// In parent:
<Modal
  visible={showSettings}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={onClose}
>
  <SettingsScreen navigation={{ goBack: onClose }} />
</Modal>

// SettingsScreen uses useSafeAreaInsets() internally
```

## HomeScreen Constants

```typescript
// Navigation bar height constant (defined in HomeScreen.tsx)
const NAV_BAR_HEIGHT = 82; // play button 60 + padding 6 + label ~16

// Dynamic padding for contentWrapper
<View style={[
  styles.contentWrapper,
  { paddingBottom: NAV_BAR_HEIGHT + insets.bottom }
]}>
```

## Safe Area Usage Patterns

### When to Use `useSafeAreaInsets()`

| Context | Use Insets? | Reason |
|---------|-------------|--------|
| Inside contentWrapper | No | Parent handles padding |
| Standalone screen | Yes (top) | No parent to handle it |
| Full-screen modal | Yes (top) | Modal is isolated |
| Transparent modal (centered) | No | Centered with padding |
| Transparent modal (full-screen card) | Yes (all) | Card can extend to edges |

### Applying Insets

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MyComponent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      {/* Content */}
    </View>
  );
}
```

### Using Math.max for Minimum Padding

```typescript
// Ensure minimum padding while respecting safe area
paddingTop: Math.max(20, insets.top + 10)
paddingBottom: Math.max(16, insets.bottom + 8)
```

## Modal Safe Area Patterns

### Centered Dialog Modal (no insets needed)

```typescript
<Modal visible={visible} transparent animationType="fade">
  <View style={styles.overlay}>
    <View style={styles.card}>
      {/* Content stays centered with padding */}
    </View>
  </View>
</Modal>

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',  // Centered
    alignItems: 'center',
    padding: 20,  // Padding keeps card away from edges
  },
  card: {
    width: '85%',
    maxWidth: 420,
    // ...
  },
});
```

### Full-Screen Card Modal (needs insets)

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function GameSettingsModal({ visible, onClose }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[
        styles.overlay,
        {
          paddingTop: Math.max(20, insets.top + 10),
          paddingBottom: Math.max(20, insets.bottom + 10),
          paddingLeft: Math.max(20, insets.left),
          paddingRight: Math.max(20, insets.right),
        }
      ]}>
        <View style={styles.card}>
          {/* ScrollView content */}
        </View>
      </View>
    </Modal>
  );
}
```

## ScreenContainer Component

A reusable wrapper is available for screens inside contentWrapper:

```typescript
import { ScreenContainer } from '../components';

function MyScreen() {
  return (
    <ScreenContainer scrollable={true} contentPaddingBottom={20}>
      {/* Content */}
    </ScreenContainer>
  );
}
```

## Common Mistakes to Avoid

1. **Adding safe area to screens in contentWrapper** - Creates double padding
2. **Hardcoding bottom padding** - Should use `NAV_BAR_HEIGHT + insets.bottom`
3. **Forgetting insets on standalone screens** - Content will overlap status bar
4. **Using SafeAreaView instead of insets** - Less control, inconsistent behavior
5. **Not testing on devices with notches** - Layout issues only visible there

## Reference Files

- **HomeScreen.tsx** - Main container with NAV_BAR_HEIGHT constant
- **SettingsScreen.tsx** - Standalone screen with insets
- **GameSettingsModal.tsx** - Full-screen card modal with insets
- **GamesListScreen.tsx** - Screen inside contentWrapper (no insets)
