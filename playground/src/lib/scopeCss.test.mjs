import { test } from 'node:test'
import assert from 'node:assert/strict'
import { scopeCss, scopeAttribute } from './scopeCss.js'

const S = (id) => `[data-problem="${id}"]`

test('scopeAttribute builds the attribute selector for an id', () => {
  assert.equal(scopeAttribute('star-rating'), '[data-problem="star-rating"]')
})

test('prefixes a simple class rule', () => {
  assert.equal(scopeCss('.board { color: red; }', 'x'), `${S('x')} .board { color: red; }`)
})

test('prefixes every selector in a comma-separated list', () => {
  const out = scopeCss('.a, .b { color: red; }', 'x')
  assert.equal(out, `${S('x')} .a, ${S('x')} .b { color: red; }`)
})

test('prefixes bare element selectors so they cannot leak to the app shell', () => {
  assert.equal(scopeCss('button { border: 0; }', 'x'), `${S('x')} button { border: 0; }`)
})

test('prefixes a universal reset so it cannot restyle the whole page', () => {
  assert.equal(scopeCss('* { margin: 0; }', 'x'), `${S('x')} * { margin: 0; }`)
})

test('keeps multiple rules independent', () => {
  const out = scopeCss('.a { color: red; }\n.b { color: blue; }', 'x')
  assert.equal(out, `${S('x')} .a { color: red; }\n${S('x')} .b { color: blue; }`)
})

test('does NOT prefix keyframe steps', () => {
  const css = '@keyframes spin { from { opacity: 0; } to { opacity: 1; } }'
  const out = scopeCss(css, 'x')
  assert.ok(!out.includes(`${S('x')} from`), 'from step must not be scoped')
  assert.ok(!out.includes(`${S('x')} to`), 'to step must not be scoped')
  assert.ok(out.includes('@keyframes spin'), 'keyframes block is preserved')
})

test('does NOT prefix percentage keyframe steps', () => {
  const css = '@keyframes p { 0% { opacity: 0; } 100% { opacity: 1; } }'
  const out = scopeCss(css, 'x')
  assert.ok(!out.includes(`${S('x')} 0%`))
  assert.ok(!out.includes(`${S('x')} 100%`))
})

test('scopes selectors inside @media but not the @media rule itself', () => {
  const out = scopeCss('@media (max-width: 600px) { .a { color: red; } }', 'x')
  assert.ok(out.includes('@media (max-width: 600px)'), 'media query preserved')
  assert.ok(!out.includes(`${S('x')} @media`), 'the at-rule itself must not be scoped')
  assert.ok(out.includes(`${S('x')} .a`), 'inner selector must be scoped')
})

test('recognises an at-rule even when a comment precedes it', () => {
  // Regression: a `/* Responsive */` comment before @media made the at-rule
  // look like a selector, so the @media itself got scoped and its inner rules
  // did not -- silently breaking every rule in the block.
  const out = scopeCss('/* Responsive */\n@media (max-width: 480px) { .a { color: red; } }', 'x')
  assert.ok(!out.includes(`${S('x')} @media`), 'at-rule must not be scoped')
  assert.ok(!out.includes(`${S('x')} /*`), 'comment must not be scoped')
  assert.ok(out.includes('/* Responsive */'), 'comment preserved')
  assert.ok(out.includes(`${S('x')} .a`), 'inner selector must be scoped')
})

test('recognises @keyframes even when a comment precedes it', () => {
  const out = scopeCss('/* anim */\n@keyframes k { from { opacity: 0; } }', 'x')
  assert.ok(!out.includes(`${S('x')} from`), 'keyframe step must not be scoped')
  assert.ok(!out.includes(`${S('x')} @keyframes`), 'at-rule must not be scoped')
})

test('handles descendant and compound selectors', () => {
  assert.equal(
    scopeCss('.a .b > .c { color: red; }', 'x'),
    `${S('x')} .a .b > .c { color: red; }`,
  )
})

test('leaves comments alone and still scopes following rules', () => {
  const out = scopeCss('/* note { not a rule } */\n.a { color: red; }', 'x')
  assert.ok(out.includes(`${S('x')} .a`))
})

test('returns empty string for empty or missing input', () => {
  assert.equal(scopeCss('', 'x'), '')
  assert.equal(scopeCss(undefined, 'x'), '')
})

test('does not double-scope an already scoped selector', () => {
  const once = scopeCss('.a { color: red; }', 'x')
  assert.equal(scopeCss(once, 'x'), once)
})
