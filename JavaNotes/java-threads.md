# Java Threads --- From Basics to Advanced

> **Modern baseline:** Java 25 is an LTS release, and Java 26 is the
> current feature release. This note uses modern Java concepts while
> also covering older concurrency APIs that you will encounter in
> enterprise codebases.

------------------------------------------------------------------------

## 1. What is a Thread?

A **thread** is an independent path of execution inside a process.

A Java application can have multiple threads executing concurrently.

Think of a Java process as a restaurant:

-   Process = the whole restaurant
-   Thread = a waiter doing work
-   Heap = shared kitchen/resources
-   Thread stack = the waiter's own notepad
-   Multiple threads can access shared objects in the heap

The important distinction is:

**Process** - Has its own address space/resources. - Processes are
relatively isolated.

**Thread** - Exists inside a process. - Threads in the same JVM share
the heap and many process-level resources. - Each thread has its own
stack and execution state.

A Java thread is represented by `java.lang.Thread`.

------------------------------------------------------------------------

## 2. Why Do We Need Threads?

Suppose an application has to perform three independent operations:

``` text
Task A: Call payment service       → 2 seconds
Task B: Call inventory service     → 2 seconds
Task C: Send notification          → 2 seconds
```

Sequential execution:

``` text
A ───── 2s ─────
                B ───── 2s ─────
                              C ───── 2s ─────

Total ≈ 6 seconds
```

Concurrent execution:

``` text
A ───────────── 2s ───────────
B ───────────── 2s ───────────
C ───────────── 2s ───────────

Total ≈ 2 seconds
```

This does **not** mean threads always make a program faster.

Concurrency is primarily about allowing multiple tasks to make progress
during overlapping periods.

------------------------------------------------------------------------

# 3. Concurrency vs Parallelism

These are related but different.

## Concurrency

Multiple tasks are in progress during overlapping time periods.

``` text
CPU
│ A A B B A C C B
└──────────────────→ time
```

The CPU may switch between tasks.

## Parallelism

Multiple tasks actually execute simultaneously on different CPU cores.

``` text
Core 1: A A A A
Core 2: B B B B
Core 3: C C C C
```

So:

> Concurrency = dealing with multiple things at once.

> Parallelism = executing multiple things at the same time.

A single-core machine can provide concurrency through scheduling, but
not true CPU parallelism.

------------------------------------------------------------------------

# 4. The Main Thread

When a Java application starts, the JVM starts the thread that executes
`main()`.

``` java
public class Main {
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getName());
    }
}
```

Typically:

``` text
main
```

`Thread.currentThread()` returns the currently executing thread.

Useful methods:

``` java
Thread.currentThread().getName();
Thread.currentThread().threadId();
Thread.currentThread().isAlive();
Thread.currentThread().isVirtual();
```

------------------------------------------------------------------------

# 5. Creating a Thread

There are several approaches.

## Approach 1 --- Extend Thread

``` java
class MyThread extends Thread {

    @Override
    public void run() {
        System.out.println("Running");
    }
}

public class Main {
    public static void main(String[] args) {
        MyThread t = new MyThread();
        t.start();
    }
}
```

Important:

``` java
t.start();
```

is NOT the same as:

``` java
t.run();
```

### `start()`

Creates/schedules a new thread of execution.

### `run()`

Just invokes the method normally if called directly.

``` java
t.run();
```

does not create a new thread.

This is one of the most common interview questions.

------------------------------------------------------------------------

# 6. Why Runnable Is Usually Better Than Extending Thread

Instead of:

``` java
class MyTask extends Thread {
    @Override
    public void run() {
        // work
    }
}
```

prefer:

``` java
class MyTask implements Runnable {
    @Override
    public void run() {
        // work
    }
}
```

Then:

``` java
Thread t = new Thread(new MyTask());
t.start();
```

Why?

Because `Runnable` represents **the task**, while `Thread` represents
**the execution mechanism**.

This separation is important.

``` text
Runnable
   ↓
WHAT should be done?

Thread
   ↓
WHO executes it?
```

Also, Java supports single inheritance, so extending `Thread` prevents
the class from extending another class.

------------------------------------------------------------------------

# 7. Lambda + Thread

Because `Runnable` is a functional interface:

``` java
Thread t = new Thread(() -> {
    System.out.println("Hello");
});

t.start();
```

This is common but should not be confused with a production concurrency
architecture.

For larger applications, prefer executors or structured concurrency
instead of manually creating large numbers of threads.

------------------------------------------------------------------------

# 8. Thread Lifecycle

A Java thread can move through these states:

``` text
NEW
 ↓
RUNNABLE
 ↓
TERMINATED
```

and may temporarily enter:

``` text
BLOCKED
WAITING
TIMED_WAITING
```

Official Java states:

``` java
Thread.State.NEW
Thread.State.RUNNABLE
Thread.State.BLOCKED
Thread.State.WAITING
Thread.State.TIMED_WAITING
Thread.State.TERMINATED
```

------------------------------------------------------------------------

## NEW

Thread object exists but has not started.

``` java
Thread t = new Thread(() -> {});
```

State:

``` text
NEW
```

------------------------------------------------------------------------

## RUNNABLE

After:

``` java
t.start();
```

the thread becomes eligible for execution.

Important:

Java's `RUNNABLE` state includes a thread that is actually running as
well as one that is ready to run.

Java does not expose a separate `RUNNING` state.

------------------------------------------------------------------------

## BLOCKED

A thread is waiting to acquire a monitor lock.

Example:

``` java
synchronized (lock) {
    // critical section
}
```

If another thread owns `lock`, the waiting thread may become `BLOCKED`.

------------------------------------------------------------------------

## WAITING

A thread waits indefinitely for another thread/action.

Examples:

``` java
Object.wait();
Thread.join();
```

------------------------------------------------------------------------

## TIMED_WAITING

Waiting for a bounded amount of time.

Examples:

``` java
Thread.sleep(1000);
Object.wait(1000);
Thread.join(1000);
```

------------------------------------------------------------------------

## TERMINATED

`run()` completed or terminated because of an uncaught exception.

A thread cannot be restarted.

``` java
Thread t = new Thread(...);

t.start();
t.start(); // IllegalThreadStateException
```

------------------------------------------------------------------------

