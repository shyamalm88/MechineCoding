import { useRef, useState, useCallback } from "react";

const CANVAS_W = 680;
const CANVAS_H = 420;
const COLORS = ["#000000", "#e53935", "#1976d2", "#388e3c", "#f57c00", "#7b1fa2", "#ffffff"];

export default function App() {
  const canvasRef = useRef(null);
  const lastPos = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");   // "pen" | "eraser"
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(4);

  function getCanvasPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    // support touch events too
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  const startDraw = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getCanvasPos(e);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing || !lastPos.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getCanvasPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? 24 : size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPos.current = pos;
  }, [isDrawing, tool, color, size]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  function clearCanvas() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  }

  function downloadCanvas() {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", userSelect: "none" }}>
      <h2 style={{ marginBottom: 12 }}>Drawing Board</h2>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        {/* Tool buttons */}
        {["pen", "eraser"].map(t => (
          <button
            key={t}
            onClick={() => setTool(t)}
            style={{
              padding: "6px 16px", border: "none", borderRadius: 6, cursor: "pointer",
              background: tool === t ? "#1976d2" : "#eeeeee",
              color: tool === t ? "#fff" : "#333",
              fontWeight: tool === t ? 600 : 400,
              textTransform: "capitalize",
            }}
          >
            {t === "pen" ? "✏️ Pen" : "🧹 Eraser"}
          </button>
        ))}

        {/* Quick color palette */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {COLORS.map(c => (
            <div
              key={c}
              onClick={() => { setColor(c); setTool("pen"); }}
              style={{
                width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer",
                border: color === c && tool === "pen" ? "3px solid #1976d2" : "2px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          ))}
          {/* Custom color */}
          <input
            type="color"
            value={color}
            onChange={e => { setColor(e.target.value); setTool("pen"); }}
            style={{ width: 28, height: 28, cursor: "pointer", border: "none", padding: 0 }}
            title="Custom color"
          />
        </div>

        {/* Brush size */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#555" }}>Size: {size}px</span>
          <input
            type="range" min={1} max={30} value={size}
            onChange={e => setSize(Number(e.target.value))}
            style={{ width: 80 }}
          />
        </div>

        {/* Actions */}
        <button onClick={clearCanvas} style={{ padding: "6px 14px", background: "#ffebee", color: "#c62828", border: "1px solid #ef9a9a", borderRadius: 6, cursor: "pointer" }}>
          Clear
        </button>
        <button onClick={downloadCanvas} style={{ padding: "6px 14px", background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7", borderRadius: 6, cursor: "pointer" }}>
          Save PNG
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          border: "2px solid #ccc",
          borderRadius: 8,
          cursor: tool === "eraser" ? "cell" : "crosshair",
          display: "block",
          background: "#ffffff",
          touchAction: "none",
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      <p style={{ marginTop: 8, fontSize: 12, color: "#aaa" }}>
        Draw with mouse or touch. Shift to eraser, or click Eraser button.
      </p>
    </div>
  );
}