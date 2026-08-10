import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements, exportToSvg } from "@excalidraw/excalidraw";

// Converts one mermaid definition string into a hand-drawn Excalidraw SVG
// (as an outerHTML string), at native 1x scale. Exposed on window so the
// Playwright-driven render.js can call it per-diagram after the bundle
// script tag has loaded.
async function convertOne(mermaidDefinition) {
  const { elements, files } = await parseMermaidToExcalidraw(mermaidDefinition);
  const excalidrawElements = convertToExcalidrawElements(elements);
  const svg = await exportToSvg({
    elements: excalidrawElements,
    appState: {
      exportBackground: true,
      exportWithDarkMode: false,
      exportScale: 1,
    },
    files: files || null,
  });
  return svg.outerHTML;
}

window.convertMermaidToExcalidrawSvg = convertOne;
window.__mermaidToExcalidrawReady = true;
