/**
 * ============================================================================
 * DSA Notes Sync
 * ============================================================================
 * Keeps each topic's notes.html "Problems in this folder" section in sync
 * with the actual .js solution files in that folder.
 *
 * For every DSA/<Topic>/ folder that already has a notes.html:
 *   - NEW    .js file with no story card  -> a placeholder story card is
 *            appended to the "Problems in this folder" section.
 *   - STALE  story card whose stored hash no longer matches the file's
 *            current content -> reported only (story may need a rewrite).
 *   - ORPHAN story card whose .js file no longer exists -> reported only.
 *
 * Run: node DSA/sync-notes.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DSA_ROOT = __dirname;
const SKIP_DIRS = new Set(["google-2025", "node_modules"]);
const GITHUB_BASE = "https://github.com/shyamalm88/MechineCoding/blob/master/DSA";

function sha1(content) {
  return crypto.createHash("sha1").update(content).digest("hex");
}

function findJsFiles(dir, baseDir = dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findJsFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      results.push(path.relative(baseDir, fullPath));
    }
  }
  return results;
}

function placeholderCard(topicName, relPath, hash) {
  const name = path.basename(relPath, ".js");
  const repoPath = [topicName, ...relPath.split(path.sep)]
    .map(encodeURIComponent)
    .join("/");
  const href = `${GITHUB_BASE}/${repoPath}`;
  return `
        <details class="reveal" data-file="${relPath}" data-hash="${hash}">
          <summary><span><span class="tag tag-story">Story</span><br />${name}</span></summary>
          <div class="reveal-body">
            <p><em>Mind-map story: not written yet.</em></p>
            <p><a href="${href}" target="_blank">Open solution file &rarr;</a></p>
          </div>
        </details>
`;
}

function syncTopic(topicName, topicDir) {
  const notesPath = path.join(topicDir, "notes.html");
  if (!fs.existsSync(notesPath)) return;

  let html = fs.readFileSync(notesPath, "utf8");
  const jsFiles = findJsFiles(topicDir).sort();

  const detailsRegex = /<details class="reveal" data-file="([^"]+)" data-hash="([^"]*)">/g;
  const existing = new Map();
  let m;
  while ((m = detailsRegex.exec(html))) {
    existing.set(m[1], m[2]);
  }

  let newCards = "";
  for (const relPath of jsFiles) {
    const hash = sha1(fs.readFileSync(path.join(topicDir, relPath)));

    if (!existing.has(relPath)) {
      console.log(`  NEW     ${topicName}/${relPath} -> added placeholder story card`);
      newCards += placeholderCard(topicName, relPath, hash);
    } else if (existing.get(relPath) !== hash) {
      console.log(`  STALE   ${topicName}/${relPath} -> solution changed since story was written`);
    }
  }

  for (const relPath of existing.keys()) {
    if (!jsFiles.includes(relPath)) {
      console.log(`  ORPHAN  ${topicName}/${relPath} -> story exists but file is gone`);
    }
  }

  if (newCards) {
    const sectionStart = html.indexOf('<section id="problems">');
    if (sectionStart === -1) {
      console.log(`  WARN    ${topicName}/notes.html has no <section id="problems"> - skipped insert`);
      return;
    }
    const sectionEnd = html.indexOf("</section>", sectionStart);
    html = html.slice(0, sectionEnd) + newCards + html.slice(sectionEnd);
    fs.writeFileSync(notesPath, html);
  }
}

function main() {
  const entries = fs.readdirSync(DSA_ROOT, { withFileTypes: true });
  let topicsWithoutNotes = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue;

    const topicDir = path.join(DSA_ROOT, entry.name);
    const notesPath = path.join(topicDir, "notes.html");

    if (fs.existsSync(notesPath)) {
      syncTopic(entry.name, topicDir);
    } else if (findJsFiles(topicDir).length > 0) {
      topicsWithoutNotes.push(entry.name);
    }
  }

  if (topicsWithoutNotes.length) {
    console.log("\nTopics with problems but no notes.html yet (not synced):");
    topicsWithoutNotes.forEach((t) => console.log(`  - ${t}`));
  }
}

main();
