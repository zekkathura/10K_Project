# Release Checklist

Pre-release checklist for Google Play Store and Apple App Store submissions.

## Before Each Release

### 1. Version Bump
Update in `app.config.js`:
```javascript
const APP_VERSION = '1.0.1';  // Semantic version (user-facing)
const BUILD_NUMBER = 2;       // MUST increment for each store upload
```

### 2. Run Tests
```bash
npm test                    # Unit tests (should be 223+ passing)
npm run test:e2e           # Web E2E tests
npm run test:e2e:mobile    # Mobile E2E tests (requires device)
```

### 3. Build Production Bundle
```bash
# Cloud build (recommended - uses EAS managed signing)
eas build --profile production --platform android

# Local build (WSL)
eas build --profile production --platform android --local --output ./build/10k-production.aab
```

### 4. Test Production Build
Before submitting, install and test the production build:
- Login with email/password
- Login with Google OAuth
- Create a game
- Play through scoring
- Check settings/theme toggle
- Verify data syncs correctly

---

## Google Play Store Setup (First Release Only)

### 1. Google Play Console Account
- Create account at https://play.google.com/console
- Pay one-time $25 developer fee
- Complete identity verification

### 2. Create App Listing
1. Go to "All apps" > "Create app"
2. Fill in:
   - App name: `10K Scorekeeper`
   - Default language: English (US)
   - App or game: Game
   - Free or paid: Free

### 3. Store Listing Assets

| Asset | Specification |
|-------|--------------|
| App icon | 512x512 PNG, 32-bit, no transparency |
| Feature graphic | 1024x500 PNG or JPG |
| Phone screenshots | 2-8 screenshots, 16:9 or 9:16, min 320px |
| Short description | Max 80 characters |
| Full description | Max 4000 characters |

**Short description example:**
> Track scores for the dice game 10,000 (Farkle). Create games, invite friends, see stats.

### 4. Content Rating
Complete the content rating questionnaire:
- Violence: None
- Sexuality: None
- Language: None
- Controlled substances: None
- User interaction: Yes (multiplayer)
- Data collection: Yes (account data)

### 5. Privacy Policy
**Required** for apps with user accounts.

Host your privacy policy at a public URL and add it to:
- Google Play Console > Policy > App content > Privacy policy
- App Store Connect > App Information > Privacy Policy URL

### 6. Data Safety Form
Google Play requires declaring what data you collect:

| Data Type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| Email address | Yes | No | Account management |
| User IDs | Yes | No | Account management |
| Game activity | Yes | No | App functionality |

### 7. Service Account for Auto-Submit
To use `eas submit`:

1. Google Play Console > Setup > API access
2. Link to Google Cloud Project (or create new)
3. Create service account with "Release manager" role
4. Download JSON key
5. Save as `google-play-service-account.json` in project root
6. **Never commit this file** (already in .gitignore)

---

## Apple App Store Setup (First Release Only)

### 1. Apple Developer Account
- Enroll at https://developer.apple.com
- Pay annual $99 fee
- Complete enrollment verification

### 2. App Store Connect
1. Create App ID in Developer Portal
2. Create app in App Store Connect
3. Fill in app metadata

### 3. Required Assets

| Asset | Specification |
|-------|--------------|
| App icon | 1024x1024 PNG, no alpha |
| iPhone screenshots | 6.5" and 5.5" displays |
| iPad screenshots | 12.9" display (if supporting tablets) |

### 4. App Review Information
- Demo account credentials for review team
- Contact information
- Notes explaining app functionality

### 5. Update eas.json
```json
"ios": {
  "appleId": "your-apple-id@email.com",
  "ascAppId": "your-app-store-connect-app-id"
}
```

---

## Submit to Stores

### Google Play
```bash
# After build completes
eas submit --platform android --profile production

# Or manually upload AAB in Play Console
```

### Apple App Store
```bash
# After build completes
eas submit --platform ios --profile production

# Or use Transporter app
```

---

## Post-Release

### Monitor
- Google Play Console > Quality > Android vitals
- App Store Connect > Analytics
- Supabase Dashboard > Logs

### Respond to Reviews
- Check ratings/reviews regularly
- Respond professionally to issues
- Track feature requests

---

## Quick Reference

### Build Commands
```bash
# Development (dev server required)
eas build --profile development --platform android

# Preview with dev database (E2E testing)
eas build --profile preview-dev --platform android

# Preview with prod database (internal testing)
eas build --profile preview --platform android

# Production (store submission)
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Version History
| Version | Build | Date | Notes |
|---------|-------|------|-------|
| 1.0.0 | 1 | TBD | Initial release |
