# APEX Feature Analysis with Google Jules

This guide explains how to use Google Jules AI to automatically analyze your APEX repository and generate feature recommendations.

## What is Google Jules?

**Google Jules** is an AI coding agent by Google that can:
- Analyze entire codebases
- Generate development plans
- Write and review code
- Create pull requests automatically
- Integrate with your GitHub repositories

Learn more: https://jules.google.com

## Setup (First Time Only)

### 1. Create a Jules Account
Visit https://jules.google.com and sign up with your Google account.

### 2. Connect Your Repository
In Jules web app:
1. Go to **Projects** or **Dashboard**
2. Click **"Connect Repository"**
3. Select your GitHub organization/user
4. Authorize Jules to access your repositories
5. Select `riteshrajas/APEX` repository
6. Confirm permissions

### 3. Generate API Key
In Jules web app:
1. Go to **Settings** ⚙️
2. Click **"API Keys"** or **"Developer"**
3. Click **"Create API Key"**
4. Copy your API key (keep it secret!)
5. Save it locally (next step)

### 4. Set Environment Variable
Store your API key as an environment variable:

**PowerShell (Windows):**
```powershell
$env:JULES_API_KEY = "your-api-key-here"

# Make it persistent (optional):
[Environment]::SetEnvironmentVariable("JULES_API_KEY", "your-api-key-here", "User")
```

**Command Prompt (Windows):**
```cmd
setx JULES_API_KEY "your-api-key-here"
```

**Bash/Zsh (macOS/Linux):**
```bash
export JULES_API_KEY="your-api-key-here"

# Make it persistent (optional):
echo 'export JULES_API_KEY="your-api-key-here"' >> ~/.bashrc
```

## Usage

### Basic Usage
```powershell
# Set API key (if not already set)
$env:JULES_API_KEY = "your-api-key-here"

# Run the analysis
.\Analyze-Features-Jules.ps1
```

### With Options
```powershell
# Auto-approve Jules plans (faster, skip manual approval)
.\Analyze-Features-Jules.ps1 -AutoApprove

# Skip GitHub issue creation
.\Analyze-Features-Jules.ps1 -SkipIssue

# Skip git commit
.\Analyze-Features-Jules.ps1 -SkipCommit

# Skip both
.\Analyze-Features-Jules.ps1 -SkipIssue -SkipCommit

# Increase timeout to 60 minutes
.\Analyze-Features-Jules.ps1 -MaxWaitMinutes 60
```

## What It Does

1. **Verifies Setup** ✅
   - Checks for Jules API key
   - Confirms git repository
   - Verifies GitHub repo connection

2. **Creates Jules Session** 🚀
   - Sends analysis prompt to Jules
   - Jules begins code analysis
   - Returns session ID and monitoring URL

3. **Waits for Completion** ⏳
   - Polls Jules session status
   - Shows progress updates
   - Handles timeouts gracefully

4. **Retrieves Results** 📊
   - Extracts analysis data
   - Compiles feature recommendations
   - Generates markdown report

5. **Saves to Repository** 💾
   - Creates `conductor/feature_opportunities.md`
   - Creates GitHub issue with findings
   - Commits changes to git

## Output

### Generated Files
- **conductor/feature_opportunities.md** — Full feature analysis from Jules
- **GitHub Issue** — Summary with link to Jules session

### Session Tracking
The script provides:
- Jules Session ID for reference
- Direct link to Jules session: `https://jules.google.com/u/1/session/{ID}`
- Progress updates while waiting
- Clear next steps when complete

## Example Run

```
============================================================================
APEX Feature Analysis - Google Jules Integration
============================================================================

[OK] Jules API key detected
[OK] Git detected
[OK] Repository: riteshrajas/APEX

[STEP 1] Finding your APEX repository in Jules...
[OK] Found repository: sources/github/riteshrajas/APEX

[STEP 2] Creating Jules session for feature analysis...
[OK] Jules session created
     Session ID: abc123def456
     Status: RUNNING
     View: https://jules.google.com/u/1/session/abc123def456

Waiting for Jules to complete analysis...
  ⏳ Status: RUNNING (2m 15s)
  ⏳ Status: ANALYZING_CODEBASE (5m 30s)
  ⏳ Status: GENERATING_FEATURES (8m 45s)
[OK] Jules analysis complete!

[STEP 3] Retrieving analysis results...
[OK] Retrieved session data
     Activities: 12

[STEP 4] Saving feature analysis...
[OK] Feature analysis saved
     Location: conductor/feature_opportunities.md

[STEP 5] Creating GitHub issue...
  https://github.com/riteshrajas/APEX/issues/42
[OK] GitHub issue created

[STEP 6] Committing to git...
[OK] Committed to git
Next: git push origin master

============================================================================
ANALYSIS COMPLETE
============================================================================

Results:
  ✅ Jules Session: https://jules.google.com/u/1/session/abc123def456
  ✅ Analysis saved: conductor/feature_opportunities.md
  ✅ Committed to git

Next Steps:
  1. Review Jules session for detailed recommendations
  2. Read conductor/feature_opportunities.md
  3. Discuss with team and prioritize
  4. Create individual issues for approved features
  5. Run: git push origin master
```

