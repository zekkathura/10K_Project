---
name: modal-components
description: Use when creating modals, dialogs, or overlay components with consistent structure and behavior
---

# Modal Component Patterns

This Skill provides standard patterns for creating modals and dialogs.

## Standard Modal Structure

```typescript
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme, useThemedStyles } from '../lib/theme';

function MyModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header with title and close button */}
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>Modal Title</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeX}>x</Text>
            </TouchableOpacity>
          </View>

          {/* Modal body content */}
          <Text style={styles.modalSubtitle}>Subtitle or description</Text>

          {/* Action buttons */}
          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleAction}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
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
    modalHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    closeX: {
      fontSize: 20,
      color: colors.textPrimary,
      fontWeight: '800',
    },
    modalSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    modalButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 8,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButton: {
      backgroundColor: '#1b8733',
    },
    cancelButton: {
      backgroundColor: colors.surfaceSecondary,
    },
    modalButtonText: {
      color: colors.buttonText,
      fontWeight: '600',
    },
  });
```

## Full-Screen Modal Pattern

For settings-like screens:

```typescript
<Modal
  visible={showModal}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={onClose}
>
  <ScreenComponent navigation={{ goBack: onClose }} />
</Modal>
```

## Modal Best Practices

### 1. Always Provide Close Mechanism

- Close X button in header
- `onRequestClose` prop for Android back button
- Cancel button for actions

### 2. Modal Sizing

```typescript
modalContent: {
  width: '85%',        // Responsive width
  maxWidth: 420,       // Max width for large screens
  padding: 20,         // Consistent padding
}
```

### 3. Backdrop

Semi-transparent black overlay:
```typescript
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)', // 50% opacity black
  justifyContent: 'center',
  alignItems: 'center',
}
```

### 4. Animation Type

- `fade` - For overlay modals (most common)
- `slide` - For full-screen modals
- `none` - For instant display

### 5. Action Buttons Layout

Horizontal row with equal width buttons:
```typescript
modalButtonsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10,
  marginTop: 8,
},
modalButton: {
  flex: 1, // Equal width buttons
  // ...
}
```

## Common Modal Types

### Confirmation Modal

```typescript
<View style={styles.modalButtonsRow}>
  <TouchableOpacity
    style={[styles.modalButton, styles.cancelButton]}
    onPress={onClose}
  >
    <Text style={styles.modalButtonText}>Cancel</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.modalButton, styles.destructiveButton]}
    onPress={handleConfirm}
  >
    <Text style={styles.modalButtonText}>Delete</Text>
  </TouchableOpacity>
</View>

// Styles:
destructiveButton: {
  backgroundColor: '#d32f2f',
}
```

### Input Modal

```typescript
<View style={styles.modalContent}>
  <View style={styles.modalHeaderRow}>
    <Text style={styles.modalTitle}>Edit Name</Text>
    <TouchableOpacity onPress={onClose}>
      <Text style={styles.closeX}>x</Text>
    </TouchableOpacity>
  </View>

  <TextInput
    style={styles.input}
    value={value}
    onChangeText={setValue}
    placeholder="Enter value"
    placeholderTextColor={colors.textSecondary}
  />

  <TouchableOpacity
    style={[styles.modalButton, styles.saveButton]}
    onPress={handleSave}
  >
    <Text style={styles.modalButtonText}>Save</Text>
  </TouchableOpacity>
</View>
```

### Loading Modal

```typescript
{loading && (
  <Modal visible={loading} transparent>
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  </Modal>
)}
```

## State Management

```typescript
const [showModal, setShowModal] = useState(false);

// Open modal
const openModal = () => setShowModal(true);

// Close modal
const closeModal = () => {
  setShowModal(false);
  // Reset modal state if needed
  setValue('');
  setError('');
};

// Close after action
const handleSave = async () => {
  // Perform action
  await saveData();
  closeModal();
};
```

## Disabled Button State

```typescript
<TouchableOpacity
  style={[
    styles.saveButton,
    !hasChanges && styles.saveButtonDisabled
  ]}
  onPress={handleSave}
  disabled={!hasChanges}
>
  <Text style={styles.modalButtonText}>Apply</Text>
</TouchableOpacity>

// Styles:
saveButtonDisabled: {
  opacity: 0.6,
}
```

## Examples in Codebase

- **GameScreen.tsx** - Score input modal, rename modal, finish game modal
- **GameSettingsModal.tsx** - Full modal with multiple modes (menu, reorder, remove, add)
- **SettingsScreen.tsx** - Full-screen modal with pageSheet presentation
- **HomeScreen.tsx** - Using Modal to display SettingsScreen

## Common Mistakes to Avoid

- Forgetting `onRequestClose` (Android back button won't work)
- Not using `transparent` prop for overlay modals
- Hardcoding colors instead of using theme
- Not providing a way to close the modal
- Inconsistent button layouts across modals