---
title: SQL + NoSQL — Interview Preparation
tags:
  - sql
  - database
  - nosql
  - postgresql
  - mysql
  - mongodb
  - redis
  - cassandra
  - dynamodb
  - spring-boot
  - hibernate
  - jdbc
  - system-design
  - interview
---

# SQL + NoSQL — Interview Preparation

> [!note]
> This note is designed for a Java/Spring Boot full-stack developer preparing for senior interviews.
>
> The goal is not to memorize SQL syntax.
>
> Learn databases through:
>
> **Data model → Query → Index → Execution plan → Transaction → Concurrency → Scaling → Failure → Trade-off**

---

# PART I — DATABASE FUNDAMENTALS

# 1. What is a Database?

A database is a system for storing, organizing, retrieving, and modifying data.

A production database must typically address:

```text
Storage
Querying
Transactions
Concurrency
Durability
Availability
Recovery
Security
Scalability
```

Do not think of a database as simply:

```text
"place where data is stored"
```

A database also provides guarantees and mechanisms around that data.

---

# 2. DBMS vs Database

A database is the stored data.

A DBMS is the software that manages it.

Examples:

```text
PostgreSQL
MySQL
Oracle
SQL Server
MongoDB
Cassandra
DynamoDB
```

---

# 3. SQL vs NoSQL

SQL databases generally provide:

```text
relational data model
tables
rows
columns
SQL
strong transactional capabilities
joins
constraints
```

NoSQL is a broad category that includes:

```text
document
key-value
wide-column
graph
```

Important:

> NoSQL does not mean "no SQL" and does not automatically mean "eventually consistent."

---

# 4. Main Database Categories

```text
Relational
 ├── PostgreSQL
 ├── MySQL
 └── Oracle

Document
 ├── MongoDB
 └── Couchbase

Key-Value
 ├── DynamoDB
 └── Redis

Wide Column
 ├── Cassandra
 └── HBase

Graph
 ├── Neo4j
 └── Amazon Neptune
```

Different databases optimize for different access patterns.

---

# 5. How to Choose a Database

Ask:

```text
What data model?
What queries?
What consistency?
What transaction requirements?
What scale?
What latency?
What write/read ratio?
What relationship complexity?
What availability requirement?
What operational ecosystem?
```

Never answer:

> "MongoDB because it is scalable."

That is incomplete.

---

# PART II — RELATIONAL / SQL

# 6. What is a Relational Database?

Data is represented using:

```text
tables
rows
columns
relationships
```

Example:

```text
users
--------------------------------
id | name | email
--------------------------------
1  | Alice | alice@example.com
2  | Bob   | bob@example.com
```

Relationships are represented using keys.

---

# 7. Primary Key

A primary key uniquely identifies a row.

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100)
);
```

Properties:

```text
unique
not null
stable identity
```

A primary key can be:

```text
single-column
composite
```

---

# 8. Foreign Key

Represents a relationship between tables.

```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Benefits:

```text
referential integrity
```

The database can prevent invalid references.

---

# 9. Unique Constraint

```sql
email VARCHAR(255) UNIQUE
```

Useful when the business rule requires uniqueness.

Important:

> Application-level checks alone are not enough for concurrency-safe uniqueness.

Better:

```text
application validation
+
database unique constraint
```

---

# 10. NOT NULL

```sql
name VARCHAR(100) NOT NULL
```

Use database constraints to protect invariants.

Do not rely entirely on application validation.

---

# 11. CHECK Constraint

```sql
age INT CHECK (age >= 0)
```

Useful for enforcing database-level invariants.

---

# 12. Normalization

Normalization reduces redundancy and update anomalies.

Common levels:

```text
1NF
2NF
3NF
BCNF
```

For most application interviews, understand:

```text
1NF → atomic values
2NF → remove partial dependency
3NF → remove transitive dependency
```

---

# 13. Denormalization

Denormalization intentionally duplicates data to improve:

```text
read performance
query simplicity
reporting
```

Trade-offs:

```text
duplicate data
update complexity
consistency challenges
storage
```

Senior answer:

> Normalize by default for correctness, then denormalize based on measured workload and access patterns.

---

# 14. SQL SELECT

Basic:

```sql
SELECT id, name
FROM users;
```

Avoid:

```sql
SELECT *
```

when you do not need every column.

Benefits:

```text
less data transfer
less memory
clearer contracts
better projection
```

---

# 15. WHERE

```sql
SELECT *
FROM users
WHERE status = 'ACTIVE';
```

Filtering should ideally happen as close to the database as practical.

---

# 16. ORDER BY

```sql
SELECT *
FROM users
ORDER BY created_at DESC;
```

Sorting can be expensive.

Indexes can sometimes support ordering efficiently.

---

# 17. LIMIT / OFFSET

```sql
SELECT *
FROM users
ORDER BY id
LIMIT 50 OFFSET 1000;
```

Simple but large offsets can become inefficient.

---

# 18. Keyset / Cursor Pagination

Instead of:

```sql
OFFSET 100000
```

use a cursor/key:

```sql
SELECT *
FROM users
WHERE id > 100000
ORDER BY id
LIMIT 50;
```

Benefits:

```text
better large-scale pagination
stable traversal
less work than huge offsets
```

Trade-off:

```text
more complex navigation
```

---

# 19. INNER JOIN

Returns matching rows.

```sql
SELECT u.id, o.id
FROM users u
INNER JOIN orders o
    ON o.user_id = u.id;
```

---

# 20. LEFT JOIN

Returns all rows from the left table.

```sql
SELECT u.id, o.id
FROM users u
LEFT JOIN orders o
    ON o.user_id = u.id;
```

Users without orders can still appear.

---

# 21. RIGHT JOIN

Conceptually the reverse of LEFT JOIN.

In practice, many teams prefer rewriting it as a LEFT JOIN for readability.

---

# 22. FULL OUTER JOIN

Returns matching and non-matching rows from both sides.

Availability depends on the database.

---

# 23. CROSS JOIN

Cartesian product.

```text
3 users × 4 products
= 12 combinations
```

Use deliberately.

---

# 24. JOIN vs Subquery

Both can solve overlapping problems.

Do not claim:

> "JOIN is always faster."

The optimizer and query shape determine performance.

Use:

```text
clarity
correctness
execution plan
```

to choose.

---

# 25. GROUP BY

```sql
SELECT status, COUNT(*)
FROM users
GROUP BY status;
```

Used for aggregation.

---

# 26. HAVING

Filters groups after aggregation.

```sql
SELECT user_id, COUNT(*)
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 10;
```

Remember:

```text
WHERE → filters rows
HAVING → filters groups
```

---

# 27. COUNT

```sql
SELECT COUNT(*)
FROM users;
```

Understand the distinction between:

```text
COUNT(*)
COUNT(column)
COUNT(DISTINCT column)
```

`COUNT(column)` does not count NULL values.

---

# 28. DISTINCT

```sql
SELECT DISTINCT country
FROM users;
```

Useful, but may require sorting/hashing and can become expensive on large datasets.

---

# 29. UNION vs UNION ALL

```sql
UNION
```

removes duplicates.

```sql
UNION ALL
```

keeps duplicates and generally avoids the duplicate-removal cost.

Use `UNION ALL` when duplicate elimination is not required.

---

# 30. NULL

NULL means:

```text
unknown / missing / absent value
```

It is not:

```text
0
''
false
```

Incorrect:

```sql
WHERE email = NULL
```

Correct:

```sql
WHERE email IS NULL
```

---

# 31. Three-Valued Logic

SQL conditions can evaluate to:

