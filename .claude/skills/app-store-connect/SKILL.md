# App Store Connect Publishing

## Quick Reference

**Console URL:** https://appstoreconnect.apple.com

**App:** 10K Scorekeeper (`com.tenk.scorekeeper`)

**Apple Developer:** https://developer.apple.com (for certificates/capabilities)

---

## Publishing a New Release

### Step 1: Build iOS via EAS

```bash
# From project directory on Windows
cd "c:\Users\blink\Documents\10K\10k-scorekeeper"
npx eas-cli build --profile production --platform ios --non-interactive
```

Build takes ~15-30 minutes (queued on EAS servers).

### Step 2: Submit to App Store Connect

**CRITICAL:** The IPA must be submitted - downloading is just a backup.

```bash
# Submit the latest iOS build to App Store Connect
npx eas-cli submit --platform ios --latest --non-interactive
```

Processing takes ~5-10 minutes, then appears in TestFlight.

### Step 3: Test in TestFlight

1. Open TestFlight on your iPhone
2. Find "10K Scorekeeper"
3. Install and test the new build
4. Verify Apple Sign In works (if applicable)

### Step 4: Submit for App Store Review

1. Go to https://appstoreconnect.apple.com
2. Select **10K Scorekeeper** → **App Store** tab
3. Click the new version (or create one if needed)
4. Fill in **What's New** section
5. Click **Add for Review**
6. Answer compliance questions
7. Click **Submit to App Review**

---

## Version Management

### Creating a New Version

1. **App Store** tab → **+ Version or Platform** → **iOS**
2. Enter version number (must match `APP_VERSION` in `app.config.js`)
3. Fill in release notes

### Version Requirements

- **Version** (`APP_VERSION`): Display version (e.g., "1.0.8")
- **Build** (`BUILD_NUMBER`): Must be unique per version upload

Both set in `app.config.js`:
```javascript
const APP_VERSION = '1.0.8';   // CFBundleShortVersionString
const BUILD_NUMBER = 15;       // CFBundleVersion
```

---

## App Privacy (CRITICAL)

**Location:** App Store Connect → App → **App Privacy**

### Current Settings (Correct)

| Question | Answer |
|----------|--------|
| Do you collect data? | **Yes** |
| Data types | Account Info (email, name) |
| Linked to identity? | **Yes** |
| Used for tracking? | **No** |

### What "Tracking" Means

Apple defines tracking as sharing data with third parties for advertising or selling data. Our app does NOT track because:
- We only collect email/name for authentication
- Data stays within our own Supabase backend
- No third-party analytics or ad SDKs
- No data sharing with other companies

**If asked:** "The app collects account information (email, display name) solely for user authentication and in-app identification. This data is stored in our own backend and is not shared with third parties or used for advertising purposes."

---

## App Review Guidelines

### Common Rejection Reasons

**5.1.2 - Data Use and Sharing (Privacy)**
- Ensure App Privacy labels match actual data collection
- Don't claim "tracking" if you're not sharing data with third parties

**2.1 - App Completeness**
- All buttons must work (no "Coming Soon" for core features)
- Sign In with Apple must function if button is visible

**4.0 - Design**
- App must work on all supported devices
- UI must be properly adapted (no cut-off elements)

### Review Notes

When submitting, you can add notes to the reviewer explaining any special configuration or context. Use this for:
- Explaining recent fixes
- Providing test accounts if needed
- Clarifying app functionality

---

## Apple Sign In Configuration

### Requirements

1. **Apple Developer Portal** (developer.apple.com):
   - App ID must have "Sign In with Apple" capability enabled
   - Go to: Certificates, Identifiers & Profiles → Identifiers → Your App ID → Capabilities

2. **Supabase Dashboard** (supabase.com):
   - Authentication → Providers → Apple
   - Client IDs must include: `com.tenk.scorekeeper` (bundle ID)
   - Also include: `com.tenk.scorekeeper.web` (for web OAuth)

3. **app.config.js**:
   ```javascript
   ios: {
     usesAppleSignIn: true,  // Adds entitlement
   },
   plugins: [
     'expo-apple-authentication',  // Required plugin
   ],
   ```

### Testing Apple Sign In

Apple Sign In only works on:
- Real iOS devices (not simulators)
- Production/TestFlight builds (not dev builds)

Test via TestFlight before submitting for review.

---

## TestFlight

### Internal Testing

1. App Store Connect → TestFlight → Internal Testing
2. Add testers (must be App Store Connect users)
3. Builds auto-available after processing

### External Testing

1. Create a test group
2. Add external testers by email
3. Submit build for Beta App Review (faster than full review)

### Build Processing

After `eas submit`, builds take ~5-10 minutes to process. Status:
- **Processing** - Apple is analyzing the build
- **Ready to Submit** - Available for TestFlight
- **Missing Compliance** - Answer export compliance questions

---

## Certificates & Provisioning

### Current Status

Managed by EAS (stored on Expo servers):
- **Distribution Certificate:** Expires Jan 1, 2027
- **Provisioning Profile:** Expires Jan 1, 2027

### Checking Certificate Status

```bash
npx eas-cli credentials --platform ios
```

### When Certificates Expire

1. EAS will prompt during build
2. Follow prompts to generate new certificates
3. Or manually in Apple Developer Portal:
   - Certificates, Identifiers & Profiles → Certificates
   - Create new Distribution Certificate
   - Download and upload to EAS

---

## Troubleshooting

### Build Not Appearing in TestFlight

- Did you run `eas submit`? Download ≠ Submit
- Check processing status in App Store Connect → TestFlight
- Processing can take 5-30 minutes

### "Missing Compliance" Warning

Answer the export compliance question:
- Our app uses HTTPS only (exempt encryption)
- Answer: "No" to using non-exempt encryption

### Apple Sign In Not Working

1. Check Apple Developer → App ID has capability
2. Check Supabase → Apple provider has bundle ID
3. Check app.config.js has `usesAppleSignIn: true`
4. Must test on real device, not simulator

### Version Already Exists

Increment `BUILD_NUMBER` in `app.config.js` before building.

---

## Release Types

| Type | Description | When to Use |
|------|-------------|-------------|
| Manual Release | You click "Release" after approval | Testing phased rollouts |
| Automatic Release | Goes live immediately on approval | Standard releases |
| Phased Release | 7-day gradual rollout (1%, 2%, 5%...) | Major updates |

---

## Checklist: New Release

- [ ] Update `APP_VERSION` and `BUILD_NUMBER` in `app.config.js`
- [ ] Build: `npx eas-cli build --profile production --platform ios --non-interactive`
- [ ] Submit: `npx eas-cli submit --platform ios --latest --non-interactive`
- [ ] Test in TestFlight on real device
- [ ] Create new version in App Store Connect (if version changed)
- [ ] Fill in "What's New" release notes
- [ ] Submit for App Review
- [ ] Monitor review status (typically 24-48 hours)
