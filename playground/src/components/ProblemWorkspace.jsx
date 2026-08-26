import { useState } from 'react'
import MarkdownView from './MarkdownView.jsx'
import PreviewPane from './PreviewPane.jsx'
import CodeView from './CodeView.jsx'

const TABS = ['Preview', 'Code']

export default function ProblemWorkspace({ problem }) {
  const [tab, setTab] = useState(TABS[0])

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
        <div className="tab-switch">
          {TABS.map((name) => (
            <button
              key={name}
              type="button"
              className={name === tab ? 'tab active' : 'tab'}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </header>

      <div className="workspace-body">
        <aside className="workspace-description">
          <MarkdownView markdown={problem.markdown} />
        </aside>

        <div className="workspace-stage">
          {tab === 'Preview' ? (
            <PreviewPane
              problemId={problem.id}
              Component={problem.Component}
              css={problem.css}
            />
          ) : (
            <CodeView files={problem.files} />
          )}
        </div>
      </div>
    </section>
  )
}
