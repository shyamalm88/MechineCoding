import { useState } from "react";

// Mock Data
const data = [
  { id: 1, title: "HTML" },
  { id: 2, title: "JavaScript" },
  { id: 3, title: "CSS" },
  { id: 4, title: "TypeScript" },
];

export default function TransferList() {
  const [leftItems, setLeftItems] = useState(data);
  const [rightItems, setRightItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set()); // Using Set for O(1) lookup

  // 1. Helper: Toggle Checkbox
  const handleToggle = (item) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  // 2. Helper: Calculate Intersection (Items in 'list' that are also 'checked')
  const intersection = (list, checked) => {
    return list.filter(item => checked.has(item));
  };

  // 3. Helper: Calculate Difference (Items in 'list' that are NOT 'checked')
  const not = (list, checked) => {
    return list.filter(item => !checked.has(item));
  };

  // MOVE RIGHT Logic
  const handleMoveRight = () => {
    const leftChecked = intersection(leftItems, checkedItems);
    
    // Safety check: Don't move if nothing selected
    if (leftChecked.length === 0) return;

    setRightItems(prev => [...prev, ...leftChecked]);
    setLeftItems(prev => not(prev, checkedItems));
    
    // CRITICAL: Uncheck items after moving so they don't stay active in new list
    const newChecked = new Set(checkedItems);
    leftChecked.forEach(item => newChecked.delete(item));
    setCheckedItems(newChecked);
  };

  // MOVE LEFT Logic
  const handleMoveLeft = () => {
    const rightChecked = intersection(rightItems, checkedItems);
    
    if (rightChecked.length === 0) return;

    setLeftItems(prev => [...prev, ...rightChecked]);
    setRightItems(prev => not(prev, checkedItems));

    const newChecked = new Set(checkedItems);
    rightChecked.forEach(item => newChecked.delete(item));
    setCheckedItems(newChecked);
  };

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
      {/* LEFT LIST */}
      <ItemList 
        items={leftItems} 
        checked={checkedItems} 
        onToggle={handleToggle} 
      />

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={handleMoveRight}>&gt;</button>
        <button onClick={handleMoveLeft}>&lt;</button>
      </div>

      {/* RIGHT LIST */}
      <ItemList 
        items={rightItems} 
        checked={checkedItems} 
        onToggle={handleToggle} 
      />
    </div>
  );
}

// Reusable List Component
const ItemList = ({ items, checked, onToggle }) => (
  <div style={{ border: "1px solid #ccc", padding: "10px", width: "150px", height: "200px", overflow: "auto" }}>
    {items.map((item) => {
      const isChecked = checked.has(item);
      return (
        <div key={item.id} style={{ marginBottom: "5px" }}>
          <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isChecked}
              // Prevent clicking the label from triggering twice if logic is complex
              onChange={() => onToggle(item)} 
              tabIndex={-1} // Accessibility consideration
            />
            <span style={{ marginLeft: "8px" }}>{item.title}</span>
          </label>
        </div>
      );
    })}
  </div>
);