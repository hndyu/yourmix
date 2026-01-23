## 2025-03-05 - Open Redirect and JSON-LD XSS Fixes

**Vulnerability:** Open Redirect in authentication flows via `callbackUrl` search parameter, and potential XSS in JSON-LD script blocks.

**Learning:**
1. `callbackUrl` was directly passed to `router.push()` without validation, allowing attackers to redirect users to malicious domains after sign-in.
2. `JSON.stringify()` does not escape `<` characters, which can lead to XSS if the resulting string is placed inside a `<script>` tag and contains user-controlled data (like cocktail names/descriptions from the database).

**Prevention:**
1. Always validate `callbackUrl` to ensure it is a safe relative path (starts with `/` but not `//`).
2. When embedding JSON in `<script>` tags (e.g., for JSON-LD), escape `<` characters as `\u003c` to prevent the browser from interpreting them as the start of a tag.