```text
TRUE
FALSE
UNKNOWN
```

NULL participates in this behavior.

This is why SQL logic can surprise developers coming from Java/JavaScript.

---

# 32. COALESCE

```sql
SELECT COALESCE(display_name, 'Unknown')
FROM users;
```

Returns the first non-null expression.

---

# 33. CASE

```sql
SELECT
    CASE
        WHEN status = 'ACTIVE' THEN 'A'
        ELSE 'I'
    END
FROM users;
```

Useful for conditional projections.

---

# 34. Subquery

```sql
SELECT *
FROM users
WHERE id IN (
    SELECT user_id
    FROM orders
);
```

Subqueries can appear in:

```text
SELECT
FROM
WHERE
HAVING
```

---

# 35. EXISTS

```sql
SELECT *
FROM users u
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.user_id = u.id
);
```

Useful when you care about existence rather than retrieving matching rows.

---

# 36. Correlated Subquery

A correlated subquery refers to the outer query.

```sql
SELECT *
FROM users u
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.user_id = u.id
);
```

The inner query depends on each outer row conceptually.

The optimizer may transform the execution strategy.

---

# 37. Common Table Expression — CTE

```sql
WITH active_users AS (
    SELECT *
    FROM users
    WHERE status = 'ACTIVE'
)
SELECT *
FROM active_users;
```

CTEs improve readability and can support recursive queries.

Do not assume a CTE always materializes or always improves performance; behavior depends on database/version/query.

---

# 38. Window Functions

Window functions perform calculations across related rows without collapsing them.

Example:

```sql
SELECT
    user_id,
    amount,
    ROW_NUMBER() OVER (
        PARTITION BY user_id
        ORDER BY created_at DESC
    ) AS rn
FROM orders;
```

Important:

```text
ROW_NUMBER
RANK
DENSE_RANK
LAG
LEAD
SUM() OVER
AVG() OVER
```

This is a high-value senior SQL topic.

---

# 39. ROW_NUMBER vs RANK vs DENSE_RANK

Suppose scores:

```text
100
100
90
```

`ROW_NUMBER`:

```text
1
2
3
```

`RANK`:

```text
1
1
3
```

`DENSE_RANK`:

```text
1
1
2
```

---

# 40. SQL Execution Order

Conceptual logical order:

```text
FROM
JOIN
WHERE
GROUP BY
HAVING
SELECT
DISTINCT
ORDER BY
LIMIT/OFFSET
```

This explains why a SELECT alias cannot always be referenced in WHERE.

---

# 41. Query Execution Plan

Use:

```sql
EXPLAIN
```

or database-specific execution-plan tools.

Look for:

```text
index scan
sequential/table scan
join strategy
estimated rows
actual rows
sort
hash
cost
```

For real performance investigation, inspect actual execution behavior where supported.

---

# 42. Index

An index is an additional data structure that helps the database locate rows more efficiently.

Without useful index:

```text
table scan
```

With useful index:

```text
index lookup
 ↓
target rows
```

Indexes are not free.

---

# 43. Index Trade-Off

Indexes improve some reads but cost:

```text
storage
INSERT cost
UPDATE cost
DELETE cost
maintenance
```

Therefore:

> Index based on access patterns, not on every column.

---

# 44. B-Tree Index

Common default index structure.

Useful for many:

```text
equality
range
ordering
prefix-related
```

queries, depending on database and operator.

---

# 45. Hash Index

Hash-based indexes are optimized for equality-style lookups in systems that support them.

They generally do not provide the same range-ordering behavior as B-tree indexes.

Do not assume hash indexes are universally faster.

---

# 46. Composite Index

Example:

```sql
CREATE INDEX idx_orders_user_status
ON orders(user_id, status);
```

Column order matters.

Think:

```text
(user_id, status)
```

is not equivalent to:

```text
(status, user_id)
```

for every query.

---

# 47. Leftmost Prefix

For:

```text
INDEX(a, b, c)
```

queries filtering by:

```text
a
a,b
a,b,c
```

can often use the leading index columns effectively.

A query only on:

```text
b
```

may not benefit in the same way.

Exact optimizer behavior depends on the database.

---

# 48. Covering Index

If an index contains all columns required by a query, the database may be able to answer the query primarily from the index.

Example:

```sql
CREATE INDEX idx_user_status_name
ON users(status, name);
```

Query:

```sql
SELECT name
FROM users
WHERE status = 'ACTIVE';
```

Potential benefit:

```text
less table access
```

---

# 49. Selectivity

An index is generally more useful when it can significantly narrow the candidate rows.

Example:

```text
email → highly selective
gender → potentially low selectivity
```

But selectivity is not the only factor.

Query shape and workload matter.

---

# 50. Sargability

A predicate is more index-friendly when the database can use the indexed column directly.

Potentially problematic:

```sql
WHERE LOWER(email) = 'alice@example.com'
```

depending on index design.

Better options may include:

```text
functional index
normalized column
database-specific expression index
```

---

# 51. Function on Indexed Column

Example:

```sql
WHERE YEAR(created_at) = 2026
```

may prevent a normal index on `created_at` from being used efficiently.

Often better:

```sql
WHERE created_at >= '2026-01-01'
  AND created_at < '2027-01-01'
```

Exact behavior depends on the optimizer.

---

# 52. LIKE and Indexes

Potentially:

```sql
WHERE email LIKE 'alice%'
```

can use an appropriate B-tree index.

But:

```sql
WHERE email LIKE '%alice%'
```

is generally harder for a normal B-tree index.

For search-heavy requirements, consider:

```text
full-text search
trigram indexes
search engines
```

depending on workload.

---

# 53. Indexing Foreign Keys

Foreign-key columns are often good index candidates because applications frequently:

```text
JOIN
filter
delete/update parent-child relationships
```

But index based on actual queries and database behavior.

---

# 54. ACID

```text
Atomicity
Consistency
Isolation
Durability
```

### Atomicity

All-or-nothing transaction.

### Consistency

Transaction preserves defined data invariants.

### Isolation

Concurrent transactions should not improperly interfere.

### Durability

Committed data survives failures according to the database's durability guarantees.

---

# 55. Transaction

Example:

```text
Transfer ₹100

Debit A
Credit B
```

Both operations should belong to one transaction.

```text
BEGIN
 ↓
debit
 ↓
credit
 ↓
COMMIT
```

Failure:

```text
ROLLBACK
```

---

# 56. Autocommit

Many JDBC configurations use autocommit by default.

Conceptually:

```text
each statement
 ↓
transaction
 ↓
commit
```

Frameworks such as Spring commonly manage transaction boundaries explicitly.

---

# 57. Isolation Levels

Common:

```text
READ UNCOMMITTED
READ COMMITTED
REPEATABLE READ
SERIALIZABLE
```

Different databases can implement these differently.

---

# 58. Dirty Read

Transaction A reads data written by transaction B before B commits.

```text
B writes 100
A reads 100
B rolls back
```

A saw data that never committed.

---

# 59. Non-Repeatable Read

Transaction A reads a row.

Transaction B changes and commits it.

Transaction A reads again and gets a different value.

```text
A → 100
B → 200
A → 200
```

---

# 60. Phantom Read

A transaction repeats a range query and sees a different set of rows.

```text
A → 10 matching rows
B → inserts matching row
A → 11 rows
```

---

# 61. MVCC

Many modern databases use Multi-Version Concurrency Control.

Conceptually:

```text
multiple row versions
       ↓
readers can often avoid blocking writers
```

Exact implementation differs by database.

PostgreSQL, for example, has a sophisticated MVCC model.

