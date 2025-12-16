# Modal System with Priority Queue

## Problem Statement

Build a **Modal System** with priority-based rendering that can manage multiple modals simultaneously. This pattern is essential for complex applications where different UI elements (alerts, confirmations, forms) may need to interrupt each other based on importance.

This pattern is essential for:
- Alert and notification systems
- Confirmation dialogs
- Form wizards and multi-step flows
- Error handling UIs
- Authentication prompts
- System-level warnings

---

## Requirements

### Functional Requirements

1. **Modal Rendering**
   - Display modal with overlay backdrop
   - Support title, content, and action buttons
   - Allow close button (optional via prop)

2. **Priority Queue System**
   - Each modal has a priority level (higher = more important)
   - When opening a new modal, filter out lower priority modals
   - Higher priority modals take precedence

3. **Modal Management**
   - Open modals programmatically via context
   - Close specific modal by ID
   - Close all modals at once
   - Support multiple simultaneous modals

4. **Action Buttons**
   - Primary action button (e.g., Confirm, Submit)
   - Secondary action button (e.g., Cancel, Back)
   - Custom onClick handlers for each action

5. **Nested Modals**
   - Open new modals from within existing modals
   - Navigate back to previous modal (if priority allows)

### Non-Functional Requirements

- Accessible overlay with proper focus management
- Smooth transitions (optional CSS)
- Memory-efficient context state
- Clean separation of concerns (Context, Component, Root)

---

## Visual Representation

```
Initial State (No Modal):
+------------------------------------------+
|                                          |
|     [ Open Low Modal ]                   |
|                                          |
+------------------------------------------+

Low Priority Modal Open (priority: 1):
+------------------------------------------+
|  +------------------------------------+  |
|  |       X (close button)             |  |
|  |                                    |  |
|  |    Low Priority Modal              |  |
|  |    ----------------------          |  |
|  |    Low priority content            |  |
|  |                                    |  |
|  |                    [ Escalate ]    |  |
|  +------------------------------------+  |
+------------------------------------------+
        ↑ Semi-transparent overlay

High Priority Modal (priority: 10) replaces low:
+------------------------------------------+
|  +------------------------------------+  |
|  |       X (close button)             |  |
|  |                                    |  |
|  |    High Priority Modal             |  |
|  |    -----------------------         |  |
|  |    High priority content           |  |
|  |                                    |  |
|  |         [ Back ]    [ Confirm ]    |  |
|  +------------------------------------+  |
+------------------------------------------+

Multiple Modals (stacked, same priority):
+------------------------------------------+
|  +----------------------------------+    |
|  | Modal 1                          |    |
|  +----------------------------------+    |
|     +----------------------------------+ |
|     | Modal 2 (on top)                 | |
|     +----------------------------------+ |
+------------------------------------------+
```

---

## Key Concepts & Intuition

### 1. Context API for Global State

```javascript
const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
    const [modal, setModal] = useState([]);

    // Modal operations...

    return (
        <ModalContext.Provider value={{ modal, openModal, closeModal, closeAll }}>
            {children}
        </ModalContext.Provider>
    );
}
```

**Why Context?**
- Modals need to be triggered from anywhere in the app
- Avoids prop drilling through component tree
- Centralized state management for all modals
- Clean API via custom hook (`useModal`)

### 2. Priority Queue Pattern

```javascript
const openModal = (modal) => {
    setModal((prev) => {
        // Filter out modals with lower priority
        const filtered = prev.filter(m => m.priority >= modal.priority);
        return [...filtered, modal];
    });
};
```

**Key insight:** When a high-priority modal opens, it dismisses all lower-priority modals. This ensures critical alerts (errors, confirmations) always take precedence.

### 3. Component Architecture

```
ModalProvider (Context)
    ├── Page (Consumer - opens modals)
    └── ModalRoot (Renderer - displays modals)
            └── Modal (Presentational)
```

**Separation of Concerns:**
- `ModalProvider`: State management
- `ModalRoot`: Maps state to UI
- `Modal`: Pure presentational component

### 4. Imperative API Design

```javascript
openModal({
    id: "confirm-delete",
    title: "Confirm Delete",
    priority: 10,
    children: "Are you sure?",
    primaryAction: {
        label: "Delete",
        onClick: handleDelete
    },
    secondaryAction: {
        label: "Cancel",
        onClick: () => closeModal("confirm-delete")
    }
});
```

**Why imperative?** More flexible than declarative modals. Can be triggered from event handlers, async operations, or anywhere in the code.

### 5. Nested Modal Navigation

```javascript
primaryAction: {
    label: "Escalate",
    onClick: () => {
        openModal({
            id: "high",
            priority: 10,
            // ...
            secondaryAction: {
                label: "Back",
                onClick: () => closeModal("high")
            }
        });
    }
}
```

