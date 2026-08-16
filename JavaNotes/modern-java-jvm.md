---
title: Modern Java + JVM — Interview Preparation
tags:
  - java
  - modern-java
  - jvm
  - gc
  - concurrency
  - java-8
  - java-17
  - java-21
  - virtual-threads
  - interview
---

# Modern Java + JVM — Interview Preparation

> [!note]
> This note is designed for a Java/Spring Boot full-stack developer preparing for senior interviews.
>
> The goal is not to memorize Java features. Learn:
>
> **What → Why → How → Runtime behavior → Trade-offs → Production implications → Interview traps**

---

# PART I — MODERN JAVA

# 1. What Does "Modern Java" Mean?

For interview preparation, think of modern Java as the evolution from Java 8 onward:

```text
Java 8
├── Lambda
├── Functional Interfaces
├── Stream API
├── Optional
└── java.time

Java 9–11
├── Module system
├── var
├── HTTP Client
├── String improvements
└── Collection factory methods

Java 12–17
├── Switch expressions
├── Text blocks
├── Records
├── Pattern matching
├── Sealed classes
└── Stronger language/runtime improvements

Java 21+
├── Virtual threads
├── Pattern matching
├── Record patterns
├── Sequenced collections
└── Structured concurrency APIs / modern concurrency evolution
```

Always distinguish:

```text
feature introduced
vs
feature finalized / standardized
vs
feature available in the Java version used by the company
```

---

# 2. Lambda Expressions

Before Java 8:

```java
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
};
```

Lambda:

```java
Runnable r = () -> System.out.println("Hello");
```

A lambda is behavior that can be passed as a value where a compatible functional interface is expected.

---

# 3. Functional Interface

A functional interface has exactly one abstract method.

Example:

```java
@FunctionalInterface
interface Calculator {
    int add(int a, int b);
}
```

Usage:

```java
Calculator c = (a, b) -> a + b;
```

Common built-in interfaces:

```text
Predicate<T>      → T → boolean
Function<T,R>     → T → R
Consumer<T>       → T → void
Supplier<T>       → () → T
UnaryOperator<T>  → T → T
BinaryOperator<T> → (T,T) → T
```

---

# 4. Predicate vs Function vs Consumer vs Supplier

```java
Predicate<User>
```

asks:

```text
Is this user valid?
```

```java
Function<User, String>
```

maps:

```text
User → name
```

```java
Consumer<User>
```

performs an action:

```text
User → side effect
```

```java
Supplier<User>
```

produces a value:

```text
() → User
```

Interview trick:

> `Function` transforms; `Predicate` tests; `Consumer` consumes; `Supplier` supplies.

---

# 5. Method References

Instead of:

```java
users.forEach(user -> System.out.println(user));
```

you can use:

```java
users.forEach(System.out::println);
```

Forms:

```text
object::instanceMethod
Class::staticMethod
Class::instanceMethod
Class::new
```

Method references are syntactic sugar for compatible lambdas, not a completely different execution model.

---

# 6. Stream API

A Stream is a pipeline for processing elements.

```java
users.stream()
    .filter(User::isActive)
    .map(User::getName)
    .sorted()
    .toList();
```

Think:

```text
Source
 ↓
Intermediate operations
 ↓
Terminal operation
```

---

# 7. Intermediate vs Terminal Operations

Intermediate:

```text
filter
map
flatMap
sorted
distinct
peek
limit
skip
```

Terminal:

```text
collect
toList
forEach
reduce
count
findFirst
findAny
anyMatch
allMatch
noneMatch
```

Important:

> Intermediate operations are generally lazy.

---

# 8. Stream Laziness

This:

```java
users.stream()
    .filter(...)
    .map(...);
```

does not necessarily execute the pipeline immediately.

Execution happens when a terminal operation requests results.

Why?

Because the Stream API can optimize how elements flow through the pipeline.

---

# 9. map vs flatMap

`map`:

```text
A → B
```

Example:

```java
users.stream()
    .map(User::getAddress);
```

`flatMap`:

```text
A → Stream<B>
```

and flattens the result.

Example:

```java
users.stream()
    .flatMap(user -> user.getOrders().stream());
```

Mental model:

```text
map
[A, B, C] → [X, Y, Z]

flatMap
[A → [X,Y], B → [Z], C → [P,Q]]
→ [X,Y,Z,P,Q]
```

---

# 10. filter

```java
users.stream()
    .filter(User::isActive)
    .toList();
```

It keeps elements matching a predicate.

---

# 11. reduce

Used to combine elements into one result.

```java
int total = numbers.stream()
    .reduce(0, Integer::sum);
```

Mental model:

```text
many values
 ↓
combine
 ↓
one result
```

For simple numeric aggregations, specialized operations such as `sum()` may be clearer.

---

# 12. collect

