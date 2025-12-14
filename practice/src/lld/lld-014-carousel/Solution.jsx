import { useState } from "react";
import "./styles.css";

export default function Carousel() {
  const items = ["Slide 1", "Slide 2", "Slide 3"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = items.length;

  function next() {
    setCurrentIndex((prev) => (prev + 1) % total);
  }

  function prev() {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }

  return (
    <div className="carousel-container">
        <div className="carousel">
        <button onClick={prev}>←</button>

        <div className="carousel-window">
            <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
            {items.map((item, index) => (
                <div className="carousel-item" key={index}>
                {item}
                </div>
            ))}
            </div>
        </div>

        <button onClick={next}>→</button>
        </div>
        <div className="dots">
            {items.map((_, index) => (
            <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
            />
            ))}
        </div>
    </div>
  );
}
