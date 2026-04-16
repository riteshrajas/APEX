# Repository Guidelines

## Project Structure & Module Organization

`Core/CLI` is the agent runtime and terminal UI; most application code lives in `src/`, with tests under `tests/`. `Core/RAM` is the Next.js dashboard and knowledge base (`src/app`, `src/components`, `src/knowledge-base`). `MicroMax/OS` contains the PlatformIO firmware (`src/`, `include/`, `platformio.ini`), while `MicroMax/OS Client` is the Chrome-based Web Serial control app. `IOT/` stores KiCad schematics and board files. `conductor/` holds product and workflow planning documents.

## Build, Test, and Development Commands

- `cd Core/RAM && npm run dev`: start the Next.js dashboard locally.
- `cd Core/RAM && npm run build`: create a production build.
- `cd Core/RAM && npm run lint`: run ESLint before submitting UI changes.
- `cd MicroMax/OS && platformio run -e uno`: build Uno firmware.
- `cd MicroMax/OS && platformio run -e pico`: build RP2040 firmware.
- `cd MicroMax/OS && platformio run -e uno -t upload --upload-port COM4`: flash firmware.
- `cd "MicroMax/OS Client" && python -m http.server 4173`: serve the browser client for local testing.

## Coding Style & Naming Conventions

Follow the existing style of the area you touch. Use 2-space indentation for TypeScript, JavaScript, HTML, and CSS. Use 4-space indentation for C++ firmware. Prefer `camelCase` for variables/functions, `PascalCase` for React components and enum types, and descriptive filenames like `VoiceAgent.tsx`, `IO_Manager.cpp`, or `test_rp2040.py`. Keep edits focused; do not rename or reshuffle modules without a clear need.

## Testing Guidelines

Run the nearest relevant checks before opening a PR. For dashboard changes, run `npm run lint` in `Core/RAM`. For firmware, build the target environment with PlatformIO before flashing. Hardware-side diagnostics in `MicroMax/test_*.py` are useful for serial verification; name new tests by capability or board, for example `test_serial_ping.py`.

## Commit & Pull Request Guidelines

Recent history favors short imperative commits, often with a scope prefix, for example `docs: add system architecture documentation` or `conductor(setup): add conductor setup files`. Use `area: action` where possible. PRs should include a short summary, affected paths, validation steps, and screenshots for `Core/RAM` or `MicroMax/OS Client` UI changes.

### Local PR Automation (Windows)

To create PRs from a local machine without sharing keys/secrets, use the repo helper:

```powershell
.\open-pr-local.bat "P:\APEX\MiniMax" "feat/minimax-l2-wireless" "minimax: add wireless stack" "Implements L2 WiFi/MQTT bridge and sentry telemetry." main
```

Requirements:
- `gh` CLI installed and authenticated (`gh auth login`)
- existing local git credentials/SSH agent setup

Security note: never share private SSH keys with agents or scripts. The helper relies on your already-authenticated local environment.

## Security & Device Notes

Do not commit secrets, API keys, or machine-specific serial assumptions. When changing hardware behavior or protocol messages, update `MicroMax/OS/SPEC.md` alongside the code.
