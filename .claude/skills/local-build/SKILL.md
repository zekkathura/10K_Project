# Build Skill

Build Android APKs/AABs locally via WSL, and iOS via EAS cloud.

**Key Rule:** Android = local WSL builds only. iOS = EAS cloud builds only.

## IMPORTANT: EAS CLI Command

**ALWAYS use `npx eas-cli` instead of `eas`** - the `eas` command may not be in PATH.

```bash
# ❌ WRONG - may fail with "command not found"
eas build --profile production --platform ios

# ✅ CORRECT - always works
npx eas-cli build --profile production --platform ios
```

## Build Folder Structure

```
build/
├── 10k-dev-v{VER}-b{BUILD}.apk           # Development (requires Metro)
├── 10k-preview-dev-v{VER}-b{BUILD}.apk   # Preview-dev (standalone, 10k-dev DB)
├── 10k-production-v{VER}-b{BUILD}.aab    # Production Android (Google Play)
├── 10k-production-v{VER}-b{BUILD}.ipa    # Production iOS (App Store)
└── archive/                               # Old builds moved here
```

**Only ONE file of each type exists in `build/` at a time.** Old versions go to `archive/`.

## Build File Types

| Profile | Platform | Filename Pattern | Database | Format | Use Case |
|---------|----------|------------------|----------|--------|----------|
| `development` | Android | `10k-dev-v{VER}-b{BUILD}.apk` | 10k-dev | APK | Dev client (requires Metro) |
| `preview-dev` | Android | `10k-preview-dev-v{VER}-b{BUILD}.apk` | 10k-dev | APK | Standalone testing |
| `production` | Android | `10k-production-v{VER}-b{BUILD}.aab` | 10k-prod | AAB | Google Play upload |
| `production` | iOS | `10k-production-v{VER}-b{BUILD}.ipa` | 10k-prod | IPA | App Store / TestFlight |

**Examples:**
- Android: `10k-preview-dev-v1.0.1-b5.apk`
- iOS: `10k-production-v1.0.8-b15.ipa`

## Build Workflow (Claude Code MUST Follow)

When asked to build, follow this process:

### Step 1: Check for Existing File

```bash
# Use Glob to find existing files of same profile type
Glob pattern: build/10k-{profile}*.apk  (or *.aab for production)
```

### Step 2: Archive or Overwrite Decision

| Existing File | New Build | Action |
|---------------|-----------|--------|
| `v1.0.1-b5` | `v1.0.1-b5` | **Overwrite** (same version+build) |
| `v1.0.1-b4` | `v1.0.1-b5` | **Archive** existing, then build |
| `v1.0.0-b3` | `v1.0.1-b5` | **Archive** existing, then build |
| None | Any | Build directly |

### Step 3: Archive (if needed)

```bash
# Move existing file to archive (PowerShell)
powershell -Command "Move-Item -Path 'build/10k-preview-dev-v*.apk' -Destination 'build/archive/' -Force"
```

### Step 4: Update Version (if needed)

Before building, update `app.config.js`:
- `APP_VERSION` - User specifies (recommend +0.0.1)
- `BUILD_NUMBER` - Auto-increment by 1

### Step 5: Build

```bash
wsl -d Ubuntu -e bash -c "export ANDROID_HOME=/mnt/c/Users/blink/AppData/Local/Android/Sdk && export ANDROID_SDK_ROOT=/mnt/c/Users/blink/AppData/Local/Android/Sdk && cd /mnt/c/Users/blink/Documents/10K/10k-scorekeeper && npx eas-cli build --profile {PROFILE} --platform android --local --output ./build/{FILENAME} --non-interactive"
```

Replace:
- `{PROFILE}` - `preview-dev`, `development`, or `production`
- `{FILENAME}` - `10k-{profile}-v{VER}-b{BUILD}.apk` (or `.aab` for production)

**Note:** Uses Windows Android SDK at `/mnt/c/Users/blink/AppData/Local/Android/Sdk`

## Quick Examples

### Preview-dev Build
```bash
# Filename: 10k-preview-dev-v1.0.1-b5.apk
wsl -d Ubuntu -e bash -c "export ANDROID_HOME=/mnt/c/Users/blink/AppData/Local/Android/Sdk && export ANDROID_SDK_ROOT=/mnt/c/Users/blink/AppData/Local/Android/Sdk && cd /mnt/c/Users/blink/Documents/10K/10k-scorekeeper && npx eas-cli build --profile preview-dev --platform android --local --output ./build/10k-preview-dev-v1.0.1-b5.apk --non-interactive"
```

