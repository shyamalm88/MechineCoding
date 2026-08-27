import { useState } from 'react'

function ProfileForm({ user }) {
  // Initial state is only read on MOUNT -- changing the prop later does nothing.
  const [draft, setDraft] = useState(user.name)
  return (
    <input value={draft} onChange={(e) => setDraft(e.target.value)}
           style={{ padding: 7, width: 200 }} />
  )
}

const USERS = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Grace' }]

export default function Demo() {
  const [id, setId] = useState(1)
  const user = USERS.find((u) => u.id === id)

  return (
    <div>
      <p>
        {USERS.map((u) => (
          <button key={u.id} onClick={() => setId(u.id)} style={{ marginRight: 6 }}>
            select {u.name}
          </button>
        ))}
      </p>
      <table style={{ borderCollapse: 'collapse', fontSize: 14 }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 18px 8px 0' }}>no key</td>
            <td><ProfileForm user={user} /></td>
            <td style={{ paddingLeft: 12, color: '#b91c1c', fontSize: 13 }}>keeps stale state</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 18px 8px 0' }}>key={'{'}user.id{'}'}</td>
            <td><ProfileForm key={user.id} user={user} /></td>
            <td style={{ paddingLeft: 12, color: '#15803d', fontSize: 13 }}>resets on switch</td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 470 }}>
        Type in both boxes, then switch user. The unkeyed one keeps what you
        typed for the previous user; the keyed one remounts fresh.
      </p>
    </div>
  )
}
