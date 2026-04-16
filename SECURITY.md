# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in APEX, please **do not** open a public issue. Instead, please report it responsibly by emailing the project team.

Please include:
- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested remediation (if you have one)

We aim to acknowledge and begin investigating security reports within 24 hours.

## Security Best Practices

### For Contributors

1. **Never commit secrets** — API keys, credentials, or tokens should never be committed to the repository. Use environment variables instead.

2. **Protect hardware access** — Do not assume specific serial ports or device paths in code. Always prompt users to select their device.

3. **Validate serial protocol messages** — The Apex Serial Protocol (ASP) transmits JSON over USB. Always validate incoming messages for type safety and expected fields.

4. **Sanitize command execution** — When executing system commands, use parameterized APIs (e.g., \child_process.execFile\) rather than string concatenation.

5. **Keep dependencies updated** — Regularly run \
pm audit\ and \pip audit\ to check for vulnerabilities in dependencies. Update promptly when patches are available.

### For Users

1. **Use official releases** — Download APEX only from the official repository
2. **Verify firmware sources** — When flashing firmware to hardware, ensure you're using a trusted, verified build
3. **Protect your credentials** — If you use APEX with API keys or authentication tokens, keep them secure and rotate them regularly
4. **Report suspicious activity** — If you notice unusual behavior or suspect a compromise, report it immediately

## Dependency Security

APEX uses the following dependency management tools:
- **Node.js projects**: \
pm\ with security audits
- **Rust projects**: \cargo\ with advisory checks
- **Python (CLI testing)**: \pip\ with periodic security reviews

To check for vulnerabilities:

\\\ash
# Node.js
npm audit

# Rust (if applicable)
cargo audit

# Python
pip audit
\\\

## Hardware Security Considerations

1. **Serial Communication** — USB communication between Core/CLI and MicroMax uses an unencrypted JSON protocol. Run on trusted networks only.

2. **GPIO Control** — MicroMax firmware controls physical relays and GPIO. Ensure physical access to hardware is appropriately secured.

3. **Firmware Integrity** — Consider code signing or verification mechanisms for production deployments.

## Compliance

APEX is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Security Changelog

We will document significant security patches and their severity in release notes.

---

Thank you for helping keep APEX secure!
