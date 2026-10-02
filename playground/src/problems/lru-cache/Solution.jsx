import { LRUcache } from './LRUCache.js'

const log = []
const cache = new LRUcache(2)
const run = (label, fn) => log.push([label, String(fn())])

run('set(1,1)', () => (cache.set(1, 1), 'ok'))
run('set(2,2)', () => (cache.set(2, 2), 'ok'))
run('get(1)', () => cache.get(1))
run('set(3,3)  → evicts 2', () => (cache.set(3, 3), 'ok'))
run('get(2)  (evicted)', () => cache.get(2))
run('get(3)', () => cache.get(3))
run('get(1)', () => cache.get(1))

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {log.map(([a, b], i) => (
          <tr key={i}>
            <td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
            <td style={{ padding: '6px 0', fontWeight: 700 }}>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
