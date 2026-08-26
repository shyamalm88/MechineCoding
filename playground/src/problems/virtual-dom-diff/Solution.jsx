import { diff, h } from './diff.js'

const before = h('ul', { className: 'list' },
  h('li', { key: 'a' }, 'Apple'),
  h('li', { key: 'b' }, 'Banana'),
  h('li', { key: 'c' }, 'Cherry'),
)
const after = h('ul', { className: 'list highlighted' },
  h('li', { key: 'c' }, 'Cherry'),
  h('li', { key: 'a' }, 'Apricot'),
  h('li', { key: 'd' }, 'Date'),
)

const unkeyedBefore = h('div', {}, h('span', {}, 'x'), h('span', {}, 'y'))
const unkeyedAfter = h('div', {}, h('p', {}, 'x'), h('span', {}, 'y'))

const patches = diff(before, after)
const replacePatches = diff(unkeyedBefore, unkeyedAfter)

const Table = ({ title, rows }) => (
  <>
    <p style={{ fontWeight: 700, marginBottom: 4 }}>{title}</p>
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 12.5, marginBottom: 16 }}>
      <tbody>
        {rows.map((p, i) => (
          <tr key={i}>
            <td style={{ padding: '4px 14px 4px 0', color: '#b45309', fontWeight: 700 }}>{p.type}</td>
            <td style={{ padding: '0 14px 0 0' }}>path [{p.path.join(',')}]</td>
            <td>{p.key ? `key=${p.key}` : ''} {p.props ? JSON.stringify(p.props) : ''} {p.value ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)

export default function Demo() {
  return (
    <div>
      <Table title="Keyed list: reorder + edit + add + remove" rows={patches} />
      <Table title="Type change (span → p): REPLACE, no child diffing" rows={replacePatches} />
    </div>
  )
}