Collectors support:

```text
toList
toSet
toMap
groupingBy
partitioningBy
joining
counting
mapping
```

Example:

```java
Map<String, List<User>> byCity =
    users.stream()
        .collect(Collectors.groupingBy(User::getCity));
```

---

# 13. toMap Trap

This can throw if duplicate keys exist:

```java
Collectors.toMap(
    User::getId,
    User::getName
);
```

If duplicate IDs are possible, provide a merge function:

```java
Collectors.toMap(
    User::getId,
    User::getName,
    (oldValue, newValue) -> newValue
);
```

Classic interview trap.

---

# 14. Stream vs Collection

Collection:

```text
stores data
```

Stream:

```text
processes data
```

A Stream generally does not own the underlying data.

---

# 15. Stream Reuse

A Stream is generally single-use.

```java
Stream<String> s = names.stream();

s.count();
s.count(); // IllegalStateException
```

Create a new Stream when needed.

---

# 16. Parallel Streams

```java
numbers.parallelStream()
```

can execute operations in parallel.

But:

> `parallelStream()` is not automatically faster.

Potential problems:

```text
small workload
blocking I/O
shared mutable state
common ForkJoinPool contention
ordering requirements
CPU saturation
```

Use deliberately.

---

# 17. Optional

`Optional<T>` represents:

```text
value present
or
value absent
```

Example:

```java
Optional<User> user = repository.findById(id);
```

Avoid:

```java
if (optional.isPresent()) {
    ...
}
```

when a direct operation expresses intent better:

```java
optional.map(...)
        .orElse(...)
```

---

# 18. Optional Anti-Patterns

Avoid generally:

```java
Optional<User> field;
```

and:

```java
Optional<User> methodParameter;
```

Optional is primarily useful as a return-value signal.

Also avoid:

```java
optional.get()
```

without establishing presence.

---

# 19. orElse vs orElseGet

This is a classic interview question.

```java
optional.orElse(expensiveOperation());
```

The argument may be evaluated even when the Optional contains a value.

```java
optional.orElseGet(() -> expensiveOperation());
```

The supplier is evaluated only when needed.

Therefore:

```text
orElse     → eager argument evaluation
orElseGet  → lazy supplier evaluation
```

---

# 20. Modern Date/Time API

Use:

```text
LocalDate
LocalTime
LocalDateTime
Instant
ZonedDateTime
OffsetDateTime
Duration
Period
DateTimeFormatter
```

Prefer `java.time` over legacy:

```text
Date
Calendar
SimpleDateFormat
```

---

# 21. Instant vs LocalDateTime

`Instant` represents a point on the global timeline.

```java
Instant.now()
```

`LocalDateTime` has no timezone/offset.

```java
LocalDateTime.now()
```

For distributed systems, timestamps representing actual events are often better represented as `Instant`.

---

# 22. ZonedDateTime

Represents date/time with a time zone.

```java
ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
```

Useful when business behavior depends on local time zones.

---

# 23. Records

Java records provide concise immutable-style data carriers.

```java
public record UserDto(
    Long id,
    String name
) {}
```

The compiler provides:

```text
constructor
accessors
equals
hashCode
toString
```

Accessor syntax:

```java
dto.name()
```

not:

```java
dto.getName()
```

---

# 24. Record Limitations

Records are not simply "immutable classes."

The record components are final, but referenced objects can still be mutable.

Example:

```java
record User(List<String> roles) {}
```

The `roles` list itself can still be mutable.

This is called shallow immutability.

---

# 25. Records and JPA

A record is generally not a drop-in replacement for a JPA entity.

JPA entities commonly require:

```text
no-arg constructor
non-final entity class/fields in many provider configurations
identity/lifecycle management
```

Records are excellent candidates for:

```text
DTOs
API responses
value objects
immutable data carriers
```

---

# 26. Sealed Classes

Sealed classes restrict which classes may extend/implement a type.

```java
public sealed interface Payment
    permits CardPayment, BankPayment {
}
```

This helps model a closed hierarchy.

---

# 27. Sealed Classes + Pattern Matching

A sealed hierarchy can make exhaustive branching clearer.

Conceptually:

```java
switch (payment) {
    case CardPayment c -> ...
    case BankPayment b -> ...
}
```

This is useful for domain modeling where the set of variants is controlled.

---

# 28. Switch Expressions

Modern Java allows:

```java
String result = switch (status) {
    case ACTIVE -> "A";
    case INACTIVE -> "I";
    default -> "UNKNOWN";
};
```

Compared with older switch statements, switch expressions produce values directly.

---

# 29. yield

For multi-statement switch branches:

```java
String result = switch (status) {
    case ACTIVE -> {
        log();
        yield "A";
    }
    default -> "UNKNOWN";
};
```

---

# 30. Pattern Matching for instanceof

