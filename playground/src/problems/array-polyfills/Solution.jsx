import './polyfills.js'

const nums = [1, 2, 3, 4]
const sparse = [1, , 3] // eslint-disable-line no-sparse-arrays

let sparseVisits = 0
sparse.myMap((n) => { sparseVisits++; return n })

let emptyReduce
try { [].myReduce((a, b) => a + b); emptyReduce = 'no throw' }
catch (e) { emptyReduce = e.constructor.name }

const rows = [
  ['[1,2,3,4].myMap(n => n * 2)', JSON.stringify(nums.myMap((n) => n * 2))],
  ['[1,2,3,4].myFilter(n => n % 2)', JSON.stringify(nums.myFilter((n) => n % 2))],
  ['[1,2,3,4].myReduce((a,b) => a+b)', nums.myReduce((a, b) => a + b)],
  ['[1,2,3,4].myReduce((a,b) => a+b, 100)', nums.myReduce((a, b) => a + b, 100)],
  ['[1,2,3,4].myEvery(n => n > 0)', String(nums.myEvery((n) => n > 0))],
  ['[].myEvery(n => false) (vacuous truth)', String([].myEvery(() => false))],
  ['visits on [1, <hole>, 3] (holes skipped)', sparseVisits],
  ['[].myReduce(fn) with no initial', emptyReduce],
]

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}>
            <td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
            <td style={{ padding: '6px 0', fontWeight: 700 }}>{String(b)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
