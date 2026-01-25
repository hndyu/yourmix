## 2025-03-01 - JSON-LD XSS Prevention
**Vulnerability:** Potential Cross-Site Scripting (XSS) when embedding JSON-LD in `<script>` tags using `dangerouslySetInnerHTML`. An attacker-controlled string containing `</script>` could terminate the script block and execute arbitrary scripts.
**Learning:** Standard `JSON.stringify` does not escape `<` characters, which are problematic inside HTML script tags.
**Prevention:** Use the `safeJsonStringify` utility (in `app/lib/security.ts`) which escapes `<` as `\u003c`. This ensures the JSON is safe to embed directly in HTML while remaining valid JSON-LD.
