import './polyfills.js'

const person = { name: 'Ada' }
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`
}

function Point(x, y) {
  this.x = x
  this.y = y
}

const BoundPoint = Point.myBind(null, 1)
const instance = new BoundPoint(2)

const rows = [
  ['greet.myCall(person, "Hi", "!")', greet.myCall(person, 'Hi', '!')],
  ['greet.myApply(person, ["Hey", "?"])', greet.myApply(person, ['Hey', '?'])],
  ['greet.myBind(person, "Yo")("!!")', greet.myBind(person, 'Yo')('!!')],
  ['new (Point.myBind(null,1))(2) → x,y', `${instance.x},${instance.y}`],
  ['instance instanceof Point', String(instance instanceof Point)],
]

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}>
            <td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
            <td style={{ padding: '6px 0', fontWeight: 700 }}>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
