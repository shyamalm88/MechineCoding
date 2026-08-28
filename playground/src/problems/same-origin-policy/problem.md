# Same-Origin Policy and origin definition

## The short answer

An **origin** is the triple: **scheme + host + port**. All three must match.

The Same-Origin Policy blocks a document from **reading** data from a different
origin. It does *not* block sending requests to one — and that asymmetry is the
entire reason CSRF exists.

## What counts as the same origin

Starting from `https://app.example.com/dashboard`:

| URL | Same origin? | Why |
|---|---|---|
| `https://app.example.com/settings` | ✓ | path is irrelevant |
| `http://app.example.com/dashboard` | ✗ | different **scheme** |
| `https://app.example.com:8443/` | ✗ | different **port** |
| `https://api.example.com/` | ✗ | different **host** — subdomains count |
| `https://example.com/` | ✗ | still a different host |

Two traps: **`http` and `https` are different origins**, and **a subdomain is a
different origin**. People routinely assume both are "the same site".

## Origin vs site

"Site" is a *looser* grouping than origin, based on the registrable domain:

```
https://app.example.com   ┐ same SITE (example.com)
https://api.example.com   ┘ different ORIGINs
```

`SameSite` cookies use **site**; the Same-Origin Policy uses **origin**. Mixing
them up leads to "why is my cookie being sent but my fetch is blocked?".

## What it actually restricts

**Blocked** — reading across origins:

- reading a cross-origin `fetch`/XHR response body
- touching another frame's DOM
- reading its `localStorage` or cookies
- reading pixels from a canvas tainted by a cross-origin image

**Allowed** — embedding and sending:

- `<img>`, `<script>`, `<link>`, `<iframe>`, `<video>`
- submitting a form to any origin

Those are legacy affordances the whole web depends on — you could not use a CDN
otherwise. But they mean **a malicious page can cause a request to your bank
with the user's cookies attached**; it just cannot read the response.

That is CSRF, and it is why CSRF protection is a separate concern from CORS.

## Worked example: why "it still hit my server" is expected

```html
<!-- on evil.com -->
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker" />
</form>
<script>document.forms[0].submit()</script>
```

The browser sends this **with the user's bank.com cookies**. The Same-Origin
Policy stops `evil.com` reading the response — it does nothing to stop the
transfer happening.

Defences: `SameSite=Lax/Strict` cookies, CSRF tokens, and checking the `Origin`
header server-side.

## The controlled escapes

- **CORS** — the server opts in to letting JS read the response.
- **postMessage** — explicit structured messaging between frames. **Always check
  `event.origin`**; a handler that trusts any sender is a real vulnerability.
- **`crossorigin` attribute** — lets you read errors from scripts and use
  cross-origin images in canvas, given the right headers.
- **`document.domain`** — legacy, deprecated, and disabled by default now.

## How to answer this out loud

"An origin is scheme, host and port — all three. `http` vs `https` and
`app.example.com` vs `api.example.com` are different origins, which surprises
people. The policy blocks *reading* across origins, not *sending*: you can still
embed a script or submit a form anywhere, which is exactly why CSRF exists and
why CSRF protection is separate from CORS. The controlled escapes are CORS for
reading responses and postMessage between frames — and with postMessage you must
check `event.origin`, otherwise any site can talk to your handler."

## Follow-ups to expect

- *Is SOP the same as CORS?* No — SOP is the restriction; CORS is the mechanism
  for relaxing it.
- *Why can I load an image cross-origin but not read its pixels?* Loading is
  allowed; reading taints the canvas unless CORS headers permit it.
- *What is `crossOriginIsolated`?* A stricter mode (COOP/COEP) required for
  `SharedArrayBuffer` and high-resolution timers.
