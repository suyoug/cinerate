import { useState } from "react";

// An interactive 1–10 star rating widget.
// Calls onRate(score) when the user clicks a star.
export default function StarRating({ value, onRate, disabled }) {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const active = hover || value || 0;

  return (
    <div className={`star-rating ${disabled ? "disabled" : ""}`}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          className={n <= active ? "star filled" : "star"}
          onMouseEnter={() => !disabled && setHover(n)}
          onMouseLeave={() => !disabled && setHover(0)}
          onClick={() => !disabled && onRate(n)}
          aria-label={`Rate ${n} out of 10`}
        >
          ★
        </button>
      ))}
      {value ? <span className="your-score">Your rating: {value}/10</span> : null}
    </div>
  );
}
