import { useEffect, useRef, useState } from "react";

class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const add = elapsed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + add);
    this.lastRefill = now;
  }

  allow() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

export default function TokenBucketDemo() {
  const bucketRef = useRef(new TokenBucket(5, 1));
  const [tokens, setTokens] = useState(5);
  const [logs, setLogs] = useState([]);

  const sendRequest = () => {
    const allowed = bucketRef.current.allow();
    setTokens(bucketRef.current.tokens.toFixed(2));

    setLogs((prev) => [
      `${allowed ? "✅ Allowed" : "❌ Blocked"} at ${new Date().toLocaleTimeString()}`,
      ...prev,
    ]);
  };

  // UI auto-refresh token count
  useEffect(() => {
    const id = setInterval(() => {
      bucketRef.current.refill();
      setTokens(bucketRef.current.tokens.toFixed(2));
    }, 500);

    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>🪣 Token Bucket Rate Limiter</h2>

      <p><b>Tokens:</b> {tokens}</p>
      <button onClick={sendRequest}>Send Request</button>

      <div style={{ marginTop: 16 }}>
        {logs.slice(0, 6).map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