Old:

```java
if (obj instanceof String) {
    String s = (String) obj;
}
```

Modern:

```java
if (obj instanceof String s) {
    System.out.println(s.length());
}
```

The variable is conditionally pattern-bound.

---

# 31. Pattern Matching for switch

Modern Java supports richer switch pattern matching.

Conceptually:

```java
switch (value) {
    case String s -> ...
    case Integer i -> ...
    default -> ...
}
```

Use according to the Java version used by the project.

---

# 32. Text Blocks

Instead of escaping large strings:

```java
String json = """
    {
      "name": "Alice"
    }
    """;
```

Useful for:

```text
JSON
SQL
HTML
multi-line text
```

---

# 33. var

Local variable type inference:

```java
var users = repository.findAll();
```

The compiler still knows the static type.

Important:

> `var` is not dynamic typing.

Avoid using it when it significantly reduces readability.

---

# 34. Immutable Collection Factory Methods

Modern Java supports:

```java
List.of(...)
Set.of(...)
Map.of(...)
```

These produce unmodifiable collections.

Trap:

```java
List<String> x = List.of("A");
x.add("B"); // UnsupportedOperationException
```

---

# 35. Sequenced Collections

Modern Java introduces common interfaces/APIs for collections with defined encounter order, including operations conceptually around:

```text
first
last
reversed
```

This helps reduce inconsistencies between collection APIs.

Know the feature at a high level if interviewing on a recent Java version.

---

# 36. Virtual Threads

Virtual threads are lightweight Java threads designed to make high-concurrency blocking workloads easier to scale.

Traditional:

```text
OS thread
 ↓
Java thread
```

Virtual:

```text
many virtual threads
        ↓
fewer carrier OS threads
```

---

# 37. Why Virtual Threads Matter

Suppose:

```text
100,000 concurrent HTTP requests
```

Most spend time waiting for:

```text
DB
HTTP
file
network
```

Platform threads are expensive compared with virtual threads.

Virtual threads allow many blocking tasks to be represented more efficiently.

---

# 38. Virtual Threads Are Not Faster CPUs

Important interview trap:

> Virtual threads do not make CPU-heavy code execute faster.

They improve scalability for workloads with lots of blocking/waiting.

If work is:

```text
CPU-heavy
```

you still have limited CPU cores.

---

# 39. Creating Virtual Threads

Modern Java:

```java
Thread.startVirtualThread(() -> {
    // task
});
```

or:

```java
try (var executor =
         Executors.newVirtualThreadPerTaskExecutor()) {

    executor.submit(() -> callService());
}
```

---

# 40. Virtual Threads + Spring Boot

Modern Spring Boot applications can use virtual threads where supported/configured by the Java/Spring version.

Typical benefit:

```text
request
 ↓
blocking DB/HTTP call
 ↓
virtual thread yields
 ↓
carrier thread can execute other work
```

But downstream capacity still limits throughput.

---

# 41. Virtual Threads + Database Pools

Critical trap:

```text
1,000 virtual threads
        ↓
10 DB connections
```

Only around the available DB connections can make progress on DB operations.

Therefore:

> Virtual threads remove thread scarcity, not database connection scarcity.

---

# 42. Virtual Thread Pinning

A virtual thread can become pinned to its carrier in situations such as certain synchronized/native execution paths.

Classic concern:

```java
synchronized (lock) {
    blockingOperation();
}
```

If the virtual thread is pinned while blocking, scalability benefits can be reduced.

Modern Java versions have improved pinning behavior, so always verify the exact JDK version and current documentation rather than repeating an oversimplified "synchronized always pins" rule.

---

# 43. Virtual Threads and ThreadLocal

Virtual threads still support `ThreadLocal`, but do not assume ThreadLocal state behaves like a scarce platform-thread pool.

Important concepts remain:

```text
context propagation
cleanup
memory retention
request boundaries
```

For structured request context in Spring, understand how:

```text
SecurityContextHolder
RequestContextHolder
MDC
```

are propagated and cleared.

---

# 44. Structured Concurrency

Structured concurrency treats related concurrent tasks as one logical operation.

Conceptually:

```text
Request
 ├── call service A
 ├── call service B
 └── call service C

wait for related tasks
 ↓
combine result
```

This improves:

```text
lifecycle management
cancellation
error propagation
observability
```

The exact API status depends on the JDK version; understand the concept and the current JDK API status separately.

---

# 45. CompletableFuture

Used for asynchronous composition.

```java
CompletableFuture<User> user =
    getUser();

CompletableFuture<List<Order>> orders =
    getOrders();

CompletableFuture<Result> result =
    user.thenCombine(
        orders,
        Result::new
    );
```

Important methods:

```text
thenApply
thenCompose
thenCombine
thenAccept
exceptionally
handle
whenComplete
allOf
anyOf
```

