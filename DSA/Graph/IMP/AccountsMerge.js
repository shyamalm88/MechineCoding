/**
 * ============================================================================
 * PROBLEM: Accounts Merge (LeetCode #721)
 * CATEGORY: 🟢 IMPORTANT (Union-Find + Graph Modeling)
 * ============================================================================
 *
 * You are given a list of accounts where:
 *
 *   accounts[i] = [name, email1, email2, ...]
 *
 * All accounts belong to the same person IF they share
 * at least ONE common email.
 *
 * Your task:
 * - Merge accounts that belong to the same person
 * - Return merged accounts in the format:
 *     [name, sorted unique emails...]
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   Input:
 *   [
 *     ["John","johnsmith@mail.com","john_newyork@mail.com"],
 *     ["John","johnsmith@mail.com","john00@mail.com"],
 *     ["Mary","mary@mail.com"],
 *     ["John","johnnybravo@mail.com"]
 *   ]
 *
 *   Output:
 *   [
 *     ["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],
 *     ["Mary","mary@mail.com"],
 *     ["John","johnnybravo@mail.com"]
 *   ]
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - 1 <= accounts.length <= 1000
 * - Total emails <= 10000
 * - Names may repeat, but emails uniquely identify people
 *
 * ============================================================================
 * INTUITION: What Is REALLY Being Merged?
 * ============================================================================
 *
 * The trick is to ignore "accounts" entirely.
 *
 * Key Insight (VERY IMPORTANT):
 *
 *   Emails are the TRUE nodes.
 *   Accounts are just GROUPINGS of emails.
 *
 * Two accounts belong to the same person IF:
 *   - Their email nodes are connected (directly or indirectly)
 *
 * So this is a CONNECTED COMPONENTS problem
 * on a graph of EMAILS.
 *
 * ============================================================================
 * WHY UNION-FIND IS A GREAT FIT
 * ============================================================================
 *
 * In each account:
 *   - All emails belong to the SAME person
 *   - So they must be UNIONED together
 *
 * Across accounts:
 *   - Shared emails automatically connect components
 *
 * Union-Find efficiently:
 * - Merges email groups
 * - Helps identify final connected components
 *
 * ============================================================================
 * ALGORITHM (UNION-FIND + GROUPING)
 * ============================================================================
 *
 * 1. Assign each unique email an integer ID
 *
 * 2. Initialize Union-Find over all email IDs
 *
 * 3. For each account:
 *      - Union the FIRST email with all other emails in the account
 *
 * 4. After processing all accounts:
 *      - Emails with the same root belong to the same person
 *
 * 5. Group emails by root
 *
 * 6. For each group:
 *      - Sort emails
 *      - Prepend account holder name
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - E = total number of unique emails
 *
 * Time:
 *   O(E log E)  (sorting emails)
 *
 * Space:
 *   O(E)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🟢 IMPORTANT
 * ============================================================================
 *
 * Interviewers are testing:
 * - Graph modeling ability (emails as nodes)
 * - Union-Find beyond integers
 * - Ability to cleanly post-process components
 *
 * This problem separates "DSU memorization"
 * from "DSU understanding".
 * ============================================================================
 */

function accountsMerge(accounts) {
  // -------------------------------
  // Step 1: Map emails to IDs
  // -------------------------------
  const emailToId = new Map();
  const emailToName = new Map();
  let id = 0;

  for (const account of accounts) {
    const name = account[0];
    for (let i = 1; i < account.length; i++) {
      const email = account[i];
      if (!emailToId.has(email)) {
        emailToId.set(email, id++);
        emailToName.set(email, name);
      }
    }
  }

  // -------------------------------
  // Union-Find setup
  // -------------------------------
  const parent = Array.from({ length: id }, (_, i) => i);
  const rank = Array(id).fill(0);

  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x, y) {
    const px = find(x);
    const py = find(y);
    if (px === py) return;

    if (rank[px] < rank[py]) {
      parent[px] = py;
    } else if (rank[px] > rank[py]) {
      parent[py] = px;
    } else {
      parent[py] = px;
      rank[px]++;
    }
  }

  // -------------------------------
  // Step 2: Union emails within accounts
  // -------------------------------
  for (const account of accounts) {
    const firstEmail = account[1];
    const firstId = emailToId.get(firstEmail);

    for (let i = 2; i < account.length; i++) {
      union(firstId, emailToId.get(account[i]));
    }
  }

  // -------------------------------
  // Step 3: Group emails by root
  // -------------------------------
  const groups = new Map();

  for (const [email, emailId] of emailToId.entries()) {
    const root = find(emailId);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(email);
  }

  // -------------------------------
  // Step 4: Build result
  // -------------------------------
  const result = [];

  for (const emails of groups.values()) {
    emails.sort();
    const name = emailToName.get(emails[0]);
    result.push([name, ...emails]);
  }

  return result;
}
