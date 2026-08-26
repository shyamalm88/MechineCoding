import { useState } from "react";

const initialBoard = {
  todo: [
    { id: 1, text: "Design UI" },
    { id: 2, text: "Write API" },
  ],
  inProgress: [
    { id: 3, text: "Build Kanban" },
  ],
  done: [
    { id: 4, text: "Setup Repo" },
  ],
};

const columns = [
  { key: "todo", title: "Todo" },
  { key: "inProgress", title: "In Progress" },
  { key: "done", title: "Done" },
];

export default function KanbanBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [dragged, setDragged] = useState(null);

  // ---------------- DRAG HANDLERS ----------------

  const onDragStart = (colKey, index) => {
    setDragged({ colKey, index });
  };

  const onDrop = (targetColKey, targetIndex) => {
    if (!dragged) return;

    const { colKey: sourceCol, index: sourceIndex } = dragged;

    if (sourceCol === targetColKey && sourceIndex === targetIndex) return;

    setBoard((prev) => {
      const next = { ...prev };

      const sourceList = [...next[sourceCol]];
      const [moved] = sourceList.splice(sourceIndex, 1);

      const targetList = [...next[targetColKey]];
      targetList.splice(targetIndex, 0, moved);

      next[sourceCol] = sourceList;
      next[targetColKey] = targetList;

      return next;
    });

    setDragged(null);
  };

  const onDragOver = (e) => e.preventDefault();

  // ---------------- CRUD ----------------

  const addCard = (colKey) => {
    const text = prompt("Card title?");
    if (!text) return;

    setBoard((prev) => ({
      ...prev,
      [colKey]: [...prev[colKey], { id: Date.now(), text }],
    }));
  };

  const deleteCard = (colKey, index) => {
    setBoard((prev) => ({
      ...prev,
      [colKey]: prev[colKey].filter((_, i) => i !== index),
    }));
  };

  // ---------------- UI ----------------

  return (
    <div className="kanban">
      {columns.map((col) => (
        <div
          key={col.key}
          className="column"
          onDragOver={onDragOver}
        >
          <h3>{col.title}</h3>

          {board[col.key].map((card, index) => (
            <div
              key={card.id}
              className="card"
              draggable
              onDragStart={() => onDragStart(col.key, index)}
              onDrop={() => onDrop(col.key, index)}
            >
              {card.text}
              <button
                className="delete"
                onClick={() => deleteCard(col.key, index)}
              >
                ✕
              </button>
            </div>
          ))}

          <button className="add" onClick={() => addCard(col.key)}>
            + Add
          </button>
        </div>
      ))}
    </div>
  );
}
