# Modal with Priority System

## Problem Statement

Build a **Modal Component** with a priority-based system that determines which modal should be displayed when multiple modals compete for visibility. Higher priority modals can replace lower priority ones, ensuring critical information (errors, confirmations) always takes precedence.

This pattern is essential for:
- Confirmation dialogs for dangerous actions
- System error alerts that must interrupt user flow
- Authentication prompts
- Multi-step workflows with nested confirmations

---

## Requirements

### Functional Requirements

1. **Modal Display**
   - Show modal with overlay backdrop
   - Display title, content, and action buttons
   - Close on overlay click or ESC key
   - Prevent body scroll when open

2. **Priority System**
   - Each modal has a priority level (number)
   - Higher priority modals replace lower priority ones
   - Lower priority modals cannot replace higher priority ones
   - Only one modal visible at a time

3. **Nested Modal Triggering**
   - Buttons inside a modal can trigger another modal
   - If new modal has higher priority, it replaces current
   - Example: Settings (priority 1) → Delete Confirm (priority 10)

4. **Async Modal Triggering**
   - Modals can be triggered by async events (API errors, timers)
   - High priority async modals interrupt any open modal

### Non-Functional Requirements

- Accessible (ESC to close, focus management)
- Portal rendering to avoid z-index issues
- Body scroll lock when modal is open
- Clean event listener cleanup

---

## Visual Representation

```
Initial State:
+------------------------------------------+
|                                          |
|  [ Open Settings ]  [ Simulate Error ]   |
|                                          |
+------------------------------------------+

Settings Modal Open (Priority: 1):
+------------------------------------------+
|  +------------------------------------+  |
|  |  Settings                      X   |  |
|  |  --------------------------------  |  |
|  |  Configure your preferences:       |  |
|  |  [x] Enable notifications          |  |
|  |                                    |  |
|  |  [ Delete Account ]  <- triggers   |  |
|  |                         priority 10|  |
|  |  --------------------------------  |  |
|  |          [ Cancel ]  [ Save ]      |  |
|  +------------------------------------+  |
+------------------------------------------+

After clicking "Delete Account" (Priority: 10 replaces 1):
+------------------------------------------+
|  +------------------------------------+  |
|  |  ⚠️ Confirm Delete             X   |  |
|  |  --------------------------------  |  |
|  |  Are you sure you want to delete   |  |
|  |  your account? This cannot be      |  |
|  |  undone.                           |  |
|  |  --------------------------------  |  |
|  |          [ Cancel ]  [ Delete ]    |  |
|  +------------------------------------+  |
+------------------------------------------+

Async Error Interrupts (Priority: 100):
+------------------------------------------+
|  +------------------------------------+  |
|  |  🚨 Connection Lost            X   |  |
|  |  --------------------------------  |  |
|  |  Unable to connect to server.      |  |
|  |  Please check your internet.       |  |
|  |  --------------------------------  |  |
|  |          [ Cancel ]  [ Retry ]     |  |
|  +------------------------------------+  |
+------------------------------------------+
```

---

## Key Concepts & Intuition

### 1. Priority-Based State Update

```javascript
const openModal = (newModal) => {
  setModal((current) => {
    // No modal open OR new modal has higher priority
    if (!current || newModal.priority > current.priority) {
      return newModal;
    }
    // Keep current modal (new one has lower/equal priority)
    return current;
  });
};
```

**Key insight:** Using functional state update ensures we compare against the latest state, avoiding race conditions.

### 2. Portal Rendering

```javascript
import ReactDOM from "react-dom";

return ReactDOM.createPortal(
  <div className="overlay">
    <div className="modal">{/* content */}</div>
  </div>,
  document.body
);
```

**Why Portals?**
- Renders modal at document body level
- Avoids z-index conflicts with parent components
- Overlay covers entire viewport reliably

### 3. Click Outside to Close

```javascript
const modalRef = useRef(null);

const handleMouseDown = (e) => {
  if (modalRef.current && !modalRef.current.contains(e.target)) {
    onClose();
  }
};

document.addEventListener("mousedown", handleMouseDown);
```

**Why mousedown instead of click?** Prevents issues where drag-selecting text accidentally closes the modal.

### 4. ESC Key Handler

```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [onClose]);
```

