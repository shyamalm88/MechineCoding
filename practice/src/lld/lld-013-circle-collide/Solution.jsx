import { useRef, useState } from "react";
import "./styles.css";

export default function CircleCollide() {
  const [circles, setCircles] = useState([]);
  const containerRef = useRef(null);

  // Check if two circles overlap
  function isColliding(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < c1.r + c2.r;
  }

  function handleClick(e) {
    const rect = containerRef.current.getBoundingClientRect();

    const newCircle = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      r: 50,
      color: "blue"
    };

    setCircles(prevCircles => {
      const updatedCircles = [...prevCircles, newCircle];

      return updatedCircles.map(circle => {
        let hasCollision = false;

        for (let other of updatedCircles) {
          if (circle.id === other.id) continue;

          if (isColliding(circle, other)) {
            hasCollision = true;
            break;
          }
        }

        return {
          ...circle,
          color: hasCollision ? "red" : "blue"
        };
      });
    });
  }

  return (
    <div
      ref={containerRef}
      className="canvas"
      onClick={handleClick}
    >
      {circles.map(circle => (
        <div
          key={circle.id}
          className="circle"
          style={{
            left: circle.x - circle.r,
            top: circle.y - circle.r,
            width: circle.r * 2,
            height: circle.r * 2,
            background: circle.color
          }}
        />
      ))}
    </div>
  );
}
