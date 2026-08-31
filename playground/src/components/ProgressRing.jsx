/**
 * Completion ring for the current collection. Percentage counts only problems
 * where EVERY revision pass is ticked, so the ring fills when the work is
 * finished rather than merely started; the caption underneath carries the
 * finer-grained tick count.
 */
export default function ProgressRing({ done, total, ticks, totalTicks, percent }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius

  return (
    <div className="progress-ring">
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <circle className="ring-track" cx="28" cy="28" r={radius} />
        <circle
          className="ring-value"
          cx="28"
          cy="28"
          r={radius}
          strokeDasharray={circumference}
          // Offset shrinks as progress grows; rotated -90deg in CSS so it
          // starts at 12 o'clock rather than 3.
          strokeDashoffset={circumference * (1 - percent / 100)}
        />
        <text className="ring-text" x="28" y="28" textAnchor="middle" dominantBaseline="central">
          {percent}%
        </text>
      </svg>
      <div className="progress-caption">
        {/* Screen readers get one sentence instead of three loose numbers. */}
        <span className="sr-only">
          {done} of {total} problems fully revised, {ticks} of {totalTicks} boxes ticked.
        </span>
        <strong aria-hidden="true">{done}/{total}</strong>
        <span aria-hidden="true">revised</span>
        <span className="progress-ticks" aria-hidden="true">{ticks}/{totalTicks} boxes</span>
      </div>
    </div>
  )
}