# 9. Thread.sleep()

``` java
Thread.sleep(1000);
```

The current thread pauses for approximately one second.

Important:

`sleep()` does NOT release intrinsic locks.

Example:

``` java
synchronized (lock) {
    Thread.sleep(5000);
}
```

The thread sleeps while still holding `lock`.

This can block other threads from entering the synchronized section.

------------------------------------------------------------------------

# 10. Thread.join()

`join()` allows one thread to wait for another thread to finish.

``` java
Thread worker = new Thread(() -> {
    System.out.println("Working...");
});

worker.start();

worker.join();

System.out.println("Worker finished");
```

Conceptually:

``` text
main
 │
 ├── starts worker
 │
 ├── waits at join()
 │
 │       worker executes
 │       worker finishes
 │
 └── main continues
```

`join()` is extremely important for understanding coordination.

------------------------------------------------------------------------

# 11. Thread.interrupt()

Interrupt is a **cooperative cancellation mechanism**.

It does not forcibly kill a thread.

``` java
thread.interrupt();
```

The target thread should respond appropriately.

For example:

``` java
try {
    Thread.sleep(10_000);
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

Why restore the interrupt flag?

Because catching `InterruptedException` clears the interrupted status.

A common good pattern is:

``` java
catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    return;
}
```

Do not casually swallow interrupts:

``` java
catch (InterruptedException e) {
    // nothing
}
```

That can break cancellation and shutdown behavior.

------------------------------------------------------------------------

# 12. Daemon vs Non-Daemon Threads

A JVM normally continues running while at least one non-daemon thread is
alive.

Daemon threads are background threads.

``` java
Thread t = new Thread(task);
t.setDaemon(true);
t.start();
```

Important:

`setDaemon(true)` must be called before `start()`.

Daemon threads should not be used for critical work that must complete
reliably during shutdown.

------------------------------------------------------------------------

# 13. Thread Priority

Java has thread priorities:

``` java
Thread.MIN_PRIORITY
Thread.NORM_PRIORITY
Thread.MAX_PRIORITY
```

Usually:

``` text
1
5
10
```

Do not design application correctness around thread priority.

Scheduling behavior is platform-dependent.

------------------------------------------------------------------------

# 14. The Real Problem: Shared Mutable State

Threads themselves are not usually the hardest part.

The real difficulty is:

> Multiple threads accessing mutable shared state.

Example:

``` java
class Counter {
    int count = 0;

    void increment() {
        count++;
    }
}
```

This looks harmless.

But:

``` java
count++;
```

is conceptually:

``` text
read count
add 1
write count
```

Two threads can interleave these operations.

Suppose:

``` text
count = 0

Thread A reads 0
Thread B reads 0

Thread A writes 1
Thread B writes 1
```

Expected:

``` text
2
```

Actual:

``` text
1
```

This is a **race condition**.

------------------------------------------------------------------------

# 15. Race Condition

A race condition occurs when the result depends on timing/interleaving
between concurrent operations.

Typical symptoms:

-   intermittent bugs
-   difficult reproduction
-   different results between runs
-   bugs that disappear when debugging
-   production-only failures

Concurrency bugs are often nondeterministic.

------------------------------------------------------------------------

# 16. Atomicity

An operation is atomic if it appears indivisible to other threads.

`count++` is not atomic.

For counters, use:

``` java
AtomicInteger counter = new AtomicInteger();

counter.incrementAndGet();
```

Then:

``` java
System.out.println(counter.get());
```

------------------------------------------------------------------------

# 17. synchronized

`synchronized` provides mutual exclusion and memory visibility
guarantees.

``` java
class Counter {

