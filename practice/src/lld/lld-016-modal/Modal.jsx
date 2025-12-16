import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  onPrimary,
  primaryText = "Save",
  secondaryText = "Cancel",
  showClose = true,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleMouseDown = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        {showClose && (
          <button className="close" onClick={onClose}>×</button>
        )}

        <h3>{title}</h3>

        <div className="content">{children}</div>

        <div className="actions">
          <button onClick={onClose}>{secondaryText}</button>
          <button onClick={onPrimary}>{primaryText}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