---

# 46. thenApply vs thenCompose

`thenApply`:

```text
T → U
```

`thenCompose`:

```text
T → CompletableFuture<U>
```

Example:

```java
getUser()
    .thenCompose(user -> getOrders(user.id()));
```

Think:

```text
map       → transform value
compose   → flatten async future
```

---

# 47. CompletableFuture Exception Handling

```java
future.exceptionally(ex -> fallback());
```

or:

```java
future.handle((result, ex) -> ...);
```

Important:

> Exceptions in asynchronous pipelines can otherwise be hidden until a terminal observation such as `join()`/`get()`.

---

# 48. CompletableFuture vs Virtual Threads

These solve different problems.

CompletableFuture:

```text
asynchronous composition
```

Virtual threads:

```text
cheap concurrent blocking tasks
```

You do not automatically need CompletableFuture just because an operation is concurrent.

For straightforward request-per-task code with blocking I/O, virtual threads can make synchronous-looking code attractive.

---

# 49. ExecutorService

ExecutorService manages task execution.

Important:

```text
submit
execute
shutdown
shutdownNow
awaitTermination
```

Production code must manage lifecycle.

---

# 50. Executors Factory Trap

Be careful with:

```java
Executors.newFixedThreadPool(...)
```

The default queue is unbounded.

If producers submit work faster than workers process it:

```text
tasks accumulate
 ↓
memory growth
```

For bounded workloads, constructing `ThreadPoolExecutor` explicitly with an appropriate queue and rejection policy can be safer.

---

# 51. Interrupts

`Thread.interrupt()` is a cooperative cancellation signal.

It does not forcibly kill a thread.

Blocking methods may throw:

```java
InterruptedException
```

Bad:

```java
catch (InterruptedException e) {
}
```

Better:

```java
catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    throw new CancellationException();
}
```

Exact handling depends on the application contract.

---

# 52. Semaphore

Semaphore limits concurrent access.

Example:

```java
Semaphore semaphore = new Semaphore(10);
```

Conceptually:

```text
100 tasks
 ↓
Semaphore(10)
 ↓
10 concurrent operations
```

Useful for:

```text
bounded concurrency
external API limits
database-protection gates
```

---

# 53. CountDownLatch

A CountDownLatch allows one or more threads to wait until a count reaches zero.

```text
start
 ↓
workers
 ├── done
 ├── done
 └── done
 ↓
count = 0
 ↓
continue
```

One-time synchronization mechanism.

---

# 54. CyclicBarrier

Allows a group of threads to wait for one another at a barrier.

Unlike CountDownLatch, it can be reused.

Think:

```text
Phase 1
 ├── worker A
 ├── worker B
 └── worker C
       ↓
    barrier
       ↓
Phase 2
```

---

# 55. Modern Java Interview Traps

1. `var` is not dynamic typing.
2. Streams are not collections.
3. Streams are generally single-use.
4. Intermediate stream operations are lazy.
5. `parallelStream()` is not automatically faster.
6. `map` and `flatMap` are different.
7. `orElse` can eagerly evaluate its argument.
8. `Optional.get()` is not a safe default.
9. Records are not deeply immutable.
10. Records are generally not JPA entities.
11. Virtual threads do not make CPU-heavy work faster.
12. Virtual threads do not remove DB connection limits.
13. CompletableFuture and virtual threads solve different problems.
14. `Executors.newFixedThreadPool()` uses an unbounded queue by default.
15. Interrupt is cooperative cancellation.
16. Swallowing InterruptedException is usually a bug.
17. `synchronized`/native blocking interactions with virtual threads require JDK-version-aware understanding.
18. Structured concurrency is version-sensitive; know the JDK you are discussing.

---

# PART II — JVM

# 56. What Is the JVM?

JVM executes Java bytecode.

Conceptually:

```text
Java source
   ↓
javac
   ↓
.class bytecode
   ↓
JVM
   ↓
machine instructions
```

The JVM provides:

```text
execution
memory management
garbage collection
security/runtime checks
JIT compilation
threading
```

---

# 57. JDK vs JRE vs JVM

JVM:

```text
executes bytecode
```

JRE historically:

```text
JVM + runtime libraries
```

JDK:

```text
development tools
+
runtime
```

Modern JDK distributions are the primary installation model; don't over-focus on the old "install JRE separately" model.

---

# 58. Java Compilation

```text
.java
 ↓
javac
 ↓
.class
 ↓
bytecode
```

Bytecode is platform-independent.

The JVM implementation is platform-specific.

This gives:

```text
write once
run on a compatible JVM
```

---

# 59. JVM Architecture

Conceptually:

