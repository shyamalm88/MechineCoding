import React, {useState, useEffect} from "react";
import "./styles.css";

const START_MIN = 0;   // 9:00 AM
const END_MIN = 24 * 60;    // 6:00 PM
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

  for (let event of sorted) {
    if (!group.length || overlaps(group[group.length - 1], event)) {
      group.push(event);
    } else {
      distribute(group, result);
      group = [event];
    }
  }
  if (group.length) distribute(group, result);

  return result;
}

function distribute(group, result) {
  const width = 100 / group.length;
  group.forEach((e, i) => {
    result.push({
      ...e,
      width,
      left: i * width,
    });
  });
}

function overlaps(a, b) {
  return a.end > b.start;
}


export default function CalendarDayView() {
  const laidOut = layoutEvents(events);
  const [now, setNow] = useState(new Date());


  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every minute

    return () => clearInterval(id);
  }, []);

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  const showNow =
    currentMinutes >= START_MIN &&
    currentMinutes <= END_MIN;

  const nowTop =
    ((currentMinutes - START_MIN) / DAY_RANGE) * 100;

  return (
    <div className="calendar-wrapper">
      {/* Time column */}
      <div className="time-column">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="time-label">
            {9 + i}:00
          </div>
        ))}
      </div>

      {/* Day column */}
      <div className="calendar">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="hour-line" />
        ))}

        {showNow && (
          <div
            className="now-line"
            style={{ top: `${nowTop}%` }}
          >
            <div className="now-dot" />
          </div>
        )}

        {laidOut.map((e) => (
          <div
            key={e.id}
            className="event"
            style={{
              top: `${((e.start - START_MIN) / DAY_RANGE) * 100}%`,
              height: `${((e.end - e.start) / DAY_RANGE) * 100}%`,
              left: `${e.left}%`,
              width: `${e.width}%`,
            }}
          >
            {e.title}
          </div>
        ))}
      </div>
    </div>
  );
}
