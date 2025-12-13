import { useEffect, useRef } from "react";

function usePrevious(value) {
  // 1. Create a "Box" to hold the value
  const ref = useRef();

  // 2. Update the box AFTER the render finishes
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only run when value changes

  // 3. Return the current content of the box
  // CRITICAL: This return happens BEFORE the useEffect updates the ref.
  // So it returns the OLD value.
  return ref.current;
}
