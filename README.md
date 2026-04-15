# APEX

APEX is a multi-module automation stack that combines an AI terminal runtime, a realtime web dashboard, hardware firmware, and electronics design assets in one repository.

## Modules

| Module | Purpose | README |
| --- | --- | --- |
| Core | Software runtime layer (CLI + RAM) | [`Core/README.md`](./Core/README.md) |
| Core/CLI | Terminal AI runtime and orchestration engine | [`Core/CLI/README.md`](./Core/CLI/README.md) |
| Core/RAM | Next.js dashboard + knowledge base | [`Core/RAM/README.md`](./Core/RAM/README.md) |
| MicroMax | Hardware execution layer | [`MicroMax/README.md`](./MicroMax/README.md) |
| MicroMax/OS | PlatformIO firmware for Uno + RP2040 | [`MicroMax/OS/README.md`](./MicroMax/OS/README.md) |
| MicroMax/OS Client | Browser/Rust-based control + flashing helper | [`MicroMax/OS Client/README.md`](./MicroMax/OS%20Client/README.md) |
| IOT | KiCad schematics + PCB layout | [`IOT/README.md`](./IOT/README.md) |
| conductor | Product context, tracks, and workflow docs | [`conductor/README.md`](./conductor/README.md) |

## Quick Start

### 1) Clone

```powershell
git clone <repo-url> APEX
cd APEX
```

### 2) Run the dashboard

```powershell
cd .\Core\RAM
npm install
npm run dev
```

### 3) Build firmware

```powershell
cd ..\..\MicroMax\OS
platformio run -e uno
platformio run -e pico
```

## Common Commands

```powershell
# Core/RAM
cd .\Core\RAM
npm run dev
npm run build
npm run lint

# Core/CLI
cd ..\CLI
bun run dev
bun run build

# MicroMax firmware
cd ..\..\MicroMax\OS
platformio run -e uno
platformio run -e pico
platformio run -e uno -t upload --upload-port COM4

# MicroMax OS Client (Rust server)
cd "..\OS Client"
cargo run
```

## Documentation

- Architecture overview: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- Agent capability notes: [`AGENT.md`](./AGENT.md)
- Workflow and planning system: [`conductor/index.md`](./conductor/index.md)
- Conductor module guide: [`conductor/README.md`](./conductor/README.md)