### Production Build
```bash
# Filename: 10k-production-v1.0.4-b9.aab
wsl -d Ubuntu -e bash -c "export ANDROID_HOME=/mnt/c/Users/blink/AppData/Local/Android/Sdk && export ANDROID_SDK_ROOT=/mnt/c/Users/blink/AppData/Local/Android/Sdk && cd /mnt/c/Users/blink/Documents/10K/10k-scorekeeper && npx eas-cli build --profile production --platform android --local --output ./build/10k-production-v1.0.4-b9.aab --non-interactive"
```

## Installing APK

```bash
# Install on connected device
adb install -r build/10k-preview-dev-v1.0.1-b5.apk

# Launch app
adb shell am start -n com.tenk.scorekeeper.previewdev/.MainActivity
```

**Note:** AAB files cannot be installed directly - they're for Google Play upload only.

## App Names on Device

| Profile | App Name | Package ID |
|---------|----------|------------|
| development | DEV - 10K Scorekeeper | com.tenk.scorekeeper.dev |
| preview-dev | PREVIEW DEV - 10K Scorekeeper | com.tenk.scorekeeper.previewdev |
| production | 10K Scorekeeper | com.tenk.scorekeeper |

## Prerequisites (Already Configured)

**Windows:**
- Android SDK at `C:\Users\blink\AppData\Local\Android\Sdk`
- ADB in PATH

**WSL Ubuntu:**
- Node.js 20+
- EAS CLI logged in (`tuesdaylabs` account)

## Important Notes

1. **Uses Windows Android SDK** - WSL accesses it at `/mnt/c/Users/blink/AppData/Local/Android/Sdk`
2. **First production build** requires interactive keystore generation (user runs manually)
3. **Build time:** First build ~10-15 min, subsequent ~3-5 min
4. **Credentials:** `credentials.json` contains signing keystore - keep safe
5. **Use `-d Ubuntu`** in WSL commands to avoid Windows path issues

## iOS Builds (EAS Cloud)

iOS builds **require EAS cloud** because they need macOS for compilation.

### iOS Build Command

```bash
# From project directory on Windows
cd "c:\Users\blink\Documents\10K\10k-scorekeeper"
npx eas-cli build --profile production --platform ios --non-interactive
```

**Note:** The build is queued on EAS servers. Free tier has a queue; paid plans get priority.

### IMPORTANT: Submit to App Store Connect After Build

**Claude Code MUST submit the build to App Store Connect immediately after the iOS build completes.**

Downloading the IPA is just a local backup - the build must be submitted to appear in TestFlight/App Store Connect.

```bash
# Submit the latest iOS build to App Store Connect
npx eas-cli submit --platform ios --latest --non-interactive
```

This uploads the build to Apple. Processing takes ~5-10 minutes, then it appears in TestFlight.

### iOS Build Output

- Build runs on EAS cloud (macOS servers)
- Creates `.ipa` file stored on EAS
- Download from: EAS dashboard or the URL provided after build completes
- Submit to TestFlight: `npx eas-cli submit --platform ios`

### Post-Build: Move IPA to Build Folder

**IMPORTANT:** After downloading an iOS build, Claude Code MUST move it to the build folder with proper naming.

The downloaded IPA will have a generic name like `application-{BUILD_ID}.ipa`. Rename and move it:

```powershell
# Find the downloaded IPA (usually in Downloads)
powershell -Command "Get-ChildItem -Path 'c:\Users\blink\Downloads\' -Filter '*.ipa' | Select-Object Name, LastWriteTime"

# Move and rename to build folder (match Android naming convention)
powershell -Command "Move-Item -Path 'c:\Users\blink\Downloads\application-{BUILD_ID}.ipa' -Destination 'c:\Users\blink\Documents\10K\10k-scorekeeper\build\10k-production-v{VER}-b{BUILD}.ipa' -Force"
```

**iOS build files in `build/` folder:**
```
build/
├── 10k-production-v1.0.8-b15.aab    # Android (Google Play)
├── 10k-production-v1.0.8-b15.ipa    # iOS (App Store)
└── archive/                          # Old builds
```

**Archive old IPAs** before moving new one (same as Android workflow).

### iOS Credentials

Credentials are managed by EAS (stored on Expo servers):
- Distribution Certificate
- Provisioning Profile
- Push Notification keys (if needed)

First build prompts for Apple Developer credentials. After setup, builds work non-interactively.

### Checking iOS Build Status

```bash
# Check build status
npx eas-cli build:list --platform ios --limit 5

# View specific build
npx eas-cli build:view {BUILD_ID}
```

### Complete iOS Build Workflow

**After iOS build finishes, Claude Code should do ALL of the following:**

1. **Submit to App Store Connect** (required for TestFlight):
   ```bash
   npx eas-cli submit --platform ios --latest --non-interactive
   ```

2. **Download and archive IPA** (optional local backup):
   - User downloads IPA from EAS dashboard
   - Claude moves it to `build/` folder with proper naming

3. **Inform user** that build will appear in TestFlight in ~5-10 minutes
