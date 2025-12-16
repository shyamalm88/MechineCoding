import { useState } from "react";

// Mock Data
const data = [
  { id: 1, title: "HTML" },
  { id: 2, title: "JavaScript" },
  { id: 3, title: "CSS" },
  { id: 4, title: "TypeScript" },
];

export default function TransferList() {
  // Location state
  const [leftItems, setLeftItems] = useState(data);
  const [rightItems, setRightItems] = useState([]);

  // Selection state (store IDs, not objects)
  const [checkedIds, setCheckedIds] = useState(new Set());

  /* -------------------- Helpers -------------------- */

  const toggleChecked = (id) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const intersection = (items) =>
    items.filter((item) => checkedIds.has(item.id));

  const difference = (items) =>
    items.filter((item) => !checkedIds.has(item.id));

  const clearChecked = (items) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      items.forEach((item) => next.delete(item.id));
      return next;
    });
  };

  /* -------------------- Actions -------------------- */

  const moveRight = () => {
    const selected = intersection(leftItems);
    if (selected.length === 0) return;

    setRightItems((prev) => [...prev, ...selected]);
    setLeftItems((prev) => difference(prev));
    clearChecked(selected);
  };

  const moveLeft = () => {
    const selected = intersection(rightItems);
    if (selected.length === 0) return;

    setLeftItems((prev) => [...prev, ...selected]);
    setRightItems((prev) => difference(prev));
    clearChecked(selected);
  };

  /* -------------------- UI -------------------- */

  return (
    <div style={styles.container}>
      <ItemList
        title="Available"
        items={leftItems}
        checkedIds={checkedIds}
        onToggle={toggleChecked}
      />

      <div style={styles.actions}>
        <button onClick={moveRight}>&gt;</button>
        <button onClick={moveLeft}>&lt;</button>
      </div>

      <ItemList
        title="Selected"
        items={rightItems}
        checkedIds={checkedIds}
        onToggle={toggleChecked}
      />
    </div>
  );
}

/* -------------------- Reusable List -------------------- */

function ItemList({ title, items, checkedIds, onToggle }) {
  return (
    <div style={styles.list}>
      <h4>{title}</h4>
      {items.map((item) => (
        <label key={item.id} style={styles.item}>
          <input
            type="checkbox"
            checked={checkedIds.has(item.id)}
            onChange={() => onToggle(item.id)}
          />
          <span style={{ marginLeft: 8 }}>{item.title}</span>
        </label>
      ))}
    </div>
  );
}

/* -------------------- Styles -------------------- */

const styles = {
  container: {
    display: "flex",
    gap: 20,
    alignItems: "center",
  },
  list: {
    border: "1px solid #ccc",
    padding: 10,
    width: 160,
    height: 220,
    overflowY: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    marginBottom: 6,
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};
