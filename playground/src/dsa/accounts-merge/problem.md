# Accounts Merge (LeetCode #721)

## Category

🟢 IMPORTANT (Union-Find + Graph Modeling)

You are given a list of accounts where:

```text
  accounts[i] = [name, email1, email2, ...]
```

All accounts belong to the same person IF they share
at least ONE common email.

Your task:
- Merge accounts that belong to the same person
- Return merged accounts in the format:
```text
    [name, sorted unique emails...]
```

Example:

```text
  Input:
  [
    ["John","johnsmith@mail.com","john_newyork@mail.com"],
    ["John","johnsmith@mail.com","john00@mail.com"],
    ["Mary","mary@mail.com"],
    ["John","johnnybravo@mail.com"]
  ]
```

```text
  Output:
  [
    ["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],
    ["Mary","mary@mail.com"],
    ["John","johnnybravo@mail.com"]
  ]
```

Constraints:
- 1 <= accounts.length <= 1000
- Total emails <= 10000
- Names may repeat, but emails uniquely identify people

## Intuition

What Is REALLY Being Merged?

The trick is to ignore "accounts" entirely.

Key Insight (VERY IMPORTANT):

```text
  Emails are the TRUE nodes.
  Accounts are just GROUPINGS of emails.
```

Two accounts belong to the same person IF:
```text
  - Their email nodes are connected (directly or indirectly)
```

So this is a CONNECTED COMPONENTS problem
on a graph of EMAILS.

WHY UNION-FIND IS A GREAT FIT

In each account:
```text
  - All emails belong to the SAME person
  - So they must be UNIONED together
```

Across accounts:
```text
  - Shared emails automatically connect components
```

Union-Find efficiently:
- Merges email groups
- Helps identify final connected components

ALGORITHM (UNION-FIND + GROUPING)

1. Assign each unique email an integer ID

2. Initialize Union-Find over all email IDs

3. For each account:
```text
     - Union the FIRST email with all other emails in the account
```

4. After processing all accounts:
```text
     - Emails with the same root belong to the same person
```

5. Group emails by root

6. For each group:
```text
     - Sort emails
     - Prepend account holder name
```

TIME & SPACE COMPLEXITY

Let:
- E = total number of unique emails

Time:
```text
  O(E log E)  (sorting emails)
```

Space:
```text
  O(E)
```

WHY THIS PROBLEM IS 🟢 IMPORTANT

Interviewers are testing:
- Graph modeling ability (emails as nodes)
- Union-Find beyond integers
- Ability to cleanly post-process components

This problem separates "DSU memorization"
from "DSU understanding".
