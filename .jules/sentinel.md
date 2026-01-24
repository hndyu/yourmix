## 2025-05-22 - Open Redirect in Authentication
**Vulnerability:** The `callbackUrl` search parameter in sign-in and sign-up flows was used directly in `router.push()` without validation, allowing redirects to malicious external domains.
**Learning:** Even when using robust auth libraries like `better-auth`, custom client-side redirection logic can introduce vulnerabilities if user-provided URLs are not sanitized.
**Prevention:** Always validate redirection targets. For internal redirects, strictly enforce that the URL starts with a single `/` and not `//`.
