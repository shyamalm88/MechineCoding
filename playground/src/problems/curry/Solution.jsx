import { curry, infiniteAdd } from './curry.js'

const volume = curry((l, w, h) => l * w * h)

const rows = [
  ['volume(2)(3)(4)', volume(2)(3)(4)],
  ['volume(2, 3)(4)', volume(2, 3)(4)],
  ['volume(2)(3, 4)', volume(2)(3, 4)],
  ['volume(2, 3, 4)', volume(2, 3, 4)],
  ['infiniteAdd(1)(2)(3)(4) + 0', infiniteAdd(1)(2)(3)(4) + 0],
]

export default function CurryDemo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 14 }}>
      <tbody>
        {rows.map(([expr, result]) => (
          <tr key={expr}>
            <td style={{ padding: '6px 16px 6px 0' }}>{expr}</td>
            <td style={{ padding: '6px 0', fontWeight: 700 }}>{String(result)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
