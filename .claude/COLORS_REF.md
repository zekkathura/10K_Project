# Color Theme Reference

**Source of Truth:** `src/lib/theme.tsx`
**Visual Reference:** `assets/images/colorPalette.png`

---

## Light Mode Colors

| Category | Name | Hex | Usage |
|----------|------|-----|-------|
| **Backgrounds** | background | `#FFFFFF` | Main screen background |
| | surface | `#F5F6F7` | Cards, elevated surfaces |
| | surfaceSecondary | `#D7DFEB` | Secondary surfaces, footers |
| **Text** | textPrimary | `#2C303A` | Main text, headings |
| | textSecondary | `#5E6637` | Subtitles, labels |
| | textTertiary | `#A3A7B1` | Muted text, hints |
| **Borders** | border | `#D7DFEB` | Input borders, dividers |
| | divider | `#D7DFEB` | Section dividers |
| **Accents** | accent | `#4A78FF` | Primary buttons, links, focus |
| | accentLight | `#90A9FF` | Focus rings, highlights |
| | accentPurple | `#9B59B6` | Special highlights (effective dates) |
| **Status** | error | `#FF4444` | Error text, icons |
| | errorBackground | `#FFE8E8` | Error alerts |
| | success | `#4CAF50` | Success text, icons |
| | successBackground | `#E8F5E9` | Success alerts |
| **Buttons** | buttonPrimary | `#4A78FF` | Primary button background |
| | buttonSecondary | `#FFFFFF` | Secondary button background |
| | buttonText | `#FFFFFF` | Button text |
| **Inputs** | inputBackground | `#FFFFFF` | Input field background |
| | inputBorder | `#D7DFEB` | Input field border |
| | inputText | `#2C303A` | Input field text |
| | placeholder | `#A3A7B1` | Placeholder text |

---

## Dark Mode Colors

| Category | Name | Hex | Usage |
|----------|------|-----|-------|
| **Backgrounds** | background | `#0C0F17` | Main screen background |
| | surface | `#11141F` | Cards, elevated surfaces |
| | surfaceSecondary | `#24344D` | Secondary surfaces, footers |
| **Text** | textPrimary | `#FFFFFF` | Main text, headings |
| | textSecondary | `#9CA3AF` | Subtitles, labels |
| | textTertiary | `#6B7280` | Muted text, hints |
| **Borders** | border | `#24344D` | Input borders, dividers |
| | divider | `#24344D` | Section dividers |
| **Accents** | accent | `#4A78FF` | Primary buttons, links, focus |
| | accentLight | `#90A9FF` | Focus rings, highlights |
| | accentPurple | `#D99CE3` | Special highlights (effective dates, light purple) |
| **Status** | error | `#FF4444` | Error text, icons |
| | errorBackground | `#2c090c` | Error alerts (dark red) |
| | success | `#4CAF50` | Success text, icons |
| | successBackground | `#0c2c15` | Success alerts (dark green) |
| **Buttons** | buttonPrimary | `#4A78FF` | Primary button background |
| | buttonSecondary | `#24344D` | Secondary button background |
| | buttonText | `#FFFFFF` | Button text |
| **Inputs** | inputBackground | `#24344D` | Input field background |
| | inputBorder | `#24344D` | Input field border |
| | inputText | `#FFFFFF` | Input field text |
| | placeholder | `#8C92A3` | Placeholder text |

---

## Custom Colors (Not in Theme)

Colors used for specific elements outside the theme system:

| Element | Light Mode | Dark Mode | Notes |
|---------|------------|-----------|-------|
| Login dice | `#1a3a6e` (dark blue) | `#FFFFFF` (white) | Footer decoration |

---

## Usage Guidelines

1. **Always use theme colors** via `useThemedStyles()` or `useTheme()`
2. **Never hardcode colors** in components - add to theme if needed
3. **Accent colors are shared** between light/dark modes for brand consistency
4. **Custom colors** should be added to theme.tsx if used in multiple places

## Adding New Colors

To add a new color to the theme:
1. Add to both `lightColors` and `darkColors` in `src/lib/theme.tsx`
2. Add TypeScript type to `ThemeColors` interface
3. Update this reference doc