# Stepper Wizard

## Problem Statement

Build a multi-step form wizard (checkout flow) with a progress indicator, per-step validation, and a final review screen. Common in Salesforce, Adobe, and Flipkart rounds.

## Requirements

1. **4 steps** — Personal Info → Address → Payment → Review & Submit
2. **Step indicator** at the top showing done / active / pending states
3. **Per-step validation** — Next button disabled until required fields filled
4. **Back/Next navigation** — Back always enabled (except step 1), Next gated by validation
5. **Review step** — shows all collected data before final submit
6. **Success screen** after submit

## Key Interview Points

### Shared form state (single object, not per-step state)
```js
const [data, setData] = useState({ name: "", email: "", street: "", card: "" });
function update(field, value) {
  setData(prev => ({ ...prev, [field]: value }));
}
```
Why: keeps data alive when navigating back, avoids prop-drilling multiple setters.

### Validation per step
```js
function isStepValid(step, data) {
  if (step === 0) return data.name && data.email && data.phone;
  if (step === 1) return data.street && data.city;
  if (step === 2) return data.card && data.cvv;
  return true;
}
```

### Step indicator pattern
```jsx
// Circle: green checkmark if completed, blue if active, grey if pending
i < step ? "✓" : i + 1
background: i < step ? "green" : i === step ? "blue" : "grey"
```

### Connector line between steps
```jsx
{i < STEPS.length - 1 && (
  <div style={{ flex: 1, height: 2, background: i < step ? "green" : "grey" }} />
)}
```

## What interviewers look for

- Single shared form state (not 4 separate useState objects)
- Validation gates on Next, not just on submit
- Connector lines update correctly as steps complete
- Review step derived from shared state (no duplication)
- Clean separation: wizard shell vs. individual step components