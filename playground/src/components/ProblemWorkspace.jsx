import { useState } from 'react'
import MarkdownView from './MarkdownView.jsx'
import PreviewPane from './PreviewPane.jsx'
import CodeView from './CodeView.jsx'

export default function ProblemWorkspace({ problem }) {
  // Conceptual problems ship no Solution.jsx and no source files, so neither
  // tab has anything to show -- the description alone is the whole content.
  const hasPreview = Boolean(problem.Component)
  const hasCode = problem.files.length > 0
  const tabs = [...(hasPreview ? ['Preview'] : []), ...(hasCode ? ['Code'] : [])]
  const [tab, setTab] = useState(tabs[0] ?? null)

  // Switching to a problem that lacks the currently-selected tab must fall
  // back, or the stage would render nothing.
  const activeTab = tabs.includes(tab) ? tab : (tabs[0] ?? null)

  return (
    <section className="workspace">
      <header className="workspace-head">
        <div>
          <h1>{problem.title}</h1>
          <p className="workspace-meta">
            <span>{problem.category}</span>
            <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
          </p>
        </div>
        {tabs.length > 0 && (
          <div className="tab-switch">
            {tabs.map((name) => (
              <button
                key={name}
                type="button"
                className={name === activeTab ? 'tab active' : 'tab'}
                onClick={() => setTab(name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className={activeTab ? 'workspace-body' : 'workspace-body solo'}>
        <aside className="workspace-description">
          <MarkdownView markdown={problem.markdown} />
        </aside>

        {activeTab && (
          <div className="workspace-stage">
            {activeTab === 'Preview' ? (
              <PreviewPane
                problemId={problem.id}
                Component={problem.Component}
                css={problem.css}
              />
            ) : (
              <CodeView files={problem.files} />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