```text
              JVM
               │
     ┌─────────┴─────────┐
     │                   │
Runtime Data Areas     Execution Engine
     │                   │
     │             ┌─────┴─────┐
     │             │           │
     │          Interpreter   JIT
     │
     ├── Heap
     ├── JVM Stacks
     ├── Metaspace
     ├── PC Registers
     └── Native Method Stacks
```

---

# 60. Heap

Objects are generally allocated in the heap.

```java
User user = new User();
```

The `User` object lives in managed heap memory.

Heap is shared among JVM threads.

---

# 61. JVM Stack

Each thread has its own JVM stack.

Each method invocation creates a stack frame containing things such as:

```text
local variables
operand stack
return information
```

Conceptually:

```text
Thread
 ↓
Stack
 ├── frame: main()
 ├── frame: service()
 └── frame: repository()
```

---

# 62. Stack vs Heap

```text
Stack
→ per-thread
→ method execution frames
→ local references/primitive values as applicable

Heap
→ shared
→ objects/arrays
→ garbage collected
```

Avoid saying:

> "All primitives are on the stack."

Java memory behavior is more nuanced because variables can be optimized by the JVM and escape analysis.

---

# 63. Metaspace

Metaspace stores JVM class metadata outside the traditional Java heap.

Introduced in Java 8 as a replacement for PermGen.

Metaspace can grow subject to native-memory/system limits and JVM configuration.

---

# 64. PermGen vs Metaspace

Before Java 8:

```text
PermGen
```

Java 8+:

```text
Metaspace
```

Metaspace uses native memory rather than the traditional fixed-size PermGen area.

---

# 65. Class Loading

JVM loads classes dynamically.

High-level process:

```text
Loading
 ↓
Linking
 ├── Verification
 ├── Preparation
 └── Resolution
 ↓
Initialization
```

---

# 66. ClassLoader

Common loader hierarchy concepts:

```text
Bootstrap
   ↓
Platform
   ↓
Application
```

The exact implementation details are JVM-version dependent.

Class loaders allow classes to be loaded dynamically and support isolation patterns.

---

# 67. Parent Delegation

Typically, a class loader asks its parent to load a class first.

Why?

```text
avoid duplicate core classes
security
consistent type identity
```

This is called parent delegation.

Custom class loaders can alter this behavior.

---

# 68. Class Identity

A Java class is identified by:

```text
class name
+
class loader
```

Therefore:

```text
same class name
+
different class loaders
=
potentially different types
```

This matters in:

```text
application servers
plugins
containers
hot reload
frameworks
```

---

# 69. Bytecode

`.class` files contain JVM bytecode.

Tools:

```text
javap
```

can inspect bytecode.

Example:

```bash
javap -c MyClass
```

This is useful when understanding:

```text
method invocation
boxing
synchronized
lambda implementation
```

---

# 70. Interpreter

The JVM can interpret bytecode directly.

This helps startup because the JVM does not need to compile everything immediately.

---

# 71. JIT Compiler

Frequently executed code can be compiled into optimized native machine code.

Conceptually:

```text
Bytecode
 ↓
Interpreter
 ↓
hot code detected
 ↓
JIT compilation
 ↓
optimized machine code
```

This is why long-running Java applications can become highly optimized.

---

# 72. Tiered Compilation

Modern JVMs use multiple compilation levels to balance:

```text
startup
profiling
optimization
```

The JVM can gradually optimize hot code based on runtime behavior.

---

# 73. Deoptimization

A JIT compiler makes assumptions based on runtime observations.

If assumptions become invalid:

```text
optimized code
 ↓
assumption invalid
 ↓
deoptimization
 ↓
fallback/recompile
```

This is a sophisticated reason why runtime behavior can differ from naive source-code reasoning.

---

# 74. Escape Analysis

The JVM can determine whether an object escapes a method/thread.

This can enable optimizations such as:

```text
scalar replacement
lock elimination
allocation optimization
```

Do not assume every `new` necessarily becomes a long-lived heap allocation visible exactly as written in source.

---

# 75. Garbage Collection

GC automatically reclaims objects that are no longer reachable.

Conceptually:

```text
GC Roots
 ↓
reachable objects

unreachable objects
 ↓
eligible for collection
```

---

# 76. GC Roots

Typical GC roots include:

```text
active thread references
static references
JNI references
stack references
other JVM-managed roots
```

An object is collectible when it is no longer reachable from GC roots.

---

# 77. Reachability

Example:

```java
User u = new User();
u = null;
```

If no other reference exists:

```text
User object
 ↓
unreachable
 ↓
eligible for GC
```

Eligible does not mean:

```text
immediately collected
```

---

# 78. Generational GC

Generational hypothesis:

> Most objects die young.

Conceptual:

```text
Young Generation
 ├── Eden
 └── Survivor areas

Old Generation
```

Short-lived objects are handled differently from long-lived objects.

Exact layout depends on the collector.

