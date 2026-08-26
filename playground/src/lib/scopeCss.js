/**
 * Per-problem CSS isolation.
 *
 * Every problem's stylesheet is injected into the one document the app shell
 * lives in. Migrated problems were written as standalone pages, so they
 * contain things like `* { margin: 0 }` and bare `button { ... }` rules that
 * would restyle the sidebar and tabs, plus class names (`.board`, `.cell`)
 * that several problems define differently.
 *
 * Rather than rewrite those files -- the Code tab shows them verbatim, so
 * they must stay exactly as authored -- each rule's selector is prefixed at
 * injection time with the problem's scope attribute, confining it to that
 * problem's preview subtree.
 */

const AT_RULE_WITH_OWN_BODY = /^@(keyframes|font-face|counter-style|property|layer)\b/i
const AT_RULE_WRAPPING_RULES = /^@(media|supports|container|layer)\b/i

export function scopeAttribute(problemId) {
  return `[data-problem="${problemId}"]`
}

/**
 * Split a block's top-level content into segments, respecting nesting depth so
 * a nested `{ }` (e.g. inside @media) is not mistaken for the end of a rule.
 *
 * Braces inside comments (`/* a { b } *\/`) and inside quoted strings
 * (`content: "}"`) are not structural and must be skipped, or the whole split
 * desynchronises and selectors get mangled.
 */
/**
 * Advance past a comment or quoted string starting at `i`, or return `i`
 * unchanged when the character there begins neither. Shared by every scan in
 * this module so none of them mistakes a brace inside a comment or a string
 * for a structural one.
 */
function skipNonStructural(css, i) {
  const char = css[i]

  if (char === '/' && css[i + 1] === '*') {
    const end = css.indexOf('*/', i + 2)
    return end === -1 ? css.length : end + 2
  }

  if (char === '"' || char === "'") {
    let j = i + 1
    while (j < css.length && css[j] !== char) {
      j += css[j] === '\\' ? 2 : 1
    }
    return j + 1
  }

  return i
}

/** Index of the first brace that actually opens a block, ignoring comments. */
function findStructuralBrace(segment) {
  let i = 0
  while (i < segment.length) {
    const skipped = skipNonStructural(segment, i)
    if (skipped !== i) {
      i = skipped
      continue
    }
    if (segment[i] === '{') return i
    i += 1
  }
  return -1
}

function splitTopLevel(css) {
  const segments = []
  let depth = 0
  let start = 0
  let i = 0

  while (i < css.length) {
    const skipped = skipNonStructural(css, i)
    if (skipped !== i) {
      i = skipped
      continue
    }

    const char = css[i]
    if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        segments.push(css.slice(start, i + 1))
        start = i + 1
      }
    }
    i += 1
  }

  const tail = css.slice(start)
  if (tail.trim()) segments.push(tail)
  return segments
}

/**
 * Append the scope attribute to the LAST compound of a selector, producing the
 * "self" form: an element that carries the attribute directly.
 *
 * A pseudo-element must remain last in a compound (`.a[attr]::before` is valid,
 * `.a::before[attr]` is not), so the attribute is inserted before it.
 */
function selfForm(selector, scope) {
  const pseudoElement = selector.search(/::/)
  if (pseudoElement === -1) return `${selector}${scope}`
  return `${selector.slice(0, pseudoElement)}${scope}${selector.slice(pseudoElement)}`
}

function scopeSelectorList(selectorList, scope) {
  return selectorList
    .split(',')
    .flatMap((selector) => {
      const trimmed = selector.trim()
      if (!trimmed) return []
      // Idempotent: re-scoping an already-scoped sheet is a no-op.
      if (trimmed.startsWith(scope) || trimmed.includes(scope)) return [trimmed]
      // Two forms: descendant (normal preview content, and anything inside a
      // tagged portal root) and self (the tagged portal root itself).
      return [`${scope} ${trimmed}`, selfForm(trimmed, scope)]
    })
    .join(', ')
}

export function scopeCss(css, problemId) {
  if (!css) return ''

  const scope = scopeAttribute(problemId)

  return splitTopLevel(css)
    .map((segment) => {
      const braceIndex = findStructuralBrace(segment)
      if (braceIndex === -1) return segment

      const prelude = segment.slice(0, braceIndex)
      const body = segment.slice(braceIndex + 1, segment.lastIndexOf('}'))

      // Split off leading whitespace and/or comments FIRST, so blank lines and
      // notes between rules survive -- and, critically, so an at-rule preceded
      // by a comment (`/* Responsive */\n@media ...`) is still recognised as an
      // at-rule rather than treated as a selector.
      const [, leading = '', selectorList = ''] =
        prelude.match(/^((?:\s|\/\*[\s\S]*?\*\/)*)([\s\S]*)$/) ?? []
      const head = selectorList.trim()

      // @keyframes/@font-face own their body -- its inner blocks are steps or
      // descriptors, not selectors, and must never be scoped.
      if (AT_RULE_WITH_OWN_BODY.test(head)) return segment

      // @media/@supports wrap real rules: keep the at-rule, scope what's inside.
      if (AT_RULE_WRAPPING_RULES.test(head)) {
        return `${leading}${selectorList}{${scopeCss(body, problemId)}}`
      }

      if (!head) return segment

      return `${leading}${scopeSelectorList(selectorList, scope)} {${body}}`
    })
    .join('')
}