---

# 62. Optimistic Locking

Common JPA pattern:

```java
@Version
private Long version;
```

Database concept:

```text
UPDATE ... WHERE id=? AND version=5
```

If no row updates:

```text
someone changed it
```

Useful when conflicts are relatively uncommon.

---

# 63. Pessimistic Locking

Database locks prevent conflicting operations from proceeding concurrently.

Examples:

```text
SELECT ... FOR UPDATE
```

Use carefully because locks can cause:

```text
blocking
deadlocks
lower concurrency
```

---

# 64. Deadlock

Example:

```text
Transaction A
locks row 1
waits for row 2

Transaction B
locks row 2
waits for row 1
```

Both wait.

Database detects the cycle and usually aborts one transaction.

Prevention:

```text
consistent lock ordering
short transactions
appropriate indexes
avoid unnecessary locks
retry safe transactions
```

---

# 65. Lost Update

Two transactions read the same value:

```text
A reads 100
B reads 100

A writes 110
B writes 120
```

A's update is effectively lost.

Solutions:

```text
optimistic locking
pessimistic locking
atomic SQL update
appropriate transaction isolation
```

---

# 66. Atomic Update

Instead of:

```text
read balance
calculate
write balance
```

use:

```sql
UPDATE accounts
SET balance = balance - 100
WHERE id = 1
  AND balance >= 100;
```

Then inspect affected rows.

This can avoid race conditions that application-side read-modify-write introduces.

---

# 67. Constraint vs Application Validation

Suppose two requests create:

```text
email = alice@example.com
```

Both check:

```text
does email exist?
→ no
```

Both insert.

Without a database uniqueness constraint, duplicates can happen.

Correct design:

```text
application validation
+
UNIQUE constraint
```

---

# 68. Referential Integrity

Foreign keys can enforce:

```text
child references existing parent
```

Without database enforcement, application bugs can create orphan records.

---

# 69. Cascade Delete

Possible:

```text
delete user
 ↓
delete orders
```

But cascading deletes can become dangerous at scale.

Always understand:

```text
how many rows?
locking?
transaction duration?
business semantics?
```

---

# 70. Stored Procedures

Stored procedures move some logic into the database.

Potential benefits:

```text
centralized DB logic
reduced network round trips
security boundaries
```

Trade-offs:

```text
deployment complexity
testing
portability
developer tooling
logic split across layers
```

Use based on architecture and organizational needs.

---

# 71. Views

A view is a stored query abstraction.

```sql
CREATE VIEW active_users AS
SELECT *
FROM users
WHERE status = 'ACTIVE';
```

Useful for:

```text
abstraction
reporting
security boundaries
query reuse
```

Materialized views physically store results in databases that support them.

---

# 72. Materialized View

Instead of computing a complex query every time:

```text
base tables
 ↓
materialized result
```

Queries can be faster.

But refresh strategy creates:

```text
staleness
storage
refresh cost
```

---

# 73. Partitioning

Partitioning divides a large table into smaller physical partitions.

Example:

```text
orders
 ├── 2025
 ├── 2026-01
 ├── 2026-02
 └── 2026-03
```

Potential benefits:

```text
partition pruning
maintenance
data lifecycle
large-table management
```

Partitioning is not the same as sharding.

---

# 74. Sharding

Sharding distributes data across independent database nodes.

```text
Shard 1 → users A-F
Shard 2 → users G-M
Shard 3 → users N-Z
```

Benefits:

```text
horizontal storage scaling
write scaling
```

Costs:

```text
cross-shard queries
rebalancing
transactions
operational complexity
```

---

# 75. Partitioning vs Sharding

```text
Partitioning
→ divides data within a database system

Sharding
→ distributes data across database nodes/instances
```

---

# 76. Read Replicas

Architecture:

```text
Primary
 ├── writes
 └── replication
      ├── Replica 1
      └── Replica 2
```

Read replicas improve read scalability.

But replication can be asynchronous.

Therefore:

```text
write primary
immediately read replica
```

may return stale data.

---

# 77. Read-After-Write Consistency

User:

```text
POST /profile
```

Then:

```text
GET /profile
```

If GET goes to a lagging replica:

```text
old data
```

Possible strategies:

```text
route critical reads to primary
session/consistency-aware routing
replication wait
application-level versioning
```

---

# 78. Connection Pool

Applications use connection pools such as HikariCP.

Pool:

```text
Application Threads
       ↓
Connection Pool
 ├── C1
 ├── C2
 ├── C3
 └── C4
       ↓
Database
```

Pool too small:

```text
threads wait
```

Pool too large:

```text
DB overload
context switching
memory usage
```

---

# 79. Database Connection Pool Exhaustion

Symptoms:

```text
connection timeout
request latency spikes
threads waiting
```

Investigate:

```text
slow queries
long transactions
connection leaks
pool size
DB max connections
traffic
```

Do not automatically increase the pool.

---

# 80. SQL Injection

Bad:

```java
String sql =
    "SELECT * FROM users WHERE email = '" +
    email + "'";
```

Use:

```text
PreparedStatement
parameter binding
```

ORM frameworks help, but unsafe dynamic SQL can still create injection vulnerabilities.

---

# 81. ORM Does Not Replace SQL Knowledge

Hibernate/JPA can generate SQL.

You still need to understand:

```text
joins
indexes
execution plans
transactions
locks
query cardinality
N+1
pagination
```

---

# 82. SQL Performance Debugging

Approach:

```text
1. Identify slow query
2. Measure actual latency
3. Inspect execution plan
4. Check row estimates
5. Check indexes
6. Check joins
7. Check sorting
8. Check data volume
9. Check locking
10. Optimize
11. Measure again
```

Do not optimize from intuition alone.

---

# 83. Query Cardinality

Cardinality is the number of rows produced by an operation.

Example:

```text
users = 1M
orders = 10M
```

A poorly designed join can generate a huge intermediate result.

Understanding cardinality is critical for query optimization.

---

# 84. Select N+1 Problem

Application:

```text
SELECT users
```

then:

```text
SELECT orders WHERE user_id = ?
```

for every user.

Example:

```text
1 + 100 = 101 queries
```

Solutions:

```text
JOIN
fetch join
batch query
projection
```

---

# 85. Database Index Does Not Always Improve Query

An index may be ignored because:

```text
low selectivity
small table
query returns large percentage of rows
function prevents use
statistics
optimizer cost model
```

The execution plan tells you what happened.

---

# 86. Statistics

Query optimizers use statistics to estimate:

```text
row counts
selectivity
distribution
cost
```

Stale statistics can lead to poor execution plans.

---

# 87. SQL Query Question: Second Highest Salary

One possible solution:

```sql
SELECT MAX(salary)
FROM employees
WHERE salary < (
    SELECT MAX(salary)
    FROM employees
);
```

But interviewers may follow up:

```text
What about duplicate salaries?
What if no second salary exists?
Can you use DENSE_RANK?
```

Window function:

```sql
SELECT salary
FROM (
    SELECT
        salary,
        DENSE_RANK() OVER (
            ORDER BY salary DESC
        ) AS rnk
    FROM employees
) x
WHERE rnk = 2;
```

---

# 88. SQL Query: Find Duplicate Emails

