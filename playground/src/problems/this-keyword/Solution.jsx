const obj = {
  name: 'obj',
  regular() { return this?.name ?? 'undefined' },
  arrow: () => (typeof this === 'undefined' ? 'undefined (module scope)' : 'not obj'),
}

const detached = obj.regular
const bound = obj.regular.bind({ name: 'bound' })

function Ctor() { this.name = 'instance' }
Ctor.prototype.who = function () { return this.name }

const rows = [
  ['obj.regular()  — implicit binding', obj.regular()],
  ['const f = obj.regular; f()  — lost binding', String(detached())],
  ['obj.regular.call({name:"call"})', obj.regular.call({ name: 'call' })],
  ['obj.regular.bind({name:"bound"})()', bound()],
  ['obj.arrow()  — lexical, ignores obj', obj.arrow()],
  ['new Ctor().who()  — new binding', new Ctor().who()],
  ['[1].map(obj.regular)[0]  — detached again', String([1].map(obj.regular)[0])],
  ['[1].map(obj.regular, obj)[0]  — thisArg', String([1].map(obj.regular, obj)[0])],
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
