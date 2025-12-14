---
name: theme-styling
description: Use when working with themes, dark/light mode, styling components, or creating new styled screens
---

# Theme & Styling Patterns

This Skill provides conventions for using the theme system and styling components.

## Theme System

The app uses a centralized theme system with dark/light mode support via `src/lib/theme.ts`.

### Using Themes in Components

```typescript
import { Theme, useTheme, useThemedStyles } from '../lib/theme';

export default function MyComponent() {
  const { theme, mode, setMode } = useTheme();
  const styles = useThemedStyles(createStyles);

  // mode is 'dark' | 'light'
  // theme.colors provides all color values
  // setMode() to change themes

  return (
    <View style={styles.container}>
      {/* Your component */}
    </View>
  );
}

// IMPORTANT: Styles must be created using this pattern
const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    text: {
      color: colors.textPrimary,
    },
    // ... more styles
  });
```

### Available Theme Colors

Access via `theme.colors`:

**Backgrounds:**
- `background` - Main background
- `surface` - Cards, panels
- `surfaceSecondary` - Secondary surfaces

**Text:**
- `textPrimary` - Main text
- `textSecondary` - Secondary text
- `buttonText` - Button text

**Accent & Borders:**
- `accent` - Primary accent color
- `accentLight` - Lighter accent
- `border` - Borders
- `divider` - Dividers

**Inputs:**
- `inputBackground` - Input backgrounds
- `inputBorder` - Input borders
- `inputText` - Input text

**Buttons:**
- `buttonSecondary` - Secondary buttons

### Theme Mode

**Default theme**: Dark mode
User can change in Settings screen, saved to `profiles.theme_mode`

### Conditional Styling Based on Mode

```typescript
const { mode } = useTheme();

<Image
  style={[
    styles.icon,
    mode === 'dark' && styles.iconTint
  ]}
/>

// In createStyles:
iconTint: { tintColor: colors.textPrimary }
```

## Common Styling Patterns

### Modal Structure

```typescript
<Modal visible={showModal} transparent animationType="fade" onRequestClose={onClose}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeaderRow}>
        <Text style={styles.modalTitle}>Title</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeX}>x</Text>
        </TouchableOpacity>
      </View>
      {/* Modal content */}
    </View>
  </View>
</Modal>

// Styles:
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center'
},
modalContent: {
  backgroundColor: colors.surface,
  padding: 20,
  borderRadius: 12,
  width: '85%',
  maxWidth: 420,
  borderWidth: 1,
  borderColor: colors.border,
},
modalTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: colors.textPrimary
},
closeX: {
  fontSize: 20,
  color: colors.textPrimary,
  fontWeight: '800'
}
```

### Button Patterns

```typescript
// Primary button
<TouchableOpacity
  style={[styles.button, styles.primaryButton]}
  onPress={handleAction}
>
  <Text style={styles.buttonText}>Action</Text>
</TouchableOpacity>

// Styles:
button: {
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center'
},
primaryButton: {
  backgroundColor: colors.accent
},
buttonText: {
  color: colors.buttonText,
  fontWeight: '600'
}
```

### Input Patterns

```typescript
<TextInput
  style={styles.input}
  placeholder="Enter text"
  placeholderTextColor={theme.colors.textSecondary}
  value={value}
  onChangeText={setValue}
/>

// Styles:
input: {
  borderWidth: 1,
  borderColor: colors.inputBorder,
  borderRadius: 8,
  padding: 10,
  color: colors.inputText,
  backgroundColor: colors.inputBackground,
}
```

## Icon Tinting

Icons should tint based on theme mode for proper contrast:

```typescript
// Rules tab icon tints in dark mode
<Image
  source={require('../../assets/images/rules_logo.png')}
  style={[
    styles.icon,
    mode === 'dark' && styles.iconTint
  ]}
/>

// Some icons (like Play) don't tint - they stay unchanged
```

## Typography Scale

- **Headers**: 18-24px, fontWeight '700'
- **Body**: 14-16px, fontWeight '600'
- **Secondary**: 12-14px, fontWeight '400'-'600'
- **Buttons**: 14-16px, fontWeight '600'-'700'

## Layout Conventions

- **Padding**: 10-20px for content areas
- **Margins**: 8-12px between elements
- **Border Radius**: 8-12px for rounded corners
- **Gap**: Use gap property for flex spacing when available

## Accessibility

- Always use semantic color names (`colors.textPrimary`) not hardcoded values
- Ensure sufficient contrast in both light and dark modes
- Use meaningful fontWeight for hierarchy