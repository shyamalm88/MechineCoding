/**
 * Detail component
 *
 * Displays:
 * 1. problem.md (rendered as simple markdown)
 * 2. Interactive React component (Solution.jsx)
 *
 * Uses static imports mapped by ID for Vite compatibility
 */
import { useState, useEffect } from 'react'
import MarkdownView from './MarkdownView'

// Import all Solution components statically (required for Vite)
import HolyGrail from '../lld/lld-001-holy-grail/Solution'
import TransferList from '../lld/lld-002-transfer-list/Solution'
import ProgressBarsIV from '../lld/lld-003-progress-bars-iv/Solution'
import GridLights from '../lld/lld-004-grid-lights/Solution'
import Wordle from '../lld/lld-005-wordle/Solution'
import Typeahead from '../lld/lld-006-typeahead/Solution'
import FileExplorer from '../lld/lld-007-file-explorer/Solution'
import Comments from '../lld/lld-008-nested-comments/Solution'
import TrafficLight from '../lld/lld-009-traffic-light/Solution'
import PromiseProgress from '../lld/lld-010-promise-progress/Solution'
import InfiniteScroll from '../lld/lld-011-infinite-scroll/Solution'
import StarRating from '../lld/lld-012-star-rating/Solution'
import CircleCollide from "../lld/lld-013-circle-collide/Solution"
import Carousel from "../lld/lld-014-carousel/Solution"
import VirtualList from "../lld/lld-015-virtual-list/Solution"
import Modal from "../lld/lld-016-modal/Solution"
import GridSelection from "../lld/lld-017-grid-selection/Solution"
import CheckboxHierarchy from "../lld/lld-018-checkbox-hierarchy/Solution"
import SearchHighlighter from "../lld/lld-019-search-highlighter/Solution"
import Connect4 from "../lld/lld-020-connect-4/Solution"
import DataTable from "../lld/lld-021-data-table/Solution"
import TicTacToe from '../lld/lld-022-tic-tac-toe-dynamic/Solution'
import SnakeAndLadder from '../lld/lld-023-snake-ladder/Solution'
import KnightShortestPath from '../lld/lld-024-chess-board-knight-shortest-path/Solution'
import RookShortestPath from '../lld/lld-025-chess-board-rook-shortest-path/Solution'
import TokenBucket from '../lld/lld-026-token-bucket/Solution'
import CalendarDayView from '../lld/lld-027-calendar-day-view/Solution'
import KanbanBoard from '../lld/lld-028-kanban-board/Solution'
import NotificationSystem from '../lld/lld-029-notification-system/Solution'
import PollWidget from '../lld/lld-030-poll-widget/Solution'
















// Map LLD IDs to their Solution components
const SOLUTION_COMPONENTS = {
  'lld-001-holy-grail': HolyGrail,
  'lld-002-transfer-list': TransferList,
  'lld-003-progress-bars-iv': ProgressBarsIV,
  'lld-004-grid-lights': GridLights,
  'lld-005-wordle': Wordle,
  'lld-006-typeahead': Typeahead,
  'lld-007-file-explorer': FileExplorer,
  'lld-008-nested-comments': Comments,
  'lld-009-traffic-light': TrafficLight,
  'lld-010-promise-progress': PromiseProgress,
  'lld-011-infinite-scroll': InfiniteScroll,
  'lld-012-star-rating': StarRating,
  'lld-013-circle-collide': CircleCollide,
  'lld-014-carousel': Carousel,
  'lld-015-virtual-list': VirtualList,
  'lld-016-modal': Modal,
  'lld-017-grid-selection': GridSelection,
  'lld-018-checkbox-hierarchy': CheckboxHierarchy,
  'lld-019-search-highlighter': SearchHighlighter,
  'lld-020-connect-4': Connect4,
  'lld-021-data-table': DataTable,
  'lld-022-tic-tac-toe-dynamic': TicTacToe,
  'lld-023-snake-ladder': SnakeAndLadder,
  'lld-024-chess-board-knight-shortest-path': KnightShortestPath,
  'lld-025-chess-board-rook-shortest-path': RookShortestPath,
  'lld-026-token-bucket': TokenBucket,
  'lld-027-calendar-day-view': CalendarDayView,
  'lld-028-kanban-board': KanbanBoard,
  'lld-029-notification-system': NotificationSystem,
  'lld-030-poll-widget': PollWidget










}

function Detail({ lld }) {
  // Raw markdown string from problem.md
  const [problemMd, setProblemMd] = useState('')
  // Loading state
  const [loading, setLoading] = useState(false)
  // Error state
  const [error, setError] = useState(null)

  // Fetch problem.md whenever lld changes
  useEffect(() => {
    if (!lld) {
      setProblemMd('')
      return
    }

    setLoading(true)
    setError(null)

    // Fetch problem.md
    fetch(`/${lld.path}/problem.md`)
      .then(r => r.ok ? r.text() : '')
      .then(problem => {
        setProblemMd(problem)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load problem.md:', err)
        setError(`Failed to load problem: ${err.message}`)
        setLoading(false)
      })
  }, [lld])

  // No LLD selected yet
  if (!lld) {
    return (
      <main className="detail">
        <p className="detail-empty">Select an LLD from the sidebar</p>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="detail">
        <p className="detail-loading">Loading {lld.title}...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="detail">
        <p className="detail-error">Error: {error}</p>
      </main>
    )
  }

  // Get the Solution component for this LLD
  const SolutionComponent = SOLUTION_COMPONENTS[lld.id]

  return (
    <main className="detail">
      {/* Interactive Solution Component - TOP */}
      <section className="detail-section">
        <h2 className="detail-section-title">Solution (Interactive)</h2>
        <div className="solution-container">
          {SolutionComponent ? (
            <SolutionComponent />
          ) : (
            <p style={{ color: '#d32f2f' }}>
              Solution component not found for {lld.id}.
              <br />
              <small>Make sure to add it to Detail.jsx's SOLUTION_COMPONENTS map.</small>
            </p>
          )}
        </div>
      </section>

      {/* Problem statement - BOTTOM */}
      <section className="detail-section">
        <h2 className="detail-section-title">Problem</h2>
        <MarkdownView markdown={problemMd} />
      </section>
    </main>
  )
}

export default Detail
