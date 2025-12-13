export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref || ref.current.contains(event.target)) {
        return;
      }

      handler(listener);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchdown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchdown", listener);
    };
  }, [ref, handler]);
}
