#!/usr/bin/env pwsh
<#
.SYNOPSIS
Setup Google Jules for APEX Feature Analysis

.DESCRIPTION
Interactive setup wizard for configuring Google Jules integration

.EXAMPLE
.\Setup-Jules.ps1
#>

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          Google Jules Setup for APEX Feature Analysis                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if API key already set
if ($env:JULES_API_KEY) {
    Write-Host "✅ Jules API key is already set in environment" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: .\Analyze-Features-Jules.ps1" -ForegroundColor Cyan
    Write-Host ""
    
    $response = Read-Host "Reconfigure? (Y/N)"
    if ($response -ne "Y" -and $response -ne "y") {
        exit 0
    }
}

Write-Host "Setup requires 4 steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1️⃣  Create Jules account" -ForegroundColor Gray
Write-Host "  2️⃣  Connect your GitHub repo" -ForegroundColor Gray
Write-Host "  3️⃣  Generate API key" -ForegroundColor Gray
Write-Host "  4️⃣  Save API key locally" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1
Write-Host "STEP 1: Create Jules Account" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to: https://jules.google.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Click 'Sign In' or 'Get Started'" -ForegroundColor Gray
Write-Host "2. Sign in with your Google account" -ForegroundColor Gray
Write-Host "3. Complete the onboarding flow" -ForegroundColor Gray
Write-Host ""

$response = Read-Host "Ready to continue? (Y/N)"
if ($response -ne "Y" -and $response -ne "y") {
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 2
Write-Host "STEP 2: Connect Your GitHub Repository" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host ""
Write-Host "In Jules web app:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to Dashboard or Projects" -ForegroundColor Gray
Write-Host "2. Click 'Connect Repository' or 'New Project'" -ForegroundColor Gray
Write-Host "3. Select your GitHub organization (riteshrajas)" -ForegroundColor Gray
Write-Host "4. Find and select 'APEX' repository" -ForegroundColor Gray
Write-Host "5. Grant Jules permissions to access the repo" -ForegroundColor Gray
Write-Host "6. Confirm and save" -ForegroundColor Gray
Write-Host ""

$response = Read-Host "Ready to continue? (Y/N)"
if ($response -ne "Y" -and $response -ne "y") {
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 3
Write-Host "STEP 3: Generate API Key" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host ""
Write-Host "In Jules web app:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Click your profile icon (top right)" -ForegroundColor Gray
Write-Host "2. Go to 'Settings' ⚙️" -ForegroundColor Gray
Write-Host "3. Click 'API Keys' or 'Developer Settings'" -ForegroundColor Gray
Write-Host "4. Click 'Create API Key'" -ForegroundColor Gray
Write-Host "5. Name it 'APEX-Analysis' or similar" -ForegroundColor Gray
Write-Host "6. Click 'Generate'" -ForegroundColor Gray
Write-Host "7. Copy the key (you won't see it again!)" -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   - Keep your API key SECRET" -ForegroundColor Yellow
Write-Host "   - Never share it or commit it to git" -ForegroundColor Yellow
Write-Host "   - Store it securely" -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Ready to continue? (Y/N)"
if ($response -ne "Y" -and $response -ne "y") {
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 4
Write-Host "STEP 4: Save API Key Locally" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host ""
Write-Host "Paste your Jules API key below:" -ForegroundColor Cyan
Write-Host "(Your input will be hidden)" -ForegroundColor Gray
Write-Host ""

$apiKey = Read-Host -AsSecureString "Jules API Key"
$plainKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($apiKey))

if (-not $plainKey -or $plainKey.Length -lt 10) {
    Write-Host ""
    Write-Host "❌ Invalid API key" -ForegroundColor Red
    exit 1
}

# Validate API key format (basic check)
if ($plainKey -notmatch '^[a-zA-Z0-9\-_]{20,}$') {
    Write-Host ""
    Write-Host "⚠️  Warning: API key format looks unusual. Verify you copied it correctly." -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (Y/N)"
    if ($confirm -ne "Y" -and $confirm -ne "y") {
        exit 1
    }
}

# Set environment variable (current session)
$env:JULES_API_KEY = $plainKey

# Offer to make persistent
Write-Host ""
Write-Host "API key set for current session." -ForegroundColor Green
Write-Host ""
Write-Host "Make it persistent? This will save it to your user environment variables." -ForegroundColor Cyan
$persistent = Read-Host "(Y/N)"

if ($persistent -eq "Y" -or $persistent -eq "y") {
    try {
        [Environment]::SetEnvironmentVariable("JULES_API_KEY", $plainKey, "User")
        Write-Host "✅ API key saved to user environment" -ForegroundColor Green
        Write-Host "   (Restart PowerShell for changes to take effect)" -ForegroundColor Gray
    } catch {
        Write-Host "⚠️  Could not save to environment. Key is set for this session only." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  API key will only be available in this PowerShell session" -ForegroundColor Yellow
    Write-Host "   You'll need to set it again when you restart PowerShell" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test connection
Write-Host "Testing Jules API connection..." -ForegroundColor Cyan
Write-Host ""

try {
    $headers = @{
        "x-goog-api-key" = $plainKey
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod `
        -Uri "https://jules.googleapis.com/v1alpha/sources" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop
    
    if ($response.sources) {
        Write-Host "✅ Connection successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Found $($response.sources.Count) connected repositories:" -ForegroundColor Green
        $response.sources | ForEach-Object {
            Write-Host "   • $($_.githubRepo.owner)/$($_.githubRepo.repo)" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️  Connected but no repositories found" -ForegroundColor Yellow
        Write-Host "   Make sure APEX is connected in Jules web app" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Connection failed" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Verify:" -ForegroundColor Cyan
    Write-Host "  1. API key is correct (copy from Jules settings)" -ForegroundColor Gray
    Write-Host "  2. APEX repo is connected in Jules web app" -ForegroundColor Gray
    Write-Host "  3. You have internet connectivity" -ForegroundColor Gray
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run:" -ForegroundColor Cyan
Write-Host "  .\Analyze-Features-Jules.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Options:" -ForegroundColor Cyan
Write-Host "  .\Analyze-Features-Jules.ps1 -AutoApprove    (skip manual approval)" -ForegroundColor Gray
Write-Host "  .\Analyze-Features-Jules.ps1 -SkipCommit     (don't commit results)" -ForegroundColor Gray
Write-Host ""
Write-Host "For help, see: JULES_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
