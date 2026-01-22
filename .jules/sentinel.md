## 2025-05-15 - [Open Redirect in Auth Flows]
**Vulnerability:** The `callbackUrl` parameter in sign-in, sign-up, and social login flows was not validated, allowing redirection to arbitrary external domains after authentication.
**Learning:** Next.js `useSearchParams()` returns decoded values, but developers may still accidentally check against encoded strings (e.g., `%2F...`), leading to broken logic. Centralizing URL validation in a utility function ensures consistent protection across all auth entry points.
**Prevention:** Always validate user-provided redirect URLs using a utility like `isValidCallbackUrl` that enforces relative paths (starting with `/` but not `//` or `/\`).
