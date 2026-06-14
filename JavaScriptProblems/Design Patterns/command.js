/**
 * COMMAND PATTERN — Undo / Redo
 *
 * Encapsulate every action as an object with `execute()` and `undo()`.
 * A `CommandManager` keeps a history stack so any action can be reversed
 * (and re-applied via redo). Classic follow-up: "design an undo/redo
 * system for a text editor".
 */
class CommandManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  execute(command) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // new action invalidates the redo history
  }

  undo() {
    const command = this.undoStack.pop();
    if (!command) return;
    command.undo();
    this.redoStack.push(command);
  }

  redo() {
    const command = this.redoStack.pop();
    if (!command) return;
    command.execute();
    this.undoStack.push(command);
  }
}

// ─── Example: text document with insert/delete commands ───────────────────
class Document {
  constructor() {
    this.text = "";
  }
}

class InsertTextCommand {
  constructor(doc, text, position) {
    this.doc = doc;
    this.text = text;
    this.position = position;
  }

  execute() {
    const { text, position, doc } = this;
    doc.text = doc.text.slice(0, position) + text + doc.text.slice(position);
  }

  undo() {
    const { text, position, doc } = this;
    doc.text = doc.text.slice(0, position) + doc.text.slice(position + text.length);
  }
}

// Usage
const doc = new Document();
const manager = new CommandManager();

manager.execute(new InsertTextCommand(doc, "Hello", 0));
console.log(doc.text); // "Hello"

manager.execute(new InsertTextCommand(doc, " World", 5));
console.log(doc.text); // "Hello World"

manager.undo();
console.log(doc.text); // "Hello"

manager.undo();
console.log(doc.text); // ""

manager.redo();
console.log(doc.text); // "Hello"

manager.redo();
console.log(doc.text); // "Hello World"

module.exports = { CommandManager, Document, InsertTextCommand };
