import { useEffect, useRef, useState } from 'react'
import { renderDom, h } from './renderDom.js'

export default function Demo() {
  const hostRef = useRef(null)
  const [clicks, setClicks] = useState(0)

  useEffect(() => {
    const tree = h('div', { className: 'rd-card' },
      h('h3', { className: 'rd-title' }, 'Built from a plain object'),
      h('p', null, 'This subtree was created by renderDom, not JSX.'),
      h('ul', { className: 'rd-list' },
        h('li', null, 'attributes → setAttribute'),
        h('li', null, 'style object → el.style'),
        h('li', null, 'onClick → addEventListener'),
      ),
      h('button', {
        className: 'rd-btn',
        style: { marginTop: '8px' },
        onClick: () => setClicks((c) => c + 1),
      }, 'Click me (real listener)'),
      h('input', { placeholder: 'disabled via boolean prop', disabled: true }),
    )

    const host = hostRef.current
    host.innerHTML = ''
    host.appendChild(renderDom(tree))
  }, [])

  return (
    <div>
      <div ref={hostRef} />
      <p style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 13 }}>
        button clicks handled: <b>{clicks}</b>
      </p>
    </div>
  )
}
