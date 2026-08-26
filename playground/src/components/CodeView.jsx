import { useEffect, useMemo, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import 'highlight.js/styles/github-dark.css'

// Register only the languages these problems actually use, rather than pulling
// in highlight.js's full ~190-language bundle. `xml` is required even though no
// file maps to it directly: highlight.js's javascript grammar delegates to xml
// to highlight JSX tags, and without it JSX renders unstyled.
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

function languageFor(filename) {
  if (filename.endsWith('.css')) return 'css'
  return 'javascript' // .js and .jsx -- highlight.js handles JSX via javascript
}

export default function CodeView({ files }) {
  const [activeName, setActiveName] = useState(files[0].name)

  // If the problem changes, the previously active filename may not exist in
  // the new file list -- fall back to that problem's entry file.
  useEffect(() => {
    if (!files.some((file) => file.name === activeName)) {
      setActiveName(files[0].name)
    }
  }, [files, activeName])

  const active = files.find((file) => file.name === activeName) ?? files[0]

  const highlighted = useMemo(
    () => hljs.highlight(active.code, { language: languageFor(active.name) }).value,
    [active],
  )

  return (
    <div className="code-view">
      {files.length > 1 && (
        <div className="code-tabs">
          {files.map((file) => (
            <button
              key={file.name}
              type="button"
              className={file.name === active.name ? 'code-tab active' : 'code-tab'}
              onClick={() => setActiveName(file.name)}
            >
              {file.name}
            </button>
          ))}
        </div>
      )}
      <pre className="code-block">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  )
}
