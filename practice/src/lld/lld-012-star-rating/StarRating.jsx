import { useState } from "react";
import "./styles.css";

export default function StarRating({ totalStars = 5, onChange }) {
  const [rating, setRating] = useState(0); // The clicked rating
  const [hover, setHover] = useState(0);   // The star currently being hovered

  return (
    <div className="star-container">
      {/* Create an array of length 'totalStars' */}
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1; // Convert 0-index to 1-based value

        return (
          <button
            key={starValue}
            className={`star ${starValue <= (hover || rating) ? "on" : "off"}`}
            onClick={() => {
              setRating(starValue);
              if (onChange) onChange(starValue);
            }}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            onDoubleClick={()=>{
                setRating(0);
                setHover(0);
                if (onChange) onChange(0);
            }}
          >
            <span className="star-icon">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
}