---

# 79. Minor GC

Typically refers to collection activity focused on the young generation in generational collectors.

It is usually more frequent and shorter than major/full collection, but terminology varies by collector/JDK.

---

# 80. Major vs Full GC

Do not memorize simplistic definitions.

Collector terminology differs.

A Full GC generally involves broader heap processing and is often more disruptive.

Modern collectors such as G1 and ZGC have different phases and goals.

---

# 81. G1 GC

G1 (Garbage-First) divides the heap into regions.

Conceptually:

```text
Heap
 ┌──┬──┬──┬──┬──┬──┐
 │R │R │R │R │R │R │
 └──┴──┴──┴──┴──┴──┘
```

G1 attempts to prioritize regions with more reclaimable space while managing pause-time goals.

---

# 82. ZGC

ZGC is designed for very low pause times on large heaps.

It uses concurrent techniques to reduce long application pauses.

Use it when:

```text
large heap
latency-sensitive workload
low-pause requirements
```

Exact collector selection should be based on workload and JDK version.

---

# 83. Serial vs Parallel vs G1 vs ZGC

Very high-level:

```text
Serial
→ simple/smaller workloads

Parallel
→ throughput-oriented

G1
→ balanced latency/throughput, region-based

ZGC
→ very low pause goals / large heaps
```

Do not select a GC based only on a memorized table.

Measure.

---

# 84. Stop-The-World

Some GC phases pause application threads.

This is called:

```text
Stop-The-World
```

Modern collectors perform substantial work concurrently, but not all phases are necessarily concurrent.

---

# 85. GC Pause vs Application Latency

Suppose:

```text
API latency = 500ms
```

Possible causes:

```text
GC pause
DB wait
connection pool wait
network
CPU
lock contention
```

GC is only one possible cause.

Monitor:

```text
GC pauses
allocation rate
heap occupancy
CPU
application latency
```

---

# 86. OutOfMemoryError

Possible causes:

```text
heap exhaustion
metaspace exhaustion
direct/native memory exhaustion
too many threads
other native resource exhaustion
```

Therefore:

> OutOfMemoryError does not necessarily mean "heap is full."

---

# 87. Java Heap Space

Example:

```text
java.lang.OutOfMemoryError: Java heap space
```

Usually indicates the heap cannot satisfy allocation demands.

Potential causes:

```text
memory leak
large objects
unbounded cache
high allocation rate
insufficient heap
```

---

# 88. Metaspace OOM

Possible cause:

```text
too many dynamically generated classes
class-loader leak
framework/proxy generation
```

Common in systems with:

```text
dynamic class generation
redeployment
plugin loading
```

---

# 89. StackOverflowError

Usually caused by excessive stack depth, commonly recursive calls:

```java
void recurse() {
    recurse();
}
```

Eventually:

```text
StackOverflowError
```

This is different from heap exhaustion.

---

# 90. Direct Memory

Libraries such as NIO can use off-heap/direct memory.

Examples:

```text
ByteBuffer.allocateDirect(...)
```

Direct memory is outside the normal Java heap.

Problems can manifest as native-memory pressure even when heap usage looks reasonable.

---

# 91. Native Memory

The JVM itself and libraries use native memory for:

```text
threads
class metadata
code cache
GC structures
direct buffers
JNI
```

Therefore JVM memory investigation must look beyond heap.

---

# 92. Java Memory Leak

A Java memory leak occurs when objects remain reachable even though the application no longer logically needs them.

Common causes:

```text
static collections
unbounded caches
listeners
ThreadLocal misuse
classloader leaks
long-lived references
```

Important:

> GC cannot collect reachable objects, even if the application has forgotten about them logically.

---

# 93. ThreadLocal Memory Leak

With thread pools:

```text
request A
 ↓
ThreadLocal = user A
 ↓
thread returns to pool
 ↓
request B reuses thread
```

If the ThreadLocal is not cleared:

```text
request B
 ↓
may observe stale context
```

Use:

```java
try {
    context.set(value);
    ...
} finally {
    context.remove();
}
```

This is especially important for:

```text
MDC
request context
security context
tenant context
```

---

# 94. JVM Monitoring

Useful tools/metrics:

```text
JMX
JFR
jcmd
jstack
jmap
jstat
GC logs
heap dumps
thread dumps
```

Modern production analysis often favors:

```text
JFR
jcmd
observability platform
```

depending on the incident.

---

# 95. Thread Dump

Thread dumps help identify:

```text
deadlocks
blocked threads
waiting threads
CPU-heavy threads
pool starvation
```

Look for states:

```text
RUNNABLE
BLOCKED
WAITING
TIMED_WAITING
```

---

# 96. Heap Dump

Heap dumps help identify:

```text
retained memory
large object graphs
leaks
unexpected caches
classloader leaks
```

