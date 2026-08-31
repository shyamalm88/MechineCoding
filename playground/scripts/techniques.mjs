/**
 * Derive technique tags from a problem's own source text.
 *
 * Nothing is hand-tagged: every DSA file already names its approach in the
 * header ("INTUITION: Multi-Source BFS", "APPROACH: Sort by Deadline +
 * Max-Heap"), so the tags are read back out of the prose rather than
 * maintained as a second list that would drift from the code.
 *
 * A problem can carry several tags -- Word Ladder is BFS, Course Schedule is
 * both DFS and Topological Sort -- which is the point: technique cuts ACROSS
 * the folder categories.
 */
export const TECHNIQUES = [
  ['BFS', /\bBFS\b|breadth[-\s]first/i],
  ['DFS', /\bDFS\b|depth[-\s]first/i],
  ['Backtracking', /\bbacktrack/i],
  ['Union-Find', /union[-\s]?find|disjoint[-\s]set/i],
  ['Topological Sort', /topological|\bin-?degree\b/i],
  ['Dijkstra', /dijkstra/i],
  ['Two Pointers', /two[-\s]pointers?/i],
  ['Fast & Slow Pointers', /fast[-\s]and[-\s]slow|tortoise/i],
  ['Sliding Window', /sliding[-\s]window/i],
  // "binary search TREE" is a data structure, not the search technique.
  ['Binary Search', /binary\s+search(?!\s+tree)/i],
  ['Dynamic Programming', /\bDP\b|dynamic\s+programming|memoiz/i],
  ['Greedy', /\bgreedy\b/i],
  ['Heap', /\bheaps?\b|priority\s+queue/i],
  ['Monotonic Stack', /monotonic/i],
  ['Trie', /\btrie\b/i],
  ['Prefix Sum', /prefix\s+sum/i],
  ['Bit Manipulation', /bit\s+manipulation|bitwise|\bXOR\b/i],
  ['Recursion', /\brecursi(on|ve|vely)\b/i],
]

/** Tags present in `source`, in the fixed order above so output is stable. */
export function detectTechniques(source) {
  return TECHNIQUES.filter(([, pattern]) => pattern.test(source)).map(([name]) => name)
}
