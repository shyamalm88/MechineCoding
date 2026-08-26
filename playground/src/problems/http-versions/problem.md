# HTTP/1.1 vs HTTP/2 vs HTTP/3

## HTTP/1.1

One request at a time per connection. Browsers work around this by opening
~6 parallel connections per origin, which is why "domain sharding" and
"concatenate everything into one bundle" were once best practice.

**Head-of-line blocking at the request level**: a slow response holds up
everything behind it on that connection.

## HTTP/2

- **Multiplexing**: many streams share one TCP connection, so bundling and
  sharding become counter-productive.
- **Header compression (HPACK)**: repeated headers stop costing full bytes.
- **Server push**: largely a failure in practice; removed from Chrome.

**But head-of-line blocking moved down to TCP.** All streams share one TCP
connection, so a single lost packet stalls *every* stream while it is
retransmitted — on a lossy mobile network HTTP/2 can be worse than HTTP/1.1.

## HTTP/3

Replaces TCP with **QUIC**, which runs over UDP and implements streams itself.
A lost packet now only stalls the stream it belonged to, finally eliminating
head-of-line blocking.

Also: TLS is built in (1-RTT handshake, 0-RTT on resumption), and connections
survive a network change — switching from Wi-Fi to cellular keeps the same
connection ID instead of starting over.

## The one-line summary

HTTP/2 fixed head-of-line blocking in HTTP; HTTP/3 fixed it in the transport.
