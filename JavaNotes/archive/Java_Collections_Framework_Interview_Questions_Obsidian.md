---
title: Java Collections Framework — Interview Questions & Answers
tags:
  - java
  - collections
  - arraylist
  - hashmap
  - hashset
  - concurrenthashmap
  - interview
  - backend
---

# Java Collections Framework — Interview Questions & Answers

> [!note]
> This note is designed as **interview preparation**, not a one-line revision sheet.
> Questions progress from basic → intermediate → advanced → tricky → scenario-based.
>
> The objective is to understand not only **what** a collection does, but **why it exists, how it works internally, its complexity, memory behavior, common mistakes, and when to choose it in production**.

---

# 1. Collections Framework Fundamentals

## Q1. What is the Java Collections Framework?

The Java Collections Framework is a set of interfaces, implementations, algorithms, and utility methods for storing and manipulating groups of objects.

The framework provides common abstractions such as:

```text
Collection
├── List
├── Set
└── Queue / Deque

Map
```

Important interfaces include:

```text
List
Set
Queue
Deque
Map
```

Common implementations include:

```text
ArrayList
LinkedList
HashSet
LinkedHashSet
TreeSet

HashMap
LinkedHashMap
TreeMap
ConcurrentHashMap

ArrayDeque
PriorityQueue
```

The framework prevents developers from having to build common data structures from scratch.

---

## Q2. What is the difference between Collection and Collections?

This is a common interview question.

### `Collection`

`Collection` is an interface representing a group of objects.

Examples:

```java
Collection<String> names;
List<String> names;
Set<String> names;
```

### `Collections`

`Collections` is a utility class containing static methods for operating on collections.

Examples:

```java
Collections.sort(list);
Collections.reverse(list);
Collections.shuffle(list);
Collections.unmodifiableList(list);
```

So:

```text
Collection
→ interface

Collections
→ utility class
```

---

## Q3. Is Map part of the Collection interface hierarchy?

No.

This is an important distinction.

The hierarchy is conceptually:

```text
Iterable
   ↓
Collection
   ├── List
   ├── Set
   └── Queue
```

`Map` is separate:

```text
Map
├── HashMap
├── LinkedHashMap
├── TreeMap
└── ConcurrentHashMap
```

A map stores associations:

```text
key → value
```

while a `Collection` represents a group of individual elements.

---

## Q4. What is the difference between List, Set, and Map?

### List

- Ordered
- Allows duplicates
- Index-based access

Example:

```java
List<String> names =
    new ArrayList<>();
```

```text
["A", "B", "A"]
```

### Set

- Represents unique elements
- Does not generally use index-based access
- Ordering depends on implementation

Example:

```java
Set<String> names =
    new HashSet<>();
```

### Map

- Stores key-value pairs
- Keys are unique
- Values can generally be duplicated

Example:

```java
Map<Integer, String> users =
    new HashMap<>();
```

```text
1 → Alice
2 → Bob
```

---

# 2. List

## Q5. What is List?

`List` is an ordered collection that permits duplicate elements.

Example:

```java
List<String> names =
    new ArrayList<>();

names.add("Alice");
names.add("Bob");
names.add("Alice");
```

Result:

```text
Alice
Bob
Alice
```

A List supports index-based operations:

```java
names.get(0);
names.set(1, "Charlie");
names.remove(0);
```

---

## Q6. What are the common List implementations?

Important implementations:

```text
ArrayList
LinkedList
Vector
Stack
```

For modern application development, `ArrayList` is usually the default general-purpose List.

`LinkedList` has specialized use cases.

`Vector` and `Stack` are legacy classes and generally should not be the first choice for new code.

---

# 3. ArrayList

## Q7. What is ArrayList?

`ArrayList` is a resizable-array implementation of `List`.

Conceptually:

```text
ArrayList
   ↓
Object[]
   ↓
[ A ][ B ][ C ][ D ][ ... ]
```

It provides fast indexed access.

```java
list.get(5);
```

is generally O(1).

---

## Q8. Why is ArrayList get() O(1)?

Because elements are stored in an array-like contiguous structure.

If the underlying array starts at address `base` and each element occupies a fixed-size reference slot, the JVM can conceptually calculate the location of index `i` directly.

```text
index 0
index 1
index 2
index 3
...
```

There is no need to traverse previous elements.

Therefore:

```text
get(index) → O(1)
set(index) → O(1)
```

---

## Q9. What is the difference between size and capacity in ArrayList?

This is a very important concept.

### Size

Number of actual elements.

```java
List<Integer> list = new ArrayList<>();
```

After:

```java
list.add(10);
list.add(20);
```

size is:

```text
2
```

### Capacity

Number of elements the internal array can currently hold before it needs to grow.

Therefore:

```text
size ≠ capacity
```

An ArrayList can have capacity greater than its current size.

---

## Q10. What happens internally when ArrayList capacity is insufficient?

Suppose the internal array is full.

When adding another element:

```text
old array
[ A ][ B ][ C ][ D ]
                ↑
              full
```

ArrayList needs a larger backing array.

Conceptually:

```text
old array
   ↓
allocate larger array
   ↓
copy elements
   ↓
insert new element
   ↓
replace old backing array
```

The exact growth policy is an implementation detail and should not be relied upon as a contractual API guarantee.

### Interview point

Appending is usually amortized O(1), but an individual resize can require O(n) copying.

---

## Q11. What is amortized O(1) for ArrayList add()?

Most append operations don't require resizing.

Occasionally, resizing requires copying many elements.

Across a long sequence of additions, the average cost per append remains amortized O(1).

