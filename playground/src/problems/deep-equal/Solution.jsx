import { deepEqual } from './deepEqual.js'

const cyclicA = { name: 'a' }; cyclicA.self = cyclicA
const cyclicB = { name: 'a' }; cyclicB.self = cyclicB

const rows = [
  ['{a:{b:1}} vs {a:{b:1}}', deepEqual({ a: { b: 1 } }, { a: { b: 1 } })],
  ['[1,[2,3]] vs [1,[2,3]]', deepEqual([1, [2, 3]], [1, [2, 3]])],
  ['NaN vs NaN', deepEqual(NaN, NaN)],
  ['+0 vs -0 (distinguished)', deepEqual(0, -0)],
  ['new Date(0) vs new Date(0)', deepEqual(new Date(0), new Date(0))],
  ['/a/g vs /a/g', deepEqual(/a/g, /a/g)],
  ['Map([[1,2]]) vs Map([[1,2]])', deepEqual(new Map([[1, 2]]), new Map([[1, 2]]))],
  ['{a:1} vs {a:1,b:2}', deepEqual({ a: 1 }, { a: 1, b: 2 })],
  ['[] vs {}  (prototype differs)', deepEqual([], {})],
  ['circular vs circular', deepEqual(cyclicA, cyclicB)],
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
