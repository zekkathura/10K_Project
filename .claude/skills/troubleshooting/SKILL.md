# Troubleshooting Guide

Quick solutions for common issues with 10K Scorekeeper development and publishing.

---

## Build Issues

### "eas: command not found"

**Solution:** Use `npx eas-cli` instead of `eas`

```bash
# Wrong
eas build --profile production --platform ios

# Correct
npx eas-cli build --profile production --platform ios
```

### Android Build Fails in WSL

**Check these in order:**

1. **Android SDK path correct?**
   ```bash
   export ANDROID_HOME=/mnt/c/Users/blink/AppData/Local/Android/Sdk
   export ANDROID_SDK_ROOT=/mnt/c/Users/blink/AppData/Local/Android/Sdk
   ```

2. **Node version?** Need 18+
   ```bash
   node --version
   ```

3. **EAS logged in?**
   ```bash
   npx eas-cli whoami
   # Should show: tuesdaylabs
   ```

### "Version code already exists" (Google Play)

Increment `BUILD_NUMBER` in `app.config.js`:
```javascript
const BUILD_NUMBER = 16;  // Must be higher than any previous upload
```

### iOS Build Stuck in Queue

Free tier has limited priority. Options:
- Wait (can take 30+ minutes during peak times)
- Check status: `npx eas-cli build:list --platform ios --limit 5`

---

## App Store Issues

### Build Not Appearing in TestFlight

**Most common cause:** You downloaded but didn't submit.

```bash
# This submits the build to Apple
npx eas-cli submit --platform ios --latest --non-interactive
```

Processing takes 5-30 minutes after submission.

### "Missing Compliance" in TestFlight

App Store Connect asks about encryption:
1. Go to TestFlight → Your Build → "Missing Compliance"
2. Answer: **No** (app only uses HTTPS, which is exempt)

### Apple Sign In Rejected

Checklist:
1. **Apple Developer Portal:** App ID has "Sign In with Apple" capability
2. **Supabase:** Apple provider includes `com.tenk.scorekeeper` in Client IDs
3. **app.config.js:** Has `usesAppleSignIn: true` and `expo-apple-authentication` plugin
4. **Testing:** Must test on real device via TestFlight (not simulator)

### App Privacy Labels Wrong

Go to App Store Connect → Your App → **App Privacy**:
- We collect: Account Info (email, name)
- Linked to identity: Yes
- Used for tracking: **No** (we don't share with third parties)

---

## Supabase Issues

### "Permission denied" or RLS Errors

Check Row Level Security policies:
1. Go to Supabase Dashboard → Database → Tables
2. Click table → "Policies" tab
3. Verify user has access via policy conditions

Common fix: User's `auth.uid()` must match a column in the query.

### Realtime Not Working

1. **Check table has realtime enabled:**
   - Database → Replication → Ensure table is checked

2. **Check RLS allows SELECT:**
   - User must have SELECT permission via policy

3. **Check subscription code:**
   ```javascript
   supabase.channel('changes')
     .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, callback)
     .subscribe()
   ```

### Auth Session Lost

If users keep getting logged out:
1. Check Supabase Dashboard → Authentication → Settings
2. JWT expiry time (default 1 hour)
3. Refresh token settings

---

## Development Issues

### Expo Dev Server Port Conflict

```bash
# Kill existing processes (PowerShell)
Get-Process -Name "node" | Stop-Process -Force

# Then start fresh
npm start -- --clear
```

### Changes Not Reflecting

1. **Clear Metro cache:**
   ```bash
   npm start -- --clear
   ```

2. **Reload app:**
   - Shake device → "Reload"
   - Or press `r` in terminal

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

### TypeScript Errors After Schema Change

After modifying database schema:
1. Update types in `src/types/` if using generated types
2. Restart TypeScript server in VS Code: Cmd/Ctrl+Shift+P → "TypeScript: Restart TS Server"

---

## Device Testing

### ADB Device Not Found

```bash
# Check connection
adb devices

# If empty, try:
# 1. Reconnect USB cable
# 2. Enable USB debugging on device
# 3. Accept prompt on device
# 4. Restart ADB
adb kill-server
adb start-server
```

### Can't Install APK

```bash
# Uninstall existing version first
adb uninstall com.tenk.scorekeeper.previewdev

# Then install
adb install -r build/10k-preview-dev-v1.0.8-b15.apk
```

### App Crashes on Launch

1. **Check logs:**
   ```bash
   adb logcat | grep -i "10k\|tenk\|expo"
   ```

2. **Common causes:**
   - Wrong Supabase credentials for environment
   - Missing native module (rebuild needed)
   - Android SDK version mismatch

---

## Environment Issues

### Wrong Supabase Database

Check which database the build connects to:

| Build Profile | Supabase | APP_ENV |
|--------------|----------|---------|
| development | 10k-dev | development |
| preview-dev | 10k-dev | preview-dev |
| preview | 10k-prod | preview |
| production | 10k-prod | production |

Credentials are hardcoded in `src/lib/supabase.ts` based on `APP_ENV`.

### Environment Variables Not Loading

For local development:
1. Check `.env` file exists and has values
2. Restart Expo with `--clear` flag

For EAS builds:
1. Check `eas.json` profile has correct `env` section
2. Check EAS secrets: `npx eas-cli secret:list`

---

## Quick Diagnostic Commands

```bash
# Check EAS login
npx eas-cli whoami

# List recent builds
npx eas-cli build:list --limit 5

# Check iOS credentials
npx eas-cli credentials --platform ios

# Check Android credentials
npx eas-cli credentials --platform android

# View specific build
npx eas-cli build:view <BUILD_ID>

# Check connected Android devices
adb devices

# View app version in config
grep -E "APP_VERSION|BUILD_NUMBER" app.config.js
```

---

## Getting Help

### Expo/EAS Issues
- Docs: https://docs.expo.dev
- Discord: https://chat.expo.dev

### Supabase Issues
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com

### Apple Developer Issues
- https://developer.apple.com/contact/

### Google Play Issues
- https://support.google.com/googleplay/android-developer/
