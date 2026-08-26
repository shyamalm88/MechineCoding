/**
 * Build the page list with ellipses: 1 … 4 5 6 … 20
 *
 * Kept pure and separate from the component so the (fiddly) window logic is
 * testable in isolation.
 */
export function buildPages(current, total, siblings = 1) {
  const totalSlots = siblings * 2 + 5 // first, last, current, 2 ellipses
  if (total <= totalSlots) return range(1, total)

  const left = Math.max(current - siblings, 1)
  const right = Math.min(current + siblings, total)

  // Only show an ellipsis if it replaces MORE THAN ONE page -- otherwise
  // "1 … 3" is silly when it stands in for just page 2.
  const showLeftDots = left > 2
  const showRightDots = right < total - 1

  if (!showLeftDots && showRightDots) return [...range(1, totalSlots - 2), '…', total]
  if (showLeftDots && !showRightDots) return [1, '…', ...range(total - (totalSlots - 3), total)]
  return [1, '…', ...range(left, right), '…', total]
}

const range = (start, end) =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i)
