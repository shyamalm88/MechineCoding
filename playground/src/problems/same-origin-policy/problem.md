# Same-Origin Policy and origin definition

## What an origin is

The **triple**: scheme + host + port.

| URL | Same origin as `https://app.example.com/a`? |
|---|---|
| `https://app.example.com/b` | Yes — path is irrelevant |
| `http://app.example.com/a` | No — different scheme |
| `https://app.example.com:8443/a` | No — different port |
| `https://api.example.com/a` | No — different host |
| `https://example.com/a` | No — subdomain counts |

Note "site" is a *looser* concept than "origin": `SameSite` cookies use
registrable domain, so `app.example.com` and `api.example.com` are the same
**site** but different **origins**.

## What it actually restricts

The policy blocks *reading* across origins, not embedding:

- **Blocked**: reading a cross-origin response body, touching another frame's
  DOM, reading its `localStorage`.
- **Allowed**: embedding `<img>`, `<script>`, `<link>`, `<iframe>`, and
  submitting forms. These are legacy affordances the web depends on — and they
  are precisely why CSRF exists.

That asymmetry is the key insight: you can *send* a cross-origin request and
cause a side effect, you just cannot *read* what came back.

## Controlled escapes

- **CORS** — the server opts in to letting JS read the response.
- **postMessage** — explicit, structured messaging between frames. Always check
  `event.origin`; a handler that trusts any sender is a vulnerability.
- **document.domain** — legacy, deprecated, and disabled by default now.