So:

```text
Typical add at end → O(1) amortized
Resize → O(n)
```

---

## Q12. What is the complexity of common ArrayList operations?

| Operation | Typical Complexity |
|---|---:|
| `get(index)` | O(1) |
| `set(index)` | O(1) |
| `add(element)` at end | O(1) amortized |
| `add(index, element)` | O(n) |
| `remove(index)` | O(n) |
| `contains()` | O(n) |
| `indexOf()` | O(n) |

Why is insertion/removal in the middle O(n)?

Because subsequent elements may need to be shifted.

---

## Q13. Why is inserting at the beginning of ArrayList O(n)?

Consider:

```text
[A][B][C][D]
```

Insert `X` at index 0:

```text
[X][A][B][C][D]
```

The existing elements must shift.

```text
A → index 1
B → index 2
C → index 3
D → index 4
```

Therefore:

```text
add(0, value) → O(n)
```

---

## Q14. Why is ArrayList usually preferred over LinkedList?

For many general-purpose workloads, `ArrayList` provides:

- Better cache locality
- O(1) indexed access
- Efficient iteration
- Lower per-element memory overhead
- Good practical performance

`LinkedList` can have O(1) insertion/removal once you already have the relevant node/position, but finding the position can itself take O(n).

Therefore the simplistic statement:

> "LinkedList is better for insertion."

is incomplete.

---

# 4. LinkedList

## Q15. What is LinkedList?

Java's `LinkedList` is a doubly linked list.

Conceptually:

```text
Node A
  ↕
Node B
  ↕
Node C
  ↕
Node D
```

Each node contains links to neighboring nodes.

It implements both:

```text
List
Deque
```

---

## Q16. Why can LinkedList insertion be O(1)?

If you already have the relevant node/position, changing the neighboring links can be O(1).

But if you first need to find index 500,000:

```text
find position → O(n)
insert         → O(1)
```

Overall:

```text
O(n)
```

This is why saying:

> "LinkedList insertion is O(1)."

is an incomplete interview answer.

---

## Q17. Why is LinkedList often slower in real applications despite O(1) insertion?

Because Big-O isn't the whole story.

Linked lists involve:

- Node objects
- More references
- Pointer chasing
- Poorer cache locality
- More object overhead
- More allocations

Array-backed structures often benefit from CPU cache locality.

Therefore `ArrayList` can outperform `LinkedList` even when a theoretical operation appears to favor `LinkedList`.

---

# 5. Vector and Stack

## Q18. What is Vector?

`Vector` is a legacy synchronized List implementation.

It predates much of the modern Collections Framework.

For new application code, `ArrayList` is generally preferred when synchronization isn't required.

If concurrent access is required, choose a collection based on the actual concurrency requirement rather than automatically choosing `Vector`.

---

## Q19. What is Stack?

`Stack` is a legacy class extending `Vector`.

It represents LIFO behavior:

```text
Last In
   ↓
First Out
```

For stack behavior in modern Java, `ArrayDeque` is generally preferred.

Example:

```java
Deque<Integer> stack =
    new ArrayDeque<>();

stack.push(10);
stack.push(20);

stack.pop(); // 20
```

---

# 6. Set

## Q20. What is Set?

A `Set` represents a collection that does not allow duplicate elements according to its equality semantics.

Example:

```java
Set<String> names =
    new HashSet<>();

names.add("Alice");
names.add("Bob");
names.add("Alice");
```

The set contains only:

```text
Alice
Bob
```

Different Set implementations provide different ordering and performance characteristics.

---

# 7. HashSet

## Q21. What is HashSet?

`HashSet` is a hash-table-based Set implementation.

Conceptually, it uses hashing to efficiently determine whether an element is already present.

```text
element
   ↓
hashCode()
   ↓
bucket
   ↓
compare equality
```

Average-case membership operations are typically O(1), assuming a good hash distribution and appropriate implementation behavior.

---

## Q22. How does HashSet ensure uniqueness?

HashSet relies on hashing and equality.

Conceptually:

```text
add(element)
     ↓
hashCode()
     ↓
bucket
     ↓
compare with existing elements
     ↓
equals()
     ↓
already present?
```

If an equal element is already present, the new element isn't added.

Therefore `equals()` and `hashCode()` must follow their contract.

---

## Q23. Can HashSet contain null?

Yes.

A HashSet can contain a single `null` element.

---

# 8. LinkedHashSet

## Q24. What is LinkedHashSet?

`LinkedHashSet` combines hash-based lookup with predictable insertion-order iteration.

Example:

```java
Set<String> set =
    new LinkedHashSet<>();

set.add("B");
set.add("A");
set.add("C");
```

Iteration is predictably:

```text
B
A
C
```

This is useful when you want:

```text
uniqueness
+
insertion-order iteration
```

---

# 9. TreeSet

## Q25. What is TreeSet?

`TreeSet` is a sorted Set implementation based on a tree structure.

It maintains elements according to their natural ordering or a supplied `Comparator`.

Example:

```java
Set<Integer> numbers =
    new TreeSet<>();

numbers.add(30);
numbers.add(10);
numbers.add(20);
```

Iteration:

```text
10
20
30
```

Typical operations are O(log n).

---

## Q26. HashSet vs LinkedHashSet vs TreeSet?

| Feature | HashSet | LinkedHashSet | TreeSet |
|---|---|---|---|
| Uniqueness | Yes | Yes | Yes |
| Insertion order | No guarantee | Yes | No |
| Sorted order | No | No | Yes |
| Typical lookup | O(1) avg | O(1) avg | O(log n) |
| Null | Allows one | Allows one | Generally does not support null with natural ordering |

