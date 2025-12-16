import { useState } from "react";
import Modal from "./Modal";

export default function App() {
  const [modal, setModal] = useState(null);
  // modal = { priority, title, content, onPrimary, primaryText }

  const openModal = (newModal) => {
    setModal((current) => {
      if (!current || newModal.priority > current.priority) {
        return newModal;
      }
      return current;
    });
  };

  const closeModal = () => setModal(null);

  // Low priority: Settings modal
  const openSettings = () => {
    openModal({
      title: "Settings",
      priority: 1,
      content: (
        <div>
          <p>Configure your preferences:</p>
          <label>
            <input type="checkbox" /> Enable notifications
          </label>
          <br />
          <button
            style={{ marginTop: 10, color: "red" }}
            onClick={openDeleteConfirm}
          >
            Delete Account
          </button>
        </div>
      ),
      primaryText: "Save",
      onPrimary: () => {
        alert("Settings saved!");
        closeModal();
      },
    });
  };

  // High priority: Confirmation modal (triggered from within Settings)
  const openDeleteConfirm = () => {
    openModal({
      title: "⚠️ Confirm Delete",
      priority: 10,
      content: "Are you sure you want to delete your account? This cannot be undone.",
      primaryText: "Delete",
      onPrimary: () => {
        alert("Account deleted!");
        closeModal();
      },
    });
  };

  // Simulate async error (highest priority)
  const simulateError = () => {
    setTimeout(() => {
      openModal({
        title: "🚨 Connection Lost",
        priority: 100,
        content: "Unable to connect to server. Please check your internet connection.",
        primaryText: "Retry",
        onPrimary: () => {
          alert("Retrying...");
          closeModal();
        },
      });
    }, 2000);
    alert("Error will appear in 2 seconds (even if another modal is open)");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Modal Priority Demo</h2>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={openSettings}>Open Settings (Priority: 1)</button>
        <button onClick={simulateError}>Simulate Error in 2s (Priority: 100)</button>
      </div>
      <p style={{ marginTop: 10, color: "#666" }}>
        Try: Open Settings → Click "Delete Account" → High priority modal replaces it
      </p>

      <Modal
        isOpen={!!modal}
        title={modal?.title}
        onClose={closeModal}
        onPrimary={modal?.onPrimary || closeModal}
        primaryText={modal?.primaryText}
      >
        {modal?.content}
      </Modal>
    </div>
  );
}
