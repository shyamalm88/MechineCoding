#!/usr/bin/env node
// Batch-converts mermaid flowchart diagrams into hand-drawn Excalidraw SVGs.
//
// Usage: node render.js <input.json> <output.json>
//   input.json:  [{ "id": "<content-hash>", "mermaid": "graph TD\n..." }, ...]
//   output.json: { "<content-hash>": { "svg": "<svg ...>...</svg>" } }
//              | { "<content-hash>": { "error": "message" } }
//
// Requires `npm install` to have been run in this directory, and Playwright
// with a Chromium browser available (see the repo's README for the
// NODE_PATH used to resolve the locally-installed Playwright package).

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    console.error("Usage: node render.js <input.json> <output.json>");
    process.exit(1);
  }

  const { chromium } = require("playwright");

  const diagrams = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  const bundle = await esbuild.build({
    entryPoints: [path.join(__dirname, "src", "index.js")],
    bundle: true,
    format: "iife",
    platform: "browser",
    define: { "process.env.NODE_ENV": '"production"' },
    loader: { ".woff2": "dataurl", ".woff": "dataurl", ".ttf": "dataurl" },
    write: false,
  });
  const bundleJs = bundle.outputFiles[0].text;

  const excalidrawCss = fs.readFileSync(
    path.join(
      __dirname,
      "node_modules",
      "@excalidraw",
      "excalidraw",
      "dist",
      "prod",
      "index.css"
    ),
    "utf8"
  );

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));

  await page.setContent(
    `<!doctype html><html><head><style>${excalidrawCss}</style></head><body></body></html>`
  );
  await page.addScriptTag({ content: bundleJs });
  await page.waitForFunction(() => window.__mermaidToExcalidrawReady === true, {
    timeout: 15000,
  });
  await page.evaluate(() => document.fonts.ready);

  const results = {};
  for (const { id, mermaid } of diagrams) {
    try {
      const svg = await page.evaluate(
        (def) => window.convertMermaidToExcalidrawSvg(def),
        mermaid
      );
      results[id] = { svg };
    } catch (e) {
      results[id] = { error: e.message };
    }
  }

  await browser.close();

  if (pageErrors.length) {
    console.error("Page errors encountered during rendering:");
    for (const e of pageErrors) console.error("  " + e);
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  const ok = Object.values(results).filter((r) => r.svg).length;
  const failed = Object.values(results).filter((r) => r.error).length;
  console.error(`Rendered ${ok}/${diagrams.length} diagrams (${failed} failed).`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