    private int count;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```

Only one thread at a time can execute synchronized methods using the
same object's monitor.

------------------------------------------------------------------------

# 18. Synchronized Block

Instead of locking the whole method:

``` java
public synchronized void increment() {
    count++;
}
```

you can limit the critical section:

``` java
public void increment() {

    synchronized (this) {
        count++;
    }
}
```

Even better, when appropriate, use a private lock:

``` java
private final Object lock = new Object();

public void increment() {
    synchronized (lock) {
        count++;
    }
}
```

This avoids exposing your lock to external code.

------------------------------------------------------------------------

# 19. Intrinsic Lock / Monitor

Every Java object can act as an intrinsic lock.

When you write:

``` java
synchronized (obj) {
}
```

the executing thread acquires the monitor associated with `obj`.

Only one thread can own that monitor at a time.

This leads to:

``` text
Thread A
   ↓
acquire lock
   ↓
critical section
   ↓
release lock
```

Other threads attempting the same monitor may become `BLOCKED`.

------------------------------------------------------------------------

# 20. synchronized and Memory Visibility

`synchronized` is not only about "one thread at a time."

It also establishes happens-before relationships.

Conceptually:

``` text
Thread A
writes data
   ↓
unlock
   ↓
Thread B
lock
   ↓
sees A's writes
```

This is why synchronization solves both:

-   mutual exclusion
-   visibility

------------------------------------------------------------------------

# 21. volatile

`volatile` is primarily about visibility and ordering, not
compound-operation atomicity.

``` java
private volatile boolean running = true;
```

Thread A:

``` java
running = false;
```

Thread B:

``` java
while (running) {
    // work
}
```

`volatile` helps ensure that the update is visible.

But:

``` java
volatile int count;

count++;
```

is still not atomic.

Remember:

> volatile != atomic

------------------------------------------------------------------------

# 22. Atomic Classes

Java provides:

``` java
AtomicInteger
AtomicLong
AtomicBoolean
AtomicReference
```

Example:

``` java
AtomicInteger count = new AtomicInteger();

count.incrementAndGet();
count.decrementAndGet();
count.compareAndSet(10, 20);
```

These are useful for lock-free or low-lock atomic operations.

------------------------------------------------------------------------

# 23. CAS --- Compare And Set

CAS is a fundamental technique behind many atomic operations.

Conceptually:

``` text
if currentValue == expectedValue
    replace with newValue
else
    fail
```

Example:

``` java
counter.compareAndSet(10, 20);
```

CAS is central to many non-blocking concurrency algorithms.

------------------------------------------------------------------------

# 24. ExecutorService

In real applications, manually creating threads is usually not the
preferred abstraction.

Instead:

``` java
ExecutorService executor =
        Executors.newFixedThreadPool(10);
```

Submit tasks:

``` java
executor.submit(() -> {
    System.out.println("Task running");
});
```

Shutdown:

``` java
executor.shutdown();
```

The idea:

``` text
Application
    ↓
ExecutorService
    ↓
Thread Pool
    ↓
Worker Threads
    ↓
Tasks
```

------------------------------------------------------------------------

# 25. Why Thread Pools?

Creating a platform thread has a cost.

Instead of:

``` text
Request → create thread
Request → create thread
Request → create thread
...
```

use:

``` text
Requests
   ↓
Task queue
   ↓
Thread pool
   ↓
Reusable workers
```

Thread pools provide:

-   resource control
-   thread reuse
-   bounded concurrency
-   queueing
-   lifecycle management

------------------------------------------------------------------------

# 26. Fixed Thread Pool

``` java
ExecutorService executor =
        Executors.newFixedThreadPool(10);
```

At most roughly 10 worker threads execute tasks concurrently.

Useful for CPU-bound work when the pool size is deliberately chosen
based on workload and environment.

------------------------------------------------------------------------

# 27. Cached Thread Pool

``` java
Executors.newCachedThreadPool();
```

Can create threads as needed and reuse idle ones.

Be careful: under heavy load, an unbounded thread creation strategy can
become dangerous.

Do not blindly use it for production workloads.

------------------------------------------------------------------------

# 28. ScheduledExecutorService

For delayed/repeated work:

``` java
ScheduledExecutorService scheduler =
        Executors.newScheduledThreadPool(2);
```

Example:

``` java
scheduler.schedule(
    () -> System.out.println("Hello"),
    5,
    TimeUnit.SECONDS
);
```

------------------------------------------------------------------------

# 29. Callable

`Runnable` does not return a result.

``` java
Runnable task = () -> {
    System.out.println("Hello");
};
```

`Callable<T>` returns a result and can throw checked exceptions.

``` java
Callable<Integer> task = () -> {
    return 42;
};
```

Submit:

``` java
Future<Integer> future = executor.submit(task);
```

Retrieve:

``` java
Integer result = future.get();
```

------------------------------------------------------------------------

# 30. Future

A `Future` represents the eventual result of asynchronous computation.

``` text
submit task
     ↓
Future
     ↓
task executes
     ↓
result available
```

But:

``` java
future.get();
```

is blocking.

So `Future` is useful but has limitations for composing complex
asynchronous workflows.

------------------------------------------------------------------------

# 31. CompletableFuture

For asynchronous composition:

``` java
CompletableFuture
```

Example:

``` java
CompletableFuture
    .supplyAsync(() -> fetchUser())
    .thenApply(user -> user.getName())
    .thenAccept(System.out::println);
```

Composition:

``` java
CompletableFuture<User> user =
    CompletableFuture.supplyAsync(this::fetchUser);

CompletableFuture<Order> order =
    user.thenCompose(this::fetchOrder);
```

Parallel operations can be combined:

``` java
CompletableFuture.allOf(a, b, c);
```

------------------------------------------------------------------------

# 32. Common CompletableFuture Methods

## thenApply

Transform a result:

``` java
future.thenApply(x -> x * 2);
```

## thenAccept

Consume a result:

``` java
future.thenAccept(System.out::println);
```

## thenCompose

Chain dependent asynchronous operations:

``` java
future.thenCompose(this::nextAsyncOperation);
```

## thenCombine

Combine independent results:

``` java
futureA.thenCombine(
    futureB,
    (a, b) -> combine(a, b)
);
```

## exceptionally

Handle failure:

``` java
future.exceptionally(ex -> fallback);
```

## handle

Handle both result and failure:

``` java
future.handle((result, error) -> {
    if (error != null) {
        return fallback;
    }
    return result;
});
```

------------------------------------------------------------------------

# 33. ForkJoinPool

Java provides:

``` java
ForkJoinPool
```

It is designed for tasks that can be recursively split into smaller
tasks.

Concept:

``` text
Large Task
   ↓
Split
 ┌───────┐
 A       B
 ↓       ↓
A1 A2   B1 B2
```

Fork/join uses **work stealing**.

An idle worker can steal work from another worker's queue.

------------------------------------------------------------------------

# 34. Parallel Streams

``` java
list.parallelStream()
    .map(...)
    .filter(...)
    .toList();
```

Parallel streams use the common ForkJoinPool by default.

Do NOT assume:

``` text
parallelStream = faster
```

Parallelism has overhead and can be slower for:

-   small collections
-   cheap operations
-   I/O-bound operations
-   workloads with contention
-   operations with poor parallel decomposition

------------------------------------------------------------------------

# 35. Lock API

Java also provides explicit locks.

``` java
Lock lock = new ReentrantLock();

lock.lock();

try {
    // critical section
} finally {
    lock.unlock();
}
```

The `finally` is essential.

------------------------------------------------------------------------

# 36. ReentrantLock

`ReentrantLock` provides capabilities beyond basic `synchronized`.

For example:

``` java
lock.tryLock();
```

or:

``` java
lock.tryLock(1, TimeUnit.SECONDS);
```

You can also use interruptible locking:

``` java
lock.lockInterruptibly();
```

This can be useful when you need more control over lock acquisition.

------------------------------------------------------------------------

# 37. ReadWriteLock

When reads are frequent and writes are rare:

``` java
ReadWriteLock lock =
        new ReentrantReadWriteLock();
```

Multiple readers can hold the read lock concurrently.

A writer requires exclusive access.

``` text
Readers:
R1 ─────
R2 ─────
R3 ─────

Writer:
          W ─────
```

------------------------------------------------------------------------

# 38. StampedLock

`StampedLock` provides:

-   read lock
-   write lock
-   optimistic read

Example:

``` java
StampedLock lock = new StampedLock();

long stamp = lock.tryOptimisticRead();

try {
    // read
} finally {
    if (!lock.validate(stamp)) {
        // retry under read lock
    }
}
```

Useful in some read-heavy workloads, but more complex than
`ReentrantReadWriteLock`.

Do not use it automatically.

------------------------------------------------------------------------

# 39. Semaphore

A semaphore controls access to a limited number of permits.

``` java
Semaphore semaphore = new Semaphore(10);
```

Concept:

``` text
10 permits

Request 1 → permit
Request 2 → permit
...
Request 10 → permit
Request 11 → waits
```

Useful for limiting concurrent access to resources.

Examples:

-   database connection-like resource limits
-   external service concurrency
-   expensive operations

------------------------------------------------------------------------

# 40. CountDownLatch

Used when one or more threads need to wait until a number of operations
complete.

``` java
CountDownLatch latch =
        new CountDownLatch(3);
```

Workers:

``` java
latch.countDown();
```

Waiting thread:

``` java
latch.await();
```

Concept:

``` text
Task A ── countDown()
Task B ── countDown()
Task C ── countDown()
             ↓
          count = 0
             ↓
         waiting thread continues
```

A latch generally cannot be reset.

------------------------------------------------------------------------

# 41. CyclicBarrier

A barrier allows multiple threads to meet at a synchronization point.

``` java
CyclicBarrier barrier =
        new CyclicBarrier(3);
```

Each thread:

``` java
barrier.await();
```

They wait until all required parties arrive.

Unlike a latch, a cyclic barrier can be reused.

------------------------------------------------------------------------

# 42. Phaser

`Phaser` is a more flexible synchronization mechanism for phased
computation.

It can support changing numbers of participants and multiple phases.

Think:

``` text
Phase 1
 ↓
Phase 2
 ↓
Phase 3
```

Useful for advanced coordination problems.

------------------------------------------------------------------------

# 43. BlockingQueue

A `BlockingQueue` is extremely important.

Examples:

``` java
ArrayBlockingQueue
LinkedBlockingQueue
PriorityBlockingQueue
SynchronousQueue
```

Producer:

``` java
queue.put(task);
```

Consumer:

``` java
Task task = queue.take();
```

Concept:

``` text
Producer
   ↓
BlockingQueue
   ↓
Consumer
```

This is the classic producer-consumer pattern.

------------------------------------------------------------------------

# 44. ConcurrentHashMap

`HashMap` is not thread-safe for concurrent mutation.

For concurrent access:

``` java
ConcurrentHashMap<K, V>
```

It provides concurrent operations designed for multi-threaded access.

Example:

``` java
ConcurrentHashMap<String, Integer> map =
        new ConcurrentHashMap<>();

map.merge("java", 1, Integer::sum);
```

------------------------------------------------------------------------

# 45. Thread Safety

A component is thread-safe when it behaves correctly when accessed
concurrently according to its contract.

Thread safety can be achieved through:

-   immutability
-   confinement
-   synchronization
-   locks
-   atomic variables
-   concurrent collections
-   message passing
-   avoiding shared mutable state

A very useful principle:

> The easiest shared state to synchronize is the state you don't share.

------------------------------------------------------------------------

# 46. Immutability

Immutable objects are naturally easier to share across threads.

Example:

``` java
public record User(
    String id,
    String name
) {}
```

Once constructed, the record's components cannot be reassigned.

Immutability dramatically reduces concurrency problems.

------------------------------------------------------------------------

# 47. Thread Confinement

Keep mutable state inside one thread.

``` text
Thread A
  └── private mutable state

Thread B
  └── private mutable state
```

No sharing → fewer synchronization problems.

------------------------------------------------------------------------

# 48. ThreadLocal

`ThreadLocal` gives each thread its own value.

``` java
ThreadLocal<String> user =
        new ThreadLocal<>();

user.set("Shyamal");

String value = user.get();

user.remove();
```

Conceptually:

``` text
Thread A → "A's value"
Thread B → "B's value"
Thread C → "C's value"
```

It is not shared state in the usual sense.

------------------------------------------------------------------------

# 49. ThreadLocal Warning

ThreadLocal can become problematic with thread pools.

A worker thread may live for a long time.

If you do:

``` java
threadLocal.set(value);
```

and forget:

``` java
threadLocal.remove();
```

the value can remain associated with the pooled worker longer than
intended.

Typical safe pattern:

``` java
try {
    threadLocal.set(value);
    // work
} finally {
    threadLocal.remove();
}
```

With virtual threads, ThreadLocal is supported, but because a JVM can
have very large numbers of virtual threads, you should carefully
consider the memory cost and whether scoped values are a better fit.

------------------------------------------------------------------------

# 50. ScopedValue --- Modern Java

Java 25 finalized `ScopedValue`.

It is designed for safely sharing immutable, bounded-lifetime data with
callees and child threads.

Conceptually:

``` text
Caller
  ↓
bind value
  ↓
Method A
  ↓
Method B
  ↓
Method C
```

The value is available within the scope.

It is especially relevant with:

-   virtual threads
-   structured concurrency

It is not simply "a newer ThreadLocal." Its programming model is
different.

Use it when you have one-way, immutable contextual data with a bounded
lifetime.

------------------------------------------------------------------------

# 51. Memory Model

The Java Memory Model (JMM) defines how threads interact through memory.

Three important concepts:

### Visibility

Will another thread see my write?

### Atomicity

Can an operation be observed halfway through?

### Ordering

Can operations appear reordered from another thread's perspective?

Concurrency correctness requires understanding all three.

------------------------------------------------------------------------

# 52. Happens-Before

The happens-before relationship is one of the most important advanced
Java concurrency concepts.

If action A happens-before action B, then the effects of A are
guaranteed to be visible/ordered appropriately with respect to B.

Important happens-before relationships include:

``` text
Program order
Lock unlock → subsequent lock
volatile write → subsequent volatile read
Thread.start() → actions in started thread
Actions in thread → successful join()
```

This is the foundation behind Java's visibility guarantees.

------------------------------------------------------------------------

# 53. Deadlock

Deadlock occurs when threads wait forever for each other.

Example:

``` text
Thread A:
locks A
waits for B

Thread B:
locks B
waits for A
```

Diagram:

``` text
Thread A ──holds──> Lock A
   │
   └──waits for──> Lock B

Thread B ──holds──> Lock B
   │
   └──waits for──> Lock A
```

Neither can proceed.

------------------------------------------------------------------------

# 54. Preventing Deadlock

Common techniques:

1.  Always acquire locks in the same global order.

``` text
Lock A → Lock B
```

Never:

``` text
Thread 1: A → B
Thread 2: B → A
```

2.  Minimize lock scope.

3.  Avoid unnecessary nested locks.

4.  Use `tryLock()` when appropriate.

5.  Prefer higher-level concurrency abstractions.

------------------------------------------------------------------------

# 55. Livelock

Threads are active but cannot make progress.

Example:

``` text
Thread A repeatedly backs off for B
Thread B repeatedly backs off for A
```

Unlike deadlock:

``` text
Deadlock → threads stuck
Livelock → threads active but useless
```

------------------------------------------------------------------------

# 56. Starvation

A thread never gets sufficient access to a resource because other
threads continuously get priority/access.

Example:

``` text
Thread A waits
Thread B repeatedly acquires resource
Thread C repeatedly acquires resource
Thread A keeps waiting
```

------------------------------------------------------------------------

# 57. False Sharing

A lower-level performance issue.

Two independent variables can occupy the same CPU cache line.

``` text
Cache line
┌───────────────────────┐
│ variable A | variable B│
└───────────────────────┘
```

Two CPUs repeatedly modifying separate variables can cause cache-line
invalidation.

This matters mostly in highly optimized, low-level concurrent systems.

Do not optimize for it prematurely.

------------------------------------------------------------------------

# 58. Platform Threads

Traditional Java threads are platform threads.

They are typically mapped roughly 1:1 to operating-system threads.

They have significant resource costs.

Therefore:

``` text
100,000 requests
```

does not generally imply:

``` text
100,000 platform threads
```

You normally use a bounded thread pool.

------------------------------------------------------------------------

# 59. Virtual Threads

Virtual threads were finalized in Java 21.

They are lightweight threads managed by the Java runtime.

``` java
Thread.startVirtualThread(() -> {
    System.out.println("Hello");
});
```

Or:

``` java
Thread.ofVirtual()
      .name("worker")
      .start(() -> {
          // work
      });
```

Or:

``` java
ExecutorService executor =
    Executors.newVirtualThreadPerTaskExecutor();
```

------------------------------------------------------------------------

# 60. Platform vs Virtual Threads

``` text
Platform Thread
      ↓
OS thread
      ↓
Expensive
      ↓
Limited quantity
```

Virtual:

``` text
Virtual Thread
      ↓
JVM scheduler
      ↓
Carrier platform thread
      ↓
Can support huge numbers
```

Virtual threads are designed primarily for **scale and throughput**,
especially when tasks spend substantial time blocked on I/O.

They are not "faster CPU threads."

------------------------------------------------------------------------

# 61. Virtual Thread Example

``` java
try (var executor =
         Executors.newVirtualThreadPerTaskExecutor()) {

    executor.submit(() -> {
        callDatabase();
    });

    executor.submit(() -> {
        callPaymentService();
    });
}
```

This style allows straightforward blocking code while supporting large
numbers of concurrent tasks.

------------------------------------------------------------------------

# 62. Virtual Threads and Blocking I/O

This is the key mental model.

Traditional platform thread:

``` text
Platform Thread
     ↓
blocking I/O
     ↓
OS thread remains occupied
```

Virtual thread:

``` text
Virtual Thread
     ↓
blocking I/O
     ↓
virtual thread can unmount
     ↓
carrier thread can run another virtual thread
```

Therefore virtual threads are excellent for workloads with lots of
waiting.

------------------------------------------------------------------------

# 63. Virtual Threads Are NOT a CPU Parallelism Trick

Bad reasoning:

> "I have 64 cores, so I'll create millions of virtual threads for
> CPU-intensive calculations."

Virtual threads do not create more CPU capacity.

If work is CPU-bound:

``` text
CPU
 ↓
limited number of cores
```

Millions of CPU-heavy tasks still compete for those cores.

Virtual threads primarily improve **concurrency/throughput**, not raw
CPU speed.

------------------------------------------------------------------------

# 64. Virtual Thread Pinning

A virtual thread can sometimes be **pinned to its carrier platform thread**.

The important modern-Java nuance is that older interview material is now partly outdated. Before Java 24, a virtual thread could be pinned while blocked inside `synchronized` methods/statements. JDK 24 changed the JVM implementation so that virtual threads can generally block in `synchronized` constructs without the old monitor-pin limitation.

Remaining pinning situations can still matter, especially around native/foreign-function execution and blocking behavior that prevents the virtual thread from unmounting.

Do **not** memorize:

```text
"synchronized always pins virtual threads"
```

That statement is outdated for modern JDKs. Instead remember:

```text
Virtual Thread
      ↓
blocking operation
      ↓
ideally unmounts from carrier
      ↓
carrier can run another virtual thread
```

If the virtual thread is pinned for a long time:

```text
Virtual Thread
      ↓
PINNED
      ↓
Carrier remains occupied
      ↓
less scalability
```

### Interview answer

> Virtual-thread pinning means a virtual thread cannot unmount from its carrier during certain blocking situations. Historically this included monitor-based synchronization, but Java 24 removed nearly all of those cases. Remaining pinning can still occur around native/foreign-function interactions. In production, I would use JFR and current-JDK diagnostics rather than assuming every `synchronized` block is a pinning problem.

------------------------------------------------------------------------

# 65. Virtual Threads and Thread Pools

One important mindset change:

Old model:

``` text
Thread creation expensive
        ↓
Reuse a small thread pool
```

Virtual-thread model:

``` text
Virtual thread cheap
        ↓
Create one per task
```

This is why:

``` java
Executors.newVirtualThreadPerTaskExecutor()
```

is often preferable to trying to create a huge reusable virtual-thread
pool.

Virtual threads themselves are cheap; pooling them is generally
unnecessary.

------------------------------------------------------------------------

# 66. Structured Concurrency

Structured concurrency treats related concurrent tasks as one unit of
work.

Example problem:

``` text
Request
 ├── fetch user
 ├── fetch orders
 └── fetch recommendations
```

These tasks are related to one request.

A structured concurrency model lets you:

-   fork subtasks
-   wait for them together
-   propagate failure
-   cancel related tasks
-   keep lifetimes bounded

Java 26 continues structured concurrency as a **preview API**, so you
should learn the concept, but don't treat the API as a finalized
everyday production API yet.

------------------------------------------------------------------------

# 67. Structured Concurrency Mental Model

Without structure:

``` text
Request
 ├── Thread A ────────────────>
 ├── Thread B ─────────>
 └── Thread C ─────────────────────>
```

Lifetimes can become difficult to reason about.

With structured concurrency:

``` text
Request scope
┌──────────────────────────────┐
│ A ──────────┐               │
│ B ───────┐  │               │
│ C ────────────────┐         │
│            join   │         │
└──────────────────────────────┘
```

The child tasks belong to the parent operation.

------------------------------------------------------------------------

# 68. Thread Safety in Spring

This is extremely important for you as a future Spring developer.

Spring singleton beans are usually shared across requests.

Example:

``` java
@Service
public class UserService {

