@echo off
setlocal EnableExtensions

if "%~1"=="" goto :usage
if "%~2"=="" goto :usage
if "%~3"=="" goto :usage
if "%~4"=="" goto :usage

set "REPO_PATH=%~1"
set "BRANCH_NAME=%~2"
set "PR_TITLE=%~3"
set "PR_BODY=%~4"
set "BASE_BRANCH=%~5"
if "%BASE_BRANCH%"=="" set "BASE_BRANCH=main"

where gh >nul 2>nul
if errorlevel 1 (
  echo ERROR: GitHub CLI (gh) is not installed or not on PATH.
  exit /b 1
)

gh auth status -h github.com >nul 2>nul
if errorlevel 1 (
  echo ERROR: gh is not authenticated. Run: gh auth login
  exit /b 1
)

if not exist "%REPO_PATH%" (
  echo ERROR: Repo path does not exist: %REPO_PATH%
  exit /b 1
)

pushd "%REPO_PATH%" >nul

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo ERROR: Not a git repository: %REPO_PATH%
  popd >nul
  exit /b 1
)

git checkout -B "%BRANCH_NAME%"
if errorlevel 1 (
  echo ERROR: Failed to create/switch branch %BRANCH_NAME%.
  popd >nul
  exit /b 1
)

git push -u origin "%BRANCH_NAME%"
if errorlevel 1 (
  echo ERROR: Failed to push branch %BRANCH_NAME% to origin.
  popd >nul
  exit /b 1
)

gh pr create --base "%BASE_BRANCH%" --head "%BRANCH_NAME%" --title "%PR_TITLE%" --body "%PR_BODY%"
if errorlevel 1 (
  echo ERROR: PR creation failed.
  popd >nul
  exit /b 1
)

echo PR created successfully.
popd >nul
exit /b 0

:usage
echo Usage:
echo   open-pr-local.bat ^<repo-path^> ^<branch-name^> ^<pr-title^> ^<pr-body^> [base-branch]
echo Example:
echo   open-pr-local.bat "P:\APEX\MiniMax" "feat/minimax-l2-wireless" "minimax: add wireless stack" "Implements L2 WiFi/MQTT bridge and sentry telemetry." main
exit /b 1
