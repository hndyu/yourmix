## 2025-03-01 - JSON-LD XSS Prevention
**Vulnerability:** Potential Cross-Site Scripting (XSS) when embedding JSON-LD in `<script>` tags using `dangerouslySetInnerHTML`. An attacker-controlled string containing `</script>` could terminate the script block and execute arbitrary scripts.
**Learning:** Standard `JSON.stringify` does not escape `<` characters, which are problematic inside HTML script tags.
**Prevention:** Use the `safeJsonStringify` utility (in `app/lib/security.ts`) which escapes `<` as `\u003c`. This ensures the JSON is safe to embed directly in HTML while remaining valid JSON-LD.

## 2025-03-01 - AI API Resource Exhaustion Prevention
**Vulnerability:** Publicly accessible AI generation endpoints (e.g., Gemini API) can be abused by anonymous users, leading to significant costs or quota exhaustion. Additionally, lack of input validation on the number of ingredients can lead to oversized prompts.
**Learning:** Core AI features should be protected by authentication even if it impacts the anonymous user experience. Defensive limits on input size are essential for cost control and DoS prevention.
**Prevention:** Implement session-based authentication for all AI endpoints and enforce strict upper bounds on input data (e.g., max 10 ingredients).
