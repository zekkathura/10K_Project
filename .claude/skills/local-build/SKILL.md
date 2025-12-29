# Local Build Skill

Use when building Android APKs locally via WSL (no EAS cloud quota limits).

## Pre-built Files (Use First!)

**Check `build/` directory before rebuilding.** These files should exist:

| File | Profile | Database | Format | Use Case |
|------|---------|----------|--------|----------|
| `build/10k-dev.apk` | development | 10k-dev | APK | Dev client (requires Metro) |
| `build/10k-preview-dev.apk` | preview-dev | 10k-dev | APK | E2E testing (standalone) |
| `build/10k-production.aab` | production | 10k-prod | AAB | Google Play Store upload |

**Note:** Production builds create an `.aab` (Android App Bundle), not `.apk`. Google Play requires AAB format. You cannot install an AAB directly on a device.

**Quick install existing APK:**
```bash
adb install -r build/10k-preview-dev.apk
adb shell am start -n com.tenk.scorekeeper.previewdev/.MainActivity
```

Only rebuild if code changes need testing on native device.

## Overview

Local builds run in WSL (Windows Subsystem for Linux) and produce APKs without using EAS cloud build quota. This enables unlimited builds for testing.

**⚠️ IMPORTANT: Local builds do NOT include R8/ProGuard mapping files.** Google Play will show a deobfuscation warning and crash reports will be obfuscated. This is fine for internal testing, but **for official production releases, use EAS cloud builds instead:**
```bash
eas build --profile production --platform android   # Cloud build - includes mapping files
```

## Prerequisites (Already Installed)

WSL Ubuntu environment with:
- **Node.js 20** - JavaScript runtime
- **Java JDK 17** - Required by Gradle (`/usr/lib/jvm/java-17-openjdk-amd64`)
- **Android SDK** - `~/android-sdk` with:
  - cmdline-tools/latest
  - build-tools (34.0.0, 35.0.0, 36.0.0)
  - platforms (android-34, android-36)
  - platform-tools
  - ndk/27.1.12297006
  - cmake/3.22.1
- **EAS CLI** - Expo Application Services CLI

## Automated Build (Claude Code)

**IMPORTANT:** Use explicit inline exports (not `source ~/.profile`) because WSL's PATH contains Windows paths with parentheses that break bash.

### Build Command (Verified Working)
```bash
wsl -d Ubuntu -e bash -c "export ANDROID_HOME=/home/blink/android-sdk && export ANDROID_SDK_ROOT=/home/blink/android-sdk && export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 && export PATH=/home/blink/android-sdk/cmdline-tools/latest/bin:/home/blink/android-sdk/platform-tools:/usr/local/bin:/usr/bin:/bin && export EXPO_TOKEN=<token> && cd /mnt/c/Users/blink/Documents/10K/10k-scorekeeper && eas build --profile preview-dev --platform android --local --output ./build/10k-preview-dev.apk --non-interactive 2>&1"
```

**Key points:**
- Use absolute paths (`/home/blink/android-sdk` not `~/android-sdk`)
- Set minimal clean PATH (avoid Windows paths with spaces/parentheses)
- Add `2>&1` to capture both stdout and stderr

### Build Profiles
| Profile | App ID | Supabase | Use Case |
|---------|--------|----------|----------|
| `preview-dev` | `com.tenk.scorekeeper.previewdev` | 10k-dev | E2E testing |
| `preview` | `com.tenk.scorekeeper.preview` | 10k-prod | Internal testing |
| `production` | `com.tenk.scorekeeper` | 10k-prod | App Store |

## Manual Build (User)

Open WSL terminal and run:

```bash
# Navigate to project
cd /mnt/c/Users/blink/Documents/10K/10k-scorekeeper

# Build preview-dev APK (uses 10k-dev Supabase)
eas build --profile preview-dev --platform android --local --output ./build/10k-preview-dev.apk

# Build preview APK (uses 10k-prod Supabase)
eas build --profile preview --platform android --local --output ./build/10k-preview.apk

# Build production AAB (for Google Play)
eas build --profile production --platform android --local --output ./build/10k-production.aab
```

## Production Build (First Time - Keystore Setup)

The first production build requires **interactive keystore generation**. This must be run by the user in WSL terminal (Claude Code cannot run this non-interactively).

### First-Time Production Build

```bash
# Open WSL terminal and run:
cd /mnt/c/Users/blink/Documents/10K/10k-scorekeeper
eas build --profile production --platform android --local --output ./build/10k-production.aab
```

**When prompted:** "Generate a new Android Keystore?" → Press **Y**

The keystore will be:
- Saved locally in `credentials.json` (gitignored)
- Backed up to EAS servers for future cloud builds
- Required for ALL future updates to this app on Google Play

### Subsequent Production Builds

After the keystore exists, production builds work the same as other profiles:
```bash
cd /mnt/c/Users/blink/Documents/10K/10k-scorekeeper
eas build --profile production --platform android --local --output ./build/10k-production.aab
```

### Important Notes

- **Keep `credentials.json` safe** - Contains your signing keystore. Back it up securely.
- **Same keystore required forever** - Google Play requires the same signing key for all app updates
- **AAB format** - Production builds create `.aab` (Android App Bundle), not `.apk`
- **Cannot install AAB directly** - AAB is for Google Play upload only; use preview builds for device testing

## Output Locations

Build files are output to the `build/` directory with versioned names:
- `build/10k-dev.apk` - Development client APK (requires Metro server)
- `build/10k-preview-dev.apk` - Standalone testing APK (10k-dev database)
- `build/10k-production-v{VERSION}-b{BUILD_NUMBER}.aab` - Google Play bundle (10k-prod database)

