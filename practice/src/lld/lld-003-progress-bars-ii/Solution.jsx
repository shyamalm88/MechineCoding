/**
 * Progress Bars IV - CONCURRENT ANIMATION
 *
 * Key Concepts:
 * - State management with fine-grain progress tracking (0-100%)
 * - JavaScript-based animation (setInterval, NOT CSS transitions)
 * - Concurrency limit: max 3 bars fill at once
 * - Pause/resume support (preserve progress)
 *
 * Approach:
 * 1. State: Array of percentages [0, 35, 60, 100, ...]
 * 2. Animation loop: setInterval every 10ms, increment first 3 non-full bars by 0.5%
 * 3. Start: Begin interval, save timerId
 * 4. Pause: clearInterval(timerId), set timerId to null
 * 5. Add: Append 0 to progression array
 * 6. Reset: Set progression to [0], clear interval
 *
 * Time Complexity: O(n) per interval tick (find first 3 non-full bars)
 * Space Complexity: O(n) where n = number of bars
 */

import { useState, useRef } from 'react'

// ==================== CONSTANTS ====================
const INITIAL_PROGRESSION = [0] // One empty bar
const MAX_CONCURRENT_BARS = 3   // Fill at most 3 bars at once
const UPDATE_INTERVAL_MS = 10   // 60fps (~16ms), we use 10ms for smoother animation
const INCREMENT_AMOUNT = 0.5    // 0.5% * 200 ticks = 100% in 2000ms
const MAX_PROGRESS = 100        // 100% = full

// ==================== MAIN COMPONENT ====================
function ProgressBarsIV() {
  // Array of progress percentages: [0, 35, 60, 100, ...]
  const [progression, setProgression] = useState(INITIAL_PROGRESSION)

  // Track if animation is running (for button label)
  const [isRunning, setIsRunning] = useState(false)

  // Store interval ID (useRef to persist across renders without causing re-renders)
  const timerIdRef = useRef(null)

  // ==================== START ANIMATION ====================
  /**
   * Starts the interval loop that fills up to 3 bars at once.
   * Each tick: find first 3 non-full bars, increment by 0.5%.
   */
  const start = () => {
    // Avoid multiple intervals running simultaneously
    if (timerIdRef.current !== null) {
      return
    }

    setIsRunning(true)

    // Start interval: runs every 10ms
    timerIdRef.current = setInterval(() => {
      // Use callback form to access latest progression state
      setProgression((currentProgression) => {
        // Clone array to avoid mutation (React best practice)
        const newProgression = currentProgression.slice()

        // Find first 3 bars that are not full (< 100%)
        let barsUpdated = 0
        for (let i = 0; i < newProgression.length && barsUpdated < MAX_CONCURRENT_BARS; i++) {
          if (newProgression[i] < MAX_PROGRESS) {
            // Increment by 0.5%, cap at 100%
            newProgression[i] = Math.min(
              newProgression[i] + INCREMENT_AMOUNT,
              MAX_PROGRESS
            )
            barsUpdated++
          }
        }

        return newProgression
      })
    },  UPDATE_INTERVAL_MS)
  }

  // ==================== PAUSE ANIMATION ====================
  /**
   * Stops the interval, preserves current progress.
   */
  const pause = () => {
    if (timerIdRef.current === null) {
      return
    }

    // Clear interval and reset timer ID
    clearInterval(timerIdRef.current)
    timerIdRef.current = null
    setIsRunning(false)
  }

  // ==================== ADD BAR ====================
  /**
   * Appends a new empty bar (0%) to the bottom.
   * Does NOT change animation state (keeps running/paused).
   */
  const addBar = () => {
    setProgression((currentProgression) => {
      // concat returns new array with 0 appended (immutable)
      return currentProgression.concat(0)
    })
  }

  // ==================== RESET ====================
  /**
   * Stops animation and resets to initial state: one empty bar.
   */
  const reset = () => {
    pause() // Stop any running animation
    setProgression(INITIAL_PROGRESSION) // Reset to [0]
  }

  // ==================== TOGGLE START/PAUSE ====================
  const toggleStartPause = () => {
    if (isRunning) {
      pause()
    } else {
      start()
    }
  }

  // ==================== RENDER ====================
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Progress Bars IV</h2>

      {/* Control buttons */}
      <div style={styles.controls}>
        <button onClick={toggleStartPause} style={styles.button}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={addBar} style={styles.button}>
          Add
        </button>
        <button onClick={reset} style={styles.button}>
          Reset
        </button>
      </div>

      {/* Progress bars */}
      <div style={styles.barsContainer}>
        {progression.map((progress, index) => (
          <ProgressBar key={index} progress={progress} index={index} />
        ))}
      </div>

      {/* Debug info (optional, remove in production) */}
      <div style={styles.debug}>
        <small>
          Bars: {progression.length} |
          Filling: {progression.filter(p => p > 0 && p < 100).length} |
          Full: {progression.filter(p => p === 100).length}
        </small>
      </div>
    </div>
  )
}

