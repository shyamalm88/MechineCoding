import { useState } from "react";

const STEPS = ["Personal Info", "Address", "Payment", "Review & Submit"];

// ── Step components ──────────────────────────────────────────────────────────

function StepPersonal({ data, onChange }) {
  return (
    <div style={styles.fields}>
      <Field label="Full Name" value={data.name} onChange={v => onChange("name", v)} placeholder="Arjun Kumar" />
      <Field label="Email" value={data.email} onChange={v => onChange("email", v)} placeholder="arjun@example.com" type="email" />
      <Field label="Phone" value={data.phone} onChange={v => onChange("phone", v)} placeholder="+91 98765 43210" />
    </div>
  );
}

function StepAddress({ data, onChange }) {
  return (
    <div style={styles.fields}>
      <Field label="Street" value={data.street} onChange={v => onChange("street", v)} placeholder="123 MG Road" />
      <Field label="City" value={data.city} onChange={v => onChange("city", v)} placeholder="Bengaluru" />
      <Field label="Pincode" value={data.pincode} onChange={v => onChange("pincode", v)} placeholder="560001" />
    </div>
  );
}

function StepPayment({ data, onChange }) {
  return (
    <div style={styles.fields}>
      <Field label="Card Number" value={data.card} onChange={v => onChange("card", v)} placeholder="4242 4242 4242 4242" />
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Expiry" value={data.expiry} onChange={v => onChange("expiry", v)} placeholder="MM/YY" />
        </div>
        <div style={{ flex: 1 }}>
          <Field label="CVV" value={data.cvv} onChange={v => onChange("cvv", v)} placeholder="123" />
        </div>
      </div>
    </div>
  );
}

function StepReview({ data }) {
  const rows = [
    ["Name", data.name], ["Email", data.email], ["Phone", data.phone],
    ["Street", data.street], ["City", data.city], ["Pincode", data.pincode],
    ["Card", data.card ? `**** **** **** ${data.card.slice(-4)}` : "—"],
  ];
  return (
    <div>
      <p style={{ color: "#666", marginBottom: 16 }}>Please review your details before submitting.</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td style={{ padding: "8px 12px", color: "#666", fontWeight: 500, width: "40%" }}>{label}</td>
              <td style={{ padding: "8px 12px", color: "#1a1a1a" }}>{value || <span style={{ color: "#bbb" }}>—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Shared Field component ───────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 500, marginBottom: 6, color: "#444" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 12px", fontSize: 15,
          border: "1.5px solid #ccc", borderRadius: 6, outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── Validation per step ──────────────────────────────────────────────────────

function isStepValid(step, data) {
  if (step === 0) return data.name.trim() && data.email.trim() && data.phone.trim();
  if (step === 1) return data.street.trim() && data.city.trim() && data.pincode.trim();
  if (step === 2) return data.card.trim() && data.expiry.trim() && data.cvv.trim();
  return true; // Review step is always valid
}

// ── Main Wizard ──────────────────────────────────────────────────────────────

const INITIAL = { name: "", email: "", phone: "", street: "", city: "", pincode: "", card: "", expiry: "", cvv: "" };

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✓</div>
        <h2 style={{ color: "#2e7d32" }}>Order Placed!</h2>
        <p style={{ color: "#666" }}>Confirmation sent to {data.email}</p>
        <button onClick={() => { setSubmitted(false); setStep(0); setData(INITIAL); }} style={styles.btnSecondary}>
          Start Over
        </button>
      </div>
    );
  }

  const valid = isStepValid(step, data);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 540, margin: "0 auto" }}>
      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600,
                  background: i < step ? "#2e7d32" : i === step ? "#1976d2" : "#e0e0e0",
                  color: i <= step ? "#fff" : "#999",
                  transition: "background 0.2s",
                }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, marginTop: 4, color: i === step ? "#1976d2" : "#999", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? "#2e7d32" : "#e0e0e0", margin: "0 4px", marginBottom: 18 }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{ minHeight: 200 }}>
        {step === 0 && <StepPersonal data={data} onChange={update} />}
        {step === 1 && <StepAddress data={data} onChange={update} />}
        {step === 2 && <StepPayment data={data} onChange={update} />}
        {step === 3 && <StepReview data={data} />}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          style={step === 0 ? { ...styles.btnSecondary, opacity: 0.4, cursor: "not-allowed" } : styles.btnSecondary}
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!valid}
            style={!valid ? { ...styles.btnPrimary, opacity: 0.5, cursor: "not-allowed" } : styles.btnPrimary}
          >
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} style={styles.btnSuccess}>
            Place Order
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  fields: { display: "flex", flexDirection: "column" },
  btnPrimary: {
    padding: "10px 28px", background: "#1976d2", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 15,
  },
  btnSecondary: {
    padding: "10px 28px", background: "#f5f5f5", color: "#444",
    border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", fontSize: 15,
  },
  btnSuccess: {
    padding: "10px 28px", background: "#2e7d32", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 15,
  },
};