```sql
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

---

# 89. SQL Query: Delete Duplicates

Do not blindly delete duplicates.

First identify:

```text
canonical row
duplicate rows
business rules
foreign-key dependencies
```

A window function can help identify duplicates:

```sql
ROW_NUMBER() OVER (
    PARTITION BY email
    ORDER BY id
)
```

Then delete rows where:

```text
row_number > 1
```

with careful transaction/testing.

---

# 90. SQL Query: Latest Record Per User

```sql
SELECT *
FROM (
    SELECT
        o.*,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY created_at DESC
        ) AS rn
    FROM orders o
) x
WHERE rn = 1;
```

This is a high-value SQL interview pattern.

---

# 91. SQL Query: Top N Per Group

Use:

```text
ROW_NUMBER
RANK
DENSE_RANK
```

Example:

```sql
SELECT *
FROM (
    SELECT
        department,
        employee,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department
            ORDER BY salary DESC
        ) AS rnk
    FROM employees
) x
WHERE rnk <= 3;
```

---

# 92. SQL Query: Running Total

```sql
SELECT
    created_at,
    amount,
    SUM(amount) OVER (
        ORDER BY created_at
    ) AS running_total
FROM payments;
```

---

# 93. SQL Query: Consecutive Records

Common approach:

```text
LAG
LEAD
ROW_NUMBER
date arithmetic
```

The exact solution depends on what "consecutive" means.

This is a good senior SQL problem because it tests window functions and reasoning.

---

# 94. SQL Interview Trap: WHERE vs HAVING

Wrong mental model:

```text
HAVING filters rows
```

Better:

```text
WHERE → before grouping
HAVING → after grouping
```

---

# 95. SQL Interview Trap: DELETE vs TRUNCATE vs DROP

### DELETE

```text
row-level deletion
can use WHERE
transaction behavior depends on DB
```

### TRUNCATE

```text
remove table contents efficiently
usually no WHERE
database-specific transactional/locking semantics
```

### DROP

```text
remove the table/object itself
```

Never claim identical behavior across all databases.

---

# 96. SQL Interview Trap: UNION vs UNION ALL

```text
UNION
→ removes duplicates

UNION ALL
→ keeps duplicates
```

If deduplication is unnecessary:

```text
UNION ALL
```

is generally preferable.

---

# 97. SQL Interview Trap: COUNT(*)

`COUNT(*)` counts rows.

`COUNT(column)` ignores NULL values.

This is frequently asked.

---

# 98. SQL Interview Trap: NULL

Remember:

```sql
NULL = NULL
```

does not evaluate to TRUE.

Use:

```sql
IS NULL
IS NOT NULL
```

---

# 99. SQL Interview Trap: LEFT JOIN + WHERE

Consider:

```sql
SELECT *
FROM users u
LEFT JOIN orders o
    ON o.user_id = u.id
WHERE o.status = 'PAID';
```

The WHERE condition can eliminate NULL-extended rows and make the result behave like an inner join for that condition.

Moving the predicate:

```sql
LEFT JOIN orders o
    ON o.user_id = u.id
   AND o.status = 'PAID'
```

can preserve users without paid orders.

This is a classic interview trap.

---

# 100. SQL Interview Trap: DISTINCT as a Fix

Bad approach:

```text
JOIN creates duplicates
 ↓
add DISTINCT
```

First ask:

```text
Why did the join multiply rows?
```

`DISTINCT` may hide a data-model/query problem and can add cost.

---

# PART III — NOSQL

# 101. What is NoSQL?

NoSQL databases are non-relational database systems designed around different data models and scaling patterns.

Major categories:

```text
Document
Key-value
Wide-column
Graph
```

NoSQL often emphasizes:

```text
flexible schemas
horizontal scaling
high throughput
specific access patterns
```

But these are not universal properties of every NoSQL database.

---

# 102. Why NoSQL?

Possible reasons:

```text
very high write volume
horizontal scaling
flexible schema
document-oriented data
low-latency key access
large distributed datasets
specialized query patterns
```

Choose based on workload.

---

# 103. Document Database

Example:

```json
{
  "_id": "user-123",
  "name": "Alice",
  "email": "alice@example.com",
  "addresses": [
    {
      "city": "Bangalore",
      "type": "HOME"
    }
  ]
}
```

MongoDB is a common example.

---

# 104. Document vs Relational

Relational:

```text
users
addresses
orders
```

Document:

```text
user
 ├── profile
 ├── addresses
 └── preferences
```

Embedding can reduce joins.

But excessive embedding can create:

```text
large documents
update complexity
duplication
```

---

# 105. Embed vs Reference in MongoDB

Embed when:

```text
data belongs tightly to parent
read together
bounded size
same lifecycle
```

Reference when:

```text
large collection
independent lifecycle
many-to-many
frequently updated independently
```

---

# 106. MongoDB Indexes

MongoDB supports indexes on fields.

Example conceptually:

```javascript
db.users.createIndex({ email: 1 })
```

Indexes improve matching/sorting in suitable queries but consume storage and write resources.

---

# 107. MongoDB Compound Index

```javascript
db.orders.createIndex({
    userId: 1,
    createdAt: -1
})
```

Field order matters.

Think about:

```text
equality
sort
range
```

when designing compound indexes.

---

# 108. MongoDB Aggregation Pipeline

Example conceptual stages:

```text
$match
 ↓
$group
 ↓
$sort
 ↓
$limit
```

Useful for analytical/document transformations.

---

# 109. MongoDB Transactions

Modern MongoDB supports transactions.

But:

> The existence of transactions does not mean you should model every relational workload exactly as you would in SQL.

Good document modeling can reduce the need for cross-document transactions.

---

# 110. MongoDB Atomicity

MongoDB provides atomicity at the document level.

For multi-document operations, transaction support exists, but it introduces additional coordination/cost.

Design documents so common operations can often be handled within one document where practical.

---

# 111. DynamoDB

DynamoDB is a managed NoSQL key-value/document database.

Core concepts:

```text
table
item
partition key
sort key
GSI
LSI
provisioned/on-demand capacity
```

The most important DynamoDB mindset:

> Design the table around access patterns, not around normalization.

---

# 112. DynamoDB Partition Key

Partition key determines how items are distributed.

Bad:

```text
partition key = country
```

if:

```text
90% traffic = India
```

because it can create a hot partition/key.

Prefer keys with sufficient distribution.

---

# 113. DynamoDB Sort Key

A composite primary key:

```text
partition key + sort key
```

can support queries such as:

```text
customerId = 123
AND orderId begins with "2026"
```

depending on key design.

---

# 114. GSI vs LSI

### GSI

Global Secondary Index:

```text
different partition/sort key
```

Can be used across partitions and has independent capacity characteristics.

### LSI

Local Secondary Index:

```text
same partition key
different sort key
```

Defined as part of table creation.

---

# 115. DynamoDB Query vs Scan

### Query

Targets a specific partition key.

Generally efficient.

### Scan

Reads broadly across the table/index.

Can be expensive at scale.

Senior interview rule:

> Design access patterns so production requests use Query rather than large Scans.

---

# 116. DynamoDB Single-Table Design

Instead of:

```text
users
orders
payments
```

you may model multiple entity types in one table.

Example:

```text
PK=USER#123
SK=PROFILE

PK=USER#123
SK=ORDER#456

