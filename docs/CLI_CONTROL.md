# APEX CLI PC Control

This adds a layered desktop automation CLI that can move the mouse, click buttons, type text, run hotkeys, scroll, and execute macro files.

## Layers
- **L1 Primitive Controls**: `move`, `click`, `type`, `hotkey`, `scroll`, `wait`
- **L2 Workflow Macros**: `macro --file <json>`
- **L3 Safety Guardrails**: dry-run by default; `--live` required for real actions.

## Quick Start

```bash
python3 cli/pc_control.py click --x 600 --y 420
python3 cli/pc_control.py type --text "hello world"
python3 cli/pc_control.py hotkey ctrl shift esc
```

The commands above run in dry-run mode unless `--live` is provided.

## Live Control

Install dependency:

```bash
pip install pyautogui
```

Then run:

```bash
python3 cli/pc_control.py --live click --x 500 --y 500 --button left --clicks 1
```

## Macro Example

Create `macro.json`:

```json
[
  {"action": "move", "x": 800, "y": 450, "duration": 0.2},
  {"action": "click", "button": "left", "clicks": 1},
  {"action": "type", "text": "APEX online", "interval": 0.03},
  {"action": "hotkey", "keys": ["ctrl", "s"]},
  {"action": "wait", "seconds": 0.5}
]
```

Run it:

```bash
python3 cli/pc_control.py --live macro --file macro.json
```

## Notes
- Keep your mouse near a corner if your OS uses fail-safe interrupts.
- Use dry-run first to validate intent before enabling `--live`.
