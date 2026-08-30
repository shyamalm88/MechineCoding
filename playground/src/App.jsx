import { useMemo } from 'react'
import { listProblems, loadProblem, COLLECTION } from '#collection'
import Sidebar from './components/Sidebar.jsx'
import ProblemWorkspace from './components/ProblemWorkspace.jsx'
import { useHashParam } from './lib/hashState.js'

export default function App() {
  const problems = useMemo(() => listProblems(), [])
  const fallbackId = problems[0]?.id ?? null
  const [selectedId, setSelectedId] = useHashParam('p', fallbackId)

  // The hash is user input: a stale or hand-edited id must not reach
  // loadProblem, which throws on an unknown id.
  const openId = problems.some((problem) => problem.id === selectedId)
    ? selectedId
    : fallbackId

  const problem = useMemo(
    () => (openId ? loadProblem(openId) : null),
    [openId],
  )

  return (
    <div className="layout">
      <Sidebar
          problems={problems}
          selectedId={openId}
          onSelect={setSelectedId}
          collection={COLLECTION}
        />
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
