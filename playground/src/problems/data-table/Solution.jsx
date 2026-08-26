import { useState } from "react";

const data = [
  { id: 1, name: "Alice", age: 32, role: "Engineer", salary: 120000 },
  { id: 2, name: "Bob", age: 28, role: "Designer", salary: 90000 },
  { id: 3, name: "Carol", age: 40, role: "Manager", salary: 150000 },
  { id: 4, name: "Dave", age: 35, role: "Engineer", salary: 130000 },
  { id: 5, name: "Eve", age: 29, role: "Engineer", salary: 110000 },
  { id: 6, name: "Frank", age: 45, role: "Director", salary: 180000 },
  { id: 7, name: "Grace", age: 27, role: "Designer", salary: 85000 }
];

export default function App() {
  const [filterText, setFilterText] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 3;

  // 1. Filter
  const filtered = data.filter(row =>
    row.name.toLowerCase().includes(filterText.toLowerCase()) ||
    row.role.toLowerCase().includes(filterText.toLowerCase())
  );

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;

    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Pagination
  const totalPages = Math.ceil(sorted.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginated = sorted.slice(start, start + pageSize);

  // Handle sort click
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Reset page when filter changes
  const onFilterChange = (e) => {
    setFilterText(e.target.value);
    setPage(1);
  };

  return (
    <div className="dataTableWrapper">
      <h2>Employee Table</h2>

      <input
        placeholder="Filter by name or role"
        value={filterText}
        onChange={onFilterChange}
      />

      <table border="1" cellPadding={8}>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} onClick={() => handleSort(key)}>
                {key}
                {sortKey === key && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginated.map((row) => (
            <tr key={row.id}>
              {Object.keys(row).map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>

        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
