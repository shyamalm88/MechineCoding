import { useEffect } from "react";

function getFocusableElements(node) {
  return [
    ...node.querySelectorAll("button, a[href], input, select, textarea"),
  ].filter((el) => !el.disabled);
}

export function useFocusTrap(ref, isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    const node = ref.current;

    // Remember where focus was before opening
    const previousFocus = document.activeElement;

    // Move focus inside the dialog
    const items = getFocusableElements(node);

    if (items.length > 0) {
      items[0].focus();
    } else {
      node?.focus();
    }

    function handleKeyDown(e) {
      // Escape → close dialog
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // We only care about Tab
      if (e.key !== "Tab") return;

      // Find focusable elements again
      const items = getFocusableElements(node);

      // No focusable elements
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      // Shift + Tab on first → move to last
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }

      // Tab on last → move to first
      else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus to the element that opened the dialog
      previousFocus?.focus();
    };
  }, [isOpen, onClose, ref]);
}
