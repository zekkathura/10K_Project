# Loader Components

Custom loading indicators that replace React Native's default `ActivityIndicator`.

## Components

### ThemedLoader (Primary - Use This)

Cross-platform loading indicator that automatically uses the best experience for each platform.

**Location:** `src/components/ThemedLoader.tsx`

**Usage:**
```tsx
import { ThemedLoader } from '../components';

// Full-page loading (default) - shows dice on web, spinner on native
<ThemedLoader text="Loading..." />

// Custom loading text
<ThemedLoader text="Crunching the numbers..." />

// Hide loading text
<ThemedLoader hideText />

// Inline/button loading - always uses small spinner
<ThemedLoader mode="inline" color="#fff" />

// With size specification
<ThemedLoader mode="inline" size="large" color={theme.colors.accent} />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'fullPage' \| 'inline'` | `'fullPage'` | Loading mode |
| `size` | `'small' \| 'large'` | `'small'` | Size for inline mode |
| `color` | `string` | theme accent | Custom color override |
| `text` | `string` | `'Loading...'` | Text shown in fullPage mode |
| `hideText` | `boolean` | `false` | Hide text in fullPage mode |

**Platform behavior:**
- **Web (fullPage):** 3D tumbling dice animation (DiceLoader)
- **Native (fullPage):** 2D animated dice (NativeDiceLoader)
- **All platforms (inline):** ActivityIndicator

---

### DiceLoader (Web Only)

3D tumbling dice animation that cycles through 5 different roll patterns randomly.
Only renders on web - returns null on native platforms.

**Location:** `src/components/DiceLoader.tsx`

**Direct usage (rare):**
```tsx
import { DiceLoader } from '../components';

// Only use directly when outside ThemeProvider context
<DiceLoader size={70} />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `60` | Dice size in pixels |
| `speed` | `number` | `1.5` | Full cycle duration in seconds (lower = faster) |
| `color` | `string` | `'#DC2626'` | Dice color (red with white dots) |

**Features:**
- 5 different roll patterns (Forward Spiral, Side Sweep, Zigzag, etc.)
- Follows standard dice rules (opposite faces sum to 7)
- Smooth CSS 3D transform animations
- Random pattern switching after each cycle

---

### NativeDiceLoader (Mobile Only)

2D animated dice for iOS/Android that simulates the 3D tumbling effect of the web
DiceLoader. Uses the same 5 roll patterns and follows standard dice rules.

**Location:** `src/components/NativeDiceLoader.tsx`

**Direct usage (rare):**
```tsx
import { NativeDiceLoader } from '../components';

// Only use directly when outside ThemeProvider context
<NativeDiceLoader size={70} />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `60` | Dice size in pixels |
| `speed` | `number` | `1.5` | Full cycle duration in seconds (matches web) |
| `color` | `string` | `'#DC2626'` | Dice color (red with white dots) |

**Features:**
- 5 different roll patterns matching web (Forward Spiral, Side Sweep, Zigzag, etc.)
- Varied rotation directions (clockwise and counter-clockwise)
- Smooth easing with bounce effects and wobble
- Face sequences follow standard dice rules (opposite faces sum to 7)
- Random pattern switching after each 6-face cycle
- Uses native driver for 60fps performance

---

## Migration from ActivityIndicator

**Before:**
```tsx
import { ActivityIndicator } from 'react-native';

// Full-page
<ActivityIndicator size="large" color={theme.colors.accent} />

// Button
<ActivityIndicator color="#fff" size="small" />
```

**After:**
```tsx
import { ThemedLoader } from '../components';

// Full-page
<ThemedLoader text="Loading..." />

// Button
<ThemedLoader mode="inline" color="#fff" />
```

---

### ThemedAlert (Alerts)

Cross-platform modal alert component that respects dark/light theme.
Use instead of native `Alert.alert()` for consistent styling.

**Location:** `src/components/ThemedAlert.tsx`

**Usage:**
```tsx
import { useThemedAlert } from '../components';

function MyComponent() {
  const alert = useThemedAlert();

  const handleAction = () => {
    alert.show({
      title: 'Confirm',
      message: 'Are you sure?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteItem() },
      ],
    });
  };
}
```

**Setup (in App.tsx):**
```tsx
import { ThemedAlertProvider } from './components';

export default function App() {
  return (
    <ThemedAlertProvider>
      {/* app content */}
    </ThemedAlertProvider>
  );
}
```

**Options:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Alert title |
| `message` | `string` | Alert message |
| `buttons` | `AlertButton[]` | Array of buttons (optional, defaults to 'OK') |

**Button styles:**
- `default` - Primary button style
- `cancel` - Secondary/cancel style
- `destructive` - Red/danger style

---

### ScreenContainer (Layout)

Standardized layout wrapper for screens rendered inside HomeScreen's contentWrapper.

**Location:** `src/components/ScreenContainer.tsx`

**Usage:**
```tsx
import { ScreenContainer } from '../components';

function MyScreen() {
  return (
    <ScreenContainer scrollable={true} contentPaddingBottom={20}>
      {/* Screen content */}
    </ScreenContainer>
  );
}
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `scrollable` | `boolean` | `true` | Wrap content in ScrollView |
| `contentPaddingBottom` | `number` | `0` | Extra bottom padding for content |
| `style` | `ViewStyle` | - | Custom container style |
| `contentStyle` | `ViewStyle` | - | Custom scroll content style |
| `testID` | `string` | - | Test ID for testing |

**Note:** Only use for screens inside HomeScreen's contentWrapper. Standalone screens and modals should handle their own safe areas. See `screen-layout` skill for details.

---

## File Structure

```
src/components/
  index.ts              # Re-exports (import from '../components')
  DiceLoader.tsx        # Web-only 3D dice animation
  NativeDiceLoader.tsx  # Mobile-only 2D dice animation
  ThemedLoader.tsx      # Cross-platform wrapper (use this)
  ThemedAlert.tsx       # Cross-platform modal alerts (use this)
  ScreenContainer.tsx   # Layout wrapper for screens in contentWrapper
```

## Notes

- Always prefer `ThemedLoader` over direct loader usage
- DiceLoader uses CSS 3D transforms (web-only)
- NativeDiceLoader uses React Native Animated API (iOS/Android)
- Both loaders show an animated red dice with changing faces
- Loading text defaults to "Loading..." - customize per-context
