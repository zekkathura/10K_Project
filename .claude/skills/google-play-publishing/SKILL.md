# Google Play Publishing

## Quick Reference

**Console URL:** https://play.google.com/console

**App:** 10K Scorekeeper (`com.tenk.scorekeeper`)

**Build file:** `build/10k-production-v{VER}-b{BUILD}.aab`

---

## Publishing a New Release

### Step 1: Build AAB
```bash
# From project directory, build via WSL
wsl -d Ubuntu -e bash -c "export ANDROID_HOME=/mnt/c/Users/blink/AppData/Local/Android/Sdk && export ANDROID_SDK_ROOT=/mnt/c/Users/blink/AppData/Local/Android/Sdk && cd /mnt/c/Users/blink/Documents/10K/10k-scorekeeper && npx eas-cli build --profile production --platform android --local --output ./build/10k-production-v{VER}-b{BUILD}.aab --non-interactive"
```

### Step 2: Open Google Play Console
1. Go to https://play.google.com/console
2. Select **10K Scorekeeper**

### Step 3: Create Release
1. Left sidebar: **Release** → **Production** (or Testing track)
2. Click **Create new release**
3. Click **Upload** and select your `.aab` file from `build/` folder
4. Wait for upload and processing (~1-2 min)

### Step 4: Add Release Notes
In the "Release notes" section, add what's new:
```
• Bug fixes and performance improvements
```
Or be specific:
```
• Added Apple Sign In
• Fixed UI layout issues
• Improved stats screen
```

### Step 5: Review and Roll Out
1. Click **Next** to review
2. Check for warnings/errors (resolve if any)
3. Click **Start rollout to Production**
4. Confirm in the dialog

---

## Release Tracks

| Track | Purpose | Users |
|-------|---------|-------|
| Internal testing | Quick testing, immediate availability | You + testers you add |
| Closed testing | Beta testing | Invited testers only |
| Open testing | Public beta | Anyone can join |
| Production | Live release | All users |

**Recommended flow:** Internal testing → Production (for small apps)

---

## Staged Rollouts

For Production releases, you can do staged rollouts:
- Start with 10% of users
- Monitor for crashes in **Quality** → **Android vitals**
- Increase to 50%, then 100%

For a small app, just do 100% immediately.

---

## Common Tasks

### Check Release Status
1. **Release** → **Production** (or your track)
2. See status: "In review", "Available", "Rolled out"

### View Crash Reports
1. **Quality** → **Android vitals** → **Crashes and ANRs**

### Update Store Listing
1. **Grow** → **Store presence** → **Main store listing**
2. Edit description, screenshots, etc.
3. Click **Save** then **Submit for review**

### Respond to User Reviews
1. **Ratings and reviews**
2. Click on a review to respond

---

## Version Requirements

Google Play requires:
- **versionCode** (BUILD_NUMBER) must increase with each upload
- **versionName** (APP_VERSION) is display only but should increase

Both are set in `app.config.js`:
```javascript
const APP_VERSION = '1.0.8';   // versionName
const BUILD_NUMBER = 15;       // versionCode
```

---

## Troubleshooting

### "Version code already exists"
Your BUILD_NUMBER in `app.config.js` must be higher than any previously uploaded build.

### "App signing"
Google manages app signing. Your upload key (in `credentials.json`) signs the AAB, then Google re-signs with the real key.

### Release stuck "In review"
- First releases: 1-7 days
- Updates: Usually hours to 1 day
- Nothing you can do but wait