    private int counter = 0;

    public void increment() {
        counter++;
    }
}
```

If this is a singleton bean, multiple requests can access the same
instance concurrently.

Therefore:

> Do not put request-specific mutable state in singleton Spring beans.

Prefer:

``` java
@Service
public class UserService {

    public User getUser(String id) {
        // local variables are thread-confined
    }
}
```

Local variables belong to the executing thread's stack.

Shared instance fields are different.

------------------------------------------------------------------------

# 69. Spring Singleton Does NOT Mean One Thread

Very important:

``` text
Spring singleton
     ≠
single-threaded
```

It means one bean instance in that Spring application context.

Many request threads can call it concurrently.

``` text
Request 1 ──┐
Request 2 ──┤
Request 3 ──┼──> same UserService instance
Request 4 ──┤
Request 5 ──┘
```

Therefore Spring singleton beans should normally be stateless.

------------------------------------------------------------------------
\n# 74. Advanced Interview Gap Addendum\n\nThis section closes several high-value gaps for senior Java/Spring Boot interviews without replacing the existing material.\n\n---\n\n## Q74.1. Why is ThreadLocal particularly important in Spring applications?\n\n`ThreadLocal` is a Core Java mechanism, but Spring and Java production libraries use the same idea for thread-bound contextual data. Examples to recognize include `RequestContextHolder`, `SecurityContextHolder`, and MDC-based logging context.\n\nThe key production model is:\n\n```text\nRequest A → Worker Thread-1 → context A\nRequest B → Worker Thread-2 → context B\n```\n\nWith a thread pool, the same worker can process another request:\n\n```text\nRequest A → Thread-1 → set(A) → request ends\n                         ↓\n                    Thread-1 reused\n                         ↓\nRequest B → Thread-1\n```\n\nIf request-specific data is not cleared, stale context can survive longer than intended.\n\nUse cleanup when you own the ThreadLocal lifecycle:\n\n```java\ntry {\n    context.set(value);\n    process();\n} finally {\n    context.remove();\n}\n```\n\n### Interview scenario\n\n> A Spring Boot service occasionally logs User A's request ID while processing User B's request. What would you investigate?\n\nA strong answer includes ThreadLocal/MDC, thread pools, context propagation, request lifecycle, async execution, and missing cleanup.\n\n---\n\n## Q74.2. Why is ThreadLocal.remove() especially important with thread pools?\n\nA pooled thread usually lives longer than a request:\n\n```text\nThread lifetime > Request lifetime\n```\n\nTherefore:\n\n> ThreadLocal gives thread isolation, not request isolation.\n\nRequest-specific context needs explicit lifecycle cleanup when the application owns that context.\n\n---\n\n## Q74.3. ThreadLocal vs ScopedValue?\n\n```text\nThreadLocal\n→ mutable thread-associated state\n→ explicit cleanup is important\n\nScopedValue\n→ immutable/bounded contextual data\n→ lexically scoped\n→ especially relevant with virtual threads and structured concurrency\n```\n\nScopedValue was finalized in Java 25. It is not simply a newer spelling of ThreadLocal; the programming model is different.\n\n---\n\n## Q74.4. What is the correct way to shut down an ExecutorService?\n\n`shutdown()` means stop accepting new tasks while previously submitted tasks continue. `shutdownNow()` attempts to stop execution, typically by interrupting running tasks, and returns tasks that never started. `awaitTermination()` lets the caller wait for termination.\n\nA robust pattern is:\n\n```java\nexecutor.shutdown();\n\ntry {\n    if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {\n        executor.shutdownNow();\n\n        if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {\n            // log failure to terminate\n        }\n    }\n} catch (InterruptedException e) {\n    executor.shutdownNow();\n    Thread.currentThread().interrupt();\n}\n```\n\n### Senior interview point\n\n`shutdownNow()` does not forcibly kill arbitrary Java code. Cancellation is cooperative, so tasks must respond to interruption appropriately.\n\n---\n\n## Q74.5. What is the Executors.newFixedThreadPool() trap?\n\n```java\nExecutors.newFixedThreadPool(10);\n```\n\ndoes not mean the entire workload is bounded. The traditional fixed-thread-pool factory uses an unbounded work queue. Under sustained overload:\n\n```text\n10 workers\n   +\nunbounded queue\n   ↓\nqueue growth\n   ↓\nlatency / memory pressure\n```\n\nFor production systems, explicitly configuring `ThreadPoolExecutor` with a bounded queue and an appropriate rejection policy is often preferable:\n\n```java\nThreadPoolExecutor executor =\n    new ThreadPoolExecutor(\n        10, 20,\n        30, TimeUnit.SECONDS,\n        new ArrayBlockingQueue<>(500),\n        new ThreadPoolExecutor.CallerRunsPolicy()\n    );\n```\n\nThe correct numbers depend on the workload.\n\nWhen discussing thread pools, always ask:\n\n```text\nworkers? queue capacity? rejection policy?\nqueue latency? shutdown? downstream capacity?\n```\n\n---\n\n## Q74.6. How do you implement bounded concurrency with Semaphore?\n\nSuppose 10,000 requests exist but an external service should receive at most 20 concurrent calls:\n\n```java\nSemaphore semaphore = new Semaphore(20);\n\nsemaphore.acquire();\ntry {\n    callExternalService();\n} finally {\n    semaphore.release();\n}\n```\n\nThe important distinction is:\n\n```text\nThread pool\n→ controls worker execution\n\nSemaphore\n→ controls access to limited capacity\n```\n\nThis is useful for downstream protection, expensive operations, and other bounded resources.\n\n---\n\n## Q74.7. CountDownLatch vs CyclicBarrier vs Semaphore\n\nUse this mental model:\n\n```text\nCountDownLatch\n→ wait until N things happen\n\nCyclicBarrier\n→ N participants meet at a synchronization point\n\nSemaphore\n→ only N participants may enter concurrently\n```\n\nA latch is generally one-shot; a cyclic barrier is reusable.\n\n---\n\n## Q74.8. Why is swallowing InterruptedException a serious bug?\n\nBad:\n\n```java\ntry {\n    queue.take();\n} catch (InterruptedException e) {\n    // ignore\n}\n```\n\nBetter:\n\n```java\ntry {\n    queue.take();\n} catch (InterruptedException e) {\n    Thread.currentThread().interrupt();\n    return;\n}\n```\n\nOr propagate it when the API allows:\n\n```java\nvoid process() throws InterruptedException {\n    queue.take();\n}\n```\n\nInterrupt is a cooperative cancellation signal. Swallowing it can break executor shutdown, request cancellation, and application lifecycle behavior.\n\n---\n\n## Q74.9. What is double-checked locking and why does it need volatile?\n\nClassic lazy Singleton:\n\n```java\nclass Singleton {\n    private static volatile Singleton instance;\n\n    private Singleton() {}\n\n    static Singleton getInstance() {\n        if (instance == null) {\n            synchronized (Singleton.class) {\n                if (instance == null) {\n                    instance = new Singleton();\n                }\n            }\n        }\n        return instance;\n    }\n}\n```\n\nThe two checks avoid synchronization after initialization while preventing multiple construction during initialization. `volatile` is required for correct visibility and ordering/safe publication under the Java Memory Model.\n\nFor a Singleton specifically, the initialization-on-demand holder idiom is often simpler. The real interview topic is:\n\n```text\nvolatile\n+ visibility\n+ ordering\n+ safe publication\n+ Java Memory Model\n```\n\n---\n\n## Q74.10. volatile vs synchronized vs AtomicInteger\n\n```text\nvolatile\n→ visibility/order; not compound-operation atomicity\n\nsynchronized\n→ mutual exclusion + visibility/order\n\nAtomicInteger\n→ atomic operations on an integer, typically via CAS-style mechanisms\n```\n\nExample:\n\n```java\nvolatile boolean running;\n\nAtomicInteger count = new AtomicInteger();\ncount.incrementAndGet();\n\n synchronized (lock) {\n    // compound critical section\n}\n```\n\nChoose based on the required correctness property, not on which API sounds more advanced.\n\n---\n\n## Q74.11. Does synchronized still pin virtual threads?\n\nDo **not** answer simply: "Yes." That was important before Java 24. JDK 24 delivered JEP 491, changing the JVM so virtual threads can generally block in `synchronized` methods/statements without the old monitor-pin limitation.\n\nRemaining pinning situations are narrower, particularly around native/foreign-function interactions. The exact behavior is JDK-version dependent, so state the Java version in a senior interview.\n\nA strong answer is:\n\n> Virtual-thread pinning is real, but the old rule that synchronized always pins a virtual thread is outdated from Java 24 onward. I would use current-JDK/JFR diagnostics to investigate remaining pinning rather than blindly replacing synchronized with ReentrantLock.\n\n---\n\n## Q74.12. What is structured concurrency and what is its current status?\n\nStructured concurrency treats related concurrent tasks as one unit of work:\n\n```text\nRequest\n ├── fetch user\n ├── fetch orders\n └── fetch recommendations\n```\n\nThe model gives related subtasks clearer lifetime, joining, failure propagation, cancellation, and observability.\n\nAs of Java 26, `StructuredTaskScope` is still a **preview API**. Learn the concept and the purpose, but do not describe it as a finalized general-purpose Java API.\n\n---\n\n## Q74.13. CompletableFuture vs Structured Concurrency\n\n`CompletableFuture` emphasizes asynchronous pipelines:\n\n```text\nstage → stage → combine\n```\n\nStructured concurrency emphasizes a parent operation owning related child tasks:\n\n```text\nparent\n ├── child A\n ├── child B\n └── child C\n       ↓\n     join / failure / cancellation\n```\n\nThey overlap but are not identical abstractions. Structured concurrency is primarily about task relationships and lifetimes.\n\n---\n\n## Q74.14. What should you think about when using virtual threads in Spring Boot?\n\nDo not stop at "virtual threads are cheap." Trace the whole resource chain:\n\n```text\nRequests\n   ↓\nVirtual threads\n   ↓\nApplication\n   ↓\nDB connection pool\n   ↓\nDatabase\n```\n\nand:\n\n```text\nVirtual threads\n   ↓\nHTTP client / connection pool\n   ↓\nDownstream service\n```\n\nVirtual threads remove one bottleneck; they do not increase database or downstream capacity. Use appropriate connection pools, timeouts, semaphores, rate limits, bulkheads, and other capacity controls where needed.\n\n---\n\n## Q74.15. Senior scenario: the API becomes slow under load\n\nSuppose:\n\n```text\nSpring Boot API\n    ↓\n10,000 concurrent requests\n    ↓\nDB + 2 downstream services\n```\n\nDo not immediately say "increase the thread pool." Investigate:\n\n```text\nCPU? GC? memory?\nthread pool? virtual-thread behavior?\nDB connection pool? DB query latency?\nHTTP connection pool? downstream latency?\nqueue growth? lock contention?\nretries? timeouts? external rate limits?\n```\n\nThen ask:\n\n> What resource is actually saturated?\n\nThe correct concurrency solution depends on the bottleneck.\n\n---\n\n# 77. Final High-Priority Concurrency Checklist\n\nFor Java + Spring Boot interviews, make sure you can explain these without memorizing one-line definitions:\n\n```text\nFOUNDATION\nThread/process, concurrency/parallelism, lifecycle, start/run, sleep, join, interrupt\n\nSHARED STATE\nRace condition, atomicity, synchronized, monitor, volatile, AtomicInteger, CAS, JMM, happens-before\n\nTASK EXECUTION\nExecutorService, ThreadPoolExecutor, queues, rejection, Callable, Future, CompletableFuture, shutdown lifecycle\n\nCOORDINATION\nSemaphore, CountDownLatch, CyclicBarrier, BlockingQueue, ReentrantLock, ReadWriteLock\n\nTHREAD CONTEXT\nThreadLocal, remove(), thread pools, MDC, Spring context holders, ScopedValue\n\nFAILURE\nDeadlock, starvation, livelock, cancellation, InterruptedException, pool exhaustion\n\nMODERN JAVA\nPlatform threads, virtual threads, DB-pool interaction, modern pinning behavior, StructuredTaskScope preview\n\nADVANCED\nDouble-checked locking, volatile, safe publication, production concurrency diagnosis\n```\n\n---\n\n
# 70. Common Interview Traps

### `start()` vs `run()`

`start()` creates/schedules concurrent execution.

`run()` is just a method invocation when called directly.

### `sleep()` vs `wait()`

`sleep()` pauses the current thread and does not release intrinsic
locks.

`wait()` releases the object's monitor and must be used with the
appropriate monitor ownership.

### `synchronized` vs `volatile`

`synchronized` provides mutual exclusion plus visibility/order
guarantees.

`volatile` provides visibility/order semantics but does not make
compound operations atomic.

### `Runnable` vs `Callable`

Runnable:

``` text
no result
```

Callable:

``` text
returns result
can throw checked exceptions
```

### `HashMap` vs `ConcurrentHashMap`

HashMap is not designed for concurrent mutation.

ConcurrentHashMap is designed for concurrent access.

### `Future` vs `CompletableFuture`

Future represents an asynchronous result but is awkward for complex
composition.

CompletableFuture supports composition and asynchronous pipelines.

### Platform vs Virtual Thread

Platform threads are OS-backed and relatively expensive.

Virtual threads are JVM-scheduled and lightweight, especially useful for
high-concurrency I/O workloads.

------------------------------------------------------------------------

# 71. Recommended Learning Order

Do NOT try to memorize everything in this note at once.

Learn in this order:

``` text
1. Thread basics
2. start() vs run()
3. Runnable
4. Thread lifecycle
5. sleep()
6. join()
7. interrupt()
8. Race conditions
9. synchronized
10. intrinsic locks
11. volatile
12. AtomicInteger / CAS
13. ExecutorService
14. Thread pools
15. Callable / Future
16. CompletableFuture
17. BlockingQueue
18. ConcurrentHashMap
19. Lock / ReentrantLock
20. CountDownLatch
21. CyclicBarrier
22. Semaphore
23. ThreadLocal
24. Java Memory Model
25. happens-before
26. Deadlock / starvation / livelock
27. ForkJoinPool
28. Parallel streams
29. Platform threads
30. Virtual threads
31. ScopedValue
32. Structured concurrency
33. Spring concurrency
34. Production debugging/performance
```

------------------------------------------------------------------------

# 72. A Mental Model to Remember

When thinking about Java concurrency, ask these questions:

``` text
1. Who owns the data?
2. Is the data shared?
3. Is the data mutable?
4. Can multiple threads access it?
5. Do I need atomicity?
6. Do I need visibility?
7. Do I need ordering?
8. Do I need mutual exclusion?
9. Can I avoid sharing instead?
10. Can I use immutability?
11. Should this be a task submitted to an executor?
12. Is this CPU-bound or I/O-bound?
13. Should I use a platform thread or virtual thread?
14. How will cancellation work?
15. What happens when a task fails?
```

If you can answer these questions, you are thinking like a
concurrent-programming engineer rather than simply memorizing APIs.

------------------------------------------------------------------------

# 73. The Big Picture

``` text
                         JAVA CONCURRENCY
                                │
             ┌──────────────────┴──────────────────┐
             │                                     │
        Thread Basics                         Shared State
             │                                     │
       ┌─────┼─────┐                    ┌──────────┼──────────┐
       │     │     │                    │          │          │
    Thread Runnable Lifecycle       synchronized volatile   Atomic
       │                         │
       │                         └── Locks
       │
       └───────────────┐
                       │
                 Task Execution
                       │
             ┌─────────┼─────────┐
             │         │         │
        ExecutorService Future CompletableFuture
             │
        Thread Pools
             │
     ┌───────┴────────┐
     │                │
 Platform Threads  Virtual Threads
                         │
                ┌────────┴────────┐
                │                 │
           ScopedValue      Structured
                           Concurrency
```

The ultimate goal is not:

> "I know 30 concurrency classes."

The goal is:

> "Given a concurrent problem, I can identify the shared state, the
> synchronization requirements, the task model, the failure/cancellation
> model, and choose an appropriate Java concurrency abstraction."

------------------------------------------------------------------------


# 78. Updated Learning Priority

For efficient interview preparation, study in this order:

```text
1. Thread basics + lifecycle
2. start/run + Runnable/Callable
3. Race conditions + atomicity
4. synchronized + monitor
5. volatile + Java Memory Model + happens-before
6. AtomicInteger + CAS
7. ExecutorService + ThreadPoolExecutor
8. Future + CompletableFuture
9. Interrupts + cancellation
10. Graceful executor shutdown
11. BlockingQueue + producer/consumer
12. ReentrantLock
13. Semaphore + bounded concurrency
14. CountDownLatch + CyclicBarrier
15. ThreadLocal + thread-pool leak scenario
16. Spring singleton thread safety + MDC/context
17. Deadlock/starvation/livelock
18. Platform vs virtual threads
19. Virtual threads + downstream resource limits
20. Modern virtual-thread pinning
21. ScopedValue
22. Structured concurrency
23. Double-checked locking + volatile
24. Production concurrency scenarios
```

The objective is not to know every concurrency class. The objective is to identify the required property:

```text
Need visibility?
Need atomicity?
Need mutual exclusion?
Need bounded concurrency?
Need cancellation?
Need coordination?
Need contextual data?
Need high I/O concurrency?
Need structured task lifetime?
```

and then select the simplest correct abstraction.

---

## Sources / Current Java Notes

- OpenJDK JEP 491: Synchronize Virtual Threads without Pinning (Java 24).
- OpenJDK JEP 525: Structured Concurrency, sixth preview (Java 26).
- Java SE 26 Thread and concurrency APIs, including virtual threads and thread-local support.
