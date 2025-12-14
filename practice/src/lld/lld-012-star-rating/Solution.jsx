import { useState } from "react";
import StarRating from "./StarRating";
import "./styles.css";

export default function App() {
  const [currentRating, setCurrentRating] = useState(0);

  const handleRatingChange = (newRating) => {
    console.log("User selected:", newRating);
    setCurrentRating(newRating);
  };

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>Rate this Product</h1>
      
      {/* Usage 1: Default 5 Stars */}
      <StarRating onChange={handleRatingChange} />
      
      <p>Current Rating: <strong>{currentRating}</strong> / 5</p>

      <hr />

      {/* Usage 2: Custom 10 Stars */}
      <h3>Rate your Uber Driver (10 scale)</h3>
      <StarRating totalStars={10} />
    </div>
  );
}