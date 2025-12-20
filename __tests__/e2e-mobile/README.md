# Mobile E2E Tests (Maestro)

Automated UI tests for Android using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

1. **Maestro installed**
   ```powershell
   # Run in PowerShell as Administrator
   iwr -useb 'https://get.maestro.mobile.dev' | iex
   ```

2. **Java 17** (required by Maestro)
   - Install Eclipse Adoptium Temurin JDK 17
   - Set `JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot`

3. **Android device/emulator connected**
   ```bash
   adb devices  # Should show your device
   ```

4. **App installed on device**
   - Build the preview-dev APK: `eas build --profile preview-dev --platform android`
   - Or use local build (see `.claude/skills/local-build/`)

## Test Users

Create these users in **10k-dev** Supabase (Authentication > Users):
- `testuser1@10k.test` / `TestPassword123!`
- `testuser2@10k.test` / `TestPassword123!`

**Important**: Users must have a profile in the `profiles` table for returning user flows.

## Test Structure

```
e2e-mobile/
├── .maestro/
│   └── config.yaml          # App ID, test configuration
├── helpers/
│   └── _login.yaml          # Reusable login sequence (not run as test)
└── flows/
    ├── 01-smoke-test.yaml         # Quick health check (~30s)
    ├── 02-full-user-journey.yaml  # Full game lifecycle (~3-4min)
    ├── 03-settings-and-theme.yaml # Settings and theme toggle (~1min)
    └── 04-edge-cases.yaml         # Error handling (~1min)
```

### Test Flows

| Flow | Description | Time |
|------|-------------|------|
| `01-smoke-test` | App launches, login works, nav tabs visible | ~30s |
| `02-full-user-journey` | Login, navigate tabs, create game, score entry | ~3-4min |
| `03-settings-and-theme` | Settings modal, theme toggle Light/Dark | ~1min |
| `04-edge-cases` | Google OAuth start, join with invalid code | ~1min |

**Total run time: ~6 minutes**

## Running Tests

```bash
# Run all flows
cd __tests__/e2e-mobile && maestro test flows/

# Run single flow
maestro test __tests__/e2e-mobile/flows/01-smoke-test.yaml

# Interactive test builder (Maestro Studio)
maestro studio
```

## App IDs by Environment

| Environment | App ID | Supabase |
|-------------|--------|----------|
| Preview-Dev | `com.tenk.scorekeeper.previewdev` | 10k-dev (for E2E testing) |
| Preview | `com.tenk.scorekeeper.preview` | 10k-prod |
| Production | `com.tenk.scorekeeper` | 10k-prod |

**For E2E testing, use `preview-dev` profile** - standalone APK against dev database.

## Writing New Tests

### Optimized Test Philosophy

1. **Single login per journey** - Don't `clearState` + login for every small test
2. **Chain related tests** - Test multiple features after one login
3. **Handle error dialogs** - Use `optional: true` for dismissing unexpected dialogs
4. **Use helper flows** - Put reusable sequences in `helpers/` directory

### Example Flow

```yaml
appId: com.tenk.scorekeeper.previewdev
---
- launchApp:
    clearState: true

# Use helper for login
- runFlow: "../helpers/_login.yaml"

# Test multiple features after single login
- assertVisible: "Home"
- tapOn: "Stats"
- takeScreenshot: "stats-screen"
- tapOn: "Rules"
- takeScreenshot: "rules-screen"
- tapOn: "Home"
```

### Handling Error Dialogs

```yaml
# Won't fail if OK button not present
- tapOn:
    text: "OK"
    optional: true
    retryTapIfNoChange: false
```

### Waiting for Elements

```yaml
# More reliable than assertVisible for slow-loading elements
- extendedWaitUntil:
    visible: "Home"
    timeout: 15000
```

## Known Issues

1. **React Native text matching** - Buttons with dynamic text (e.g., "Start Game (1 players)") may not match partial text searches. Use coordinate taps as fallback.

2. **Coordinate taps are fragile** - `point: "50%,80%"` depends on screen layout. Avoid when possible.

3. **Error dialogs interfere** - Supabase errors like "Failed to load users" can block tests. Always handle with `optional: true`.

## Troubleshooting

### "No devices found"
```bash
adb devices  # Check device connection
adb kill-server && adb start-server  # Restart ADB
```

### "App not installed"
```bash
adb install -r path/to/app.apk
```

### "Element not found"
- Use `maestro studio` to inspect the UI hierarchy
- Check failed test screenshots in `~/.maestro/tests/[date]/`
- Try different selectors (text, id, index)
- Add longer `timeout` for slow-loading elements

### Failed Test Artifacts
Screenshots and logs from failed tests are saved to:
```
~/.maestro/tests/YYYY-MM-DD_HHMMSS/
```
