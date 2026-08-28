# Semantic HTML and web accessibility basics

## The short answer

Use the element that means what you mean. A `<button>` gives you — for free —
keyboard focus, Enter/Space activation, the correct screen-reader role, disabled
semantics, and form participation.

```jsx
<div onClick={submit}>Submit</div>     // ✗ invisible to keyboard and screen readers
<button onClick={submit}>Submit</button>  // ✓ everything works
```

Making the div equivalent requires `role="button"`, `tabIndex={0}`, and a
`onKeyDown` handling **both** Enter and Space — and you will still miss
something (focus ring conventions, Windows High Contrast, form submission).

**The first rule of ARIA is: don't use ARIA.** A native element beats a div
wearing a role every time.

## The four principles (POUR)

- **Perceivable** — text alternatives, sufficient contrast (4.5:1 body text),
  never colour alone to convey meaning
- **Operable** — everything reachable and usable by keyboard, visible focus, no
  keyboard traps
- **Understandable** — predictable behaviour, labelled inputs, clear errors
- **Robust** — valid markup assistive tech can parse

## The things most often got wrong

**Labels.** Every input needs a real label:

```jsx
<input placeholder="Email" />                    // ✗ not a label
<label htmlFor="email">Email</label>             // ✓
<input id="email" />
```

Placeholder text disappears when you type, is usually too low-contrast, and is
not reliably announced. It is a hint, not a name.

**Focus management.** Opening a dialog must move focus into it, trap it while
open, and **restore focus to the trigger** on close. Without that, a keyboard
user is dumped back at the top of the document.

**Announcing dynamic changes.** A screen reader will not notice content that
appears unless it is in a live region:

```jsx
<div aria-live="polite">{status}</div>       // announced when it changes
<div role="alert">{error}</div>              // announced immediately
```

**Removing focus outlines.** `outline: none` with no replacement makes the site
unusable by keyboard. Style it instead:

```css
:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
```

`:focus-visible` gives keyboard users a ring without showing one on mouse click,
which is the reason people removed it in the first place.

**Heading order.** Headings are the primary navigation mechanism for screen
reader users — they jump between them like a table of contents. Skipping from
`<h1>` to `<h4>` breaks that map. One `<h1>` per page.

**Images.** `alt=""` for decorative images (so it is skipped), descriptive `alt`
for meaningful ones. Missing `alt` entirely means the screen reader may read the
filename.

## Testing

Automated tools (axe, Lighthouse) catch roughly **a third** of issues — mostly
contrast, missing labels and invalid ARIA. They cannot tell you whether focus
order makes sense or whether your live region says something useful.

The rest is manual:

1. **Unplug the mouse.** Tab through the whole flow. Can you do everything? Can
   you see where you are?
2. **Turn on a screen reader** — VoiceOver (⌘F5 on macOS) or NVDA. Listen to a
   form and an error.
3. Zoom to 200% and check nothing is cut off.

## How to answer this out loud

"The foundation is using the right element — a `<button>` gives you focus,
keyboard activation and the correct role for free, and the first rule of ARIA is
not to use ARIA when a native element exists. The things I see wrong most often
are placeholders used instead of labels, focus not being moved into and restored
from dialogs, dynamic content that's never announced because there's no live
region, and `outline: none` with nothing to replace it. Automated tools catch
about a third of issues, so I'd also tab through with the mouse unplugged and
listen to it with VoiceOver."

## Follow-ups to expect

- *When IS ARIA appropriate?* When no native element exists — tabs, comboboxes,
  tree views — and then follow the WAI-ARIA authoring patterns exactly.
- *What is the accessibility tree?* The browser's semantic view of the DOM that
  assistive tech consumes.
- *Contrast requirements?* 4.5:1 for body text, 3:1 for large text and UI
  components.
