import { useState, useRef } from "react";

const TABS = [
  {
    id: "profile",
    label: "Profile",
    Content: () => (
      <div>
        <h3 style={{ marginTop: 0 }}>Your Profile</h3>
        <p><strong>Name:</strong> Arjun Kumar</p>
        <p><strong>Email:</strong> arjun@example.com</p>
        <p><strong>Role:</strong> Frontend Engineer</p>
      </div>
    ),
  },
  {
    id: "orders",
    label: "Orders",
    Content: () => (
      <div>
        <h3 style={{ marginTop: 0 }}>Recent Orders</h3>
        {["#ORD-001 — Laptop Stand", "#ORD-002 — Keyboard", "#ORD-003 — Monitor"].map(o => (
          <p key={o} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>{o}</p>
        ))}
      </div>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    Content: () => (
      <div>
        <h3 style={{ marginTop: 0 }}>Settings</h3>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" defaultChecked /> Email notifications
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <input type="checkbox" /> SMS alerts
        </label>
      </div>
    ),
  },
  {
    id: "billing",
    label: "Billing",
    Content: () => (
      <div>
        <h3 style={{ marginTop: 0 }}>Billing</h3>
        <p>Plan: <strong>Pro — ₹999/month</strong></p>
        <p>Next renewal: <strong>July 18, 2026</strong></p>
      </div>
    ),
  },
];

export default function App() {
  const [activeId, setActiveId] = useState("profile");
  // Track which tabs have been visited for lazy rendering
  const [visited, setVisited] = useState(() => new Set(["profile"]));
  const tabRefs = useRef({});

  function activate(id) {
    setActiveId(id);
    setVisited(prev => new Set([...prev, id]));
    tabRefs.current[id]?.focus();
  }

  // Keyboard navigation: ArrowLeft/Right cycle tabs, Home/End jump to ends
  function handleKeyDown(e) {
    const ids = TABS.map(t => t.id);
    const current = ids.indexOf(activeId);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      activate(ids[(current + 1) % ids.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      activate(ids[(current - 1 + ids.length) % ids.length]);
    } else if (e.key === "Home") {
      e.preventDefault();
      activate(ids[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      activate(ids[ids.length - 1]);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 600 }}>
      <h2 style={{ marginBottom: 20 }}>Account</h2>

      {/* Tab list with ARIA roles */}
      <div role="tablist" style={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
        {TABS.map(tab => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              ref={el => (tabRefs.current[tab.id] = el)}
              onClick={() => activate(tab.id)}
              onKeyDown={handleKeyDown}
              // Roving tabIndex: only the active tab is in the tab order
              tabIndex={isActive ? 0 : -1}
              style={{
                padding: "10px 20px",
                border: "none",
                background: "none",
                cursor: "pointer",
                borderBottom: isActive ? "2px solid #1976d2" : "2px solid transparent",
                color: isActive ? "#1976d2" : "#666",
                fontWeight: isActive ? 600 : 400,
                fontSize: 15,
                marginBottom: -2,
                outline: "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels — hidden via `hidden` attribute; content only mounts after first visit */}
      {TABS.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeId}
          style={{ padding: "20px 4px" }}
        >
          {visited.has(tab.id) ? <tab.Content /> : null}
        </div>
      ))}

      <p style={{ marginTop: 16, fontSize: 12, color: "#aaa" }}>
        Keyboard: ← → to switch tabs, Home / End to jump to first / last
      </p>
    </div>
  );
}