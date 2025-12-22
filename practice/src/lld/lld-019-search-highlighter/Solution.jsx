import { useState } from "react";

const TEXT = `React is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Meta. React uses a virtual DOM to efficiently update the real DOM. When state changes, React compares the new virtual DOM with the previous one and only updates the parts that actually changed. This process is called reconciliation. React components can be written as functions or classes, though functional components with hooks are now the preferred approach. Popular features include useState for state management, useEffect for side effects, and useContext for sharing data across components.`;

function Highlight({ text, query }) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  console.log(parts)
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} style={{ background: "#fef08a" }}>{part}</mark>
    ) : (
      part
    )
  );
}

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Search Highlighter</h2>

      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, fontSize: 16, width: 300 }}
      />

      <p style={{ lineHeight: 1.8, marginTop: 20 }}>
        <Highlight text={TEXT} query={query} />
      </p>
    </div>
  );
}