Choose based on the requirement, not just performance.

---

# 10. Map Fundamentals

## Q27. What is Map?

A Map stores key-value associations:

```text
key → value
```

Example:

```java
Map<Integer, String> users =
    new HashMap<>();

users.put(1, "Alice");
users.put(2, "Bob");
```

Keys are unique.

Values don't have to be unique.

---

## Q28. Can a Map contain duplicate keys?

No.

If:

```java
map.put("A", 100);
map.put("A", 200);
```

the second `put()` replaces the value associated with `"A"`.

Final mapping:

```text
A → 200
```

---

# 11. HashMap

## Q29. What is HashMap?

`HashMap` is a hash-table-based implementation of `Map`.

Conceptually:

```text
put(key, value)
      ↓
key.hashCode()
      ↓
hash calculation
      ↓
bucket index
      ↓
store/find entry
```

Average-case lookup and insertion are typically O(1), assuming good hashing and normal conditions.

---

## Q30. How does HashMap work internally?

A simplified model:

```text
put(key, value)
      ↓
hashCode()
      ↓
hash spreading
      ↓
calculate bucket index
      ↓
bucket
   ├── empty → insert
   └── occupied
          ↓
       compare keys
          ↓
       equals()
          ↓
      same key?
       ├── yes → replace value
       └── no  → collision handling
```

Modern Java implementations can represent heavily collided buckets using tree structures under certain conditions.

The exact internal implementation is version-specific and should not be treated as API contract.

---

## Q31. Why are hashCode() and equals() important for HashMap?

HashMap uses the key's hash information to find a candidate bucket and equality to determine whether a key matches an existing entry.

The contract requires:

> If two objects are equal according to `equals()`, they must return the same `hashCode()`.

If this contract is violated, hash-based collections can behave incorrectly.

---

## Q32. What happens when two keys have the same hashCode?

This is a collision.

Example:

```text
Key A → hash 100
Key B → hash 100
```

They may map to the same bucket.

HashMap then needs to distinguish them using equality.

Conceptually:

```text
Bucket
 ├── Entry(A)
 └── Entry(B)
```

The fact that two objects have the same hash code does **not** mean they are equal.

---

## Q33. Can two unequal objects have the same hashCode?

Yes.

This is called a hash collision.

The `hashCode()` contract does not require different objects to have different hashes.

It requires:

```text
equal objects
→ same hash code
```

but:

```text
same hash code
↛ equal objects
```

---

## Q34. Why should HashMap keys be immutable?

Suppose:

```java
class UserKey {
    String id;

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public boolean equals(Object o) {
        // compares id
    }
}
```

You insert:

```java
UserKey key = new UserKey("A");
map.put(key, "value");
```

Then mutate:

```java
key.id = "B";
```

The key's hash-based location was determined using the previous state.

Now a lookup using the mutated key may fail even though the object is physically still present in the map.

### Interview principle

Keys used in hash-based collections should generally be immutable with respect to the fields used by `equals()` and `hashCode()`.

---

# 12. HashMap Capacity and Load Factor

## Q35. What is load factor in HashMap?

Load factor determines how full the hash table is allowed to become before resizing.

Conceptually:

```text
threshold = capacity × loadFactor
```

When the number of entries exceeds the threshold, HashMap resizes.

The commonly used default load factor in Java's HashMap implementation is `0.75`.

### Why not 1.0?

A lower load factor can reduce collision pressure at the cost of more memory.

This is a trade-off between:

```text
memory
vs
hash-table density
```

---

## Q36. What happens when HashMap resizes?

When the map grows beyond its threshold, the table is expanded and entries are redistributed into the new table.

Conceptually:

```text
Old table
[ ][A][ ][B][C]

        ↓ resize

New table
[ ][ ][A][ ][ ][B][C]
```

The exact implementation details have evolved across Java versions, but resizing remains potentially expensive.

Therefore, if you know approximately how many entries you need, choosing a sensible initial capacity can reduce repeated resizing.

---

## Q37. Why is HashMap capacity often related to powers of two?

Modern Java HashMap implementations use table sizing and index calculations optimized around powers of two.

This allows efficient bucket-index calculations and predictable resizing behavior.

You should understand the design reason, but don't treat the implementation as an API guarantee.

---

# 13. HashMap Null and Ordering

## Q38. Can HashMap contain null?

Yes.

A standard HashMap permits:

```text
one null key
multiple null values
```

Example:

```java
map.put(null, "value");
map.put("A", null);
```

---

## Q39. Does HashMap maintain insertion order?

No.

You should not rely on HashMap iteration order.

If you require insertion order, use:

```java
LinkedHashMap
```

If you require sorted key order, use:

```java
TreeMap
```

---

# 14. LinkedHashMap

## Q40. What is LinkedHashMap?

`LinkedHashMap` combines hash-based lookup with a linked structure that provides predictable iteration order.

By default, iteration order is insertion order.

It can also be configured for access-order behavior.

```java
LinkedHashMap<K, V> map =
    new LinkedHashMap<>(16, 0.75f, true);
```

Access-order is useful for implementing LRU-style caches.

---

## Q41. How can LinkedHashMap be used for an LRU cache?

A common pattern is:

```java
LinkedHashMap<K, V> cache =
    new LinkedHashMap<>(16, 0.75f, true) {

        @Override
        protected boolean removeEldestEntry(
                Map.Entry<K, V> eldest) {
            return size() > 100;
        }
    };
```

With access-order enabled:

