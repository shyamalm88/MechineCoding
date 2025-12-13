import "./styles.css";
import { useEffect, useState } from "react";

export default function App() {
  const [order, setOrder] = useState([]);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const [config] = useState([
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ]);

  const handleDeactivatingCells = () => {
    setIsDeactivating(true);

    const timer = setInterval(() => {
      setOrder((prev) => {
        const newOrder = [...prev];
        newOrder.pop();
        if (newOrder.length == 0) {
          clearInterval(timer);
        }
        return newOrder;
      });
    }, 300);
  };

  const handleClick = (ev, index) => {
    if (isDeactivating || order.includes(index)) return;
    const newOrder = [...order, index];
    setOrder(newOrder);

    if (newOrder.length === 8) {
      handleDeactivatingCells();
    }
  };

  useEffect(() => {
    console.log(order);
  }, [order]);

  return (
    <div className="wrapper">
      <div className="gridWrapper">
        {config.flat().map((item, index) => {
          const isActive = order.includes(index);
          return item === 0 ? (
            <div key={index}></div>
          ) : (
            <div
              key={index}
              className="gridItem"
              style={{ background: isActive ? "green" : "white" }}
              onClick={(ev) => handleClick(ev, index)}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
