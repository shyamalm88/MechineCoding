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