PK=USER#123
SK=ORDER#789
```

This is designed around access patterns.

---

# 117. Cassandra

Cassandra is a distributed wide-column database designed for:

```text
high write throughput
large distributed datasets
high availability
horizontal scaling
```

It uses a partitioned architecture.

---

# 118. Cassandra Data Modeling

Cassandra encourages:

> Query-first / access-pattern-first data modeling.

You often create tables specifically for queries.

This is different from normalized relational modeling.

---

# 119. Cassandra Partition Key

Partition key determines which node owns the data.

Bad partition key:

```text
same key for huge amounts of data
```

This creates:

```text
hot partition
large partition
```

Choose a well-distributed key.

---

# 120. Cassandra Clustering Columns

Within a partition, clustering columns control ordering and organization.

Example:

```text
PRIMARY KEY ((user_id), event_time)
```

means:

```text
partition key = user_id
clustering column = event_time
```

---

# 121. Cassandra Consistency

Cassandra supports tunable consistency levels.

Examples include:

```text
ONE
QUORUM
ALL
LOCAL_QUORUM
```

Trade-off:

```text
latency
availability
consistency
```

---

# 122. Cassandra vs SQL

Cassandra:

```text
distributed writes
high availability
query-driven modeling
limited joins
denormalization
```

SQL:

```text
joins
transactions
constraints
rich ad-hoc queries
relational model
```

---

# 123. Redis as Key-Value Store

Redis:

```text
key → value
```

with rich data structures.

Useful for:

```text
cache
counter
session
temporary state
rate limiting
locks
```

Not ideal as the primary system of record for complex relational business data.

---

# 124. NoSQL and CAP Theorem

CAP says that during a network partition, a distributed system cannot simultaneously guarantee both:

```text
strong consistency
and
availability
```

while maintaining partition tolerance.

In distributed systems:

```text
Partition tolerance
```

is generally unavoidable.

Therefore the trade-off becomes:

```text
Consistency vs Availability
```

during partition.

---

# 125. CAP Interview Trap

Do not say:

> "MongoDB is CA."

or:

> "Cassandra is AP, so it never provides consistency."

Real systems have configurable and nuanced consistency/availability behavior.

CAP is about distributed-system guarantees under partition, not a simplistic permanent label.

---

# 126. PACELC

PACELC extends CAP.

Roughly:

```text
If Partition:
    choose Availability or Consistency

Else:
    choose Latency or Consistency
```

This is useful for discussing real distributed database trade-offs.

---

# 127. Eventual Consistency

Eventually consistent system:

```text
write
 ↓
replicas converge
 ↓
eventually same state
```

A read immediately after a write may see stale data depending on architecture.

This is common in distributed systems.

---

# 128. Strong Consistency

A read after a successful write returns the latest committed value according to the database's consistency model.

Costs can include:

```text
coordination
latency
availability trade-offs
```

---

# 129. BASE

Often associated with distributed NoSQL systems:

```text
Basically Available
Soft state
Eventually consistent
```

It is a conceptual contrast to strict ACID thinking, not a universal property of all NoSQL systems.

---

# 130. ACID vs BASE

| ACID | BASE |
|---|---|
| Strong transactional model | Often relaxed consistency |
| Atomicity | Availability-oriented design |
| Consistency | Soft state |
| Isolation | Eventual convergence |
| Durability | Distributed trade-offs |

Do not treat BASE as "NoSQL transactions do not exist."

---

# 131. NoSQL Denormalization

Example:

Instead of:

```text
users
orders
```

requiring joins, a document may contain:

```json
{
  "userId": "123",
  "name": "Alice",
  "recentOrders": [...]
}
```

Benefit:

```text
fast read
```

Trade-off:

```text
duplicate data
update consistency
document growth
```

---

# 132. NoSQL Access-Pattern Design

Relational mindset:

```text
What entities do I have?
```

NoSQL mindset:

```text
What queries must I support?
```

Example:

```text
Get all orders for customer
Get latest 20 orders
Get order by ID
```

Design keys/indexes around those queries.

---

# 133. NoSQL Hot Key

If most requests hit:

```text
customerId = 123
```

that partition/key can become overloaded.

Solutions depend on database:

```text
better partition key
sharding/salting
caching
request distribution
precomputation
```

---

# 134. NoSQL Large Item / Document

Large documents cause:

```text
network overhead
serialization cost
memory pressure
update cost
```

Avoid unlimited nested collections.

Use separate entities/references when necessary.

---

# 135. NoSQL Secondary Indexes

Secondary indexes improve query flexibility.

But they can introduce:

```text
write amplification
storage
replication overhead
consistency considerations
```

Do not create indexes for every possible query.

---

# 136. NoSQL Failure Modes

Know:

```text
hot partition
hot key
large item
replica lag
eventual consistency
throttling
partition failure
network partition
rebalancing
schema evolution
index amplification
```

---

# PART IV — SQL VS NOSQL

# 137. SQL vs NoSQL Comparison

| Requirement | SQL | NoSQL |
|---|---|---|
| Complex joins | Excellent | Usually limited |
| Strong relational constraints | Excellent | Depends |
| Flexible document structure | Less natural | Excellent for document DBs |
| Ad-hoc queries | Excellent | Database-dependent |
| Horizontal scaling | Possible | Often a core design goal |
| Multi-row transactions | Strong | Varies |
| Access-pattern-driven design | Useful | Often essential |
| Analytics | Strong | Depends |
| Massive distributed writes | Possible | Often strong fit |
| Simple key lookup | Good | Excellent |
| Schema flexibility | More structured | Often more flexible |

---

# 138. When SQL Is Usually Better

Choose SQL when you need:

```text
complex relationships
joins
strong constraints
multi-row transactions
financial correctness
ad-hoc querying
mature reporting
relational integrity
```

Examples:

```text
banking
payments
order management
ERP
financial accounting
complex transactional systems
```

---

# 139. When NoSQL Is Usually Better

Possible fit:

```text
massive scale
simple predictable access patterns
document-centric data
high write throughput
distributed workloads
flexible schema
low-latency key access
```

Examples:

```text
event metadata
user sessions
catalog documents
telemetry
high-volume time-oriented data
distributed counters
```

---

# 140. Polyglot Persistence

Using multiple databases for different workloads.

Example:

```text
PostgreSQL
→ source of truth

Redis
→ cache

Kafka
→ event streaming

Elasticsearch
→ search

S3
→ large objects
```

This can be powerful but increases:

```text
operational complexity
data consistency challenges
observability requirements
failure modes
team knowledge requirements
```

Do not introduce a database merely because it is popular.

---

# 141. Database as Source of Truth

For a typical transactional application:

```text
PostgreSQL
   ↓
Source of truth

Redis
   ↓
Cache

Kafka
   ↓
Event transport

Search index
   ↓
Read optimization
```

This separation is extremely useful.

---

# 142. Database + Cache Consistency

Typical flow:

```text
DB update
 ↓
cache invalidation
```

Potential race:

```text
T1 reads old DB
T2 updates DB
T2 deletes cache
T1 writes old data into cache
```

Solutions require deliberate ordering/versioning/eventing.

---

# 143. Database + Kafka Consistency

Bad:

```text
DB update
 ↓
Kafka publish
```

If publish fails:

```text
DB = changed
Kafka = unchanged
```

Use:

```text
transactional outbox
```

---

# 144. Kafka + NoSQL

Example:

```text
Kafka
 ↓
Consumer
 ↓
Cassandra
```

Good for:

```text
high-volume event ingestion
time-oriented workloads
distributed writes
```

Design Cassandra tables around queries.

---

# 145. Kafka + MongoDB

Example:

```text
Kafka
 ↓
MongoDB consumer
 ↓
document projection
```

Kafka acts as event transport.

MongoDB acts as a queryable materialized/read model.

---

# 146. Redis + SQL

Typical:

```text
GET /product/123
 ↓
Redis
 ↓ miss
PostgreSQL
 ↓
Redis SET
 ↓
response
```

Database remains authoritative.

---

# 147. Database Replication

Primary/replica architecture:

```text
             ┌── Replica A
Primary ─────┼── Replica B
             └── Replica C
