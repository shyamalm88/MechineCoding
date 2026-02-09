import { useEffect, useState } from "react";

export default function App() {
  const [options, setOptions] = useState([
    { id: 1, vote: 0, label: "Blogs", color: "green" },
    { id: 2, vote: 0, label: "Forums", color: "red" },
    { id: 3, vote: 0, label: "Photos", color: "blue" },
    { id: 4, vote: 0, label: "Docs", color: "orange" },
  ]);
  const MAX_HEIGHT = 460;

  const totalSum = options.reduce((sum, o) => sum + o.vote, 0);

  const handleClick = (item) => {
    setOptions((prev) => {
      return prev.map((option) => {
        if (option.id === item.id) {
          return { ...option, vote: option.vote + 1 };
        } else {
          return option;
        }
      });
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          display: "flex",
        }}
      >
        {options.map((item) => {
          const percentage =
            totalSum === 0 ? 0 : Math.round((item.vote / totalSum) * 100);
          return (
            <div style={{ flexDirection: "column", gap: 10, display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  background: "#d7d7d7",
                  height: MAX_HEIGHT,
                  width: 50,
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    background: item.color,
                    height: `${percentage}%`,
                    width: "100%",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <label>{`${percentage}%`}</label>
                <button onClick={() => handleClick(item)}>Vote</button>
                <label>{item.label}</label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
