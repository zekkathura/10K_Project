# Expo Dev Server Management

## CRITICAL: Kill Before Start

**ALWAYS kill existing processes before starting Expo.** Multiple orphaned Metro bundlers cause port conflicts and confusion.

### Required Pattern

```bash
# 1. Find what's using the port
netstat -ano | findstr ":8081.*LISTENING"

# 2. Kill the process (use the PID from step 1)
powershell -Command "Stop-Process -Id <PID> -Force -ErrorAction SilentlyContinue"

# 3. Wait briefly, then start fresh
sleep 2
npx expo start --clear --port 8081
```

### One-Liner (Preferred)

```bash
# Find and kill port 8081, then start Expo
powershell -Command "Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"; sleep 2; npx expo start --clear --port 8081
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
