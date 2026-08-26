# Content Security Policy (CSP)

A response header that tells the browser which sources are allowed to load and
execute. It is a **second line of defence**: it turns many XSS bugs from
exploitable into inert.

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-r4nd0m';
  img-src 'self' data: https://cdn.example;
  connect-src 'self' https://api.example;
  frame-ancestors 'none';
  base-uri 'self'
```

## Why nonces beat allow-lists

`script-src 'self' https://cdn.example` looks safe until you realise most CDNs
host something with a JSONP endpoint or an old AngularJS build that can be
abused to execute arbitrary code. Host allow-lists have repeatedly been
bypassed this way.

A **nonce** — a fresh random value per response, echoed on each legitimate
`<script nonce="...">` — cannot be guessed by injected markup, so injected
scripts do not run.

## The directives people forget

- **`frame-ancestors 'none'`** — the modern replacement for
  `X-Frame-Options`, stopping clickjacking.
- **`base-uri 'self'`** — without it, an injected `<base>` tag can redirect
  every relative script URL to an attacker's host, defeating a nonce policy.
- **`object-src 'none'`** — legacy plugin vectors.

## Rolling it out

Start with `Content-Security-Policy-Report-Only` plus `report-to`. It reports
violations without breaking anything, letting you find what would break before
you enforce.

## Traps

- `'unsafe-inline'` in `script-src` defeats essentially the whole point.
- A nonce must be **regenerated per response**; a static nonce is just a
  password an attacker can read from the page source.
- CSP does not stop the XSS from being *stored* — it stops it executing. Fix
  the injection too.
