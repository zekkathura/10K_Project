# Expo Dev Server Management

## CRITICAL: Kill Before Start

**ALWAYS kill existing processes before starting Expo.** Multiple orphaned Metro bundlers cause port conflicts and confusion.

## Complete Workflow: Hot Dev on Android Emulator

### Step 1: Kill Existing Process on Port 8081

```bash
# Method 1: Using kill-port (simplest, most reliable)
npx kill-port 8081

# Method 2: Find and kill manually
netstat -ano | findstr ":8081.*LISTENING"
# Note the PID, then:
cmd /c "taskkill /F /PID <PID>"
```

### Step 2: Verify Android Emulator is Running

```bash
# Check connected devices
adb devices
# Should show: emulator-5554 device
```

**If no device shows:**
- Open Android Studio → Device Manager → Start your virtual device
- Or start from command line: `emulator -avd <device_name>`

### Step 3: Start Expo Dev Server

```bash
cd /c/Users/blink/Documents/10K/10k-scorekeeper
npm start -- --clear
```

This will:
- Clear Metro bundler cache
- Load environment from `.env`
- Start server on http://localhost:8081

### Step 4: Forward Port and Launch App

```bash
# Forward port 8081 from host to emulator
adb -s emulator-5554 reverse tcp:8081 tcp:8081

# Launch the dev client app
adb -s emulator-5554 shell am start -n com.tenk.scorekeeper.dev/.MainActivity
```

The app will automatically connect to the Metro bundler and enable hot reloading.

## One-Command Workflow

```bash
# Kill port, wait, start dev server (in background), forward port, launch app
npx kill-port 8081 && sleep 2 && (cd /c/Users/blink/Documents/10K/10k-scorekeeper && npm start -- --clear &) && sleep 15 && adb -s emulator-5554 reverse tcp:8081 tcp:8081 && adb -s emulator-5554 shell am start -n com.tenk.scorekeeper.dev/.MainActivity
```

### Why `--clear`?

Always use `--clear` when:
- Switching between environments (.env changed)
- After npm install
- After config changes (app.config.js, babel.config.js)
- When experiencing stale cache issues

## Environment Switching

The app uses `.env` for Supabase credentials. To switch environments:

1. Open `.env.alternatives` (reference file with all credential sets)
2. Copy the desired section (PRODUCTION or DEVELOPMENT)
3. Paste into `.env`
4. Restart Expo with `--clear`

**Files:**
- `.env` - Active credentials (app reads this)
- `.env.alternatives` - Reference with PROD and DEV options
- `.env.test` - Jest tests only (different variable names)

## Common Issues

### Port Already in Use
```
› Port 8081 is being used by another process
```
**Solution:** Kill the old process first (see pattern above).

### Multiple Expo Servers
If you see multiple ports (8081, 8082, 8083...) in use:
```bash
# Kill all Metro bundler processes
powershell -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq '' } | Stop-Process -Force"
```

### Environment Not Updating
If `.env` changes aren't reflected:
```bash
npx expo start --clear
```

## Default Port

Always use **port 8081** as the standard. Don't let Expo auto-increment to 8082, 8083, etc.

## Installed Apps on Emulator

The emulator has two 10K Scorekeeper apps installed:

| Package Name | Build Profile | Purpose | Connects to Metro? |
|--------------|---------------|---------|-------------------|
| `com.tenk.scorekeeper.dev` | development | **Hot dev** (use this!) | ✅ Yes |
| `com.tenk.scorekeeper.previewdev` | preview-dev | Standalone testing | ❌ No |

**For hot dev with instant code updates, always use `com.tenk.scorekeeper.dev`**

## Troubleshooting

### App Won't Connect to Metro

1. **Check port forwarding:**
   ```bash
   adb -s emulator-5554 reverse --list
   # Should show: tcp:8081 tcp:8081
   ```

2. **Restart Metro bundler:**
   ```bash
   npx kill-port 8081
   npm start -- --clear
   ```

3. **Clear app data and restart:**
   ```bash
   adb -s emulator-5554 shell pm clear com.tenk.scorekeeper.dev
   adb -s emulator-5554 shell am start -n com.tenk.scorekeeper.dev/.MainActivity
   ```

### Metro Bundler Stuck

If you see "Waiting on http://localhost:8081" with no progress:
- Kill and restart (npx kill-port 8081)
- Check no other Node processes are running (Task Manager)
- Delete `.expo` folder and restart

### Wrong App Version Showing

You might have the wrong app (preview-dev instead of dev):
```bash
# Uninstall preview-dev if you want clean environment
adb -s emulator-5554 uninstall com.tenk.scorekeeper.previewdev

# Launch dev client explicitly
adb -s emulator-5554 shell am start -n com.tenk.scorekeeper.dev/.MainActivity
```
