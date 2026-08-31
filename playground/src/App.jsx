import { useMemo } from 'react'
import { listProblems, loadProblem, COLLECTION } from '#collection'
import Sidebar from './components/Sidebar.jsx'
import ProblemWorkspace from './components/ProblemWorkspace.jsx'
import { useHashParam } from './lib/hashState.js'
import SidebarResizer, { useSidebarWidth } from './components/SidebarResizer.jsx'

export default function App() {
  const problems = useMemo(() => listProblems(), [])
  const fallbackId = problems[0]?.id ?? null
  const [selectedId, setSelectedId] = useHashParam('p', fallbackId)

  // The hash is user input: a stale or hand-edited id must not reach
  // loadProblem, which throws on an unknown id.
  const openId = problems.some((problem) => problem.id === selectedId)
    ? selectedId
    : fallbackId

  const [sidebarWidth, setSidebarWidth] = useSidebarWidth()

  const problem = useMemo(
    () => (openId ? loadProblem(openId) : null),
    [openId],
  )

  return (
    // The width drives a custom property so only the sidebar rule reads it.
    <div className="layout" style={{ '--sidebar-width': `${sidebarWidth}px` }}>
      <Sidebar
          problems={problems}
          selectedId={openId}
          onSelect={setSelectedId}
          collection={COLLECTION}
        />
      <SidebarResizer width={sidebarWidth} onResize={setSidebarWidth} />

      <main className="main">
        {problem ? (
          <ProblemWorkspace key={problem.id} problem={problem} />
        ) : (
          <p className="empty-state">No problems yet.</p>
        )}
      </main>
    </div>
  )
}