## Monitoring Jules Session

While the script waits, you can monitor progress at:
```
https://jules.google.com/u/1/session/{SESSION_ID}
```

In the Jules web app, you'll see:
- Real-time analysis progress
- Code samples being reviewed
- Feature generation status
- Generated recommendations
- Interactive chat to ask follow-up questions

## Troubleshooting

### "Jules API key not found!"
**Solution:** Set your API key:
```powershell
$env:JULES_API_KEY = "your-key-here"
.\Analyze-Features-Jules.ps1
```

### "Repository not found in Jules!"
**Solution:** Connect your repo to Jules first:
1. Go to https://jules.google.com
2. Click "Connect Repository"
3. Install Jules GitHub app for riteshrajas/APEX
4. Authorize permissions
5. Return and try again

### "Failed to create Jules session"
**Solutions:**
- Verify API key is correct
- Ensure Jules app is installed for your repo
- Check Jules web app status
- Try again in a few minutes

### Timeout waiting for Jules
**Solutions:**
- Increase timeout: `-MaxWaitMinutes 60`
- Check Jules session manually: `https://jules.google.com/u/1/session/{ID}`
- Save results manually when complete
- Run script with `-SkipCommit` to avoid conflicts

### "Git commit failed"
**Solutions:**
- Ensure no uncommitted changes conflict with analysis
- Run `git status` to check
- Resolve conflicts manually
- Rerun script

## Advanced Usage

### Schedule Regular Analysis
Use Windows Task Scheduler or cron to run analysis periodically:

```powershell
# Create daily analysis task (Windows)
$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM
$action = New-ScheduledTaskAction -Execute "pwsh" -Argument "-File C:\path\to\Analyze-Features-Jules.ps1"
Register-ScheduledTask -TaskName "APEX-Jules-Analysis" -Trigger $trigger -Action $action
```

### Custom Analysis Prompt
Edit the script to customize Jules's analysis:
```powershell
$sessionPrompt = @"
Your custom analysis instructions here...
"@
```

### Parse Jules Results
The script saves detailed session data. You can process it programmatically:
```powershell
$session = Invoke-RestMethod -Uri "https://jules.googleapis.com/v1alpha/sessions/$sessionId" `
    -Headers @{ "x-goog-api-key" = $env:JULES_API_KEY }

$activities = $session.activities | Where-Object { $_.type -eq "FEATURE_GENERATED" }
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Jules Feature Analysis

on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly, Sunday 2 AM
  workflow_dispatch:

jobs:
  analyze:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Jules Analysis
        env:
          JULES_API_KEY: ${{ secrets.JULES_API_KEY }}
        shell: pwsh
        run: .\Analyze-Features-Jules.ps1 -AutoApprove
      
      - name: Push Results
        run: git push origin master
```

## Best Practices

1. **Regular Runs** — Run analysis quarterly to catch new opportunities
2. **Review Carefully** — Jules is AI; verify recommendations before implementation
3. **Communicate** — Share Jules session with team for discussion
4. **Prioritize** — Use team feedback to prioritize features
5. **Track** — Create individual issues for approved features
6. **Secure Key** — Never commit API keys; use environment variables

## Support & Resources

- **Jules Documentation:** https://jules.google.com/docs
- **Jules API Reference:** https://jules.google.com/docs/api
- **GitHub Repository:** https://github.com/riteshrajas/APEX
- **CONTRIBUTING:** See CONTRIBUTING.md for development guidelines

## FAQ

**Q: Is Jules analysis guaranteed to be correct?**
A: Jules is AI-powered. Always review recommendations carefully and validate against project goals.

**Q: How much does Jules cost?**
A: Check https://jules.google.com/pricing. Free tier may have limitations.

**Q: Can I use Jules for production code changes?**
A: Yes, but review all changes before merging. Start with `-SkipCommit` to review first.

**Q: How do I cancel a Jules session?**
A: Stop the script with Ctrl+C, then cancel the session in Jules web app if needed.

**Q: Can I run multiple analyses in parallel?**
A: Yes, each gets a separate session ID. Use `-AutoApprove` to speed up approval.

---

**Script:** `Analyze-Features-Jules.ps1`
**Requires:** Jules account, API key, git, PowerShell 5.0+
**Latest:** See script file for current version
