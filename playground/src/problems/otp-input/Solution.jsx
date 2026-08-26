import { useRef, useState } from "react";

const OTP_LENGTH = 6;

export default function App() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [verified, setVerified] = useState(false);
  const inputs = useRef([]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value.slice(-1); // keep last char if browser fires with 2 chars
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1].focus();
    }
  }

  // Backspace on an empty box → focus previous box
  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  }

  // Paste: spread digits across boxes starting at focused box
  function handlePaste(e) {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = [...otp];
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setOtp(next);
    const lastFilled = Math.min(digits.length, OTP_LENGTH - 1);
    inputs.current[lastFilled].focus();
  }

  function handleVerify() {
    setVerified(true);
    setTimeout(() => setVerified(false), 2000);
  }

  function handleClear() {
    setOtp(Array(OTP_LENGTH).fill(""));
    setVerified(false);
    inputs.current[0].focus();
  }

  const value = otp.join("");
  const isComplete = value.length === OTP_LENGTH;

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 4 }}>OTP Verification</h2>
      <p style={{ color: "#666", marginBottom: 32 }}>
        Enter the 6-digit code sent to <strong>+91 98765 43210</strong>
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={{
              width: 52,
              height: 60,
              fontSize: 26,
              textAlign: "center",
              border: `2px solid ${digit ? "#1976d2" : "#ccc"}`,
              borderRadius: 10,
              outline: "none",
              transition: "border-color 0.15s",
              color: "#1a1a1a",
            }}
          />
        ))}
      </div>

      {verified ? (
        <p style={{ color: "#2e7d32", fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
          Verified successfully!
        </p>
      ) : (
        <button
          onClick={handleVerify}
          disabled={!isComplete}
          style={{
            padding: "12px 40px",
            fontSize: 16,
            background: isComplete ? "#1976d2" : "#e0e0e0",
            color: isComplete ? "#fff" : "#9e9e9e",
            border: "none",
            borderRadius: 8,
            cursor: isComplete ? "pointer" : "not-allowed",
            marginBottom: 12,
            display: "block",
            width: "100%",
          }}
        >
          Verify OTP
        </button>
      )}

      <button
        onClick={handleClear}
        style={{
          background: "none",
          border: "none",
          color: "#1976d2",
          cursor: "pointer",
          fontSize: 14,
          textDecoration: "underline",
        }}
      >
        Clear
      </button>

      <p style={{ marginTop: 24, color: "#999", fontSize: 13 }}>
        Didn't receive it?{" "}
        <span
          style={{ color: "#1976d2", cursor: "pointer" }}
          onClick={() => alert("OTP resent!")}
        >
          Resend OTP
        </span>
      </p>
    </div>
  );
}