import { useState, useRef, useEffect } from "react";

export default useIntersectionObserver = (options) => {
  let containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let element = containerRef.current;
    if (!element) return;

    const overserver = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    overserver.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options]);
  return [containerRef, isVisible];
};
