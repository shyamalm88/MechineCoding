// ES5 constructor + prototype
function Animal(name) { this.name = name }
Animal.prototype.speak = function () { return `${this.name} makes a sound` }

function Dog(name) { Animal.call(this, name) }          // borrow the constructor
Dog.prototype = Object.create(Animal.prototype)          // link the prototypes
Dog.prototype.constructor = Dog                          // repair constructor
Dog.prototype.speak = function () { return `${this.name} barks` }

// ES6 class -- same machinery, different syntax
class AnimalC {
  constructor(name) { this.name = name }
  speak() { return `${this.name} makes a sound` }
}
class DogC extends AnimalC {
  speak() { return `${this.name} barks` }
}

const proto = { greet() { return 'hi from ' + this.who } }
const viaCreate = Object.create(proto); viaCreate.who = 'Object.create'
const viaAssign = Object.assign({}, proto, { who: 'Object.assign' })

const d = new Dog('Rex')
const rows = [
  ['ES5: new Dog("Rex").speak()', d.speak()],
  ['d instanceof Animal', String(d instanceof Animal)],
  ['d.constructor.name', d.constructor.name],
  ['ES6: new DogC("Rex").speak()', new DogC('Rex').speak()],
  ['Object.create(proto) — proto on chain', String(Object.getPrototypeOf(viaCreate) === proto)],
  ['Object.assign({}, proto) — COPIED, not linked', String(Object.getPrototypeOf(viaAssign) === proto)],
  ['viaCreate.greet()', viaCreate.greet()],
  ['viaAssign.greet()', viaAssign.greet()],
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
