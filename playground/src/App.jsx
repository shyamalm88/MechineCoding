import { useMemo, useState } from 'react'
import { listProblems, loadProblem } from './problems/loader.js'
import Sidebar from './components/Sidebar.jsx'
import ProblemWorkspace from './components/ProblemWorkspace.jsx'

export default function App() {
  const problems = useMemo(() => listProblems(), [])
  const [selectedId, setSelectedId] = useState(problems[0]?.id ?? null)

  const problem = useMemo(
    () => (selectedId ? loadProblem(selectedId) : null),
    [selectedId],
  )

  return (
    <div className="layout">
      <Sidebar problems={problems} selectedId={selectedId} onSelect={setSelectedId} />
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
