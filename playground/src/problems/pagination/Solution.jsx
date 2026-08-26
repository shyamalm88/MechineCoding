import { useState } from 'react'
import { buildPages } from './paginate.js'

export default function Pagination() {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(20)
  const pages = buildPages(page, total)

  return (
    <div className="pg">
      <label className="pg-total">
        Total pages:{' '}
        <input
          type="number" min="1" max="99" value={total}
          onChange={(e) => {
            const t = Math.max(1, Number(e.target.value) || 1)
            setTotal(t)
            setPage((p) => Math.min(p, t)) // clamp so we never sit past the end
          }}
        />
      </label>

      <nav className="pg-nav" aria-label="Pagination">
        <button className="pg-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
          ‹ Prev
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`dots-${i}`} className="pg-dots" aria-hidden="true">…</span>
          ) : (
            <button
              key={p}
              className={p === page ? 'pg-btn pg-active' : 'pg-btn'}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ),
        )}
        <button className="pg-btn" onClick={() => setPage((p) => p + 1)} disabled={page === total}>
          Next ›
        </button>
      </nav>
      <p className="pg-hint">Showing page {page} of {total}</p>
    </div>
  )
}
