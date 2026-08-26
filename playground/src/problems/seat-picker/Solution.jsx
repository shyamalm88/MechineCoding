import { useState } from "react";

const ROWS = ["A", "B", "C", "D", "E", "F", "G"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];
const PRICE_PER_SEAT = 250;

// Pre-booked seats (fixed so the grid looks realistic)
const BOOKED = new Set(["A3", "A7", "B2", "B5", "C4", "C8", "D1", "D6", "E3", "E5", "F2", "F7", "G4", "G6"]);

function getSeatStatus(id, selected) {
  if (BOOKED.has(id)) return "booked";
  if (selected.has(id)) return "selected";
  return "available";
}

const STATUS_STYLE = {
  available: { background: "#e8f5e9", borderColor: "#a5d6a7", color: "#333", cursor: "pointer" },
  selected:  { background: "#1976d2", borderColor: "#1565c0", color: "#fff", cursor: "pointer" },
  booked:    { background: "#e0e0e0", borderColor: "#bdbdbd", color: "#9e9e9e", cursor: "not-allowed" },
};

export default function App() {
  const [selected, setSelected] = useState(new Set());

  function toggleSeat(id) {
    if (BOOKED.has(id)) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  const sortedSelected = [...selected].sort();
  const total = selected.size * PRICE_PER_SEAT;

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 560 }}>
      <h2 style={{ marginBottom: 4 }}>Select Your Seats</h2>
      <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>
        Bengaluru → Mumbai · Express Bus · ₹{PRICE_PER_SEAT}/seat
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {[["Available", "#e8f5e9", "#a5d6a7"], ["Selected", "#1976d2", "#1565c0"], ["Booked", "#e0e0e0", "#bdbdbd"]].map(([label, bg, border]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 18, height: 18, background: bg, border: `2px solid ${border}`, borderRadius: 4 }} />
            <span style={{ fontSize: 13 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Column header */}
      <div style={{ display: "flex", gap: 6, marginBottom: 6, marginLeft: 28 }}>
        {COLS.map(c => (
          <div key={c} style={{ width: 44, textAlign: "center", fontSize: 12, color: "#999", fontWeight: 600 }}>
            {c}
          </div>
        ))}
      </div>

      {/* Seat grid */}
      {ROWS.map(row => (
        <div key={row} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <div style={{ width: 22, fontWeight: 700, fontSize: 14, color: "#555" }}>{row}</div>
          {COLS.map(col => {
            const id = `${row}${col}`;
            const status = getSeatStatus(id, selected);
            return (
              <button
                key={id}
                onClick={() => toggleSeat(id)}
                disabled={status === "booked"}
                title={status === "booked" ? `${id} — Booked` : `${id} — ₹${PRICE_PER_SEAT}`}
                style={{
                  width: 44, height: 40,
                  border: "2px solid",
                  borderRadius: 6,
                  fontSize: 11, fontWeight: 600,
                  transition: "background 0.1s, transform 0.1s",
                  ...STATUS_STYLE[status],
                }}
              >
                {id}
              </button>
            );
          })}
        </div>
      ))}

      {/* Booking summary */}
      <div style={{
        marginTop: 24, padding: 16, background: "#f8f9fa",
        borderRadius: 10, border: "1px solid #e0e0e0",
      }}>
        {selected.size === 0 ? (
          <p style={{ color: "#999", margin: 0 }}>No seats selected. Click a seat to select it.</p>
        ) : (
          <>
            <p style={{ margin: "0 0 8px" }}>
              <strong>Seats:</strong> {sortedSelected.join(", ")}
            </p>
            <p style={{ margin: "0 0 16px" }}>
              <strong>Total:</strong> ₹{total} ({selected.size} seat{selected.size !== 1 ? "s" : ""} × ₹{PRICE_PER_SEAT})
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => alert(`Booked: ${sortedSelected.join(", ")}\nTotal: ₹${total}`)}
                style={{ padding: "10px 28px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 15 }}
              >
                Book Now
              </button>
              <button
                onClick={clearSelection}
                style={{ padding: "10px 18px", background: "#fff", color: "#666", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}