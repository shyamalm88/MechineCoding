import { useState, useRef } from "react";

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const timers = useRef({}); // id -> timeout

  const showNotification = (message, type = "info", ttl = 3000) => {
    const id = Date.now();

    const notification = {
      id,
      message,
      type,
    };

    setNotifications((prev) => [...prev, notification]);

    timers.current[id] = setTimeout(() => {
      removeNotification(id);
    }, ttl);
  };

  const removeNotification = (id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];

    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  return (
    <div className="container">
      <h2>🔔 Notification System</h2>

      <div className="buttons">
        <button onClick={() => showNotification("Success!", "success")}>
          Success
        </button>
        <button onClick={() => showNotification("Error occurred", "error")}>
          Error
        </button>
        <button onClick={() => showNotification("Info message", "info")}>
          Info
        </button>
      </div>

      <div className="toast-container">
        {notifications.map((n) => (
          <div key={n.id} className={`toast ${n.type}Bg`}>
            <span>{n.message}</span>
            <button onClick={() => removeNotification(n.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
