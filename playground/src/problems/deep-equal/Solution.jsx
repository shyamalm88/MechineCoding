import { deepEqual } from './deepEqual.js'

const rows = [
  ['{a:{b:1}} vs {a:{b:1}}', deepEqual({ a: { b: 1 } }, { a: { b: 1 } })],
  ['[1,[2,3]] vs [1,[2,3]]', deepEqual([1, [2, 3]], [1, [2, 3]])],
  ['{a:1} vs {a:1,b:2}', deepEqual({ a: 1 }, { a: 1, b: 2 })],
  ['{a:1,b:2} vs {b:2,a:1} (key order)', deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })],
  ['null vs {}', deepEqual(null, {})],
  ['NaN vs NaN (=== says false)', deepEqual(NaN, NaN)],
  ['[] vs {}  (both have 0 keys)', deepEqual([], {})],
]

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}>
            <td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
            <td style={{ padding: '6px 0', fontWeight: 700, color: b ? '#15803d' : '#b91c1c' }}>{String(b)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
