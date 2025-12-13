/**
 * Root App component
 *
 * Manages:
 * - Loading src/lld/index.json (LLD registry)
 * - Selected LLD state (which detail view to show)
 * - Layout: Sidebar (list) + Detail (problem + solution)
 */
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Detail from './components/Detail'

function App() {
  // All LLDs loaded from index.json
  const [llds, setLlds] = useState([])
  // Currently selected LLD (object from index.json)
  const [selectedLld, setSelectedLld] = useState(null)
  // Loading state
  const [loading, setLoading] = useState(true)
  // Error state
  const [error, setError] = useState(null)

  // On mount: fetch LLD registry
  useEffect(() => {
    fetch('/src/lld/index.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load LLD index')
        return res.json()
      })
      .then(data => {
        setLlds(data)
        // Check URL for lld query param
        const params = new URLSearchParams(window.location.search)
        const lldId = params.get('lld')
        const matchedLld = lldId && data.find(item => item.id === lldId)
        // Select from URL or fall back to first LLD
        if (matchedLld) {
          setSelectedLld(matchedLld)
        } else if (data.length > 0) {
          setSelectedLld(data[0])
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Update URL when selected LLD changes
  useEffect(() => {
    if (selectedLld) {
      const params = new URLSearchParams(window.location.search)
      params.set('lld', selectedLld.id)
      window.history.replaceState({}, '', `?${params.toString()}`)
    }
  }, [selectedLld])

  if (loading) {
    return <div className="loading">Loading LLD problems...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="app-container">
      {/* Left sidebar: list of all LLDs */}
      <Sidebar
        llds={llds}
        selectedId={selectedLld?.id}
        onSelect={setSelectedLld}
      />

      {/* Right detail pane: problem.md + solution.js */}
      <Detail lld={selectedLld} />
    </div>
  )
}

export default App