```text
least recently used
        ↓
eldest entry
        ↓
can be removed
```

This is a classic interview example.

---

# 15. TreeMap

## Q42. What is TreeMap?

`TreeMap` is a sorted Map implementation.

Keys are maintained according to:

- Natural ordering, or
- A supplied `Comparator`

Typical operations:

```text
put
get
remove
containsKey
```

are O(log n).

---

## Q43. HashMap vs TreeMap?

### HashMap

```text
Typical lookup → O(1) average
Ordering → no guaranteed iteration order
```

### TreeMap

```text
Lookup → O(log n)
Keys → sorted
```

Use TreeMap when sorted ordering or ordered navigation is actually required.

---

# 16. Hashtable

## Q44. What is Hashtable?

`Hashtable` is a legacy synchronized Map implementation.

It predates the modern Collections Framework.

Important differences from HashMap include:

- Hashtable is synchronized
- Hashtable does not allow null keys or null values
- HashMap allows a null key and null values

For new concurrent code, `ConcurrentHashMap` is generally a more appropriate choice than Hashtable.

---

# 17. ConcurrentHashMap

## Q45. What is ConcurrentHashMap?

`ConcurrentHashMap` is a Map implementation designed for concurrent access.

It provides thread-safe operations without requiring one global lock around the entire map for ordinary access.

It is designed to allow high levels of concurrent reads and updates.

---

## Q46. HashMap vs ConcurrentHashMap?

| Feature | HashMap | ConcurrentHashMap |
|---|---|---|
| Thread-safe | No | Yes |
| Null key | Allows one | Does not allow |
| Null values | Allows | Does not allow |
| Concurrent access | Unsafe without external coordination | Designed for it |
| Typical use | Single-threaded / externally synchronized | Shared concurrent access |

---

## Q47. Why doesn't ConcurrentHashMap allow null keys or values?

A key reason is that `null` can make concurrent lookup semantics ambiguous.

For example:

```java
map.get(key)
```

returning `null` could mean:

```text
key does not exist
OR
key exists with null value
```

ConcurrentHashMap avoids that ambiguity by disallowing null keys and values.

---

## Q48. Is ConcurrentHashMap completely lock-free?

No.

Do not say:

> ConcurrentHashMap has no locks.

Its implementation uses sophisticated combinations of synchronization and atomic operations depending on the operation and contention.

The important property is that it avoids a single global lock for normal access and is designed for high concurrency.

---

# 18. Queue and Deque

## Q49. What is Queue?

A Queue generally represents FIFO processing:

```text
First In
   ↓
First Out
```

Example:

```text
A → B → C

remove()
↓
A
```

Java's Queue abstraction has several implementations with different behaviors.

---

## Q50. What is Deque?

Deque means **Double-Ended Queue**.

Elements can be inserted and removed from both ends.

```text
front ← [ A ][ B ][ C ] → rear
```

Java provides:

```java
Deque<Integer> deque =
    new ArrayDeque<>();
```

It can be used as both:

```text
Queue
+
Stack
```

---

# 19. ArrayDeque

## Q51. Why is ArrayDeque often preferred over Stack?

`ArrayDeque` is a modern deque implementation and generally provides better semantics and performance for stack/queue usage than the legacy `Stack` class.

Stack usage:

```java
Deque<Integer> stack =
    new ArrayDeque<>();

stack.push(10);
stack.push(20);

stack.pop(); // 20
```

Queue usage:

```java
Deque<Integer> queue =
    new ArrayDeque<>();

queue.offer(10);
queue.offer(20);

queue.poll(); // 10
```

---

## Q52. Can ArrayDeque contain null?

No.

`ArrayDeque` does not permit null elements.

This can help distinguish "empty/no element" semantics from a legitimate stored value.

---

# 20. PriorityQueue

## Q53. What is PriorityQueue?

`PriorityQueue` processes elements according to priority rather than insertion order.

By default, the smallest element according to natural ordering has highest priority.

```java
PriorityQueue<Integer> queue =
    new PriorityQueue<>();

queue.offer(30);
queue.offer(10);
queue.offer(20);

queue.poll(); // 10
```

Internally it uses a heap structure.

---

## Q54. Is PriorityQueue sorted when you iterate over it?

No.

This is a common trap.

The priority queue guarantees that the element returned by operations such as `peek()`/`poll()` has the appropriate priority.

Iteration does not mean:

```text
10
20
30
```

in fully sorted order.

---

## Q55. What is the complexity of PriorityQueue operations?

Typical complexities:

```text
offer() → O(log n)
poll()  → O(log n)
peek()  → O(1)
```

Building or bulk construction can have different complexity depending on the constructor/operation used.

---

# 21. BlockingQueue

## Q56. What is BlockingQueue?

`BlockingQueue` is designed for producer-consumer scenarios.

A producer can insert work.

A consumer can remove work.

If the queue is full or empty, operations can block.

Conceptually:

```text
Producer
   ↓
BlockingQueue
   ↓
Consumer
```

Examples include:

```text
ArrayBlockingQueue
LinkedBlockingQueue
PriorityBlockingQueue
```

This is heavily used in concurrent applications.

---

# 22. Iterator

## Q57. What is Iterator?

`Iterator` provides a standard way to traverse a collection.

```java
Iterator<String> iterator =
    list.iterator();

while (iterator.hasNext()) {
    String value = iterator.next();
}
```

It abstracts traversal away from the underlying collection implementation.

---

## Q58. What is fail-fast behavior?

Many standard collection iterators are designed to detect structural modifications made outside the iterator while iteration is in progress.

