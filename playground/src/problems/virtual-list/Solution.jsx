import VirtualList from "./VirtualList";

export default function App() {
  // Simulate large dataset
  const items = Array.from(
    { length: 20000 },
    (_, index) => `Item ${index + 1}`
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Virtualized List Demo</h2>
      <VirtualList items={items} />
    </div>
  );
}
