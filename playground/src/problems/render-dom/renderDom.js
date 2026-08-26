/**
 * Build real DOM from a virtual-node object -- the core of what a framework's
 * "create element" step does.
 *
 * vnode = { type, props: { children: [...], ...attrs } } | string | number
 */
export function renderDom(vnode) {
  if (vnode == null || typeof vnode === 'boolean') return document.createTextNode('')
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    // createTextNode, never innerHTML -- text must never be parsed as markup.
    return document.createTextNode(String(vnode))
  }

  const { type, props = {} } = vnode
  const el = document.createElement(type)

  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue

    if (key === 'className') { el.setAttribute('class', value); continue }
    if (key === 'style' && typeof value === 'object') { Object.assign(el.style, value); continue }
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value)
      continue
    }
    // Booleans: present-or-absent, not the string "false".
    if (typeof value === 'boolean') { value ? el.setAttribute(key, '') : el.removeAttribute(key) }
    else el.setAttribute(key, value)
  }

  const children = props.children ?? []
  for (const child of Array.isArray(children) ? children.flat(Infinity) : [children]) {
    el.appendChild(renderDom(child))
  }
  return el
}

/** Tiny hyperscript helper so trees are readable to write. */
export const h = (type, props, ...children) => ({ type, props: { ...props, children } })
