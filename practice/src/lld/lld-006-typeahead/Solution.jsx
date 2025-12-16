import { useState, useEffect, useRef } from "react";
import useDebounce from "./useDebounce";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [result, setResult] = useState([]);
  const cache = useRef(new Map());

  const debouncedTerm = useDebounce(inputValue, 1000);

  useEffect(() => {
    setError(false);
    setLoading(true);

    if (!debouncedTerm) {
      setResult([]);
      return;
    }

    if (cache.current.has(debouncedTerm)) {
      setResult(cache.current.get(debouncedTerm));
      setLoading(false);

      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      const url = "https://dummyjson.com/products/search?q=";
      try {
        const response = await fetch(url + debouncedTerm, { signal });
        const data = await response.json();
        setResult(data.products);
        cache.current.set(debouncedTerm, data.products);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Hi error")
          return;
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [debouncedTerm]);


  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="write here..."
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />
      <div
        style={{
          position: "absolute",
          padding: 20,
          border: "1px solid #ccc",
          width: "100%",
          borderRadius: "4px",
          display: result.length ? "flex" : "none",
          background: "#fbfbfbff"
        }}
      >
        {loading && <div>Loading...</div>}
        <ul style={{ padding: 0, margin: 0 }}>
          {result.map((item) => {
            return (
              <div style={{ padding: "10px 10px 10px 20px" }}>{item.title}</div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
