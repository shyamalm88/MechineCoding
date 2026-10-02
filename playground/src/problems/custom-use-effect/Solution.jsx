import { useMemo } from 'react'
import { createUseEffect } from './miniReact.js'

export default function Demo() {
  const log = useMemo(() => {
    const out = []
    const useEffect = createUseEffect()

    // Simulate successive "renders" of one component. Each render calls the
    // hook with the current count; the effect only re-runs when deps change.
    ;[0, 1, 1, 2].forEach((count) => {
      out.push(`render     · count=${count}`)
      useEffect(() => {
        out.push(`effect ran · count=${count}`)
        return () => out.push(`cleanup    · count=${count}`)
      }, [count])
    })
    return out
  }, [])

  return (
    <div>
      <ol style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.85 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ol>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 460 }}>
        The second render with count=1 is skipped (deps unchanged). Cleanup for
        the previous value runs before the next effect — React's ordering.
      </p>
    </div>
  )
}
