import { deepDiff } from './deepDiff.js'

const before = { name: 'Ada', age: 36, address: { city: 'London', zip: 'E1' }, tags: ['a', 'b'], legacy: true }
const after  = { name: 'Ada', age: 37, address: { city: 'Paris',  zip: 'E1' }, tags: ['a', 'c'], added: 1 }
const diff = deepDiff(before, after)

const colour = { added: '#15803d', removed: '#b91c1c', changed: '#b45309' }

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <thead><tr>{['path','type','from','to'].map(h=><th key={h} style={{textAlign:'left',padding:'4px 16px 4px 0'}}>{h}</th>)}</tr></thead>
      <tbody>
        {Object.entries(diff).map(([path, d]) => (
          <tr key={path}>
            <td style={{ padding: '6px 16px 6px 0' }}>{path}</td>
            <td style={{ color: colour[d.type], fontWeight: 700 }}>{d.type}</td>
            <td style={{ padding: '0 16px' }}>{JSON.stringify(d.from) ?? '—'}</td>
            <td>{JSON.stringify(d.to) ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