Example:

```java
for (String value : list) {
    list.remove(value);
}
```

This commonly results in `ConcurrentModificationException`.

The exact behavior is best understood as **best-effort detection**, not a synchronization guarantee.

---

## Q59. How can you safely remove elements while iterating?

Use the iterator's own `remove()`:

```java
Iterator<String> iterator =
    list.iterator();

while (iterator.hasNext()) {

    String value = iterator.next();

    if (value.equals("A")) {
        iterator.remove();
    }
}
```

Or use collection operations such as:

```java
list.removeIf(value -> value.equals("A"));
```

depending on the requirement.

---

## Q60. What is ListIterator?

`ListIterator` is a specialized iterator for Lists.

It supports:

- Forward traversal
- Backward traversal
- `add()`
- `set()`
- `remove()`

Example:

```java
ListIterator<String> iterator =
    list.listIterator();
```

It is more powerful than a standard `Iterator`, but only applies to Lists.

---

# 23. Comparable and Comparator

## Q61. What is Comparable?

`Comparable` defines an object's natural ordering.

```java
class Employee
        implements Comparable<Employee> {

    private int age;

    @Override
    public int compareTo(Employee other) {
        return Integer.compare(
            this.age,
            other.age
        );
    }
}
```

Then:

```java
Collections.sort(employees);
```

can use that natural ordering.

---

## Q62. What is Comparator?

`Comparator` defines an external/custom ordering.

Example:

```java
employees.sort(
    Comparator.comparing(Employee::getName)
);
```

You can create multiple orderings without changing the class itself.

---

## Q63. Comparable vs Comparator?

| Comparable | Comparator |
|---|---|
| Natural ordering | Custom/external ordering |
| `compareTo()` | `compare()` |
| Usually implemented by the class | Separate object/function |
| Typically one primary ordering | Can define many orderings |

Example:

```text
Employee natural order → ID

Comparator 1 → name
Comparator 2 → salary
Comparator 3 → joining date
```

---

# 24. equals() and hashCode()

## Q64. Why are equals() and hashCode() important for collections?

Hash-based collections rely on both.

For objects:

```java
a.equals(b) == true
```

the contract requires:

```java
a.hashCode() == b.hashCode()
```

If the contract is violated, collections such as:

```text
HashMap
HashSet
LinkedHashMap
LinkedHashSet
```

may behave incorrectly.

---

## Q65. What happens if equals() is overridden but hashCode() isn't?

You can break hash-based collection behavior.

Example:

```java
class User {

    String id;

    @Override
    public boolean equals(Object obj) {
        // compares id
    }

    // hashCode not overridden
}
```

Two logically equal User objects may have different hash codes.

A HashSet may then treat them as separate entries because they can land in different buckets.

### Rule

> Whenever you override `equals()`, you should normally override `hashCode()` consistently.

---

## Q66. Can hashCode() be unique for every object?

It can be, but it is not required.

The contract allows collisions.

The important requirement is:

```text
equal objects
→ same hashCode
```

not:

```text
different objects
→ different hashCode
```

---

# 25. Generics and Collections

## Q67. Why do collections use generics?

Generics provide compile-time type safety.

Without generics:

```java
List list = new ArrayList();

list.add("Hello");
list.add(10);
```

Retrieval requires casts.

With generics:

```java
List<String> list =
    new ArrayList<>();

list.add("Hello");
```

The compiler prevents:

```java
list.add(10);
```

Generics reduce runtime casting errors and improve readability.

---

## Q68. What is the difference between List<?> and List<Object>?

This is an important generics question.

### `List<Object>`

Means:

> A List whose element type is exactly Object.

You can add any Object:

```java
List<Object> list = new ArrayList<>();

list.add("Hello");
list.add(10);
```

### `List<?>`

Means:

> A List of some unknown type.

```java
List<?> list = new ArrayList<String>();
```

You can safely read elements as `Object`, but you generally cannot add arbitrary values.

---

## Q69. What is PECS?

PECS means:

> **Producer Extends, Consumer Super**

For a producer:

```java
List<? extends Number>
```

you can safely read Number values.

For a consumer:

```java
List<? super Integer>
```

you can safely add Integer values.

A common mental model:

```text
Producer → extends
Consumer → super
```

---

# 26. Immutable and Unmodifiable Collections

## Q70. What is the difference between immutable and unmodifiable collections?

An **unmodifiable view** prevents modification through that particular reference but may reflect changes made through another reference.

Example:

```java
List<String> original =
    new ArrayList<>();

List<String> view =
    Collections.unmodifiableList(original);
```

`view` cannot be modified directly, but changes to `original` can be visible through `view`.

An immutable collection does not allow its state to be changed after creation.

Modern Java also provides factory methods such as:

```java
List.of(...)
Set.of(...)
Map.of(...)
```

which create unmodifiable collections.

---

## Q71. Can List.of() contain null?

No.

For example:

```java
List.of("A", null, "B");
```

throws `NullPointerException`.

This is a useful interview detail.

---

# 27. Collections Utility Methods

## Q72. What is Collections.sort()?

It sorts a List according to natural ordering or a supplied Comparator.

```java
Collections.sort(numbers);
```

Modern Java often uses:

```java
numbers.sort(Comparator.naturalOrder());
```

or:

```java
numbers.sort(Comparator.comparing(...));
```

---

## Q73. What is the difference between Arrays.sort() and Collections.sort()?

`Arrays.sort()` is used for arrays.

```java
Arrays.sort(array);
```

`Collections.sort()` works on Lists.

```java
Collections.sort(list);
```