// ==================== PROGRESS BAR COMPONENT ====================
/**
 * Individual progress bar component.
 * Displays a bar with fill percentage and label.
 */
function ProgressBar({ progress, index }) {
  return (
    <div style={styles.barWrapper}>
      {/* Label */}
      <div style={styles.barLabel}>
        Bar {index + 1}: {progress.toFixed(1)}%
      </div>

      {/* Outer container (gray background) */}
      <div style={styles.barOuter}>
        {/* Inner fill (green, animated width) */}
        <div
          style={{
            ...styles.barInner,
            width: `${progress}%`,
            // Color: green when full, blue when filling, gray when empty
            backgroundColor:
              progress === 100 ? '#4caf50' :
              progress > 0 ? '#2196f3' :
              '#e0e0e0'
          }}
        />
      </div>
    </div>
  )
}

// ==================== STYLES ====================
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px'
  },
  controls: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#1976d2',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  barsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  barWrapper: {
    width: '100%'
  },
  barLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
    marginBottom: '6px'
  },
  barOuter: {
    width: '100%',
    height: '30px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid #ddd'
  },
  barInner: {
    height: '100%',
    // Width is set inline based on progress %
    transition: 'none', // NO CSS transition (we control animation via JS)
    borderRadius: '3px'
  },
  debug: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    textAlign: 'center',
    color: '#666'
  }
}

// ==================== EXPORT ====================
export default ProgressBarsIV

// ==================== USAGE NOTES ====================
/**
 * How to use in your app:
 *
 * import ProgressBarsIV from './lld-003-progress-bars-ii/solution'
 *
 * function App() {
 *   return <ProgressBarsIV />
 * }
 *
 * Key implementation details:
 *
 * 1. Why useRef for timerId?
 *    - Persists across renders without triggering re-renders
 *    - Avoids stale closure issues
 *
 * 2. Why setProgression callback form?
 *    - Interval callback captures stale progression value
 *    - Callback form gives us latest state
 *
 * 3. Why slice() before mutation?
 *    - React best practice: never mutate state directly
 *    - Clone array first, then mutate clone
 *
 * 4. Why no CSS transition?
 *    - Need fine-grain control for pause/resume
 *    - CSS transitions can't be paused mid-animation
 *
 * 5. Why 0.5% every 10ms?
 *    - 0.5 * 200 = 100% in 2000ms
 *    - 10ms interval = ~100 ticks/sec = smooth 60fps
 *
 * Edge cases handled:
 * - Multiple start clicks → only one interval runs
 * - Add while paused → bar added but not filled
 * - Reset while running → stops animation, clears bars
 * - All bars full + Add → new bar fills immediately (if running)
 * - Pause preserves exact progress (not reset to 0)
 */
