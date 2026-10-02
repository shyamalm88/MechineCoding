import { pipe, compose, groupBy, once, chunk } from './utils.js'

const double = (n) => n * 2
const inc = (n) => n + 1
const people = [
  { name: 'Ada', dept: 'eng' }, { name: 'Bo', dept: 'design' }, { name: 'Cy', dept: 'eng' },
]

const rows = [
  ['pipe(double, inc)(5)  → inc(double(5))', pipe(double, inc)(5)],
  ['compose(double, inc)(5)  → double(inc(5))', compose(double, inc)(5)],
  ['groupBy(people, "dept")', JSON.stringify(groupBy(people, 'dept'), null, 0).slice(0, 70) + '…'],
  ['groupBy([1.2,1.8,2.1], Math.floor)', JSON.stringify(groupBy([1.2, 1.8, 2.1], Math.floor))],
  ['chunk([1,2,3,4,5], 2)', JSON.stringify(chunk([1, 2, 3, 4, 5], 2))],
  ['once(add)(2,3) then (100,100)', (() => { const add = once((a, b) => a + b); add(2, 3); return add(100, 100) })()],
]

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}>
            <td style={{ padding: '6px 18px 6px 0', verticalAlign: 'top' }}>{a}</td>
            <td style={{ padding: '6px 0', fontWeight: 700 }}>{String(b)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
