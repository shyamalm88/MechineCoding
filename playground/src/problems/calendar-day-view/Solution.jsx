import React, {useState, useEffect} from "react";

/**
 * ============================================================================
 * PROBLEM: Calendar Day View Layout
 * ============================================================================
 *
 * INTUITION:
 * We need to render events on a vertical timeline.
 * 1. Vertical Position (Top/Height): Determined by start/end time relative to the day boundaries.
 * 2. Horizontal Position (Left/Width): Determined by overlaps.
 *    - If events overlap, they must share the horizontal space to avoid visual collision.
 *    - A simple approach is to group overlapping events and divide width equally.
 *
 * ALGORITHM (Simple Grouping):
 * 1. Sort events by start time.
 * 2. Iterate through events and build "groups" of overlapping events.
 *    - If the current event overlaps with the previous one (or the group), add to current group.
 *    - If not, the group is complete. "Distribute" width among them and start a new group.
 * 3. Distribute:
 *    - Count N events in group.
 *    - Width = 100% / N.
 *    - Left = Index * Width.
 *
 * ============================================================================
 * DRY RUN
 * ============================================================================
 * Events: A (9:30-11:00), B (10:00-12:00), C (12:00-13:00)
 *
 * 1. Sort: A, B, C.
 * 2. Process A: Group is empty. Group = [A].
 * 3. Process B: Does A overlap B? (11:00 > 10:00) -> YES. Group = [A, B].
 * 4. Process C: Does B overlap C? (12:00 > 12:00) -> NO.
 *    - Distribute [A, B]:
 *      - A: width 50%, left 0%.
 *      - B: width 50%, left 50%.
 *    - Start new Group = [C].
 * 5. End: Distribute [C]:
 *    - C: width 100%, left 0%.
 * ============================================================================
 */

const START_MIN = 0;   // 9:00 AM (540 min)
const END_MIN = 24 * 60;    // 6:00 PM (1080 min)
const DAY_RANGE = END_MIN - START_MIN;

const events = [
  { id: 1, title: "Meeting A", start: 9 * 60 + 30, end: 11 * 60 },
  { id: 2, title: "Meeting B", start: 10 * 60, end: 12 * 60 },
  { id: 3, title: "Meeting C", start: 13 * 60, end: 14 * 60 },
  { id: 4, title: "Meeting D", start: 13 * 60 + 30, end: 15 * 60 },
];

function layoutEvents(events) {
  /**
   * Core idea:
   * We group events that overlap in time.
   * Overlap is determined against the *maximum end time* seen so far,
   * not just the previous event.
   */

  // Sort events by start time so we can sweep left → right
  const sorted = [...events].sort((a, b) => a.start - b.start);
  const result = [];

  // Current overlapping group
  let group = [];

  // Tracks the furthest end time of the current group.
  // This is the key invariant:
  // As long as next.start < maxEnd, it overlaps with *some* event in the group.
  let maxEnd = -Infinity;

  for (const event of sorted) {
    /**
     * Case 1: Start a new group OR continue the current overlapping group
     *
     * We continue the group if:
     *   event.start < maxEnd
     *
     * Why?
     * Because it overlaps with at least one event already in the group,
     * even if it does NOT overlap with the immediately previous event.
     */
    if (!group.length || event.start < maxEnd) {
      group.push(event);
      // Update the invariant for the group
      maxEnd = Math.max(maxEnd, event.end);
    } else {
      /**
       * Case 2: No overlap with the current group
       *
       * Finalize layout for the previous group,
       * then start a new group with this event.
       */
      distribute(group, result);
      group = [event];
      maxEnd = event.end;
    }
  }

  // Finalize the last group if it exists
  if (group.length) {
    distribute(group, result);
  }

  return result;
}

/**
 * Assigns horizontal layout for a group of overlapping events.
 *
 * All events in the group share equal width and are placed side-by-side.
 * This assumes vertical positioning is handled elsewhere.
 */
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

  // Update "Current Time" indicator every minute
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every minute

    return () => clearInterval(id);
  }, []);

  // Calculate "Now" line position
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
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="time-label">
            {0 + i}:00
          </div>
        ))}
      </div>

      {/* Day column */}
      <div className="calendar">
        {/* Background Grid Lines */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="hour-line" />
        ))}

        {/* Red "Current Time" Line */}
        {showNow && (
          <div
            className="now-line"
            style={{ top: `${nowTop}%` }}
          >
            <div className="now-dot" />
          </div>
        )}

        {/* Render Events */}
        {laidOut.map((e) => (
          <div
            key={e.id}
            className="event"
            style={{
              // Convert minutes to percentage of container height
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