```

Potential uses:

```text
read scaling
failover
backup
analytics
```

Replication lag must be understood.

---

# 148. Failover

When primary fails:

```text
Primary failure
 ↓
detect
 ↓
promote replica
 ↓
redirect traffic
```

Potential problems:

```text
data loss depending on replication
split brain
stale replicas
connection recovery
application retries
```

---

# 149. Database Backup vs Replication

Replication:

```text
availability
read scaling
```

Backup:

```text
recovery from corruption/deletion
```

Replication does not replace backups.

If bad data is replicated:

```text
primary corrupted
 ↓
replicas corrupted
```

Backups provide a different recovery capability.

---

# 150. Disaster Recovery

Know:

```text
RPO
RTO
```

### RPO

How much data loss is acceptable?

### RTO

How long can recovery take?

Example:

```text
RPO = 5 minutes
RTO = 30 minutes
```

Architecture should be designed around these requirements.

---

# 151. Database Security

Important:

```text
least privilege
TLS
encryption at rest
secret management
credential rotation
auditing
parameterized queries
network isolation
backup encryption
```

Never put database passwords directly into source code.

---

# 152. Schema Migration

Tools:

```text
Flyway
Liquibase
```

Production migration principles:

```text
backward compatibility
small incremental changes
expand/contract
avoid long locks
test migration
rollback strategy
```

---

# 153. Expand-and-Contract Migration

Example:

### Phase 1

Add new column:

```text
new_name
```

Keep old column.

### Phase 2

Application writes both.

### Phase 3

Application reads new column.

### Phase 4

Stop writing old column.

### Phase 5

Remove old column.

This avoids breaking old and new application versions during rolling deployments.

---

# 154. Zero-Downtime Schema Changes

Avoid:

```text
deploy DB-breaking schema
then deploy application
```

Prefer:

```text
backward-compatible schema
 ↓
deploy application
 ↓
migrate data
 ↓
remove old schema later
```

---

# 155. Database Observability

Monitor:

```text
query latency
QPS
error rate
connections
pool utilization
locks
deadlocks
CPU
memory
disk I/O
storage
replication lag
cache hit ratio
slow queries
```

---

# 156. Slow Query Investigation

Ask:

```text
Is query actually slow?
Or waiting for lock?
Or waiting for connection?
Or waiting on I/O?
```

This distinction is important.

A request can be slow even when SQL execution itself is fast.

---

# 157. Connection Wait vs Query Time

Example:

```text
Request latency = 500ms

Connection acquisition = 300ms
DB query = 20ms
serialization = 10ms
other = 170ms
```

Optimizing the SQL alone would barely help.

Always break latency into components.

---

# 158. Database Lock Investigation

Look for:

```text
long transactions
blocking sessions
deadlocks
lock waits
hot rows
```

A query that appears fast in isolation may be slow under concurrency because of locking.

---

# 159. Database Scaling Strategies

Vertical:

```text
more CPU
more RAM
faster storage
```

Horizontal:

```text
read replicas
sharding
partitioning
distributed databases
```

Application-level:

```text
caching
CQRS/read models
async processing
batching
```

---

# 160. CQRS

Command Query Responsibility Segregation:

```text
Write Model
    ↓
Commands

Read Model
    ↓
Queries
```

Could use:

```text
PostgreSQL
```

for writes and:

```text
Redis / Elasticsearch / MongoDB
```

for read optimization.

Trade-off:

```text
eventual consistency
multiple models
operational complexity
```

Do not use CQRS for every CRUD application.

---

# 161. Database-per-Service

In microservices, a service may own its database:

```text
Order Service
 → Order DB

Payment Service
 → Payment DB

Inventory Service
 → Inventory DB
```

Benefits:

```text
ownership
independent scaling
service isolation
```

Trade-offs:

```text
distributed transactions
cross-service queries
data duplication
eventual consistency
```

---

# 162. Shared Database Anti-Pattern

Multiple services directly modify the same tables.

Problems:

```text
tight coupling
schema coordination
hidden dependencies
deployment coupling
ownership ambiguity
```

A shared database may be acceptable in some systems, but it weakens service autonomy.

---

# 163. Cross-Service Join

Bad mental model:

```text
Order DB JOIN Payment DB JOIN User DB
```

In distributed systems, databases may be independent.

Possible alternatives:

```text
API composition
events
materialized views
denormalized read models
data warehouse
```

---

# 164. Distributed Transaction

If:

```text
Order DB
+
Payment DB
```

must atomically commit:

```text
distributed transaction
```

is complex.

Often prefer:

```text
Saga
outbox
idempotency
compensation
event-driven workflow
```

---

# PART V — SENIOR SCENARIOS

# 165. Scenario: Payment System

Requirements:

```text
correctness
idempotency
transactional integrity
auditability
high availability
```

Potential architecture:

```text
REST
 ↓
Payment Service
 ↓
PostgreSQL
 ↓
Outbox
 ↓
Kafka
 ↓
Notification / Ledger / Analytics
```

Redis:

```text
idempotency lookup
rate limiting
short-lived state
```

Do not make Redis the payment source of truth.

---

# 166. Scenario: Product Catalog

Potential:

```text
PostgreSQL
→ authoritative catalog

Redis
→ hot product cache

Search engine
→ search/filter

Kafka
→ catalog change events
```

Why multiple systems?

Each optimizes a different access pattern.

---

# 167. Scenario: Massive Event Ingestion

Requirements:

```text
millions of events
high write throughput
replay
distributed processing
```

Possible:

```text
Producers
 ↓
Kafka
 ↓
Consumer Groups
 ↓
Cassandra / Data Lake / Analytics
```

Redis may be used for:

```text
hot aggregates
rate limits
short-lived state
```

---

# 168. Scenario: User Profile

If profile data is:

```text
simple
frequently retrieved
document-shaped
```

MongoDB can be reasonable.

If profile participates in:

```text
many relational constraints
transactions
complex joins
```

PostgreSQL may be better.

---

# 169. Scenario: Leaderboard

Redis Sorted Set is a natural candidate:

```text
ZADD leaderboard score user
ZREVRANGE leaderboard ...
```

Why?

```text
score-based ordering
fast ranking operations
low latency
```

---

# 170. Scenario: Rate Limiter

Redis is often a strong fit:

```text
request
 ↓
Redis atomic operation
 ↓
allow/deny
```

Kafka is not the natural per-request state store.

---

# 171. Scenario: Audit Log

Kafka is a strong candidate:

```text
Application
 ↓
Kafka
 ↓
Audit consumers
```

For long-term immutable archival:

```text
Kafka
 ↓
Object storage / data lake
```

may be used.

---

# 172. Scenario: Search

Do not use PostgreSQL blindly for every search requirement.

Possible:

```text
PostgreSQL
→ transactional source

Elasticsearch/OpenSearch
→ full-text search
```

Synchronize using:

```text
outbox
events
CDC
```

---

# 173. Scenario: User Read API Is Slow

Investigate:

```text
DB query
index
N+1
connection pool
serialization
network
cache hit ratio
```

Potential solution:

```text
Redis cache
```

But first establish whether caching is actually appropriate.

---

# 174. Scenario: DB Is Overloaded After Introducing Redis

Possible cause:

```text
Redis failure
 ↓
