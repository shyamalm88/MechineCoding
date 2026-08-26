import { useState } from 'react'
import './styles.css'

const STARS = [1, 2, 3, 4, 5]

export default function StarRating() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)

  // Hover wins while the pointer is over the widget; otherwise show what the
  // user actually committed.
  const active = hovered || rating

  return (
    <div className="sr-rating" onMouseLeave={() => setHovered(0)}>
      {STARS.map((value) => (
        <span
          key={value}
          className={value <= active ? 'sr-star sr-filled' : 'sr-star'}
          role="button"
          tabIndex={0}
          aria-label={`Rate ${value} out of 5`}
          onMouseEnter={() => setHovered(value)}
          onClick={() => setRating(value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') setRating(value)
          }}
        >
          ★
        </span>
      ))}
      <p className="sr-label">{rating ? `${rating} / 5` : 'No rating yet'}</p>
    </div>
  )
}