### 5. Body Scroll Lock

```javascript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  }
  return () => {
    document.body.style.overflow = "auto";
  };
}, [isOpen]);
```

---

## Implementation Tips

### 1. Modal Props Structure

```javascript
const modalConfig = {
  title: "Settings",
  priority: 1,
  content: <SettingsForm />,  // Can be JSX
  primaryText: "Save",
  onPrimary: handleSave,
};
```

### 2. Triggering Nested Modals

```javascript
// Inside a low-priority modal, trigger high-priority
<button onClick={() => openModal({
  title: "Confirm",
  priority: 10,  // Higher than parent
  content: "Are you sure?",
  onPrimary: handleConfirm,
})}>
  Delete
</button>
```

### 3. Async Modal Triggering

```javascript
// API error triggers modal regardless of what's open
fetch('/api/data').catch(() => {
  openModal({
    title: "Error",
    priority: 100,  // Always wins
    content: "Request failed",
  });
});
```

### 4. Priority Guidelines

| Priority | Use Case |
|----------|----------|
| 1-10 | Normal UI modals (settings, forms) |
| 11-50 | Confirmations (delete, submit) |
| 51-99 | Warnings (unsaved changes) |
| 100+ | System errors (connection lost, auth expired) |

---

## Common Interview Questions

### Q1: Why use a single modal state instead of a stack/queue?

**Answer:** For most applications, only one modal should be visible at a time. A stack adds complexity for features rarely needed. If you need modal history (back button), then use an array:

```javascript
const [modals, setModals] = useState([]);
const currentModal = modals[modals.length - 1];
```

### Q2: How would you prevent closing a critical modal?

```javascript
<Modal
  isOpen={isOpen}
  onClose={modal.priority < 50 ? closeModal : undefined}
  showClose={modal.priority < 50}
>
```

High-priority modals can disable the close button and overlay click.

### Q3: How would you animate modal transitions?

```css
.modal {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### Q4: How would you handle form state when modal is replaced?

```javascript
// Option 1: Warn user before replacing
const openModal = (newModal) => {
  setModal((current) => {
    if (current?.hasUnsavedChanges && newModal.priority <= current.priority) {
      // Show warning instead
      return current;
    }
    return newModal;
  });
};

// Option 2: Save form state before replacing
const openModal = (newModal) => {
  setModal((current) => {
    if (current) saveDraft(current);
    return newModal;
  });
};
```

### Q5: How would you add a "Go Back" feature?

```javascript
const [modalHistory, setModalHistory] = useState([]);

const openModal = (newModal) => {
  setModalHistory(prev => [...prev, modal]); // Save current
  setModal(newModal);
};

const goBack = () => {
  const previous = modalHistory[modalHistory.length - 1];
  setModalHistory(prev => prev.slice(0, -1));
  setModal(previous);
};
```

---

## Edge Cases to Consider

1. **Rapid clicks** - User clicks multiple triggers quickly
2. **Async race conditions** - Multiple API errors at same time
3. **Memory leaks** - Cleanup event listeners on unmount
4. **Focus management** - Return focus to trigger element on close
5. **Mobile keyboards** - Modal position when keyboard opens
6. **Long content** - Scrollable modal body
7. **Nested portals** - Modal inside modal edge cases

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| openModal | O(1) | O(1) |
| closeModal | O(1) | O(1) |
| Render | O(1) | O(1) |
| Event setup/cleanup | O(1) | O(1) |

---

## File Structure

```
lld-016-modal/
├── Modal.jsx        # Presentational component with portal
├── Solution.jsx     # App with priority logic & demo
├── styles.css       # Overlay and modal styles
└── problem.md       # This file
```

---

## Real-World Applications

1. **Confirmation Dialogs** - Delete, logout, destructive actions
2. **Error Alerts** - API failures, connection issues
3. **Auth Prompts** - Session expired, re-login required
4. **Form Wizards** - Multi-step with nested confirmations
5. **Media Lightbox** - Image/video preview
6. **Cookie Consent** - GDPR compliance banners

---

## Related Patterns

- **Portal Pattern** - Render outside React tree
- **Compound Components** - Modal.Header, Modal.Body, Modal.Footer
- **Context API** - Global modal state (for larger apps)
- **State Machine** - Complex modal flows (XState)
