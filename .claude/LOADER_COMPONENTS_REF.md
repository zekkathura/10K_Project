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
- **Web (fullPage):** 3D tumbling dice animation
- **Native (fullPage):** Standard ActivityIndicator
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

## File Structure

```
src/components/
  index.ts         # Re-exports (import from '../components')
  DiceLoader.tsx   # Web-only 3D dice animation
  ThemedLoader.tsx # Cross-platform wrapper (use this)
```

## Notes

- Always prefer `ThemedLoader` over direct `DiceLoader` usage
- The dice animation uses CSS 3D transforms (web-only)
- Native platforms always get `ActivityIndicator` fallback
- Loading text defaults to "Loading..." - customize per-context