all traffic falls through to DB
```

This is a cache failure amplification problem.

Use:

```text
circuit breaker
local fallback
rate limiting
request coalescing
load shedding
```

---

# 175. Scenario: Cassandra Partition Is Huge

Symptoms:

```text
slow reads
high memory
uneven load
timeouts
```

Root cause:

```text
poor partition-key design
```

Solution requires data-model redesign, not merely more hardware.

---

# 176. Scenario: DynamoDB Is Throttling

Investigate:

```text
hot partition key
capacity
traffic distribution
item size
access pattern
GSI bottleneck
```

Do not immediately increase capacity without finding the hot key.

---

# 177. Scenario: MongoDB Document Is Huge

Ask:

```text
Is embedded collection unbounded?
Is data always read together?
Can it be separated?
```

Potential solution:

```text
reference child documents
bucket data
pagination
separate collection
```

---

# 178. Scenario: SQL Table Has 1 Billion Rows

Do not immediately say:

```text
add index
```

Consider:

```text
partitioning
archival
indexes
query patterns
read replicas
sharding
data lifecycle
hot/cold storage
pagination
```

---

# 179. Scenario: Duplicate Payment

Possible race:

```text
Request A → payment
Request B → same payment
```

Use:

```text
idempotency key
unique constraint
transaction
state machine
```

Redis can accelerate idempotency checks, but durable correctness should not depend solely on an evictable cache.

---

# 180. Scenario: Inventory Overselling

Bad:

```text
read stock = 1
 ↓
two requests both see 1
 ↓
both decrement
```

Use atomic database operations:

```sql
UPDATE inventory
SET quantity = quantity - 1
WHERE product_id = ?
  AND quantity > 0;
```

Then:

```text
affected rows = 1
→ reservation succeeded

affected rows = 0
→ sold out
```

This is often safer than a distributed lock.

---

# 181. Scenario: Order Creation

Possible transaction:

```text
BEGIN
 ↓
validate
 ↓
create order
 ↓
reserve inventory
 ↓
insert outbox event
 ↓
COMMIT
```

Then:

```text
Outbox
 ↓
Kafka
 ↓
Payment / Notification / Analytics
```

---

# 182. Scenario: Read-Heavy API

Possible:

```text
Client
 ↓
API
 ↓
Redis
 ↓ miss
PostgreSQL
 ↓
Redis
```

Need to decide:

```text
TTL
invalidation
serialization
cache key
stampede protection
fallback
```

---

# 183. Scenario: Write-Heavy API

Avoid unnecessary cache writes.

Consider:

```text
batching
asynchronous processing
Kafka
database partitioning
sharding
write-optimized NoSQL
```

Choose based on consistency requirements.

---

# 184. Scenario: Need Strong Transactions + Flexible JSON

PostgreSQL can often provide both:

```text
relational tables
+
JSON/JSONB
+
ACID transactions
```

Do not assume you need MongoDB simply because the payload is JSON-shaped.

---

# 185. Scenario: Need Millions of Writes per Second

Ask:

```text
Can SQL scale enough?
What is write pattern?
Do we need ordering?
Do we need transactions?
Can data be partitioned?
What consistency is required?
```

Potential technologies:

```text
Kafka
Cassandra
DynamoDB
distributed SQL
sharded relational DB
```

Technology choice follows requirements.

---

# PART VI — INTERVIEW QUESTION BANK

# 186. Database Fundamentals Questions

1. What is a database?
2. DBMS vs database?
3. SQL vs NoSQL?
4. What are the major NoSQL categories?
5. How do you choose a database?
6. What is a primary key?
7. What is a foreign key?
8. What is a unique constraint?
9. What is normalization?
10. What is denormalization?
11. What is ACID?
12. What is BASE?
13. What is CAP?
14. What is PACELC?
15. Strong vs eventual consistency?
16. What is MVCC?
17. What is a transaction?
18. What is a deadlock?
19. What is optimistic locking?
20. What is pessimistic locking?

---

# 187. SQL Questions

21. WHERE vs HAVING?
22. INNER JOIN vs LEFT JOIN?
23. JOIN vs subquery?
24. UNION vs UNION ALL?
25. COUNT(*) vs COUNT(column)?
26. NULL behavior?
27. What is GROUP BY?
28. What is DISTINCT?
29. What is a CTE?
30. What is a window function?
31. ROW_NUMBER vs RANK vs DENSE_RANK?
32. What is LAG/LEAD?
33. What is a correlated subquery?
34. What is EXISTS?
35. What is a recursive CTE?
36. What is query execution order?
37. What is EXPLAIN?
38. What is an execution plan?
39. What is an index?
40. B-tree vs hash index?
41. What is a composite index?
42. What is the leftmost-prefix rule?
43. What is a covering index?
44. What is selectivity?
45. What is sargability?
46. Why can functions on indexed columns hurt performance?
47. How does LIKE interact with indexes?
48. What is an index-only scan?
49. What is partitioning?
50. What is sharding?
51. Read replica?
52. Replication lag?
53. Read-after-write consistency?
54. What causes deadlocks?
55. How do you prevent deadlocks?
56. What is a lost update?
57. How do you prevent lost updates?
58. What is SQL injection?
59. How does PreparedStatement prevent injection?
60. How do you debug a slow query?
61. How do you find duplicate rows?
62. Find second-highest salary?
63. Latest record per group?
64. Top N per group?
65. Running total?
66. Consecutive records?
67. Delete duplicates safely?
68. Find users with no orders?
69. Find duplicate emails?
70. Find employees above department average?

---

# 188. NoSQL Questions

71. What is NoSQL?
72. Why use NoSQL?
73. Document database?
74. Key-value database?
75. Wide-column database?
76. Graph database?
77. SQL vs NoSQL?
78. MongoDB?
79. Embed vs reference?
80. MongoDB indexing?
81. MongoDB aggregation?
82. MongoDB transactions?
83. DynamoDB?
84. Partition key?
85. Sort key?
86. GSI vs LSI?
87. Query vs Scan?
88. Single-table design?
89. Cassandra?
90. Cassandra partition key?
91. Cassandra clustering columns?
92. Cassandra consistency levels?
93. Redis as NoSQL?
94. Hot key?
95. Hot partition?
96. Large document/item?
97. Secondary indexes?
98. Eventual consistency?
99. Strong consistency?
100. BASE?
101. NoSQL data modeling?
102. Query-first modeling?
103. Why denormalize?
104. NoSQL failure modes?

---

# 189. Database Architecture Questions

105. Primary vs replica?
106. Read replicas?
107. Database failover?
108. Replication vs backup?
109. RPO?
110. RTO?
111. Connection pooling?
112. Connection pool exhaustion?
113. Database observability?
114. Slow query investigation?
115. Lock investigation?
116. Database partitioning?
117. Database sharding?
118. Sharding key?
119. Hot shard?
120. Database migration?
121. Flyway/Liquibase?
122. Expand/contract migration?
123. Zero-downtime migration?
124. Database security?
125. Encryption at rest?
126. Encryption in transit?
127. Least privilege?
128. Secret management?

---

# 190. Spring Boot + Database Questions

129. JdbcTemplate vs JPA?
130. JPA vs Hibernate?
131. Persistence context?
132. Dirty checking?
133. First-level cache?
134. N+1?
135. Fetch join?
136. EntityGraph?
137. Lazy vs eager?
138. @Transactional?
139. Transaction propagation?
140. Isolation?
141. Optimistic locking?
142. Pessimistic locking?
143. HikariCP?
144. Connection pool sizing?
145. SQL logging?
146. How do you diagnose slow Spring DB calls?
147. How do you handle transaction + Kafka?
148. Outbox pattern?
149. Idempotency?
150. Redis cache with Spring?
151. Cache invalidation?
152. How would you use Redis and PostgreSQL together?

---

# PART VII — SQL QUERY PRACTICE

# 191. Find Users With No Orders

```sql
SELECT u.*
FROM users u
LEFT JOIN orders o
    ON o.user_id = u.id
