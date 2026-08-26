# OTP Input

## Problem Statement

Build a 6-digit OTP (One-Time Password) input component. It should behave like the input screens seen in Paytm, PhonePe, CRED, and Uber — individual boxes, auto-advancing focus, and paste support.

## Requirements

1. **6 individual input boxes** — one digit each
2. **Auto-focus next** — typing a digit moves focus to the next box automatically
3. **Backspace handling** — pressing Backspace on an empty box focuses the previous box
4. **Paste support** — pasting `123456` fills all boxes at once
5. **Digits only** — reject non-numeric input
6. **Verify button** — enabled only when all 6 boxes are filled

## Key Interview Points

### useRef for DOM access
```js
const inputs = useRef([]);
// Collect refs: ref={el => inputs.current[i] = el}
// Focus:        inputs.current[index].focus()
```

### Auto-advance on change
```js
if (value && index < OTP_LENGTH - 1) {
  inputs.current[index + 1].focus();
}
```

### Backspace → focus previous
```js
if (e.key === "Backspace" && !otp[index] && index > 0) {
  inputs.current[index - 1].focus();
}
```

### Paste handling
```js
function handlePaste(e) {
  e.preventDefault();
  const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
  // spread across state array, focus last filled box
}
```

## What interviewers look for

- Correct backspace + empty-box navigation
- Paste working across all boxes (not just the focused one)
- Not using `type="number"` (use `type="text" inputMode="numeric"`)
- Controlled inputs via state array, not individual `useState` per box