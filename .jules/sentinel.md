## 2025-03-01 - JSON-LD XSS Prevention
**Vulnerability:** Potential Cross-Site Scripting (XSS) when embedding JSON-LD in `<script>` tags using `dangerouslySetInnerHTML`. An attacker-controlled string containing `</script>` could terminate the script block and execute arbitrary scripts.
**Learning:** Standard `JSON.stringify` does not escape `<` characters, which are problematic inside HTML script tags.
**Prevention:** Use the `safeJsonStringify` utility (in `app/lib/security.ts`) which escapes `<` as `\u003c`. This ensures the JSON is safe to embed directly in HTML while remaining valid JSON-LD.

## 2025-03-02 - Authentication and Input Limits for AI APIs
**Vulnerability:** Publicly accessible AI generation endpoints can lead to credit exhaustion and potential denial of service (DoS) through large input payloads.
**Learning:** Even if inputs are validated against a whitelist, the absence of rate limiting or authentication allows malicious actors to burn through API quotas.
**Prevention:** Require authentication for resource-intensive endpoints (like AI generation) and enforce strict limits on input size (e.g., maximum number of ingredients) to minimize impact.