WHERE o.id IS NULL;
```

Alternative:

```sql
SELECT *
FROM users u
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.user_id = u.id
);
```

Know why both can be valid.

---

# 192. Find Customers With More Than 5 Orders

```sql
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;
```

---

# 193. Latest Order Per Customer

```sql
SELECT *
FROM (
    SELECT
        o.*,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY created_at DESC
        ) AS rn
    FROM orders o
) x
WHERE rn = 1;
```

---

# 194. Top 3 Salaries Per Department

```sql
SELECT *
FROM (
    SELECT
        department_id,
        employee_id,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department_id
            ORDER BY salary DESC
        ) AS rnk
    FROM employees
) x
WHERE rnk <= 3;
```

---

# 195. Running Revenue

```sql
SELECT
    created_at,
    amount,
    SUM(amount) OVER (
        ORDER BY created_at
    ) AS running_revenue
FROM payments;
```

---

# 196. Find Duplicate Emails

```sql
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

---

# 197. Find Employees Above Department Average

```sql
SELECT e.*
FROM employees e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e.department_id
);
```

Another approach can use window functions.

---

# 198. Find Missing Numbers

This is database-specific and can be solved with:

```text
generate_series
recursive CTE
numbers table
window functions
```

Do not memorize one universal solution because SQL dialects differ.

---

# 199. Find Consecutive Login Days

Typical approach:

```text
LAG()
date arithmetic
grouping
```

The important interview skill is explaining the reasoning, not memorizing one query.

---

# 200. SQL Interview Strategy

When given a query problem:

```text
1. Clarify requirements
2. Understand schema
3. Identify expected output
4. Start with correct query
5. Consider NULL
6. Consider duplicates
7. Consider indexes
8. Consider cardinality
9. Consider execution plan
10. Discuss edge cases
```

Do not jump immediately into syntax.

---

# PART VIII — SENIOR DATABASE MENTAL MODELS

# 201. Source of Truth Model

A strong architecture often looks like:

```text
PostgreSQL
   ↓
Authoritative business state

Redis
   ↓
Fast cached state

Kafka
   ↓
Durable event stream

Search Engine
   ↓
Search-optimized read model
```

Each system has a purpose.

---

# 202. Cache Model

```text
Database
   ↓
Source of Truth

Redis
   ↓
Performance Optimization
```

Ask:

```text
What happens if Redis is empty?
What happens if Redis is stale?
What happens if Redis is unavailable?
```

A resilient design can recover from cache failure.

---

# 203. Event Model

```text
Database
   ↓
Outbox
   ↓
Kafka
   ↓
Consumers
```

Ask:

```text
What if publishing fails?
What if consumer crashes?
What if event is duplicated?
What if events arrive out of order?
```

---

# 204. Consistency Model

For every distributed system, ask:

```text
Do I need strong consistency?
Can I tolerate stale reads?
How long can stale data exist?
What happens during network failure?
```

This question often determines the technology choice.

---

# 205. Scaling Model

Ask:

```text
Can I scale vertically?
Can I add replicas?
Can I partition?
Can I shard?
Can I cache?
Can I process asynchronously?
Can I denormalize?
```

Scaling is usually a combination of techniques.

---

# 206. Read vs Write Optimization

Read-heavy:

```text
cache
read replicas
indexes
materialized views
denormalized read models
```

Write-heavy:

```text
batching
partitioning
sharding
asynchronous processing
write-optimized storage
```

Always consider consistency implications.

---

# 207. Latency Breakdown

A 500ms request may be:

```text
20ms network
100ms connection wait
50ms DB
200ms external API
50ms serialization
80ms application
```

Therefore:

> "The database is slow" is not a diagnosis.

Measure each component.

---

# 208. Failure-Oriented Design

For every database dependency, ask:

```text
What if it is slow?
What if it is unavailable?
What if it returns stale data?
What if it loses data?
What if connection pool is exhausted?
What if replication lags?
What if a query locks rows?
```

This is the difference between basic and senior-level database thinking.

---

# 209. Final Golden Rules

1. Database choice follows access patterns.
2. SQL knowledge remains essential even when using Hibernate.
3. Indexes are not free.
4. Always inspect execution plans for serious performance problems.
5. Do not assume a query is slow just because the request is slow.
6. Distinguish connection wait, lock wait, query execution, and network latency.
7. Use database constraints to protect important invariants.
8. Application validation alone cannot guarantee uniqueness under concurrency.
9. Transactions do not automatically include external systems.
10. Replication does not replace backups.
11. Read replicas can be stale.
12. Partitioning is not the same as sharding.
13. Normalize for correctness; denormalize for deliberate performance/access patterns.
14. NoSQL should be modeled around access patterns.
15. Hot partitions are often data-model problems.
16. More hardware does not automatically fix a bad partition key.
17. Redis is often a cache/state layer, not the business source of truth.
18. Kafka is an event log, not a relational database.
19. Exactly-once processing does not automatically make external side effects exactly-once.
20. Idempotency is one of the most important distributed-system concepts.
21. Outbox solves an important database-to-event reliability problem.
22. Inbox/deduplication solves an important event-to-database reliability problem.
23. Cache invalidation requires explicit design.
24. Large documents and large Kafka messages are usually warning signs.
25. More indexes are not automatically better.
26. More partitions are not automatically better.
27. More database connections are not automatically better.
28. More replicas are not automatically better.
29. Strong consistency is not automatically better.
30. The best database is the one whose guarantees and access model fit the workload.

---

# 210. Final Self-Test

You should be able to explain without notes:

```text
SQL
NoSQL
Relational model
Normalization
Denormalization
Primary key
Foreign key
Constraints
JOIN
GROUP BY
HAVING
Subquery
EXISTS
CTE
Window functions
ROW_NUMBER
RANK
DENSE_RANK
NULL
Three-valued logic
Indexes
B-tree
Composite index
Covering index
Selectivity
Sargability
Execution plan
EXPLAIN
Transactions
ACID
Isolation
Dirty read
Non-repeatable read
Phantom read
MVCC
Deadlock
Lost update
Optimistic locking
Pessimistic locking
Connection pooling
Read replicas
Replication lag
Partitioning
Sharding
CAP
PACELC
Eventual consistency
Strong consistency
MongoDB
DynamoDB
Cassandra
Redis
Document modeling
Embed vs reference
Partition key
Sort key
GSI
LSI
Cassandra clustering columns
Hot partition
Hot key
Polyglot persistence
CQRS
Outbox
Inbox
Idempotency
Schema migration
Zero-downtime deployment
RPO
RTO
```

---

# 211. Final Interview Framework

When asked:

> "SQL or NoSQL?"

Never answer with a technology preference.

Answer through:

```text
Data model
 ↓
Access patterns
 ↓
Consistency
 ↓
Transaction requirements
 ↓
Read/write ratio
 ↓
Scale
 ↓
Latency
 ↓
Availability
 ↓
Operational complexity
 ↓
Cost
```

Then make the choice.

Example:

```text
Payment ledger
→ relational DB

Product document/catalog
→ relational or document DB depending on access patterns

Session/cache
→ Redis

Massive event stream
→ Kafka

High-volume distributed time-oriented writes
→ Cassandra/DynamoDB may fit

Full-text search
→ search engine
```

The strongest database interview answer is rarely:

> "Use X."

It is:

> "Given these requirements, I would choose X because..., and I would accept these trade-offs..."
