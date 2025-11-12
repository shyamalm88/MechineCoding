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
import ProgressBarsIV from '../lld/lld-003-progress-bars-ii/Solution'

// Map LLD IDs to their Solution components
const SOLUTION_COMPONENTS = {
  'lld-003-progress-bars-ii': ProgressBarsIV,
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
