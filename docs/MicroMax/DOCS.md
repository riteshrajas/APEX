# MicroMax (L1) DOCS

## Role
MicroMax is the wired, low-latency endpoint layer for direct actuator/sensor control.

## Hardware Scope
- Arduino Uno / Nano (ATmega328P)
- Raspberry Pi Pico (RP2040)
- ESP32 (wired mode)

## Transport Profile
- Primary transport: USB Serial
- ASP framing: newline-terminated JSON at 115200 baud (default)

## Hardware Setup & Flashing

### Environment
The firmware is built using **PlatformIO**. Ensure you have the PlatformIO CLI installed (`python -m pip install platformio`).

### Deployment Commands

#### Standard (Uno/Pico)
```powershell
cd MicroMax/OS
platformio run -e uno -t upload --upload-port COM4
```

#### ESP32-S3 (Custom Target)
If using an ESP32-S3 DevKit, use this command sequence to handle the board override and port selection:
```powershell
# In PowerShell:
$src='P:\APEX\MicroMax\OS\platformio.ini'; 
$tmp=Join-Path $env:TEMP 'apex-pio-esp32s3.ini'; 
(Get-Content $src -Raw) -replace '(?m)^board\s*=\s*esp32dev\s*$','board = esp32-s3-devkitc-1' | Set-Content $tmp -Encoding ascii; 
py -m platformio run -c $tmp -e esp32 -t upload --upload-port COM18
```

## ASP v2.0 Mapping
- Mandatory legacy compatibility fields:
  - `action`, `target`, `value`
  - `event`, `source`, `type`
  - `query` (heartbeat/identity)
- Recommended v2 envelope:
  - `v`, `id`, `ts`, `node`, `kind`

## Baseline Message Examples
```json
{"action":"WRITE","target":"D13","value":1}
{"event":"TRIGGER","source":"D2","type":"Interrupt"}
{"query":"WHO_ARE_YOU"}
```

## Reliability Expectations
- Heartbeat timeout handling should move outputs to safe state.
- Ack/error responses should include correlation where available (`id`/`ref`).

## Verification Checklist
- [ ] Serial command parser accepts legacy and envelope-based ASP frames
- [ ] Heartbeat timeout transitions to fail-safe
- [ ] Event and telemetry frames serialize as valid JSON lines
