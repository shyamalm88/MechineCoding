# TLS handshake and HTTPS

## What TLS provides

Three things, and interviewers like them named separately:

1. **Confidentiality** — traffic is encrypted.
2. **Integrity** — tampering is detectable.
3. **Authentication** — the certificate proves you are talking to the real host.

## TLS 1.3 handshake (1 round trip)

```
Client ── ClientHello ─────────────────▶   (versions, ciphers, key share)
       ◀── ServerHello, Certificate,  ──   (key share, cert, Finished)
           Finished
       ── Finished ────────────────────▶
       ◀═══ encrypted application data ═══▶
```

TLS 1.2 needed **two** round trips; 1.3 sends the key share optimistically in
the first message, halving handshake latency. It also removed RSA key exchange
entirely in favour of ephemeral Diffie-Hellman, which gives **forward secrecy** —
stealing the server's private key later does not decrypt past traffic.

## 0-RTT and its caveat

On resumption, 1.3 can send data in the very first packet. But 0-RTT data is
**replayable** by an attacker, so it must only carry idempotent requests —
never a purchase.

## Asymmetric then symmetric

Public-key crypto is slow, so it is used only to agree on a shared key; the
actual data uses fast symmetric encryption (AES-GCM, ChaCha20-Poly1305).

## Related headers

`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
forces HTTPS for future visits, closing the initial plaintext-redirect window.

## Traps

- The certificate authenticates the **server**, not the safety of the site — a
  phishing page can have a perfectly valid certificate.
- Mixed content: one `http://` script on an HTTPS page compromises the whole
  page and is blocked by browsers.
