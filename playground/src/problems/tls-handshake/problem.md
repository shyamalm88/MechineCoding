# TLS handshake and HTTPS

## The short answer

TLS gives you three things, and naming them separately is what interviewers
listen for:

1. **Confidentiality** — traffic is encrypted
2. **Integrity** — tampering is detectable
3. **Authentication** — the certificate proves you are talking to the real host

Only the third involves certificates. People often describe HTTPS as "encrypted"
and stop there.

## The TLS 1.3 handshake — one round trip

```
Client ── ClientHello ─────────────────▶   versions, ciphers, KEY SHARE
       ◀── ServerHello, Certificate,  ──   key share, cert, Finished
           Finished
       ── Finished ────────────────────▶
       ◀═══ encrypted application data ═══▶
```

TLS 1.2 needed **two** round trips. 1.3 halves it by having the client send its
key share **optimistically** in the first message, guessing the algorithm.

On a 100ms-latency connection that is 200ms saved on every new connection —
which is why 1.3 adoption was such a visible performance win.

## Forward secrecy

TLS 1.3 removed RSA key exchange entirely in favour of **ephemeral
Diffie-Hellman**. The session key is generated per connection and never
transmitted.

The consequence: **stealing the server's private key later does not decrypt
past traffic**. With old RSA key exchange, an attacker who recorded traffic for
years and then obtained the key could decrypt all of it retroactively. That
property is called forward secrecy and it is a genuinely big deal.

## Asymmetric, then symmetric

Public-key cryptography is slow, so it is used **only to agree on a shared
key**. The actual data uses fast symmetric encryption (AES-GCM,
ChaCha20-Poly1305).

That hybrid is the core design: asymmetric for the handshake, symmetric for the
bulk.

## 0-RTT and its caveat

On resumption, TLS 1.3 can send application data in the **very first packet** —
zero round trips.

But 0-RTT data is **replayable**: an attacker who captures it can send it again,
and the server cannot distinguish. So it must only carry **idempotent** requests.
Never a purchase, never a transfer.

This is a favourite follow-up because it shows whether you understand the
trade-off rather than just the feature.

## Related headers

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Forces HTTPS for future visits, closing the window where a user types
`example.com`, gets an HTTP request, and can be intercepted before the redirect.
`preload` gets you into browsers' built-in list so even the *first* visit is
protected.

## Traps

**A certificate authenticates the server, not the site's honesty.** A phishing
site can have a perfectly valid certificate — the padlock means "you are talking
to who you think", not "this site is trustworthy". Users are routinely taught
the wrong lesson here.

**Mixed content**: one `http://` script on an HTTPS page compromises the whole
page, which is why browsers block it outright.

## How to answer this out loud

"TLS gives confidentiality, integrity and authentication — the certificate is
only the authentication part. TLS 1.3 does the handshake in one round trip
instead of two by sending the key share optimistically, and it dropped RSA key
exchange for ephemeral Diffie-Hellman, so you get forward secrecy: capturing the
server's key later doesn't decrypt recorded traffic. Public-key crypto is only
used to agree a shared key; the data itself uses fast symmetric encryption.
0-RTT resumption is a nice win but the data is replayable, so it's only safe for
idempotent requests."

## Follow-ups to expect

- *What is in a certificate?* The domain, public key, issuer, validity dates, and
  the CA's signature.
- *How does the browser trust it?* A chain up to a root CA in the OS/browser
  trust store.
- *What is SNI?* The hostname sent in the clear during the handshake, so one IP
  can serve many certificates — and a privacy leak that Encrypted Client Hello
  addresses.
