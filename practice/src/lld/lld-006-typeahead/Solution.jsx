import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

function Typeahead() {
  const [result, setResults] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const debouncedSearchTerm = useDebounce(inputValue, 1000);

  

  useEffect(() => {
    // If empty, clear results and do nothing
    if (!debouncedSearchTerm) {
      setResults([]);
      return;
    }

    // 2. Create the AbortController for THIS specific request
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 3. Pass the 'signal' to the fetch call
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${debouncedSearchTerm}`,
          { signal } 
        );

        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        
        // 4. Update state only if we are still here (implicit success)
        setResults(data.products);
      } catch (err) {
        // 5. Handle "AbortError" separately
        if (err.name === 'AbortError') {
          console.log('Request cancelled for:', debouncedSearchTerm);
        } else {
          setError(err.message);
        }
      } finally {
        // Only turn off loading if NOT aborted (optional nuance, but safer)
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // 6. CLEANUP FUNCTION: This runs if 'debouncedSearchTerm' changes
    // or component unmounts. It cancels the PREVIOUS request.
    return () => {
      controller.abort();
    };
    
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products (e.g. 'phone')..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
    </div>
  );
}

export default Typeahead;
