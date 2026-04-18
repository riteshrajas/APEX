# Specification: Apex Mobile Client

## Overview
The Apex Mobile Client is an Android application that serves as a remote control for the APEX ecosystem on a laptop. It allows users to issue natural-language tasks (voice/text) to their laptop, manage files, run commands, and monitor progress remotely via a secure cloud proxy.

## Functional Requirements
- **Secure Remote Connectivity:** Connect to the laptop from anywhere using a secure cloud proxy (e.g., via a relay server or tunnel).
- **Natural Language Interaction:**
    - Support for text-based command input.
    - Integration with **ElevenLabs SDK** for high-fidelity, low-latency conversational voice input and synthesis.
- **Remote Execution:**
    - Trigger app launches on the host laptop.
    - Retrieve and display file lists or specific file content.
    - Execute shell commands and stream real-time output/progress to the mobile UI.
- **Safety & Approval Workflow:**
    - Push notifications for sensitive actions requiring user approval.
    - Interactive "Approve/Reject" controls within the app.
- **Real-time Monitoring:** Dashboard view showing active tasks, system resource usage, and agent status.

## Non-Functional Requirements
- **Low Latency:** Optimized for fast response times, especially for voice commands.
- **Security:** End-to-end encryption for all remote communication between the mobile client and the host laptop.
- **Aesthetic:** Minimalist Modern UI (Material 3) for a clean, accessible user experience.

## Acceptance Criteria
- [ ] User can successfully pair the Android app with their laptop.
- [ ] User can issue a text command and see it execute on the laptop.
- [ ] User can use voice (ElevenLabs) to trigger a laptop task.
- [ ] A "sensitive" command on the laptop prompts an approval dialog on the phone.
- [ ] Laptop command output is streamed back to the mobile UI with minimal delay.

## Out of Scope
- iOS/Web support for the mobile client in this track.
- Direct hardware (microcontroller) control from the phone (must go through the laptop/host).