**Pattern:** Each modal can open another. The "Back" button closes current modal, revealing the previous one (if it wasn't filtered by priority).

---

## Implementation Tips

### 1. Modal Identification

```javascript
// Use unique IDs to manage specific modals
openModal({ id: "user-profile", ... });
closeModal("user-profile");

// Without IDs, you can't close specific modals
```

### 2. Overlay Click to Close

```javascript
<div className="overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal content */}
    </div>
</div>
```

**Why stopPropagation?** Clicking inside modal shouldn't close it; only clicking overlay should.

### 3. Portal Rendering (Advanced)

```javascript
import { createPortal } from 'react-dom';

function ModalRoot() {
    return createPortal(
        <>{/* modals */}</>,
        document.getElementById('modal-root')
    );
}
```

**Why Portals?** Renders modals outside component tree, avoiding z-index and overflow issues.

### 4. ESC Key to Close

```javascript
useEffect(() => {
    const handleEsc = (e) => {
        if (e.key === 'Escape') closeTopModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
}, []);
```

---

## Common Interview Questions

### Q1: Why use Context instead of Redux/Zustand?

**Answer:** For modal state, Context is often sufficient. Modals don't have complex state transitions or need middleware. Context provides a clean, built-in solution without external dependencies. For very complex modal workflows (multi-step wizards with undo), a state machine or Redux might be better.

### Q2: How would you handle focus trapping?

```javascript
useEffect(() => {
    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const trapFocus = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    modal.addEventListener('keydown', trapFocus);
    return () => modal.removeEventListener('keydown', trapFocus);
}, []);
```

### Q3: How would you animate modal enter/exit?

```javascript
// CSS approach
.modal {
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

// For exit animations, use libraries like framer-motion
// or manage animation state before removing from DOM
```

### Q4: How would you prevent body scroll when modal is open?

```javascript
useEffect(() => {
    if (modal.length > 0) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }

    return () => {
        document.body.style.overflow = '';
    };
}, [modal.length]);
```

### Q5: How would you implement a confirmation modal hook?

```javascript
const useConfirmation = () => {
    const { openModal, closeModal } = useModal();

    const confirm = (message) => {
        return new Promise((resolve) => {
            openModal({
                id: 'confirmation',
                title: 'Confirm',
                priority: 100,
                children: message,
                primaryAction: {
                    label: 'Yes',
                    onClick: () => {
                        closeModal('confirmation');
                        resolve(true);
                    }
                },
                secondaryAction: {
                    label: 'No',
                    onClick: () => {
                        closeModal('confirmation');
                        resolve(false);
                    }
                }
            });
        });
    };

    return { confirm };
};

// Usage
const { confirm } = useConfirmation();
const shouldDelete = await confirm('Delete this item?');
```

### Q6: How would you handle modal stacking with z-index?

```javascript
{modal.map((m, index) => (
    <Modal
        key={m.id}
        style={{ zIndex: 1000 + index }}
        {...m}
    />
))}
```

---

## Edge Cases to Consider

1. **Rapid open/close** - Multiple opens before state updates
2. **Same ID modals** - What happens if you open same ID twice?
3. **Memory leaks** - Cleanup event listeners on unmount
4. **Priority ties** - How to handle same priority modals
5. **Deep nesting** - Many nested modals (wizard flows)
6. **Form data loss** - Warn before closing modal with unsaved changes
7. **Mobile/responsive** - Full-screen modals on mobile
8. **Accessibility** - Screen reader announcements, ARIA attributes

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| openModal | O(n) | O(n) |
| closeModal | O(n) | O(n) |
| closeAll | O(1) | O(1) |
| Render modals | O(n) | O(n) |

Where n = number of open modals (typically very small)

---

## Performance Optimizations

### 1. Memoize Modal Component

```jsx
const MemoizedModal = React.memo(Modal);

// Prevents re-render when other modals change
```

### 2. Lazy Load Modal Content

```jsx
const LazyContent = React.lazy(() => import('./HeavyModalContent'));

<Modal>
    <Suspense fallback={<Spinner />}>
        <LazyContent />
    </Suspense>
</Modal>
```

### 3. Debounce Rapid Opens

```javascript
const debouncedOpen = useMemo(
    () => debounce(openModal, 100),
    [openModal]
);
```

---

## Real-World Applications

1. **Confirmation Dialogs** - Delete, logout, submit actions
2. **Authentication** - Login, 2FA prompts
3. **Form Wizards** - Multi-step signup, checkout
4. **Error Alerts** - API failures, validation errors
5. **Media Preview** - Image/video lightbox
6. **Settings Panels** - Preferences, account settings
7. **Help/Onboarding** - Tutorials, tooltips

---

## Related Patterns

- **Portal Pattern** - Render outside component tree
- **Compound Components** - Modal.Header, Modal.Body, Modal.Footer
- **Render Props** - Flexible modal content rendering
- **State Machine** - Complex modal flow management (XState)
- **Command Pattern** - Queue modal operations
