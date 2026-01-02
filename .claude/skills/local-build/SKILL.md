# Local Build Skill

Build Android APKs/AABs locally via WSL. **Never use EAS cloud for Android** - reserved for iOS only.

## Build Folder Structure

```
build/
├── 10k-dev-v{VER}-b{BUILD}.apk           # Development (requires Metro)
├── 10k-preview-dev-v{VER}-b{BUILD}.apk   # Preview-dev (standalone, 10k-dev DB)
├── 10k-production-v{VER}-b{BUILD}.aab    # Production (Google Play, 10k-prod DB)
└── archive/                               # Old builds moved here
```

**Only ONE file of each type exists in `build/` at a time.** Old versions go to `archive/`.

## Build File Types

| Profile | Filename Pattern | Database | Format | Use Case |
|---------|------------------|----------|--------|----------|
| `development` | `10k-dev-v{VER}-b{BUILD}.apk` | 10k-dev | APK | Dev client (requires Metro) |
| `preview-dev` | `10k-preview-dev-v{VER}-b{BUILD}.apk` | 10k-dev | APK | Standalone testing |
| `production` | `10k-production-v{VER}-b{BUILD}.aab` | 10k-prod | AAB | Google Play upload |

**Example:** `10k-preview-dev-v1.0.1-b5.apk`

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
6. **iOS builds** use EAS cloud (not local) - requires `eas build --profile production --platform ios`