The underlying algorithms and implementation details depend on the type and Java version.

---

# 28. Important Collection Comparisons

## Q74. ArrayList vs LinkedList?

### ArrayList

Best general-purpose List choice in many cases.

```text
get(index) → O(1)
append → O(1) amortized
middle insertion → O(n)
```

### LinkedList

```text
get(index) → O(n)
```

Insertion/removal can be O(1) once the node/position is known, but finding that position may cost O(n).

### Practical answer

> I would default to ArrayList unless I have a specific access pattern that makes LinkedList appropriate.

---

## Q75. HashMap vs LinkedHashMap?

`HashMap`:

```text
Hash-based
No guaranteed iteration order
```

`LinkedHashMap`:

```text
Hash-based
Predictable insertion/access order
```

Use LinkedHashMap when iteration order matters.

---

## Q76. HashMap vs TreeMap?

```text
HashMap
→ average O(1) lookup
→ no guaranteed ordering

TreeMap
→ O(log n)
→ sorted keys
```

Choose TreeMap when ordered navigation is part of the requirement.

---

## Q77. HashSet vs TreeSet?

```text
HashSet
→ uniqueness
→ average O(1) lookup
→ no ordering guarantee

TreeSet
→ uniqueness
→ sorted elements
→ O(log n)
```

---

## Q78. HashMap vs ConcurrentHashMap?

```text
HashMap
→ not thread-safe

ConcurrentHashMap
→ designed for concurrent access
→ no null keys/values
```

Don't use ConcurrentHashMap merely because "threads might exist." Use it when shared concurrent map access is actually required.

---

## Q79. ArrayDeque vs Stack?

Prefer:

```java
Deque<T> stack = new ArrayDeque<>();
```

over legacy:

```java
Stack<T>
```

for modern stack behavior.

ArrayDeque is a general-purpose deque and can support both stack and queue operations.

---

# 29. Tricky Interview Questions

## Q80. What happens with this code?

```java
List<Integer> numbers =
    new ArrayList<>();

numbers.add(10);
numbers.add(20);

numbers.remove(1);
```

Which element is removed?

Because the argument is an `int`, this invokes:

```java
remove(int index)
```

Therefore element at index `1` is removed:

```text
20
```

If you want to remove the Integer value `1`:

```java
numbers.remove(Integer.valueOf(1));
```

This is a classic autoboxing/overload interview trap.

---

## Q81. What happens if you modify a HashMap key after inserting it?

Example:

```java
UserKey key = new UserKey("A");

map.put(key, "value");

key.setId("B");
```

If `equals()` and `hashCode()` depend on `id`, the key may no longer be found using the expected lookup.

The entry may still physically exist inside the map, but its new hash may point to a different bucket.

### Rule

Do not mutate fields used by a hash-based key's equality/hash contract while the key is being used as a key.

---

## Q82. Does HashMap use equals() before hashCode()?

No.

Hash-based lookup first uses hash information to identify candidate buckets/entries and then equality checks candidate keys.

Conceptually:

```text
hashCode()
    ↓
candidate bucket
    ↓
equals()
```

This is why both methods matter.

---

## Q83. Can two objects with the same hashCode be stored in HashMap?

Yes.

Hash collisions are allowed.

HashMap uses equality checks to distinguish different keys that land in the same bucket.

---

## Q84. Does TreeSet use equals() to determine duplicates?

This is a subtle and important question.

TreeSet determines ordering and uniqueness based on comparison.

If:

```java
compareTo(a, b) == 0
```

the TreeSet considers the elements equivalent for set purposes, even if:

```java
a.equals(b) == false
```

This is why a comparison function used with sorted collections should generally be consistent with equality when possible.

---

## Q85. Can HashSet contain two objects with the same hashCode?

Yes.

Same hash code does not mean equality.

If:

```text
hashCode(A) == hashCode(B)
```

but:

```text
A.equals(B) == false
```

both can exist in the HashSet.

---

## Q86. Does ArrayList allow null?

Yes.

```java
List<String> list =
    new ArrayList<>();

list.add(null);
```

Multiple null elements can be stored.

---

## Q87. Does TreeSet allow null?

With natural ordering, TreeSet generally does not support null because comparison requires an ordering relationship.

With custom comparators, behavior depends on the comparator and its handling of null, but relying on null ordering should be deliberate.

---

## Q88. Is Collections.synchronizedList() the same as CopyOnWriteArrayList?

No.

### synchronizedList

Wraps a List with synchronization around operations.

### CopyOnWriteArrayList

Creates a new backing array for each mutating operation.

Therefore:

```text
Many reads
Few writes
→ CopyOnWriteArrayList can be useful
```

But frequent writes can make CopyOnWriteArrayList expensive.

---

# 30. Concurrent Collections

## Q89. What is CopyOnWriteArrayList?

`CopyOnWriteArrayList` is a thread-safe List designed for workloads with many reads and relatively few writes.

On modification, it creates a new copy of the underlying array.

Conceptually:

```text
Read → shared array

Write
 ↓
new array
 ↓
copy
 ↓
replace reference
```

This makes reads efficient and iteration predictable, but writes are expensive.

---

## Q90. When would you use CopyOnWriteArrayList?

Good candidates include data that is:

```text
read frequently
written rarely
```

Examples can include:

- Listener lists
- Configuration-like snapshots
- Observer registrations

It is a poor choice when the list changes frequently.

---

## Q91. What is BlockingQueue useful for?

Producer-consumer architectures.

```text
Producer
   ↓
BlockingQueue
   ↓
Consumer
```

Producer:

