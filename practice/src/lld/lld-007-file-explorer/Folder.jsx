import { useState } from "react";

export function Folder({ explorerData, handleInsertNode }) {
  const [expanded, setExpanded] = useState(false);
  const [createMode, setCreateMode] = useState(null); 
  // null | "folder" | "file"

  const isFolder = explorerData.isFolder;

  const icon = isFolder
    ? expanded ? "📂" : "📁"
    : "📄";

  const handleToggle = () => {
    setExpanded(prev => !prev);
  };

  const handleAdd = (e, type) => {
    e.stopPropagation();
    setExpanded(true);
    setCreateMode(type);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      handleInsertNode(
        explorerData.id,
        e.target.value,
        createMode === "folder"
      );
      setCreateMode(null);
    }
  };

  const handleBlur = () => {
    setCreateMode(null);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "350px",
          cursor: "pointer"
        }}
        onClick={handleToggle}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <span>{icon}</span>
          <span>{explorerData.name}</span>
        </div>

        {isFolder && (
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={(e) => handleAdd(e, "folder")}>
              Folder +
            </button>
            <button onClick={(e) => handleAdd(e, "file")}>
              File +
            </button>
          </div>
        )}
      </div>

      {expanded && (
        <div>
          {createMode && (
            <div style={{ display: "flex", gap: 5, paddingLeft: 20 }}>
              <span>{createMode === "folder" ? "📁" : "📄"}</span>
              <input
                type="text"
                autoFocus
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
              />
            </div>
          )}

          {explorerData.items.map((item) => (
            <div key={item.id} style={{ padding: "5px 10px" }}>
              <Folder
                explorerData={item}
                handleInsertNode={handleInsertNode}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
