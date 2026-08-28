# Content Security Policy (CSP)

## The short answer

A response header telling the browser **which sources are allowed to load and
execute**. It is a **second line of defence**: it turns many XSS bugs from
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

CSP does not stop the injection happening. It stops the injected code **running**
— so you still have to fix the underlying bug.

## Why nonces beat host allow-lists

The obvious approach is listing trusted hosts:

```http
script-src 'self' https://cdn.example      # ✗ weaker than it looks
```

The problem: most large CDNs host *something* exploitable — an old AngularJS
build, a JSONP endpoint, a library with a known gadget. An attacker who can
inject a `<script src>` pointing at an allowed host can often achieve execution
anyway. Host allow-lists have been bypassed this way repeatedly in published
research.

A **nonce** is a fresh random value generated **per response** and echoed on
each legitimate script:

```html
<script nonce="r4nd0m">/* runs */</script>
<script>/* injected by an attacker — no nonce — blocked */</script>
```

The attacker cannot guess it, and cannot read it from the page before their
payload is parsed. That is why nonce-based (or hash-based) policies are the
modern recommendation.

## The directives people forget

**`frame-ancestors 'none'`** — the modern replacement for `X-Frame-Options`.
Stops your page being iframed, which is the clickjacking defence.

**`base-uri 'self'`** — without it, an injected `<base href="https://evil.com">`
retargets **every relative script URL** on the page. That defeats a nonce policy
entirely, because your own scripts now load from the attacker's host with valid
nonces. This is the single most commonly missing directive.

**`object-src 'none'`** — legacy plugin vectors (Flash-era, but still a gadget).

## Rolling it out safely

```http
Content-Security-Policy-Report-Only: …; report-to csp-endpoint
```

Report-only mode **reports violations without blocking anything**. Deploy it,
collect reports for a week, fix what would have broken, then enforce.

Going straight to enforcement on a real site reliably breaks inline handlers,
analytics snippets and third-party widgets you had forgotten about.

## The directive that defeats the whole thing

```http
script-src 'self' 'unsafe-inline'     # ✗ this is the thing XSS uses
```

`'unsafe-inline'` permits exactly the inline `<script>` an XSS injects. A policy
containing it provides essentially no XSS protection — and it is depressingly
common, usually added to make an inline analytics snippet work.

Note that when a nonce or hash is present, modern browsers **ignore
`'unsafe-inline'`**, which is a deliberate migration path.

## Traps

- **A nonce must be regenerated per response.** A static nonce is just a password
  the attacker can read from the page source.
- **`'strict-dynamic'`** lets a trusted script load further scripts, which is how
  you support bundlers/loaders without listing every host.
- CSP does not stop the payload being **stored** in your database — fix the
  injection too.

## How to answer this out loud

"CSP tells the browser which sources may load and execute, so it's defence in
depth — it turns many XSS bugs inert rather than preventing the injection. I'd
use a nonce-based policy rather than a host allow-list, because large CDNs
usually host something exploitable and allow-lists have been bypassed
repeatedly. The two directives people forget are `frame-ancestors` for
clickjacking and `base-uri`, without which an injected `<base>` tag retargets
every relative script and defeats your nonces. And I'd roll it out in
report-only mode first."

## Follow-ups to expect

- *What is `'strict-dynamic'`?* Trust propagates from a nonce'd script to scripts
  it loads — makes CSP workable with bundlers.
- *Does CSP stop CSRF?* No — different problem; use SameSite cookies and tokens.
- *Where do you get violation reports?* `report-to` / `report-uri`, into your own
  endpoint or a service.
