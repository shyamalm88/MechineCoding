/**
 * Sidebar component
 *
 * Renders a vertical list of all LLDs.
 * Highlights the selected item.
 * On click: calls onSelect(lld) to update parent state.
 */
function Sidebar({ llds, selectedId, onSelect }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Low-Level Design</h2>
      <ul className="sidebar-list">
        {llds.map(lld => (
          <li
            key={lld.id}
            className={`sidebar-item ${lld.id === selectedId ? 'selected' : ''}`}
            onClick={() => onSelect(lld)}
          >
            <div className="sidebar-item-title">{lld.title}</div>
            <div className="sidebar-item-summary">{lld.summary}</div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
