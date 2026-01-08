# Git Workflow Skill

## Repository
- **Remote**: `origin` → https://github.com/zekkathura/10K_Project.git
- **Account**: `zekkathura`

## Branch Structure

| Branch Type | Pattern | Purpose |
|-------------|---------|---------|
| `main` | `main` | Production-ready code, tagged releases |
| `release/*` | `release/v1.0.4` | Active development for a version |
| `feature/*` | `feature/dark-mode` | Individual features (merge to release) |
| `fix/*` | `fix/login-bug` | Bug fixes |

## Versioning

**Location**: `app.config.js` (lines 1-2)
```javascript
const APP_VERSION = '1.0.8';   // Semantic version (major.minor.patch)
const BUILD_NUMBER = 15;       // Increments with each build
```

**When to increment**:
- `BUILD_NUMBER`: Every new build (AAB/IPA)
- `patch` (1.0.X): Bug fixes, minor improvements
- `minor` (1.X.0): New features, non-breaking changes
- `major` (X.0.0): Breaking changes, major rewrites

## Standard Push Workflow

### Quick Push (current branch)
```bash
git add -A
git commit -m "type: Brief description"
git push origin <branch-name>
```

### Commit Message Format
```
type: Brief description

- Bullet point details
- Another change

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `chore`: Maintenance, config updates
- `refactor`: Code restructuring
- `docs`: Documentation only
- `release/vX.X.X`: Version release commit

### Release Workflow

1. **Update version** in `app.config.js`:
   ```javascript
   const APP_VERSION = '1.0.9';
   const BUILD_NUMBER = 16;
   ```

2. **Commit and push**:
   ```bash
   git add -A
   git commit -m "release/v1.0.9: Build 16 - Description of changes"
   git push origin release/v1.0.4
   ```

3. **After App Store approval**, merge to main:
   ```bash
   git checkout main
   git merge release/v1.0.4
   git tag -a v1.0.9 -m "Release v1.0.9"
   git push origin main --tags
   ```

## Common Commands

### Check Status
```bash
git status                    # See changes
git log --oneline -5          # Recent commits
git branch -a                 # All branches
git remote -v                 # Configured remotes
```

### Create New Branch
```bash
git checkout -b feature/new-feature
git push -u origin feature/new-feature
```

### Sync with Remote
```bash
git fetch --prune             # Update remote refs
git pull origin <branch>      # Pull changes
```

### Stash Changes
```bash
git stash                     # Save uncommitted changes
git stash pop                 # Restore stashed changes
```

## Files Never Committed

Already in `.gitignore`:
- `.env*` (credentials)
- `build/*.aab`, `build/*.apk` (build artifacts)
- `secrets/` (API keys)
- `node_modules/`
- `.expo/`

## Pre-Push Checklist

1. [ ] Version updated in `app.config.js` (if releasing)
2. [ ] No secrets in staged files (`git diff --cached`)
3. [ ] Tests pass (`npm test`)
4. [ ] Build succeeds (for release builds)

## Branch Naming Examples

```
release/v1.0.4      # Current release branch
feature/apple-signin # Adding Apple Sign In
fix/realtime-sync   # Fixing realtime sync bug
chore/update-deps   # Dependency updates
```