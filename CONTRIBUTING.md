# Contributing to APEX

Thank you for your interest in contributing to APEX! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   \\\ash
   git clone https://github.com/YOUR_USERNAME/APEX.git
   cd APEX
   \\\
3. **Add the upstream remote**:
   \\\ash
   git remote add upstream https://github.com/riteshrajas/APEX.git
   \\\

## Development Setup

APEX is organized into multiple modules. Set up only the modules you plan to work on:

### Core/RAM (Dashboard)
\\\powershell
cd Core\RAM
npm install
npm run dev
npm run lint   # Before submitting changes
\\\

### Core/CLI (Terminal Agent)
\\\powershell
cd Core\CLI
bun install
bun run dev
\\\

### MicroMax/OS (Firmware)
\\\powershell
cd MicroMax\OS
platformio run -e uno    # Build Uno firmware
platformio run -e pico   # Build RP2040 firmware
\\\

### MicroMax/OS Client (Web Control)
\\\powershell
cd MicroMax\OS Client
python -m http.server 4173
\\\

## Making Changes

### Branch Naming
Use descriptive branch names with a prefix:
- \eat/\ — New features
- \ix/\ — Bug fixes
- \docs/\ — Documentation updates
- \efactor/\ — Code refactoring
- \	est/\ — Test additions or fixes

Example: \eat/voice-command-support\

### Commit Message Format
Follow imperative mood with optional scope prefix:
\\\
area: action description

Optional longer explanation of what and why.
\\\

Examples:
- \docs: add system architecture documentation\
- \conductor(setup): add conductor setup files\
- \Core/RAM: fix dashboard navigation bug\
- \MicroMax/OS: improve serial protocol error handling\

### Code Style

**TypeScript / JavaScript / HTML / CSS:**
- 2-space indentation
- Prefer \camelCase\ for variables and functions
- Use \PascalCase\ for React components and enum types

**C++ Firmware:**
- 4-space indentation
- Follow existing firmware conventions in \MicroMax/OS/src/\

**General:**
- Keep comments minimal—comment only code that needs clarification
- Use descriptive variable and function names
- Run linters before committing:
  - Dashboard: \
pm run lint\ in \Core/RAM\
  - Firmware: Verify it builds with PlatformIO

## Testing

### Dashboard Tests
\\\powershell
cd Core\RAM
npm test
\\\

### Firmware Validation
Build before submitting firmware changes:
\\\powershell
cd MicroMax\OS
platformio run -e uno
platformio run -e pico
\\\

## Submitting Changes

### Create a Pull Request

1. **Update your branch** with the latest upstream:
   \\\ash
   git fetch upstream
   git rebase upstream/main
   \\\

2. **Push to your fork**:
   \\\ash
   git push origin your-branch-name
   \\\

3. **Open a Pull Request** on GitHub with:
   - Clear title and description
   - Link to any related issues: \Closes #123\
   - List of affected modules (e.g., "Core/RAM", "MicroMax/OS")
   - Validation steps (e.g., "Run \
pm run lint\, test on RP2040")
   - Screenshots for UI changes in \Core/RAM\ or \MicroMax/OS Client\

### What to Include in Your PR Description

\\\markdown
## Description
Brief explanation of the change.

## Related Issue
Closes #123

## Affected Modules
- [ ] Core/CLI
- [ ] Core/RAM
- [ ] MicroMax/OS
- [ ] MicroMax/OS Client
- [ ] IOT
- [ ] conductor

## Validation
- [x] Ran \
pm run lint\ in Core/RAM
- [x] Built firmware with PlatformIO for Uno and RP2040
- [x] Tested on hardware / Verified in dashboard

## Screenshots (if applicable)
\\\

## Documentation Updates

If your change affects how APEX works or requires new configuration:

1. Update the relevant module's README (e.g., \Core/RAM/README.md\)
2. Update \ARCHITECTURE.md\ if changing system design
3. Update \MicroMax/OS/SPEC.md\ if changing hardware behavior or protocol messages
4. Update \conductor/\ planning docs if adding new workflows

## Reporting Bugs

Use the [bug report template](/.github/ISSUE_TEMPLATE/bug_report.yml) to describe:
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happened
- **Steps to reproduce**: How to trigger the bug
- **Environment**: OS, Node version, Python version, PlatformIO version, etc.
- **Logs or error messages**: Full stack traces or console output

## Suggesting Features

Use the [feature request template](/.github/ISSUE_TEMPLATE/feature_request.yml) to propose:
- **Use case**: Why this feature is needed
- **Proposed solution**: How it might work
- **Alternatives considered**: Other approaches you thought of
- **Affected modules**: Which APEX components are involved

## Questions or Need Help?

- Review \ARCHITECTURE.md\ for system design details
- Check \AGENT.md\ for CLI agent capabilities
- See \conductor/index.md\ for workflow and planning information
- Check existing issues and discussions

## Thank You!

Your contributions help make APEX better for everyone. We appreciate your effort and look forward to collaborating with you!
