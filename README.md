# APEX

**APEX** (Autonomous Physical-Digital Ecosystem) is a multi-module automation stack that connects high-level AI reasoning with physical hardware control. It combines a terminal agent runtime, a realtime dashboard, firmware, and hardware design assets in one workspace.

## Modules

| Module | Purpose | Docs |
| --- | --- | --- |
| Core | Software runtime layer | [Core/README.md](./Core/README.md) |
| Core/CLI | Terminal AI runtime and orchestration engine | [Core/CLI/README.md](./Core/CLI/README.md) |
| Core/RAM | Next.js dashboard and knowledge base | [Core/RAM/README.md](./Core/RAM/README.md) |
| MicroMax | Level 1 hardware execution layer | [MicroMax/README.md](./MicroMax/README.md) |
| MiniMax | Level 2 wireless node layer | [MiniMax/README.md](./MiniMax/README.md) |
| MegaMax | Level 3 cellular/global node layer | [MegaMax/README.md](./MegaMax/README.md) |
| IOT | KiCad schematics and PCB layout | [IOT/README.md](./IOT/README.md) |
| conductor | Product context, tracks, and workflow docs | [conductor/README.md](./conductor/README.md) |

## Quick Start

### 1. Clone

```powershell
git clone <repo-url> APEX
cd APEX
git submodule update --init --recursive
```

### 2. Run the dashboard

```powershell
cd .\Core\RAM
npm install
npm run dev
```

### 3. Build firmware

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

# MicroMax OS Client
cd "..\OS Client"
python -m http.server 4173
```

## Documentation

- Architecture overview: [ARCHITECTURE.md](./ARCHITECTURE.md)
- ASP v2.0 specification: [SPEC_ASP_V2.md](./SPEC_ASP_V2.md)
- Roadmap: [ROADMAP.md](./ROADMAP.md)
- Master setup guide: [MASTER_SETUP_GUIDE.md](./MASTER_SETUP_GUIDE.md)
- Node docs: [docs/MicroMax/DOCS.md](./docs/MicroMax/DOCS.md), [docs/MiniMax/DOCS.md](./docs/MiniMax/DOCS.md), [docs/MegaMax/DOCS.md](./docs/MegaMax/DOCS.md)
- Agent notes: [AGENT.md](./AGENT.md)
- Workflow and planning system: [conductor/index.md](./conductor/index.md)

## Community & Policies

- [Contributing](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
