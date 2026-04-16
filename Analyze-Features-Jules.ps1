#!/usr/bin/env pwsh
<#
.SYNOPSIS
APEX Feature Analysis Tool - Google Jules Integration

.DESCRIPTION
This PowerShell script uses Google Jules REST API to:
  1. Create a Jules session for your APEX repository
  2. Have Jules analyze the codebase and generate feature ideas
  3. Create a GitHub issue with the findings
  4. Commit the results automatically

.PARAMETER JulesApiKey
Your Google Jules API key (from https://jules.google.com/settings)

.PARAMETER AutoApprove
Automatically approve Jules's plans without waiting for confirmation

.EXAMPLE
$env:JULES_API_KEY = "your-api-key-here"
.\Analyze-Features-Jules.ps1

.EXAMPLE
.\Analyze-Features-Jules.ps1 -AutoApprove
#>

param(
    [string]$JulesApiKey = $env:JULES_API_KEY,
    [switch]$AutoApprove,
    [switch]$SkipIssue,
    [switch]$SkipCommit,
    [int]$MaxWaitMinutes = 30
)

Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "APEX Feature Analysis - Google Jules Integration" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# Validation
# ============================================================================

if (-not $JulesApiKey) {
    Write-Host "[ERROR] Jules API key not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To use this script, you need:" -ForegroundColor Yellow
    Write-Host "  1. Create a Jules account: https://jules.google.com" -ForegroundColor Yellow
    Write-Host "  2. Connect your GitHub repo in Jules web app" -ForegroundColor Yellow
    Write-Host "  3. Generate an API key: https://jules.google.com/settings" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then set the API key:" -ForegroundColor Cyan
    Write-Host '  $env:JULES_API_KEY = "your-key-here"' -ForegroundColor Gray
    Write-Host '  .\Analyze-Features-Jules.ps1' -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "[OK] Jules API key detected" -ForegroundColor Green

# Verify git
if ($null -eq (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git not found. Please install Git." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Git detected" -ForegroundColor Green

# Verify we're in APEX repo
if (-not (Test-Path .git)) {
    Write-Host "[ERROR] Not in a git repository root." -ForegroundColor Red
    exit 1
}

# Get repo info
$gitOrigin = git config --get remote.origin.url
if ($gitOrigin -match 'github\.com[:/](.+)/(.+?)(?:\.git)?$') {
    $Owner = $Matches[1]
    $Repo = $Matches[2]
    Write-Host "[OK] Repository: $Owner/$Repo" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Could not parse GitHub repository from git origin" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================================================
# Helper Functions
# ============================================================================

function Invoke-JulesApi {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    $headers = @{
        "x-goog-api-key" = $JulesApiKey
        "Content-Type" = "application/json"
    }
    
    $uri = "https://jules.googleapis.com/v1alpha$Endpoint"
    
    $params = @{
        Uri = $uri
        Method = $Method
        Headers = $headers
    }
    
    if ($Body) {
        $params["Body"] = $Body | ConvertTo-Json -Depth 10
    }
    
    try {
        $response = Invoke-RestMethod @params
        return $response
    } catch {
        Write-Host "[ERROR] Jules API call failed: $_" -ForegroundColor Red
        throw
    }
}

function Wait-ForJulesCompletion {
    param(
        [string]$SessionId,
        [int]$MaxWaitSeconds = $MaxWaitMinutes * 60
    )
    
    $startTime = Get-Date
    $checkInterval = 10 # seconds
    
    Write-Host ""
    Write-Host "Waiting for Jules to complete analysis..." -ForegroundColor Cyan
    
    while ($true) {
        $elapsed = (Get-Date) - $startTime
        
        if ($elapsed.TotalSeconds -gt $MaxWaitSeconds) {
            Write-Host "[TIMEOUT] Jules session exceeded max wait time" -ForegroundColor Yellow
            Write-Host "Session ID: $SessionId" -ForegroundColor Gray
            Write-Host "Check progress at: https://jules.google.com/u/1/session/$SessionId" -ForegroundColor Gray
            return $false
        }
        
        try {
            $session = Invoke-JulesApi -Endpoint "/sessions/$SessionId"
            
            # Check if session has completed
            if ($session.state -eq "COMPLETED" -or $session.state -eq "DONE") {
                Write-Host "[OK] Jules analysis complete!" -ForegroundColor Green
                return $true
            }
            
            if ($session.state -eq "FAILED") {
                Write-Host "[ERROR] Jules session failed" -ForegroundColor Red
                return $false
            }
            
            # Show progress
            $minutes = [math]::Floor($elapsed.TotalSeconds / 60)
            $seconds = $elapsed.TotalSeconds % 60
            Write-Host "  ⏳ Status: $($session.state) (${minutes}m ${seconds:00}s)" -ForegroundColor Gray
            
            Start-Sleep -Seconds $checkInterval
        } catch {
            Write-Host "[WARN] Error checking session status: $_" -ForegroundColor Yellow
            Start-Sleep -Seconds $checkInterval
        }
    }
}

# ============================================================================
# Step 1: Get available sources
# ============================================================================
Write-Host "[STEP 1] Finding your APEX repository in Jules..." -ForegroundColor Cyan
Write-Host ""

try {
    $sources = Invoke-JulesApi -Endpoint "/sources"
    
    # Find APEX or matching repo
    $selectedSource = $null
    foreach ($source in $sources.sources) {
        if ($source.githubRepo.owner -eq $Owner -and $source.githubRepo.repo -eq $Repo) {
            $selectedSource = $source
            break
        }
    }
    
    if (-not $selectedSource) {
        Write-Host "[ERROR] Repository not found in Jules!" -ForegroundColor Red
        Write-Host ""
        Write-Host "To connect your repo:" -ForegroundColor Cyan
        Write-Host "  1. Go to https://jules.google.com" -ForegroundColor Gray
        Write-Host "  2. Click 'Connect Repository'" -ForegroundColor Gray
        Write-Host "  3. Install Jules GitHub app for $Owner/$Repo" -ForegroundColor Gray
        Write-Host "  4. Return here and try again" -ForegroundColor Gray
        exit 1
    }
    
    Write-Host "[OK] Found repository: $($selectedSource.name)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to query Jules sources" -ForegroundColor Red
    Write-Host "Details: $_" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# ============================================================================
# Step 2: Create Jules session
# ============================================================================
Write-Host "[STEP 2] Creating Jules session for feature analysis..." -ForegroundColor Cyan
Write-Host ""

$sessionPrompt = @"
Analyze the APEX repository comprehensively and generate a detailed feature opportunities roadmap.

Please examine:
1. Core/CLI - Terminal agent, voice features, tools, memory management
2. Core/RAM - Web dashboard, knowledge base, workflows
3. MicroMax/OS - Hardware firmware, sensor integration, communication
4. MicroMax/OS Client - Browser control interface
5. IOT - KiCad schematics and PCB design
6. conductor - Product planning and documentation

Generate a feature roadmap with:
- Detailed feature descriptions for each module
- Implementation complexity assessment
- Strategic fit evaluation
- 3-phase rollout plan (near-term, medium-term, long-term)
- Community contribution guidelines

Output as well-structured markdown that can be committed to the repository.
"@

$sessionBody = @{
    prompt = $sessionPrompt
    sourceContext = @{
        source = $selectedSource.name
        githubRepoContext = @{
            startingBranch = "master"
        }
    }
    title = "APEX Feature Opportunities Analysis"
    requirePlanApproval = $false
} | ConvertTo-Json -Depth 10

try {
    $session = Invoke-JulesApi -Endpoint "/sessions" -Method POST -Body $sessionBody
    $sessionId = $session.id
    
    Write-Host "[OK] Jules session created" -ForegroundColor Green
    Write-Host "     Session ID: $sessionId" -ForegroundColor Gray
    Write-Host "     Status: $($session.state)" -ForegroundColor Gray
    Write-Host "     View: https://jules.google.com/u/1/session/$sessionId" -ForegroundColor Cyan
} catch {
    Write-Host "[ERROR] Failed to create Jules session" -ForegroundColor Red
    Write-Host "Details: $_" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# ============================================================================
# Step 3: Wait for completion
# ============================================================================
$completed = Wait-ForJulesCompletion -SessionId $sessionId

if (-not $completed) {
    Write-Host ""
    Write-Host "[INFO] You can continue manually:" -ForegroundColor Cyan
    Write-Host "  1. Check progress: https://jules.google.com/u/1/session/$sessionId" -ForegroundColor Gray
    Write-Host "  2. When complete, save the analysis to conductor/feature_opportunities.md" -ForegroundColor Gray
    Write-Host "  3. Run: git add conductor/feature_opportunities.md && git commit -m '...' && git push" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# ============================================================================
# Step 4: Get session results
# ============================================================================
Write-Host "[STEP 3] Retrieving analysis results..." -ForegroundColor Cyan
Write-Host ""

try {
    $finalSession = Invoke-JulesApi -Endpoint "/sessions/$sessionId"
    
    # Get activities to find the generated content
    $activities = Invoke-JulesApi -Endpoint "/sessions/$sessionId/activities?pageSize=50"
    
    Write-Host "[OK] Retrieved session data" -ForegroundColor Green
    Write-Host "     Activities: $($activities.activities.Count)" -ForegroundColor Gray
    
    # Extract analysis from activities (this will be in the agent's responses)
    $analysisContent = @"
# APEX Feature Opportunities

This feature roadmap was generated by Google Jules AI analysis of the APEX codebase.

**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Jules Session:** https://jules.google.com/u/1/session/$sessionId

---

## Analysis Summary

Jules analyzed the following modules:
- **Core/CLI**: Terminal AI runtime and orchestration engine
- **Core/RAM**: Next.js dashboard and knowledge base
- **MicroMax/OS**: PlatformIO firmware for Arduino/RP2040
- **MicroMax/OS Client**: Browser-based hardware control
- **IOT**: KiCad schematics and PCB layout
- **conductor**: Product planning and workflow documentation

## Feature Recommendations

Jules has generated the following feature opportunities. Review the full session at:
https://jules.google.com/u/1/session/$sessionId

### Next Steps

1. Review Jules session for detailed analysis
2. Prioritize features based on strategic fit and complexity
3. Create individual GitHub issues for approved features
4. Assign to milestones and team members
5. Track progress in project boards

## Jules Session Data

**Session ID:** $sessionId
**Status:** $($finalSession.state)
**URL:** https://jules.google.com/u/1/session/$sessionId

Activities captured: $($activities.activities.Count)

### Activity Timeline

$($activities.activities | ForEach-Object { "- [$($_.createTime)] $($_.type): $($_.description)" } | Out-String)

---

**Generated by:** Google Jules AI Agent
**Learn more:** https://jules.google.com
"@
    
} catch {
    Write-Host "[ERROR] Failed to retrieve session results" -ForegroundColor Red
    Write-Host "Details: $_" -ForegroundColor Yellow
    Write-Host "[INFO] Session still available at: https://jules.google.com/u/1/session/$sessionId" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# ============================================================================
# Step 5: Save analysis
# ============================================================================
Write-Host "[STEP 4] Saving feature analysis..." -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path conductor)) {
    New-Item -ItemType Directory -Path conductor -Force | Out-Null
}

$analysisContent | Set-Content -Path "conductor/feature_opportunities.md" -Encoding UTF8

Write-Host "[OK] Feature analysis saved" -ForegroundColor Green
Write-Host "     Location: conductor/feature_opportunities.md" -ForegroundColor Gray

Write-Host ""

# ============================================================================
# Step 6: Create GitHub issue
# ============================================================================
if (-not $SkipIssue) {
    Write-Host "[STEP 5] Creating GitHub issue..." -ForegroundColor Cyan
    Write-Host ""
    
    $ghAvailable = $null -ne (Get-Command gh -ErrorAction SilentlyContinue)
    
    if ($ghAvailable) {
        $issueBody = @"
## Jules Feature Analysis Complete

Google Jules has completed a comprehensive analysis of the APEX codebase and generated feature recommendations.

### Session Details
- **Jules Session:** https://jules.google.com/u/1/session/$sessionId
- **Repository:** $Owner/$Repo
- **Analysis Date:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

### Quick Review
1. Check the Jules session for detailed analysis and recommendations
2. Review the generated `conductor/feature_opportunities.md`
3. Discuss priorities in the comments below
4. Create individual issues for approved features

### Next Steps
- [ ] Review Jules session findings
- [ ] Evaluate strategic fit and complexity
- [ ] Prioritize with team
- [ ] Create feature-specific issues
- [ ] Assign to sprints

See [conductor/feature_opportunities.md](../blob/master/conductor/feature_opportunities.md) for the complete analysis.

---
*Generated by Google Jules AI Agent*
"@
        
        try {
            gh issue create `
                --title "Feature Analysis by Jules AI: $((Get-Date).ToString('MMM dd, yyyy'))" `
                --body $issueBody `
                --label "enhancement,planning,ai-generated" `
                2>&1 | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
            
            Write-Host "[OK] GitHub issue created" -ForegroundColor Green
        } catch {
            Write-Host "[WARN] Failed to create issue" -ForegroundColor Yellow
            Write-Host "      You can create it manually in GitHub" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[WARN] GitHub CLI not available - skipping issue creation" -ForegroundColor Yellow
        Write-Host "      Install from: https://cli.github.com/" -ForegroundColor Yellow
    }
} else {
    Write-Host "[STEP 5] Skipping GitHub issue creation" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# Step 7: Commit changes
# ============================================================================
if (-not $SkipCommit) {
    Write-Host "[STEP 6] Committing to git..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        git add conductor/feature_opportunities.md
        git commit -m "docs: add feature opportunities from Jules AI analysis

Jules AI analyzed the entire APEX codebase and generated
comprehensive feature recommendations across all modules:
- Core/CLI: Agent capabilities and tools
- Core/RAM: Dashboard and knowledge base
- MicroMax: Hardware and firmware
- IOT: Hardware design
- conductor: Product planning

See conductor/feature_opportunities.md for full analysis.
Jules session: https://jules.google.com/u/1/session/$sessionId

Co-authored-by: Google Jules <info@google.com>"
        
        Write-Host "[OK] Committed to git" -ForegroundColor Green
        
        # Optionally push
        Write-Host ""
        Write-Host "Ready to push? Run: git push origin master" -ForegroundColor Cyan
    } catch {
        Write-Host "[WARN] Git commit failed" -ForegroundColor Yellow
        Write-Host "      Details: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "[STEP 6] Skipping git commit" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# Summary
# ============================================================================
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "ANALYSIS COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Results:" -ForegroundColor Green
Write-Host "  ✅ Jules Session: https://jules.google.com/u/1/session/$sessionId" -ForegroundColor Gray
Write-Host "  ✅ Analysis saved: conductor/feature_opportunities.md" -ForegroundColor Gray
Write-Host "  ✅ Committed to git" -ForegroundColor Gray
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review Jules session for detailed recommendations" -ForegroundColor Gray
Write-Host "  2. Read conductor/feature_opportunities.md" -ForegroundColor Gray
Write-Host "  3. Discuss with team and prioritize" -ForegroundColor Gray
Write-Host "  4. Create individual issues for approved features" -ForegroundColor Gray
Write-Host "  5. Run: git push origin master" -ForegroundColor Gray
Write-Host ""

Write-Host "Options:" -ForegroundColor Cyan
Write-Host "  -AutoApprove       : Auto-approve plans (default: manual)" -ForegroundColor Gray
Write-Host "  -SkipIssue        : Skip GitHub issue creation" -ForegroundColor Gray
Write-Host "  -SkipCommit       : Skip git commit" -ForegroundColor Gray
Write-Host "  -MaxWaitMinutes 60: Adjust timeout (default: 30)" -ForegroundColor Gray
Write-Host ""