Analyze with tools such as:

```text
Eclipse MAT
VisualVM
commercial profilers
```

---

# 97. Java Flight Recorder

JFR records runtime events with relatively low overhead compared with many traditional profiling approaches.

Useful for:

```text
CPU
GC
allocation
locks
threads
I/O
JVM behavior
```

JFR + JMC can be extremely valuable for production investigations.

---

# 98. JIT and Profiling

The JVM optimizes based on runtime behavior.

Therefore:

```text
benchmark
measure
profile
```

rather than assuming:

```text
source code A
must be faster than
source code B
```

Use a proper benchmark tool such as JMH for microbenchmarks.

---

# 99. JMH

Java Microbenchmark Harness is designed for JVM microbenchmarking.

Why not simply:

```java
long start = System.nanoTime();
run();
long end = System.nanoTime();
```

Because JVM optimizations include:

```text
JIT compilation
dead-code elimination
warmup
constant folding
inlining
GC effects
```

JMH handles many of these benchmarking concerns.

---

# 100. JVM Flags

Examples:

```text
-Xms
-Xmx
-Xss
```

Conceptually:

```text
-Xms → initial heap size
-Xmx → maximum heap size
-Xss → thread stack size
```

Modern JVMs have many more options, but do not tune flags blindly.

---

# 101. Container Awareness

Modern JVMs understand container resource limits much better than older Java versions.

Still verify:

```text
heap sizing
CPU limits
memory limits
GC behavior
native memory
```

when running in Docker/Kubernetes.

---

# 102. JVM + Kubernetes

Typical:

```text
Pod
 ↓
JVM
 ├── heap
 ├── metaspace
 ├── thread stacks
 ├── direct memory
 └── native memory
```

A pod can be OOM-killed even if:

```text
-Xmx
```

looks safe.

Why?

Because total process memory includes more than Java heap.

---

# 103. CPU Limits and JVM

If Kubernetes gives:

```text
CPU limit = 1 core
```

but the application creates many CPU-heavy tasks:

```text
threads
 ↓
CPU contention
```

Virtual threads do not solve this.

---

# 104. Classloader Leak Scenario

Application repeatedly loads classes:

```text
deploy version 1
 ↓
deploy version 2
 ↓
deploy version 3
```

If old classloaders remain reachable:

```text
classes
 ↓
cannot be unloaded
 ↓
metaspace growth
```

This can cause:

```text
Metaspace OOM
```

---

# 105. JVM Interview Scenario: API Suddenly Has Long Latency

Investigate:

```text
1. CPU
2. GC pauses
3. allocation rate
4. thread contention
5. DB latency
6. connection pool
7. external calls
8. network
9. locks
```

Tools:

```text
metrics
JFR
thread dump
GC logs
APM
```

Do not immediately increase heap.

---

# 106. JVM Interview Scenario: Memory Keeps Growing

Ask:

```text
Is heap occupancy after GC growing?
```

If yes:

```text
possible leak
```

If no:

```text
high allocation rate
temporary objects
GC behavior
```

Also inspect:

```text
native memory
metaspace
direct buffers
threads
```

---

# 107. JVM Interview Scenario: CPU Is 100%

Possible causes:

```text
hot loop
high request rate
GC
serialization
regex
compression
JIT
busy spin
```

Take:

```text
thread dump
CPU profile
JFR
```

Identify the actual hot threads.

---

# 108. JVM Interview Scenario: OutOfMemoryError But Heap Looks Fine

Investigate:

```text
metaspace
direct memory
thread stacks
native allocations
memory-mapped files
container memory limit
```

This is a classic senior troubleshooting question.

---

# 109. JVM Interview Scenario: Many Threads but Low CPU

Possible:

```text
threads waiting on DB
network
locks
queues
sleep
```

Thread count alone does not indicate CPU utilization.

---

# 110. JVM Interview Scenario: Many Virtual Threads but Slow Requests

Ask:

```text
DB connection pool?
external service?
CPU?
lock contention?
rate limiting?
downstream capacity?
```

Virtual threads improve concurrency representation, not downstream capacity.

---

# 111. JVM Interview Scenario: synchronized + Virtual Threads

Question:

> Does `synchronized` always make virtual threads useless?

No.

The important issue is blocking while a virtual thread is pinned to a carrier in situations where pinning applies.

Modern JDKs have evolved in this area.

Answer with:

```text
JDK version
blocking behavior
pinning scenario
actual measurement
```

rather than an absolute statement.

---

# 112. Modern Java + JVM Interview Questions

