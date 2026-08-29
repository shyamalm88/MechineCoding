import React, { useState, useEffect } from "react";

const START_MIN = 0;
const END_MIN = 24 * 60;
const DAY_RANGE = END_MIN - START_MIN;

const events = [
  { id: 1, title: "Meeting A", start: 9 * 60 + 30, end: 11 * 60 },
  { id: 2, title: "Meeting B", start: 10 * 60, end: 12 * 60 },
  { id: 3, title: "Meeting C", start: 13 * 60, end: 14 * 60 },
  { id: 4, title: "Meeting D", start: 13 * 60 + 30, end: 15 * 60 },
];

function layoutEvents(events) {
  const sorted = [...events].sort((a, b) => a.start - b.start);

  const result = [];
  let group = [];
  let maxEnd = -Infinity;

  for (const event of sorted) {
    // Same group if this event overlaps any event in the group.
    if (!group.length || event.start < maxEnd) {
      group.push(event);
      maxEnd = Math.max(maxEnd, event.end);
    } else {
      distribute(group, result);

      group = [event];
      maxEnd = event.end;
    }
  }

  // Distribute the final group.
  if (group.length) {
    distribute(group, result);
  }

  return result;
}

function distribute(group, result) {
  const width = 100 / group.length;

  group.forEach((event, index) => {
    result.push({
      ...event,
      width,
      left: index * width,
    });
  });
}

export default function CalendarDayView() {
  const laidOut = layoutEvents(events);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(id);
  }, []);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const showNow = currentMinutes >= START_MIN && currentMinutes <= END_MIN;

  const nowTop = ((currentMinutes - START_MIN) / DAY_RANGE) * 100;

  return (
    <div className="calendar-wrapper">
      <div className="time-column">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="time-label">
            {i}:00
          </div>
        ))}
      </div>

      <div className="calendar">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="hour-line" />
        ))}

        {showNow && (
          <div className="now-line" style={{ top: `${nowTop}%` }}>
            <div className="now-dot" />
          </div>
        )}

        {laidOut.map((event) => (
          <div
            key={event.id}
            className="event"
            style={{
              top: `${((event.start - START_MIN) / DAY_RANGE) * 100}%`,
              height: `${((event.end - event.start) / DAY_RANGE) * 100}%`,
              left: `${event.left}%`,
              width: `${event.width}%`,
            }}
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}