```java
queue.put(task);
```

Consumer:

```java
Task task = queue.take();
```

If the queue is empty, `take()` can wait.

If bounded and full, `put()` can wait.

This provides a useful form of backpressure.

---

# 31. Performance and Complexity

## Q92. What collection should you use for O(1) average lookup by key?

Usually:

```java
HashMap<K, V>
```

assuming appropriate hashing and normal conditions.

For concurrent access:

```java
ConcurrentHashMap<K, V>
```

For sorted keys:

```java
TreeMap<K, V>
```

---

## Q93. What collection should you use when you need unique elements and preserve insertion order?

```java
LinkedHashSet
```

---

## Q94. What collection should you use when you need unique elements in sorted order?

```java
TreeSet
```

---

## Q95. What collection should you use for a stack?

Prefer:

```java
Deque<T> stack =
    new ArrayDeque<>();
```

---

## Q96. What collection should you use for a priority-based task scheduler?

Typically:

```java
PriorityQueue
```

or a concurrent variant such as:

```java
PriorityBlockingQueue
```

depending on whether concurrent producer/consumer behavior is required.

---

# 32. Scenario-Based Interview Questions

## Q97. You need to remove duplicates from a List while preserving the original order. What would you use?

A simple solution:

```java
List<String> result =
    new ArrayList<>(
        new LinkedHashSet<>(input)
    );
```

Why?

```text
LinkedHashSet
→ removes duplicates
→ preserves insertion order
```

---

## Q98. You need to count how many times each word appears. What collection would you use?

Use a Map:

```java
Map<String, Integer> frequency =
    new HashMap<>();
```

Conceptually:

```text
word → count
```

Example:

```java
frequency.merge(word, 1, Integer::sum);
```

---

## Q99. You need the top 10 highest-priority elements from millions of records. Would you sort everything?

Not necessarily.

Sorting all elements costs roughly:

```text
O(n log n)
```

If you only need the top K elements, a bounded heap can often reduce the work to approximately:

```text
O(n log k)
```

using a `PriorityQueue`.

This is a very useful algorithm + Collections interview connection.

---

## Q100. You need a cache that removes the least recently used entry. Which collection could help?

`LinkedHashMap` can implement an LRU-style cache using access-order.

Conceptually:

```text
Access order
A → B → C → D

Access B

A → C → D → B

Capacity exceeded
↓
remove A
```

In a real concurrent/distributed application, however, you should consider whether a local cache or Redis is more appropriate.

---

## Q101. You have a Map shared by many threads. Which collection might you use?

Potentially:

```java
ConcurrentHashMap
```

But first establish the access pattern.

If the data requires atomic compound operations, use the concurrent Map's atomic APIs such as:

```java
compute()
computeIfAbsent()
merge()
putIfAbsent()
```

rather than assuming:

```java
if (!map.containsKey(key)) {
    map.put(key, value);
}
```

is atomic.

---

## Q102. Why is this code not necessarily thread-safe?

```java
if (!map.containsKey(key)) {
    map.put(key, value);
}
```

Even if `map` is a `ConcurrentHashMap`, the combination of two operations is not necessarily atomic.

Another thread can modify the map between:

```text
containsKey()
```

and:

```text
put()
```

Prefer:

```java
map.putIfAbsent(key, value);
```

or:

```java
map.computeIfAbsent(key, k -> createValue(k));
```

when appropriate.

This is a very important concurrency + Collections interview concept.

---

## Q103. You need to process tasks concurrently and block when the queue is full. What would you use?

A bounded `BlockingQueue`, such as:

```java
BlockingQueue<Task> queue =
    new ArrayBlockingQueue<>(1000);
```

A bounded queue can help prevent unlimited memory growth and provides a form of backpressure.

---

## Q104. You need sorted keys but also frequent lookup. Should you use HashMap and sort keys every time?

If sorted traversal is a core requirement and must be maintained continuously, `TreeMap` may be more appropriate.

If sorting is rare and lookup dominates, a `HashMap` plus occasional sorting may be more efficient.

The correct answer depends on workload frequency and performance requirements.

---

# 33. Advanced Scenario Questions

## Q105. You have 10 million objects and only need to know whether an ID has already been seen. What collection might you use?

A `HashSet` is a natural choice for exact membership testing.

```java
Set<Long> seen =
    new HashSet<>();
```

But at 10 million entries, memory becomes an important consideration.

You should consider:

```text
object overhead
load factor
hash table capacity
primitive-friendly alternatives if available
external storage if necessary
Bloom filter if probabilistic membership is acceptable
```

The best answer is not simply:

> HashSet because O(1).

---

## Q106. What is the difference between lookup complexity and real-world performance?

Big-O describes how an operation scales asymptotically, but actual performance also depends on:

- CPU cache locality
- Memory allocation
- Object overhead
- Hash distribution
- Branch prediction
- Contention
- Garbage collection
- Data size
- Constant factors

This explains why an `ArrayList` can outperform a theoretically favorable linked structure for many workloads.

---

## Q107. Why might ArrayList be better than LinkedList even when both can perform an operation in O(n)?

Big-O hides constant factors.

ArrayList stores elements in an array-like contiguous structure:

```text
[A][B][C][D][E]
```

which has good cache locality.

LinkedList requires following references:

```text
A → B → C → D → E
```

which can involve pointer chasing and additional object overhead.

Therefore practical performance can differ substantially despite similar asymptotic complexity for some operations.

---

# 34. Interview Trap: Choosing a Collection

## Q108. An interviewer asks: "Which collection should I use?"