1. What is a functional interface?
2. Predicate vs Function vs Consumer vs Supplier?
3. What is a lambda?
4. Method reference?
5. Stream vs Collection?
6. Intermediate vs terminal operation?
7. Why are streams lazy?
8. map vs flatMap?
9. reduce vs collect?
10. What happens with duplicate keys in Collectors.toMap?
11. Can a Stream be reused?
12. parallelStream pitfalls?
13. Optional?
14. orElse vs orElseGet?
15. Why avoid Optional fields?
16. Record?
17. Are records deeply immutable?
18. Why are records usually better suited to DTOs than JPA entities?
19. Sealed class?
20. Switch expression?
21. Pattern matching?
22. Text blocks?
23. var?
24. List.of vs ArrayList?
25. What are sequenced collections?
26. What are virtual threads?
27. What problem do virtual threads solve?
28. Are virtual threads faster than platform threads?
29. Virtual threads and JDBC?
30. Virtual threads and connection pools?
31. Virtual thread pinning?
32. Virtual threads and ThreadLocal?
33. Structured concurrency?
34. CompletableFuture vs virtual threads?
35. thenApply vs thenCompose?
36. CompletableFuture exception handling?
37. ExecutorService shutdown?
38. Why can newFixedThreadPool be dangerous?
39. What is cooperative interruption?
40. Why restore interrupt status?
41. Semaphore vs CountDownLatch?
42. CountDownLatch vs CyclicBarrier?
43. What is the JVM?
44. JDK vs JRE vs JVM?
45. What is bytecode?
46. What is the class-loading process?
47. What is ClassLoader?
48. Parent delegation?
49. How does class identity work?
50. Heap vs stack?
51. What is metaspace?
52. PermGen vs Metaspace?
53. What is JIT?
54. What is tiered compilation?
55. What is deoptimization?
56. What is escape analysis?
57. What is GC?
58. What are GC roots?
59. What is generational GC?
60. What is G1?
61. What is ZGC?
62. Stop-the-world?
63. Minor vs major/full GC?
64. What causes Java heap OOM?
65. What causes Metaspace OOM?
66. What causes StackOverflowError?
67. What is direct memory?
68. What is a Java memory leak?
69. How does ThreadLocal leak memory/context?
70. How do you investigate a memory leak?
71. How do you investigate high CPU?
72. How do you investigate high latency?
73. What is a thread dump?
74. What is a heap dump?
75. What is JFR?
76. What is JMH?
77. Why are naive microbenchmarks unreliable?
78. What happens to JVM memory inside Kubernetes?
79. Why can a container OOM while heap looks safe?
80. How do you tune JVM memory?
81. How do you choose a GC?
82. How do you diagnose classloader leaks?
83. How do virtual threads interact with downstream bottlenecks?
84. How do you investigate a production JVM incident?

---

# 113. Final Mental Model

Modern Java:

```text
Language
 ├── Lambda
 ├── Functional Interfaces
 ├── Streams
 ├── Optional
 ├── Records
 ├── Sealed Types
 ├── Pattern Matching
 └── Modern Concurrency
       ├── CompletableFuture
       ├── Executors
       ├── Virtual Threads
       └── Structured Concurrency
```

JVM:

```text
Source
 ↓
Bytecode
 ↓
ClassLoader
 ↓
Interpreter
 ↓
JIT
 ↓
Native Code

Runtime
 ├── Heap
 ├── Stack
 ├── Metaspace
 ├── Native Memory
 └── GC
```

Production:

```text
Spring Boot
 ↓
JVM
 ↓
Threads
 ↓
Heap / Native Memory
 ↓
GC
 ↓
Database / Kafka / Redis
```

---

# 114. Golden Rules

1. Streams process data; collections store data.
2. Streams are lazy until a terminal operation triggers evaluation.
3. `map` transforms; `flatMap` transforms and flattens.
4. `parallelStream()` is not a free performance switch.
5. `orElseGet` is lazy; `orElse` may evaluate eagerly.
6. Records provide concise data carriers, not deep immutability.
7. Records are generally excellent DTO candidates.
8. Virtual threads improve scalability for blocking workloads.
9. Virtual threads do not increase CPU capacity.
10. Virtual threads do not eliminate database connection limits.
11. Async programming and cheap concurrency are different concepts.
12. Interrupt is cooperative cancellation.
13. Never casually swallow `InterruptedException`.
14. `newFixedThreadPool` uses an unbounded queue by default.
15. JVM performance is runtime-driven.
16. JIT optimization depends on profiling.
17. Heap is only one part of JVM memory.
18. GC cannot collect reachable objects.
19. A Java memory leak means unwanted reachability, not absence of GC.
20. Metaspace, direct memory, stacks, and native allocations can cause memory pressure.
21. Do not tune JVM flags without measurements.
22. Use JFR, thread dumps, heap dumps, and metrics to diagnose production behavior.
23. Use JMH for serious microbenchmarks.
24. Always state the JDK version when discussing version-sensitive features.
25. For senior interviews, explain runtime behavior—not just language syntax.
