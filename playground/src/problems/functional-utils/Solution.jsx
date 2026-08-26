import { pipe, compose, groupBy, isBalanced, quickSort } from './utils.js'

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
  ['isBalanced("{[()]}")', String(isBalanced('{[()]}'))],
  ['isBalanced("{[(])}")', String(isBalanced('{[(])}'))],
  ['isBalanced("((")', String(isBalanced('(('))],
  ['quickSort([5,3,8,1,9,2])', JSON.stringify(quickSort([5, 3, 8, 1, 9, 2]))],
  ['quickSort(["b","a"], localeCompare)', JSON.stringify(quickSort(['b', 'a'], (a, b) => a.localeCompare(b)))],
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
