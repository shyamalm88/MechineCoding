/**
 * Reorganizes IDs: Odds (Desc) followed by Evens (Asc).
 * Time: O(n log n) | Space: O(1) or O(n) depending on Sort implementation
 */
function reorganizeInventory(ids) {
  if (!Array.isArray(ids) || ids.length < 2) return ids;

  return ids.sort((a, b) => {
    const isAOdd = a % 2 !== 0;
    const isBOdd = b % 2 !== 0;

    // 1. If one is odd and other is even, Odd comes first
    if (isAOdd !== isBOdd) {
      return isAOdd ? -1 : 1;
    }

    // 2. Both are Odd -> Descending
    if (isAOdd) {
      return b - a;
    }

    // 3. Both are Even -> Ascending
    return a - b;
  });
}