Don't immediately answer with a class name.

Ask:

```text
Do I need duplicates?
Do I need ordering?
Do I need sorting?
Do I need key-value associations?
Do I need indexed access?
Do I need concurrent access?
Do I need blocking?
Do I need priority ordering?
How large is the data?
How frequently is it read?
How frequently is it modified?
```

Then choose.

Example:

```text
Unique + insertion order
→ LinkedHashSet

Unique + sorted
→ TreeSet

Key/value + average O(1) lookup
→ HashMap

Key/value + sorted keys
→ TreeMap

Concurrent key/value
→ ConcurrentHashMap

Stack
→ ArrayDeque

Priority
→ PriorityQueue

Producer/consumer blocking
→ BlockingQueue
```

This is much stronger than memorizing a table.

---

# 35. High-Value Interview Follow-Up Chains

## Chain 1 — HashMap

```text
What is HashMap?
      ↓
How does put() work?
      ↓
How is hashCode() used?
      ↓
What is a bucket?
      ↓
What is a collision?
      ↓
How does equals() participate?
      ↓
What is load factor?
      ↓
When does resizing happen?
      ↓
What happens during resize?
      ↓
Why are keys ideally immutable?
      ↓
What changed with tree bins?
      ↓
HashMap vs ConcurrentHashMap?
```

---

## Chain 2 — ArrayList

```text
What is ArrayList?
      ↓
How is it stored?
      ↓
Why get() is O(1)?
      ↓
What is size vs capacity?
      ↓
What happens when capacity is exceeded?
      ↓
Why add() is amortized O(1)?
      ↓
Why insert at index 0 is O(n)?
      ↓
Why ArrayList often beats LinkedList?
```

---

## Chain 3 — equals/hashCode

```text
Why does HashMap need hashCode?
      ↓
Why does it need equals?
      ↓
What is the contract?
      ↓
Can unequal objects have same hash?
      ↓
What if equals() is overridden without hashCode()?
      ↓
What happens if a key is mutated?
```

---

## Chain 4 — ConcurrentHashMap

```text
Why isn't HashMap thread-safe?
      ↓
Why not synchronize the whole map?
      ↓
What is ConcurrentHashMap?
      ↓
Does it allow null?
      ↓
Is it completely lock-free?
      ↓
What is putIfAbsent()?
      ↓
Why isn't containsKey()+put() atomic?
      ↓
What are computeIfAbsent() and merge()?
```

---

## Chain 5 — Collection Selection

```text
Need a collection
      ↓
Duplicates?
      ↓
Ordering?
      ↓
Sorting?
      ↓
Key/value?
      ↓
Concurrency?
      ↓
Blocking?
      ↓
Priority?
      ↓
Memory constraints?
      ↓
Choose implementation
```

---

# 36. Final Self-Test

You should eventually be able to answer these without memorizing:

1. What is the Collections Framework?
2. Collection vs Collections?
3. Is Map a Collection?
4. List vs Set vs Map?
5. ArrayList internals?
6. Size vs capacity?
7. ArrayList growth?
8. Amortized O(1)?
9. ArrayList vs LinkedList?
10. Why is LinkedList often slower?
11. HashSet internals?
12. How does HashSet guarantee uniqueness?
13. HashSet vs LinkedHashSet?
14. HashSet vs TreeSet?
15. HashMap internals?
16. Hashing and buckets?
17. Collision?
18. hashCode() vs equals()?
19. HashMap load factor?
20. HashMap resizing?
21. Why are HashMap keys ideally immutable?
22. HashMap null behavior?
23. HashMap ordering?
24. LinkedHashMap?
25. LRU cache?
26. TreeMap?
27. TreeMap vs HashMap?
28. Hashtable?
29. ConcurrentHashMap?
30. Why doesn't ConcurrentHashMap allow null?
31. Queue?
32. Deque?
33. ArrayDeque?
34. Stack vs ArrayDeque?
35. PriorityQueue?
36. Is PriorityQueue iteration sorted?
37. BlockingQueue?
38. Iterator?
39. Fail-fast?
40. ListIterator?
41. Comparable?
42. Comparator?
43. Comparable vs Comparator?
44. equals/hashCode contract?
45. List<?> vs List<Object>?
46. PECS?
47. Immutable vs unmodifiable?
48. CopyOnWriteArrayList?
49. synchronizedList vs CopyOnWriteArrayList?
50. Collection selection based on requirements?

---

# 37. Final Mental Model

Do not memorize the Collections Framework as a list of classes.

Think in terms of **requirements**:

```text
                         DATA
                           │
              ┌────────────┴────────────┐
              │                         │
          Individual                 Key → Value
          elements                    mapping
              │                         │
       ┌──────┼──────┐           ┌──────┼──────┐
       │      │      │           │      │      │
      List   Set   Queue       HashMap TreeMap LinkedHashMap
       │      │      │
       │      │      ├── PriorityQueue
       │      │      └── BlockingQueue
       │      │
       │      ├── HashSet
       │      ├── LinkedHashSet
       │      └── TreeSet
       │
       ├── ArrayList
       └── LinkedList
```

Then apply the decision questions:

```text
Duplicates?
Ordering?
Sorted?
Indexed access?
Fast lookup?
Key/value?
Concurrency?
Blocking?
Priority?
Memory?
Read/write ratio?
```

The interviewer is rarely testing whether you can recite every Collection class.

They are testing whether you can answer:

> **"Given this requirement, which data structure would you choose, why, what is its complexity, and what trade-offs does it introduce?"**

That is the level of Collections knowledge expected in a strong Java interview.
