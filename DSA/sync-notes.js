/**
 * ============================================================================
 * DSA Notes Sync
 * ============================================================================
 * Keeps each topic's notes.html "Problems in this folder" section in sync
 * with the actual .js solution files in that folder.
 *
 * For every DSA/<Topic>/ folder that already has a notes.html:
 *   - NEW    .js file with no flashcard -> a placeholder chip + story panel
 *            are appended to the "Problems in this folder" flashcards.
 *   - STALE  story panel whose stored hash no longer matches the file's
 *            current content -> reported only (story may need a rewrite).
 *   - ORPHAN story panel whose .js file no longer exists -> reported only.
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

// Finds the index of the </div> that closes the <div ...> starting at openIndex.
function findMatchingClose(html, openIndex) {
  const tagRegex = /<div\b[^>]*>|<\/div>/g;
  tagRegex.lastIndex = openIndex;
  let depth = 0;
  let m;
  while ((m = tagRegex.exec(html))) {
    if (m[0].startsWith("</")) {
      depth--;
      if (depth === 0) return m.index;
    } else {
      depth++;
    }
  }
  return -1;
}

function placeholderChip(relPath) {
  const name = path.basename(relPath, ".js");
  return `            <button class="flashcard-chip" data-target="story-${name}">${name}</button>\n`;
}

function placeholderPanel(topicName, relPath, hash) {
  const name = path.basename(relPath, ".js");
  const repoPath = [topicName, ...relPath.split(path.sep)]
    .map(encodeURIComponent)
    .join("/");
  const href = `${GITHUB_BASE}/${repoPath}`;
  return `            <div class="story-panel" id="story-${name}" data-file="${relPath}" data-hash="${hash}">
              <span class="tag tag-story">Story</span>
              <h3>${name}</h3>
              <p><em>Mind-map story: not written yet.</em></p>
              <p><a href="${href}" target="_blank">Open solution file &rarr;</a></p>
            </div>
`;
}

function syncTopic(topicName, topicDir) {
  const notesPath = path.join(topicDir, "notes.html");
  if (!fs.existsSync(notesPath)) return;

  let html = fs.readFileSync(notesPath, "utf8");
  const jsFiles = findJsFiles(topicDir).sort();

  const panelRegex = /<div class="story-panel[^"]*" id="[^"]*" data-file="([^"]+)" data-hash="([^"]*)">/g;
  const existing = new Map();
  let m;
  while ((m = panelRegex.exec(html))) {
    existing.set(m[1], m[2]);
  }

  let newChips = "";
  let newPanels = "";
  for (const relPath of jsFiles) {
    const hash = sha1(fs.readFileSync(path.join(topicDir, relPath)));

    if (!existing.has(relPath)) {
      console.log(`  NEW     ${topicName}/${relPath} -> added placeholder flashcard`);
      newChips += placeholderChip(relPath);
      newPanels += placeholderPanel(topicName, relPath, hash);
    } else if (existing.get(relPath) !== hash) {
      console.log(`  STALE   ${topicName}/${relPath} -> solution changed since story was written`);
    }
  }

  for (const relPath of existing.keys()) {
    if (!jsFiles.includes(relPath)) {
      console.log(`  ORPHAN  ${topicName}/${relPath} -> story exists but file is gone`);
    }
  }

  if (newChips) {
    const listStart = html.indexOf('<div class="flashcard-list">');
    const storyStart = html.indexOf('<div class="flashcard-story">');
    if (listStart === -1 || storyStart === -1) {
      console.log(`  WARN    ${topicName}/notes.html has no flashcards section - skipped insert`);
      return;
    }
    const listClose = findMatchingClose(html, listStart);
    const storyClose = findMatchingClose(html, storyStart);

    // Insert at the later index first so the earlier index stays valid.
    if (storyClose > listClose) {
      html = html.slice(0, storyClose) + newPanels + html.slice(storyClose);
      html = html.slice(0, listClose) + newChips + html.slice(listClose);
    } else {
      html = html.slice(0, listClose) + newChips + html.slice(listClose);
      html = html.slice(0, storyClose) + newPanels + html.slice(storyClose);
    }
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
