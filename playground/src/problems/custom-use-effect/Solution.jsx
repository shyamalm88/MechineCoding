import { useEffect, useState } from 'react'
import { createHookRuntime } from './miniReact.js'

export default function Demo() {
  const [log, setLog] = useState([])

  useEffect(() => {
    const out = []
    let runtime

    const render = () => {
      const [count, setCount] = runtime.useState(0)
      const doubled = runtime.useMemo(() => count * 2, [count])

      runtime.useEffect(() => {
        out.push(`effect ran · count=${count}`)
        return () => out.push(`cleanup    · count=${count}`)
      }, [count])

      out.push(`render     · count=${count} doubled=${doubled}`)
      if (count < 2) queueMicrotask(() => setCount(count + 1))
    }

    runtime = createHookRuntime(render)
    runtime.mount()

    setTimeout(() => setLog([...out]), 60)
  }, [])

  if (!log.length) return <p>running…</p>
  return (
    <div>
      <ol style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.85 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ol>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 460 }}>
        Cleanup for the previous value runs before the next effect — exactly
        React's ordering, produced by a ~60 line runtime.
      </p>
    </div>
  )
}