**Naming Convention for Production AABs:**
- Format: `10k-production-v{APP_VERSION}-b{BUILD_NUMBER}.aab`
- Example: `10k-production-v1.0.1-b4.aab`

**⚠️ REQUIRED: Production Build Workflow (Claude Code MUST follow):**

Before building a new production AAB, Claude Code must:

1. **Ask user for version number** using AskUserQuestion tool:
   - Show current version (e.g., "Current: 1.0.0")
   - Recommend incrementing last digit by 0.0.1 (e.g., "1.0.1 (Recommended)")
   - Let user specify custom version

2. **Auto-increment BUILD_NUMBER** by 1 in `app.config.js`

3. **Archive existing AABs** - Move all `.aab` files from `build/` to `build/archive/`

4. **Build new AAB** with versioned filename

Example interaction:
```
Claude: "Current version is 1.0.0, build 3. What version for the new release?"
Options: "1.0.1 (Recommended)", "1.1.0", "2.0.0", "Other"
User selects or enters version
Claude: Updates APP_VERSION and BUILD_NUMBER, archives old AABs, builds new one
```

### Finding Build Files (Claude Code)

**Use Glob tool** to reliably find build files (avoids Windows path escaping issues):
```
# Find APKs
Glob pattern: build/**/*.apk
Path: c:\Users\blink\Documents\10K\10k-scorekeeper

# Find AAB (production)
Glob pattern: build/**/*.aab
Path: c:\Users\blink\Documents\10K\10k-scorekeeper
```

**Don't use** `dir` or `ls` commands for build files - path escaping between bash/cmd/PowerShell is unreliable.

### Paths by Context

| Context | Path Format |
|---------|-------------|
| Windows/Claude | `c:\Users\blink\Documents\10K\10k-scorekeeper\build\` |
| WSL | `/mnt/c/Users/blink/Documents/10K/10k-scorekeeper/build/` |
| ADB install | `build/10k-preview-dev.apk` (relative from project root) |

## Installing APK on Device

### Via ADB (device connected via USB)
```bash
# From Windows
adb install -r build/10k-preview-dev.apk

# Or copy to phone and install manually
```

### Direct Download
Transfer APK to phone via:
- USB file transfer
- Cloud storage (Google Drive, etc.)
- Local network share

## Build Time Estimates

- **First build**: 10-15 minutes (downloads Gradle, SDK components)
- **Subsequent builds**: 3-5 minutes (cached dependencies)

## Troubleshooting

### Build stuck on "Installing SDK Platform XX"
**Cause:** Gradle auto-downloads missing SDK components, which can hang.
**Fix:** Pre-install required SDK components:
```bash
wsl -d Ubuntu -- bash -c "yes | ~/android-sdk/cmdline-tools/latest/bin/sdkmanager 'platforms;android-36' 'build-tools;36.0.0'"
```

### "Expo user account required"
Run `eas login` in WSL terminal, or ensure EXPO_TOKEN is set in the build command.

### "ANDROID_HOME not set"
Use explicit inline exports in the build command (don't rely on ~/.profile).

### "syntax error near unexpected token `('"
**Cause:** WSL's PATH inherited from Windows contains paths with parentheses like `Program Files (x86)`.
**Fix:** Set a clean minimal PATH explicitly in your build command instead of appending to existing PATH.

### "SDK license not accepted"
Run in WSL:
```bash
yes | ~/android-sdk/cmdline-tools/latest/bin/sdkmanager --licenses
```

### Gradle download slow
First build downloads ~200MB Gradle distribution. Subsequent builds use cache (~3-5 min).

## EXPO_TOKEN Management

Token location: https://expo.dev/accounts/tuesdaylabs/settings/access-tokens

To create new token:
1. Go to Expo dashboard
2. Settings > Access Tokens
3. Create Token
4. Add to `~/.profile` in WSL

## Quick Reference

```bash
# Check WSL environment
wsl -d Ubuntu -- bash -c "node -v && java -version 2>&1 | head -1"

# List installed SDK components
wsl -d Ubuntu -- bash -c "~/android-sdk/cmdline-tools/latest/bin/sdkmanager --list_installed 2>&1 | grep -E '(platforms|build-tools|ndk|cmake)'"

# Pre-install SDK components (run before first build to avoid hangs)
wsl -d Ubuntu -- bash -c "yes | ~/android-sdk/cmdline-tools/latest/bin/sdkmanager 'platforms;android-36' 'build-tools;36.0.0'"
```

## Lessons Learned

1. **Don't source ~/.profile** - WSL inherits Windows PATH with parentheses that break bash. Use explicit inline exports.

2. **Pre-install SDK components** - Gradle auto-download can hang. Install platforms/build-tools beforehand.

3. **Use absolute paths** - `~/android-sdk` can fail in non-interactive shells. Use `/home/blink/android-sdk`.

4. **Set clean minimal PATH** - Only include essential Linux paths + Android SDK paths to avoid Windows path pollution.

5. **First build is slow** - Downloads Gradle (~200MB), NDK, CMake. Subsequent builds use cache (3-5 min).

6. **Use Glob tool for finding files** - `dir` and `ls` commands have path escaping issues on Windows. Use the Glob tool with pattern `build/**/*.apk` to reliably find APK files.

7. **Production builds need keystore** - First production build requires interactive keystore generation (user must run in WSL terminal). Subsequent builds work normally. Back up `credentials.json` securely.
