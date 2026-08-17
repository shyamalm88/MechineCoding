# Java + Spring Boot + Backend Interview SUPERSET

> [!important]
> This is the **master Obsidian interview document** combining the Java, Spring Boot, JDBC, Hibernate/JPA, Security, REST, Redis, Kafka, SQL/NoSQL, Microservices, Modern Java/JVM, Docker, Kubernetes, Maven and CI/CD material we have built.
>
> The target is a **frontend-focused full-stack engineer becoming interview-ready in Java/Spring Boot**, not a dedicated DevOps or Java-platform specialist.

## How to use this document

This is a **superset**, so some topics intentionally appear in more than one place. Use the section that gives the deepest treatment rather than trying to memorize repeated definitions.

For every interview question, train yourself to answer in this order:

1. **Definition** — what is it?
2. **Mechanism** — how does it actually work?
3. **Example** — show a small code/design example.
4. **Why** — why was the feature designed this way?
5. **Trap** — what commonly goes wrong?
6. **Production angle** — what changes under concurrency, failure, scale or deployment?
7. **Follow-up** — what question would an interviewer ask next?

## Master learning map

```text
Java
 ├─ OOP / language / exceptions
 ├─ Collections / generics
 ├─ Threads / concurrency / JMM
 ├─ Modern Java
 └─ JVM / performance
       ↓
Spring
 ├─ IoC / DI / Bean lifecycle / AOP
 ├─ Spring Boot / auto-configuration
 ├─ REST / MVC / validation
 ├─ Security
 └─ Testing
       ↓
Persistence
 ├─ JDBC
 ├─ JPA / Hibernate
 ├─ Transactions
 └─ SQL / NoSQL
       ↓
Distributed backend
 ├─ Redis
 ├─ Kafka
 ├─ Microservices
 ├─ Resilience / Outbox / Saga
 └─ Observability
       ↓
Production
 ├─ Maven
 ├─ Docker
 ├─ Kubernetes
 └─ CI/CD
```

## Current-version awareness

As of August 2026, Java SE 26 is the current feature release and Java 25 is the current LTS generation. Spring Boot 4.1.0 is listed as stable, while 4.0.x and 3.5.x are also relevant in deployed systems. Spring announced 3.5.16 as the final open-source 3.5.x release in June 2026. Version-specific answers should therefore be checked against the target company's JDK and Spring Boot version rather than blindly copying Java-8/Boot-2-era interview material.

> [!warning]
> **Modernization rule:** old interview banks are useful for discovering questions, but not automatically authoritative for current behavior. In particular, verify `finalize()`, virtual-thread behavior, Spring Security configuration, Springfox/Swagger, Spring Boot 3/4 APIs, Java 25/26 language/runtime behavior and preview/incubating features.

## Priority for your role

| Priority | Topics |
|---|---|
| P0 | Java OOP/Core, Collections, Threads, Spring Core/Boot, REST, Security, JPA/Hibernate, Transactions |
| P1 | JDBC, SQL, Redis, Kafka, Microservices, Testing, JVM |
| P1 | Maven, Docker, Kubernetes, CI/CD |
| P2 | Deep JVM internals, reflection, serialization, advanced framework internals |

## Interview mindset

The goal is not to memorize 500 one-line answers. A strong interviewer can take a simple question and change one condition:

```text
@Transactional
   ↓
What if self-invocation?
   ↓
What if another microservice?
   ↓
What if DB commit succeeds but Kafka publish fails?
   ↓
What if Kafka delivers the event twice?
   ↓
Outbox + idempotency + eventual consistency
```

If you can follow that chain, you are learning the material at interview level rather than trivia level.

---


# MASTER SECTION — Java Core + OOP


title: Java Core & OOP — Complete Interview Questions, Answers & Tricky Scenarios
tags:
  - java
  - core-java
  - oop
  - interview
  - exception-handling
  - access-modifiers
  - inner-classes
  - generics
  - java-8
  - java-17
  - java-21
  - java-25
---

# Java Core & OOP — Complete Interview Preparation

> [!note]
> This is intended as a **serious Java interview preparation note**, not a syntax cheat sheet.
>
> Questions progress from **fundamentals → OOP → language mechanics → exceptions → access control → classes → interfaces → inner classes → strings → memory → generics → Java 8+ → modern Java → tricky questions → production scenarios**.
>
> The objective is to reach the point where you can answer:
>
> **What is it? Why does it exist? How does it work? Where can it be used? Where can it NOT be used? Why? What are the trade-offs? What happens internally?**

---

# 1. What Does "Core Java" Actually Mean?

When an interviewer says:

> "How strong are you in Core Java?"

they usually mean much more than syntax.

You should be comfortable with:

```text
Java Language Fundamentals
        ↓
OOP
        ↓
Classes / Objects
        ↓
Inheritance
        ↓
Polymorphism
        ↓
Abstraction
        ↓
Encapsulation
        ↓
Interfaces
        ↓
Access Modifiers
        ↓
static / final / this / super
        ↓
Constructors
        ↓
Strings
        ↓
equals / hashCode
        ↓
Exceptions
        ↓
Generics
        ↓
Collections
        ↓
Threads / Concurrency
        ↓
JVM / Memory
        ↓
Java 8+ Features
        ↓
Modern Java
```

Collections and Threads have their own dedicated notes, so this document focuses primarily on the **rest of Core Java**, while connecting to those topics where interviewers commonly cross-question.

---

# 2. Java Fundamentals

## Q1. What is Java?

Java is a general-purpose, class-based programming language designed around object-oriented programming and portability.

A Java source program is typically:

```text
.java
 ↓
javac
 ↓
bytecode (.class)
 ↓
JVM
 ↓
machine execution
```

The important idea is that Java source is compiled into bytecode, and the JVM executes that bytecode.

---

## Q2. Why is Java platform independent?

Java source code is compiled into JVM bytecode rather than directly into one specific operating system's machine code.

```text
Java Source
    ↓
Bytecode
    ↓
JVM
 ┌──┼──┐
Linux Windows macOS
```

Different platforms provide different JVM implementations.

Therefore the same compiled bytecode can generally run on different platforms with a compatible JVM.

This is the basis of:

> **Write once, run anywhere**

It is more precise to say:

> Java bytecode is platform-independent; the JVM implementation is platform-specific.

---

## Q3. Is Java 100% object-oriented?

No.

Java has primitive types:

```java
int
long
double
boolean
char
```

These are not objects.

Java provides wrapper classes:

```java
Integer
Long
Double
Boolean
Character
```

through which primitive values can participate in object-based APIs when needed.

---

## Q4. What are primitive data types in Java?

Java has eight primitive types:

```text
byte
short
int
long
float
double
char
boolean
```

Important:

```text
byte   → 8-bit signed
short  → 16-bit signed
int    → 32-bit signed
long   → 64-bit signed
float  → 32-bit IEEE 754 floating point
double → 64-bit IEEE 754 floating point
char   → 16-bit UTF-16 code unit
boolean → true / false
```

---

## Q5. What is the difference between primitive and reference types?

Primitive:

```java
int x = 10;
```

Reference:

```java
String name = "Alice";
```

A reference variable holds a reference to an object rather than the object value itself.

Conceptually:

```text
Stack / local state
      │
      ├── x = 10
      │
      └── name ───────→ String object
```

Do not oversimplify this into:

> "Primitive is always stack and object is always heap."

Java's actual memory model and JVM optimizations are more nuanced.

---

# 3. Variables

## Q6. What types of variables exist in Java?

Common classification:

### Local variable

Declared inside a method/block.

```java
void process() {
    int count = 10;
}
```

### Instance variable

Belongs to an object.

```java
class User {
    String name;
}
```

### Static/class variable

Belongs to the class rather than an individual instance.

```java
class User {
    static int count;
}
```

---

## Q7. What is the difference between instance and static variables?

Instance:

```java
class User {
    String name;
}
```

Each object has its own `name`.

```java
User a = new User();
User b = new User();
```

Conceptually:

```text
a → name
b → name
```

Static:

```java
class User {
    static int count;
}
```

There is one class-level variable associated with the class.

Conceptually:

```text
User.class → count
```

---

## Q8. Do local variables get default values?

No.

This will not compile:

```java
void test() {
    int x;
    System.out.println(x);
}
```

Local variables must be definitely assigned before use.

Instance and static fields receive default values.

Examples:

```text
int       → 0
boolean   → false
reference → null
```

---

# 4. OOP Fundamentals

## Q9. What are the four pillars of OOP?

```text
Encapsulation
Inheritance
Polymorphism
Abstraction
```

But don't merely memorize the four words.

A good interview answer explains the problem each solves.

---

## Q10. What is encapsulation?

Encapsulation means controlling access to an object's state and behavior through a well-defined interface.

Example:

```java
class BankAccount {

    private double balance;

    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException(
                "Amount must be positive"
            );
        }

        balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}
```

The caller cannot directly do:

```java
account.balance = -1000;
```

because the state is private.

### Important

Encapsulation is not simply:

> "Make all fields private and create getters/setters."

It is about **protecting invariants and controlling state transitions**.

---

## Q11. What is inheritance?

Inheritance allows a class to derive behavior and structure from another class.

```java
class Animal {
    void eat() {
    }
}

class Dog extends Animal {
    void bark() {
    }
}
```

Conceptually:

```text
Animal
  ↑
 Dog
```

Dog inherits accessible behavior from Animal.

---

## Q12. What is polymorphism?

Polymorphism means one interface/reference can represent different concrete implementations.

Example:

```java
Animal animal = new Dog();
animal.sound();
```

If `Dog` overrides `sound()`, the Dog implementation can execute.

This is runtime polymorphism.

Another form is compile-time polymorphism through method overloading.

---

# 5. Method Overloading

## Q13. What is method overloading?

Multiple methods have the same name but different parameter lists.

```java
void print(int x) {}

void print(String x) {}

void print(int x, int y) {}
```

Overloading is resolved at compile time.

---

## Q14. Can methods be overloaded only by changing return type?

No.

This is invalid:

```java
int getValue() {
    return 1;
}

String getValue() {
    return "1";
}
```

The compiler cannot distinguish calls based only on return type.

---

## Q15. Can static methods be overloaded?

Yes.

```java
static void process(int x) {}

static void process(String x) {}
```

Static methods can be overloaded.

---

# 6. Method Overriding

## Q16. What is method overriding?

A subclass provides a new implementation of an inherited method.

```java
class Animal {

    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {

    @Override
    void sound() {
        System.out.println("Bark");
    }
}
```

At runtime:

```java
Animal a = new Dog();
a.sound();
```

prints:

```text
Bark
```

---

## Q17. What is the difference between overloading and overriding?

| Overloading | Overriding |
|---|---|
| Same class or inheritance hierarchy | Requires inheritance |
| Different parameter list | Same method signature |
| Compile-time selection | Runtime dispatch |
| Return type alone cannot distinguish | Covariant return allowed |
| Static methods can be overloaded | Static methods are hidden, not overridden |

---

## Q18. Can an overriding method reduce visibility?

No.

Example:

```java
class Parent {
    protected void process() {}
}

class Child extends Parent {
    // Cannot make it private
    // private void process() {}
}
```

The overriding method cannot be less accessible than the inherited method.

It can have equal or greater accessibility.

---

## Q19. Can an overriding method increase visibility?

Yes.

```text
protected → public
```

is allowed.

---

## Q20. Can an overriding method throw broader checked exceptions?

No.

If the parent declares:

```java
void process() throws IOException
```

the child cannot declare:

```java
void process() throws Exception
```

because `Exception` is broader.

The child can:

- Throw the same checked exception
- Throw a narrower checked exception
- Throw no checked exception
- Throw unchecked exceptions

---

## Q21. What is a covariant return type?

An overriding method can return a subtype of the parent's return type.

```java
class Parent {
    Animal create() {
        return new Animal();
    }
}

class Child extends Parent {
    @Override
    Dog create() {
        return new Dog();
    }
}
```

Because:

```text
Dog extends Animal
```

the return type is covariant.

---

# 7. Abstraction

## Q22. What is abstraction?

Abstraction means exposing essential behavior while hiding unnecessary implementation details.

Example:

```java
interface PaymentService {
    void pay(double amount);
}
```

The caller knows:

```text
pay()
```

but doesn't need to know whether the implementation uses:

```text
Stripe
PayPal
bank transfer
wallet
```

---

## Q23. Abstract class vs interface?

### Abstract class

Can have:

- Instance fields
- Constructors
- Concrete methods
- Abstract methods
- Static members

Example:

```java
abstract class Payment {

    protected String currency;

    Payment(String currency) {
        this.currency = currency;
    }

    abstract void pay();

    void validate() {
    }
}
```

### Interface

Primarily defines a contract.

Modern Java interfaces can also contain:

- Abstract methods
- Default methods
- Static methods
- Private helper methods
- Constants

---

## Q24. Can an abstract class have a constructor?

Yes.

```java
abstract class Animal {

    Animal() {
        System.out.println("Animal constructor");
    }
}
```

The constructor runs when a concrete subclass object is created, as part of superclass construction.

You cannot directly instantiate the abstract class:

```java
new Animal(); // invalid
```

---

## Q25. Can an abstract class have no abstract methods?

Yes.

```java
abstract class BaseService {

    void log() {
    }
}
```

The `abstract` keyword can be used to prevent direct instantiation and express design intent even if no abstract method exists.

---

# 8. Interfaces

## Q26. Can an interface have variables?

Yes, but interface fields are implicitly:

```text
public
static
final
```

Example:

```java
interface Config {
    int TIMEOUT = 30;
}
```

is effectively:

```java
public static final int TIMEOUT = 30;
```

---

## Q27. Can an interface have constructors?

No.

Interfaces do not have object construction semantics.

---

## Q28. Can an interface have methods with implementations?

Yes.

### default methods

```java
interface Logger {

    default void info() {
        System.out.println("INFO");
    }
}
```

### static methods

```java
interface MathUtil {

    static int add(int a, int b) {
        return a + b;
    }
}
```

### private methods

Modern Java interfaces can use private helper methods for internal implementation reuse.

---

## Q29. Why were default methods introduced?

A major reason was interface evolution.

Suppose millions of classes implement:

```java
interface Payment {
    void pay();
}
```

If Java adds a new abstract method:

```java
void refund();
```

all implementations would need to implement it.

A default method can provide backward-compatible behavior:

```java
default void refund() {
}
```

This allowed interfaces in the Java ecosystem to evolve without immediately breaking every implementation.

---

## Q30. Can a class implement multiple interfaces?

Yes.

```java
class PaymentService
        implements Payable, Refundable {
}
```

This is one way Java supports multiple inheritance of type/contracts.

Java does not allow a class to extend multiple classes.

---

# 9. Multiple Inheritance and Diamond Problem

## Q31. Why doesn't Java support multiple inheritance of classes?

Consider:

```text
        A
       / \
      B   C
       \ /
        D
```

Suppose B and C both inherit:

```java
void process()
```

Which implementation should D inherit?

This creates ambiguity.

Java avoids this class inheritance diamond problem by allowing:

```text
one superclass
+
multiple interfaces
```

---

## Q32. What happens if two interfaces provide the same default method?

Example:

```java
interface A {
    default void test() {
        System.out.println("A");
    }
}

interface B {
    default void test() {
        System.out.println("B");
    }
}
```

If:

```java
class C implements A, B {
}
```

the class must resolve the conflict by overriding:

```java
void test()
```

A class's own method takes precedence over interface defaults.

---

# 10. Access Modifiers

## Q33. What are Java's access modifiers?

```text
private
default/package-private
protected
public
```

Visibility:

```text
                 Same Class  Same Package  Subclass  Everywhere
private              ✓           ✗            ✗          ✗
default              ✓           ✓            ✗*         ✗
protected             ✓           ✓            ✓**        ✗
public                ✓           ✓            ✓          ✓
```

`*` A subclass in another package cannot access a package-private member through inheritance.

`**` Protected access across packages has an important rule: the subclass can access the member through inheritance, subject to Java's protected access rules; it cannot freely access it through an arbitrary superclass instance.

---

## Q34. What is default/package-private access?

If no access modifier is specified:

```java
class User {

    String name;
}
```

`name` has package-private access.

It is accessible from classes in the same package but not from unrelated classes in another package.

---

## Q35. Where can private members be accessed?

Only within the declaring top-level class context.

A subclass cannot directly access a parent's private field:

```java
class Parent {
    private int value;
}

class Child extends Parent {
    void test() {
        // value = 10; // invalid
    }
}
```

A child can access the state through protected/public methods exposed by the parent.

---

## Q36. Where can protected members be accessed?

Within:

- The declaring class
- The same package
- Subclasses in other packages, subject to protected access rules

Important interview trap:

A subclass in another package cannot treat a protected member as universally public.

The access must occur through the subclass/inheritance context.

---

## Q37. Can a top-level class be private?

No.

A top-level class can generally be:

```text
public
package-private
```

It cannot be:

```text
private
protected
```

Those modifiers make sense for members/nested types, not top-level classes.

---

## Q38. Can a nested class be private?

Yes.

```java
class Outer {

    private static class Helper {
    }
}
```

Nested classes can use access modifiers such as:

```text
private
protected
public
package-private
```

---

## Q39. Can a top-level class be protected?

No.

`protected` is not valid for a top-level class.

---

# 11. final Keyword

## Q40. What does final mean?

Its meaning depends on where it is used.

### final variable

Cannot be reassigned after initialization.

```java
final int x = 10;
```

### final method

Cannot be overridden.

```java
final void process() {}
```

### final class

Cannot be extended.

```java
final class Utility {}
```

---

## Q41. Does final make an object immutable?

No.

This is a major interview trap.

```java
final List<String> names =
    new ArrayList<>();

names.add("Alice");
```

This is allowed.

`final` prevents the reference from being reassigned:

```java
names = new ArrayList<>(); // invalid
```

It does not automatically make the object immutable.

---

## Q42. Can a final field contain a mutable object?

Yes.

```java
class User {

    private final List<String> roles =
        new ArrayList<>();
}
```

The reference cannot change, but the List itself can still mutate.

To create true immutability, the object's state and exposed references must be designed accordingly.

---

# 12. static

## Q43. What does static mean?

`static` indicates that a member belongs to the class rather than a particular instance.

Example:

```java
class Counter {

    static int count;
}
```

Access:

```java
Counter.count
```

rather than requiring:

```java
new Counter()
```

---

## Q44. Can a static method access instance variables directly?

No.

```java
class Test {

    int value;

    static void print() {
        // System.out.println(value); // invalid
    }
}
```

Why?

A static method has no implicit `this` object.

There is no particular instance whose `value` should be used.

It can access an instance field through an explicit object:

```java
Test t = new Test();
System.out.println(t.value);
```

---

## Q45. Can a static method access static variables?

Yes.

```java
class Test {

    static int value;

    static void print() {
        System.out.println(value);
    }
}
```

---

## Q46. Can constructors be static?

No.

A constructor belongs to object initialization and cannot be static.

---

## Q47. Can an abstract method be static?

No.

A static method belongs to the class and is not dynamically dispatched.

An abstract method requires subclass implementation and runtime dispatch.

These concepts conflict.

---

# 13. this and super

## Q48. What is this?

`this` refers to the current object instance.

Example:

```java
class User {

    private String name;

    User(String name) {
        this.name = name;
    }
}
```

Here:

```text
name parameter
vs
this.name field
```

---

## Q49. Can this be used inside a static method?

No.

A static method has no current object instance.

Therefore:

```java
static void test() {
    // this.value; // invalid
}
```

---

## Q50. What is super?

`super` refers to the superclass portion/behavior of the current object.

Example:

```java
class Parent {
    void print() {
        System.out.println("Parent");
    }
}

class Child extends Parent {

    @Override
    void print() {
        super.print();
        System.out.println("Child");
    }
}
```

---

# 14. Constructors

## Q51. What is a constructor?

A constructor initializes an object when it is created.

```java
class User {

    User() {
        System.out.println("Created");
    }
}
```

Invocation:

```java
new User();
```

Constructors:

- Have the class name
- Have no return type
- Are not inherited
- Can be overloaded

---

## Q52. Is a constructor a method?

No.

Although constructors look syntactically similar to methods, they are distinct language constructs.

A constructor:

```java
User() {}
```

does not have a return type.

---

## Q53. What is a default constructor?

There are two phrases people sometimes confuse.

If you do not declare **any constructor**, the compiler can provide a no-argument constructor.

```java
class User {
}
```

Conceptually:

```java
User() {
    super();
}
```

But if you declare:

```java
User(String name) {
}
```

the compiler no longer automatically provides a no-argument constructor.

---

## Q54. Can constructors be private?

Yes.

```java
class Singleton {

    private Singleton() {
    }
}
```

Private constructors can be useful for:

- Singleton-style designs
- Utility classes
- Factory-controlled creation

---

## Q55. Can constructors be inherited?

No.

A subclass does not inherit constructors.

But superclass construction occurs when creating a subclass object.

---

## Q56. What is constructor chaining?

Constructors can call:

```java
this(...)
```

or:

```java
super(...)
```

Example:

```java
class User {

    User() {
        this("Unknown");
    }

    User(String name) {
    }
}
```

`this(...)` calls another constructor in the same class.

`super(...)` calls a superclass constructor.

---

## Q57. Where must this() or super() appear?

If explicitly used, constructor invocation must be the first statement of the constructor.

You cannot do:

```java
User() {
    System.out.println("Hi");
    super();
}
```

---

# 15. Object Construction Order

## Q58. What happens when a subclass object is created?

Example:

```java
class Parent {

    Parent() {
        System.out.println("Parent");
    }
}

class Child extends Parent {

    Child() {
        System.out.println("Child");
    }
}
```

Creating:

```java
new Child();
```

results conceptually in:

```text
Superclass initialization
        ↓
Superclass constructor
        ↓
Subclass initialization
        ↓
Subclass constructor
```

The parent portion must be initialized before the child portion.

---

## Q59. What is the initialization order involving static fields?

A simplified class initialization picture:

```text
Class initialization
        ↓
static field initializers / static blocks
        ↓
object creation
        ↓
instance field initializers / instance initializer blocks
        ↓
constructor
```

Static initialization happens when the class is initialized, not once per object.

---

# 16. String

## Q60. Why is String immutable in Java?

Strings are immutable: once a String object is created, its character content cannot be changed.

Benefits include:

- Security
- Thread-safety of immutable state
- Safe use as HashMap keys
- String pool sharing
- Predictable behavior

Example:

```java
String s = "Hello";

s.concat(" World");
```

The original String is unchanged.

You need:

```java
s = s.concat(" World");
```

to point `s` to the new String.

---

## Q61. What is the String pool?

Java maintains a pool of String literals so identical literals can be shared.

Example:

```java
String a = "hello";
String b = "hello";
```

They can refer to the same pooled String object.

But:

```java
String c = new String("hello");
```

creates a distinct String object.

Therefore:

```java
a == b
```

can be true for identical literals, while:

```java
a == c
```

is false.

---

## Q62. What is the difference between == and equals() for String?

`==` compares references.

```java
a == b
```

asks whether both references point to the same object.

`equals()` compares String content.

```java
a.equals(b)
```

asks whether the strings contain the same sequence of characters.

For content comparison, use:

```java
equals()
```

not `==`.

---

## Q63. String vs StringBuilder vs StringBuffer?

### String

Immutable.

Repeated concatenation can create many intermediate objects.

### StringBuilder

Mutable character sequence.

Usually preferred for single-threaded string construction.

### StringBuffer

Mutable and synchronized.

Generally slower than StringBuilder and mainly relevant to legacy APIs requiring its synchronization behavior.

---

## Q64. Why is StringBuilder usually preferred?

Consider:

```java
String result = "";

for (...) {
    result += value;
}
```

Repeated concatenation can create many intermediate Strings.

`StringBuilder` allows mutation of a buffer:

```java
StringBuilder sb =
    new StringBuilder();

sb.append("A");
sb.append("B");

String result = sb.toString();
```

The compiler may optimize simple `+` concatenation, but for explicit loops and complex construction, StringBuilder makes the intent and mutability model clear.

---

# 17. equals() and hashCode()

## Q65. What is the equals() contract?

For well-behaved implementations, `equals()` should be:

```text
Reflexive
Symmetric
Transitive
Consistent
Non-null
```

### Reflexive

```java
x.equals(x) == true
```

### Symmetric

```text
x.equals(y) == y.equals(x)
```

### Transitive

If:

```text
x == y
y == z
```

under equals, then:

```text
x == z
```

### Consistent

Repeated calls should return consistent results if relevant state hasn't changed.

### Non-null

```java
x.equals(null) == false
```

for a normal non-null x.

---

## Q66. What is the hashCode contract?

If:

```java
a.equals(b)
```

is true, then:

```java
a.hashCode() == b.hashCode()
```

must be true.

The reverse is not required.

```text
same hash
≠
same object
```

---

## Q67. Why is hashCode important?

Hash-based collections use hash codes to efficiently locate candidate entries.

Examples:

```text
HashMap
HashSet
LinkedHashMap
LinkedHashSet
```

Bad hash functions can create many collisions and reduce practical performance.

---

# 18. Wrapper Classes and Autoboxing

## Q68. What are wrapper classes?

Primitive wrappers include:

```text
int      → Integer
long     → Long
double   → Double
float    → Float
short    → Short
byte     → Byte
char     → Character
boolean  → Boolean
```

They allow primitive values to be represented as objects.

---

## Q69. What is autoboxing?

Automatic conversion from primitive to wrapper.

```java
Integer x = 10;
```

conceptually involves boxing:

```text
int → Integer
```

---

## Q70. What is unboxing?

Automatic conversion from wrapper to primitive.

```java
Integer x = 10;

int y = x;
```

conceptually:

```text
Integer → int
```

---

## Q71. What is the Integer == trap?

Example:

```java
Integer a = 100;
Integer b = 100;

System.out.println(a == b);
```

This may print:

```text
true
```

because commonly used small Integer values can be cached.

But:

```java
Integer a = 1000;
Integer b = 1000;

a == b
```

should not be used for value comparison and can be false.

Use:

```java
a.equals(b)
```

for wrapper value comparison.

---

## Q72. Why can unboxing cause NullPointerException?

Example:

```java
Integer value = null;

int x = value;
```

Unboxing requires obtaining the primitive value from the wrapper, but the reference is null.

Therefore:

```text
NullPointerException
```

can occur.

This is an important real-world Java bug.

---

# 19. Exception Handling

## Q73. What is an exception?

An exception represents an abnormal condition that disrupts normal execution and can be handled by the program.

Java's throwable hierarchy begins with:

```text
Throwable
├── Error
└── Exception
    └── RuntimeException
```

---

## Q74. Error vs Exception?

### Error

Usually represents serious JVM/system-level problems that applications generally should not attempt to recover from.

Examples:

```text
OutOfMemoryError
StackOverflowError
```

### Exception

Represents conditions applications can potentially handle.

Examples:

```text
IOException
SQLException
RuntimeException
```

---

## Q75. Checked vs unchecked exceptions?

### Checked exceptions

Subclasses of Exception excluding RuntimeException.

The compiler requires them to be handled or declared.

Example:

```java
void read()
        throws IOException {
}
```

### Unchecked exceptions

RuntimeException and its subclasses.

Examples:

```text
NullPointerException
IllegalArgumentException
IllegalStateException
IndexOutOfBoundsException
```

The compiler does not require explicit handling.

---

## Q76. Why do checked exceptions exist?

They force API designers and callers to explicitly acknowledge certain recoverable/expected failure conditions.

Example:

```java
Files.readString(path);
```

may require dealing with I/O failure.

Whether checked exceptions are desirable in every application architecture is a design discussion.

---

# 20. try, catch, finally

## Q77. What is the purpose of try-catch?

```java
try {
    riskyOperation();
} catch (IOException e) {
    handle(e);
}
```

`try` contains code that may throw.

`catch` handles matching exceptions.

---

## Q78. What is finally?

`finally` is used for cleanup logic that should generally execute whether an exception occurs or not.

```java
try {
    process();
} finally {
    cleanup();
}
```

However, for resources, prefer try-with-resources when applicable.

---

## Q79. Can finally fail to execute?

Yes, in exceptional JVM termination situations such as:

```java
System.exit(...)
```

or catastrophic process termination.

Therefore:

> finally usually executes, but it is not an absolute guarantee under process termination.

---

## Q80. What happens if both try and finally return?

Example:

```java
int test() {
    try {
        return 1;
    } finally {
        return 2;
    }
}
```

The `finally` return wins.

Result:

```text
2
```

This is technically possible but strongly discouraged because it can hide the original return/exception and make control flow difficult to reason about.

---

# 21. Multiple Catch

## Q81. Can you have multiple catch blocks?

Yes.

```java
try {
    process();
}
catch (IOException e) {
}
catch (SQLException e) {
}
```

More specific exceptions should come before broader ones.

This is invalid:

```java
catch (Exception e) {
}
catch (IOException e) {
}
```

because IOException is already caught by Exception.

---

## Q82. Can you catch multiple exceptions in one catch?

Yes.

```java
catch (IOException | SQLException e) {
}
```

This is called multi-catch.

---

# 22. throw vs throws

## Q83. What is the difference between throw and throws?

### throw

Actually throws an exception object.

```java
throw new IllegalArgumentException("Invalid");
```

### throws

Declares that a method may propagate exceptions.

```java
void read()
        throws IOException {
}
```

Mental model:

```text
throw
→ action

throws
→ declaration
```

---

# 23. Custom Exceptions

## Q84. Why create custom exceptions?

Custom exceptions express domain-specific failure conditions.

Example:

```java
class InsufficientBalanceException
        extends RuntimeException {

    InsufficientBalanceException(
            String message) {
        super(message);
    }
}
```

Then:

```java
throw new InsufficientBalanceException(
    "Insufficient balance"
);
```

This is clearer than throwing a generic Exception.

---

## Q85. Should custom exceptions extend Exception or RuntimeException?

Depends on API design.

Use a checked exception when callers are expected to explicitly handle/declare the condition.

Use RuntimeException when the condition represents a programming error, invalid state, or when unchecked domain exceptions fit the application's error-handling architecture.

In modern Spring applications, domain/service exceptions are frequently unchecked.

---

# 24. Try-with-resources

## Q86. What is try-with-resources?

It automatically closes resources implementing `AutoCloseable`.

```java
try (BufferedReader reader =
        new BufferedReader(
            new FileReader("data.txt"))) {

    return reader.readLine();
}
```

The resource is closed automatically.

This is safer than manually calling:

```java
reader.close();
```

inside finally.

---

## Q87. What happens if both the main operation and close() throw?

Java uses **suppressed exceptions**.

Conceptually:

```text
Primary exception
       +
close() exception
       ↓
suppressed exception
```

You can inspect suppressed exceptions with:

```java
e.getSuppressed();
```

This is an excellent advanced exception-handling interview question.

---

# 25. Exception Handling Best Practices

## Q88. Why is catching Exception blindly a bad practice?

This:

```java
try {
    process();
} catch (Exception e) {
}
```

can:

- Hide bugs
- Lose context
- Make debugging difficult
- Swallow failures
- Break error propagation

Prefer catching the exception you can actually handle.

---

## Q89. Why should you avoid empty catch blocks?

Example:

```java
catch (Exception e) {
}
```

The failure disappears.

The system may continue with invalid state while developers have no logs or diagnostics.

If an exception is intentionally ignored, that decision should be explicit and justified.

---

## Q90. Should you log and rethrow every exception?

Not necessarily.

Blindly doing:

```text
service logs
controller logs
global handler logs
```

can create duplicate logs.

A good architecture decides where an error becomes observable and where context should be added.

---

# 26. Inner and Nested Classes

## Q91. What is a nested class?

A class declared inside another class is a nested class.

Types include:

```text
Static nested class
Inner member class
Local class
Anonymous class
```

---

## Q92. What is a static nested class?

Example:

```java
class Outer {

    static class Nested {
    }
}
```

It is associated with the outer class, not with an outer instance.

You can create it:

```java
Outer.Nested obj =
    new Outer.Nested();
```

---

## Q93. What is an inner class?

A non-static nested member class is an inner class.

```java
class Outer {

    class Inner {
    }
}
```

It is associated with an instance of the outer class.

Creation:

```java
Outer outer = new Outer();

Outer.Inner inner =
    outer.new Inner();
```

---

## Q94. Static nested class vs inner class?

### Static nested

```java
class Outer {
    static class Nested {}
}
```

No implicit outer instance.

### Inner

```java
class Outer {
    class Inner {}
}
```

Associated with an outer instance and can directly access its instance members.

---

## Q95. Can an inner class access private members of the outer class?

Yes.

```java
class Outer {

    private int value = 10;

    class Inner {

        void print() {
            System.out.println(value);
        }
    }
}
```

Nested classes have access to the enclosing class's members according to Java's access rules.

---

## Q96. Can an outer class directly access private members of an inner class?

Yes, Java's nested-type access rules permit the enclosing and nested classes to access each other's private members.

---

## Q97. Why would you use a nested class?

Common reasons:

- Encapsulate helper logic
- Keep implementation details close to the owning class
- Builder pattern
- Iterator implementations
- State machine/helper types
- Group tightly coupled types

---

# 27. Anonymous Classes

## Q98. What is an anonymous class?

An anonymous class is a one-off class declaration and instantiation.

Example:

```java
Runnable task = new Runnable() {

    @Override
    public void run() {
        System.out.println("Running");
    }
};
```

Modern Java often replaces this with a lambda when the target type is a functional interface:

```java
Runnable task =
    () -> System.out.println("Running");
```

---

## Q99. When is an anonymous class still useful?

When you need:

- Multiple methods
- State/fields
- A custom class body
- To extend a class
- More behavior than a lambda naturally expresses

Lambdas are expressions implementing functional interfaces; anonymous classes are actual class bodies.

---

# 28. Local Classes

## Q100. What is a local class?

A class declared inside a method/block.

```java
void process() {

    class Helper {
        void run() {
        }
    }

    Helper helper = new Helper();
}
```

Its scope is limited to the enclosing block.

---

# 29. Records

## Q101. What is a record?

Records are a concise way to model data-oriented classes.

Example:

```java
public record User(
    String id,
    String name
) {}
```

The compiler provides important members such as:

```text
accessors
canonical constructor
equals()
hashCode()
toString()
```

Records are especially useful for immutable data carriers.

---

## Q102. Are records completely immutable?

A record's components are final references, and the record itself cannot be extended as a normal class.

But deep immutability is not guaranteed.

Example:

```java
record User(List<String> roles) {}
```

The reference to the List cannot be reassigned through the record component, but the List itself may still be mutable.

So:

```text
record
→ shallow structural immutability
```

not automatically:

```text
deep immutable object graph
```

---

# 30. Sealed Classes

## Q103. What are sealed classes?

Sealed classes allow a superclass to explicitly control which classes may extend it.

Example:

```java
public sealed interface Payment
    permits CardPayment, CashPayment {
}
```

This is useful when the domain has a closed set of known variants.

Conceptually:

```text
Payment
 ├── CardPayment
 └── CashPayment
```

This can make domain modeling and exhaustive handling clearer.

---

# 31. Enum

## Q104. What is an enum?

An enum represents a fixed set of constants.

```java
enum Status {
    PENDING,
    PAID,
    CANCELLED
}
```

Enums are classes with special language support.

They can have:

- Fields
- Methods
- Constructors
- Implemented interfaces

---

## Q105. Can enum constructors be public?

No.

Enum instances are controlled by the JVM/language.

Enum constructors are effectively private.

---

## Q106. Can an enum implement an interface?

Yes.

```java
enum PaymentType
        implements Payable {

    CARD,
    CASH;

    @Override
    public void pay() {
    }
}
```

---

# 32. Generics

## Q107. What problem do generics solve?

Generics provide compile-time type safety and reduce casts.

Without:

```java
List list;
```

With:

```java
List<String> list;
```

The compiler knows what type the list should contain.

---

## Q108. What is type erasure?

Java generics are primarily implemented through type erasure.

Generic type information is largely removed/translated at runtime.

Therefore:

```java
List<String>
```

and:

```java
List<Integer>
```

do not represent two fundamentally separate runtime classes.

This contributes to backward compatibility with pre-generics Java bytecode.

---

## Q109. Can you create new T() in generic code?

Generally no:

```java
class Factory<T> {

    T create() {
        // new T(); // invalid
    }
}
```

The runtime does not have direct access to the concrete generic type parameter in this form.

Common alternatives:

```text
Class<T>
Supplier<T>
factory method
```

---

## Q110. Why can't you create arrays of a generic type directly?

This is not allowed:

```java
T[] values = new T[10];
```

Generic type information is erased, while arrays retain runtime component-type information.

This creates a type-system conflict.

A common workaround involves creating an Object array and carefully casting, or accepting an array type from the caller.

---

# 33. Functional Interfaces

## Q111. What is a functional interface?

An interface with exactly one abstract method.

Example:

```java
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}
```

It can be implemented using a lambda:

```java
Calculator add =
    (a, b) -> a + b;
```

---

## Q112. Can a functional interface have default methods?

Yes.

The requirement is exactly one **abstract** method.

It may also have:

- Default methods
- Static methods
- Private methods

---

# 34. Lambda Expressions

## Q113. What is a lambda expression?

A lambda is a concise way of providing behavior for a functional interface.

```java
Runnable r =
    () -> System.out.println("Hello");
```

Another:

```java
Comparator<String> comparator =
    (a, b) -> a.length() - b.length();
```

Prefer safer comparison APIs when overflow could matter:

```java
Comparator.comparingInt(String::length)
```

---

## Q114. Can a lambda access local variables?

Yes, but captured local variables must be final or effectively final.

```java
int x = 10;

Runnable r =
    () -> System.out.println(x);
```

This is valid because `x` is not reassigned.

This is invalid:

```java
int x = 10;

Runnable r =
    () -> System.out.println(x);

x = 20;
```

---

# 35. Streams

## Q115. What is a Stream?

A Stream represents a pipeline for processing data.

Example:

```java
List<String> result =
    names.stream()
         .filter(name -> name.length() > 5)
         .map(String::toUpperCase)
         .toList();
```

A Stream is not a collection.

It describes computation over data.

---

## Q116. Intermediate vs terminal operations?

Intermediate operations return another Stream:

```text
filter
map
sorted
distinct
```

Terminal operations produce a result or side effect:

```text
collect
toList
reduce
count
forEach
findFirst
```

Pipeline:

```text
source
  ↓
filter
  ↓
map
  ↓
distinct
  ↓
collect
```

---

## Q117. Are streams lazy?

Intermediate stream operations are generally lazy.

For example:

```java
names.stream()
     .filter(...)
     .map(...);
```

doesn't necessarily execute the pipeline immediately.

Execution begins when a terminal operation is invoked.

---

## Q118. What is stream short-circuiting?

Some operations can stop processing once the answer is known.

Examples:

```java
findFirst()
anyMatch()
noneMatch()
allMatch()
limit()
```

This can avoid processing the entire source.

---

## Q119. Stream vs Collection?

Collection:

> Stores/manages data.

Stream:

> Describes a computation over data.

A Collection can be traversed multiple times.

A Stream is generally consumable once.

---

# 36. Optional

## Q120. What is Optional?

`Optional<T>` represents a value that may or may not be present.

Example:

```java
Optional<User> user =
    findUser(id);
```

Instead of returning null directly, the API communicates absence explicitly.

---

## Q121. Should Optional be used everywhere?

No.

Commonly useful:

- Return values where absence is meaningful

Often inappropriate:

- Entity fields
- DTO fields by default
- Method parameters in most APIs
- Serialization models unless deliberately designed for it

Don't use Optional merely to make code look modern.

---

# 37. Java Pass-by-Value

## Q122. Is Java pass-by-reference or pass-by-value?

Java is **always pass-by-value**.

For objects, the value being passed is the reference.

Example:

```java
void change(User user) {
    user.setName("Bob");
}
```

The method receives a copy of the reference pointing to the same object.

Therefore the object's state can change.

But:

```java
void change(User user) {
    user = new User();
}
```

does not replace the caller's reference.

The caller still points to the original object.

---

## Q123. Explain pass-by-value with a simple model.

Caller:

```text
user ─────→ Object A
```

Method receives a copy:

```text
caller user ───→ Object A
method user ────→ Object A
```

If method mutates Object A:

```text
Object A changes
```

Both references observe the changed object.

If method reassigns its local reference:

```text
method user ───→ Object B
```

the caller still has:

```text
caller user ───→ Object A
```

This is why Java is pass-by-value.

---

# 38. Object Class

## Q124. What is the Object class?

`java.lang.Object` is the root superclass of Java classes.

Important methods include:

```text
equals()
hashCode()
toString()
getClass()
wait()
notify()
notifyAll()
clone()
```

Every ordinary Java class ultimately derives from Object unless it is an interface.

---

## Q125. Why override toString()?

Default `Object.toString()` is usually not useful for business debugging.

Example:

```java
@Override
public String toString() {
    return "User{id='" + id + "'}";
}
```

Useful for:

- Logging
- Debugging
- Diagnostics

Be careful not to expose secrets such as passwords or tokens.

---

# 39. final vs finally vs finalize

## Q126. final vs finally vs finalize?

### final

Language keyword.

```text
final variable
final method
final class
```

### finally

Exception-handling block.

```java
try {
} finally {
}
```

### finalize()

A legacy Object method associated with finalization.

It has been deprecated for removal and should not be used for resource management.

Use:

```text
try-with-resources
AutoCloseable
explicit lifecycle management
```

instead.

---

# 40. Garbage Collection

## Q127. What is garbage collection?

Garbage collection automatically reclaims memory associated with objects that are no longer reachable by the application.

Conceptually:

```text
Objects
 ↓
Reachable?
 ├── Yes → keep
 └── No  → eligible for reclamation
```

GC is not simply:

> "Delete objects immediately when they become unused."

Collection happens according to JVM garbage-collector algorithms and runtime conditions.

---

## Q128. Can you force garbage collection?

You can request it:

```java
System.gc();
```

but this is only a request.

The JVM is not required to perform a collection immediately.

---

## Q129. What causes OutOfMemoryError?

Possible causes include:

- Genuine memory exhaustion
- Memory leaks through unintended object retention
- Excessive allocation
- Large caches
- Huge collections
- Native memory pressure depending on error type
- Inappropriate JVM configuration

Java's GC does not prevent logical memory leaks.

If an object remains reachable through a static collection, cache, listener, or other reference chain, GC may correctly keep it alive even if the application no longer logically needs it.

---

# 41. JVM Memory Concepts

## Q130. What are Stack and Heap?

A simplified mental model:

### Stack

Each thread has execution stack frames containing things such as:

- Local variables
- Method call state
- Operand stack information

### Heap

The heap is where Java objects and arrays are generally allocated.

Important:

> This is a conceptual model. JVM optimizations such as escape analysis can change physical implementation details.

---

## Q131. What causes StackOverflowError?

Usually excessive call-stack depth, commonly from infinite or very deep recursion.

Example:

```java
void recurse() {
    recurse();
}
```

Eventually:

```text
StackOverflowError
```

---

# 42. Class Loading

## Q132. What is a ClassLoader?

A ClassLoader loads class definitions into the JVM.

Common loader categories include:

```text
Bootstrap ClassLoader
Platform ClassLoader
Application/System ClassLoader
```

Modern Java uses the platform class loader terminology; older material may call it the extension class loader.

---

## Q133. Why is class loading important?

It enables classes to be loaded dynamically as needed.

This is important for:

- Frameworks
- Application servers
- Plugins
- Dependency systems
- Reflection

---

# 43. Reflection

## Q134. What is reflection?

Reflection allows code to inspect and interact with classes, methods, fields, constructors, and annotations at runtime.

Example:

```java
Class<?> clazz =
    User.class;

Method[] methods =
    clazz.getDeclaredMethods();
```

Frameworks such as Spring heavily use reflection and related mechanisms.

---

## Q135. What are disadvantages of reflection?

Potential concerns include:

- Reduced compile-time safety
- More complex code
- Performance overhead in some scenarios
- Accessibility/security considerations
- Harder debugging
- Less obvious dependencies

Frameworks use it because its flexibility can be valuable.

---

# 44. Annotations

## Q136. What is an annotation?

An annotation provides metadata associated with program elements.

Example:

```java
@Override
```

Framework example:

```java
@Service
```

Annotations can be processed:

- At compile time
- By annotation processors
- At runtime through reflection

---

## Q137. What is @Override useful for?

It tells the compiler that you intend to override an inherited method.

If the method doesn't actually override one, the compiler can report an error.

This prevents subtle bugs caused by accidental overloading.

---

# 45. Modern Java

## Q138. What Java versions are especially important for interviews?

For modern backend interviews, understand the major evolution across:

```text
Java 8
Java 11
Java 17
Java 21
Java 25
```

Java 8 remains extremely important because of:

```text
lambdas
streams
functional interfaces
Optional
default methods
```

Java 17 and 21 are particularly important modern LTS releases.

Java 25 is also an LTS release and introduces additional modern language/runtime capabilities.

Always verify the actual target company's Java version before relying on version-specific APIs.

---

## Q139. What important features came with Java 8?

Key features:

```text
Lambda expressions
Functional interfaces
Stream API
Optional
Default methods
Method references
java.time API
```

---

## Q140. What important features came with Java 9?

Important examples:

```text
Module System
Private interface methods
Collection factory methods began evolving
```

The module system introduced:

```java
module-info.java
```

for stronger modular boundaries.

---

## Q141. What important features came with Java 10/11?

Java 10:

```java
var
```

for local variable type inference.

Java 11 brought additional APIs and became an LTS release.

Example:

```java
var name = "Alice";
```

Important:

`var` is not dynamic typing.

The compiler still determines a static type.

---

# 46. var

## Q142. Is var dynamically typed?

No.

```java
var name = "Alice";
```

The compiler infers:

```text
String
```

You cannot later do:

```java
name = 10;
```

The variable remains statically typed.

---

## Q143. Where can var be used?

`var` is primarily for local variable type inference.

It can be used for:

```java
var name = "Alice";
var users = new ArrayList<String>();
```

It cannot replace:

```text
class fields
method parameters
method return types
```

in the same way.

---

# 47. Java 14+ Switch Expressions

## Q144. What are switch expressions?

Modern Java allows switch to produce a value.

```java
String result = switch (status) {
    case PENDING -> "Waiting";
    case PAID -> "Complete";
    case CANCELLED -> "Cancelled";
};
```

This is often cleaner than mutating a variable inside an old-style switch.

---

# 48. Pattern Matching

Modern Java introduced pattern matching improvements.

Example:

```java
if (obj instanceof String s) {
    System.out.println(s.length());
}
```

The variable `s` is introduced when the pattern matches.

This reduces explicit casts:

Old:

```java
if (obj instanceof String) {
    String s = (String) obj;
}
```

Modern:

```java
if (obj instanceof String s) {
}
```

---

# 49. Text Blocks

Java supports multiline text blocks:

```java
String json = """
    {
      "name": "Alice"
    }
    """;
```

Useful for:

- JSON
- SQL
- HTML
- Templates

---

# 50. Records

Records are especially useful for:

```text
DTOs
value-like data carriers
API responses
small immutable data models
```

Example:

```java
public record UserDto(
    Long id,
    String name
) {}
```

They reduce boilerplate but should not automatically replace every domain entity.

---

# 51. Sealed Types + Pattern Matching

Modern Java allows domain modeling such as:

```java
sealed interface Payment
    permits CardPayment, CashPayment {
}
```

Combined with modern switch/pattern matching, this can make finite domain hierarchies easier to reason about.

---

# 52. Virtual Threads

Virtual threads are a major modern Java concurrency feature.

They are lightweight threads intended to make high-concurrency blocking-I/O workloads easier to scale.

Example:

```java
Thread.startVirtualThread(() -> {
    processRequest();
});
```

or through executor APIs designed for virtual threads.

They are particularly relevant to modern Spring Boot applications.

Important:

```text
Virtual threads
≠
faster CPU
```

They primarily improve scalability for suitable concurrency patterns.

---

# 53. Common Java Traps

## Q145. Why does this compile?

```java
Object x = "hello";
```

Because String is an Object.

```text
String
  ↑
Object
```

A superclass reference can refer to a subclass object.

---

## Q146. Why does this fail?

```java
Object x = "hello";

x.length();
```

The reference type is Object.

The compiler only exposes methods available through the reference type.

You need:

```java
((String) x).length();
```

provided the runtime object really is a String.

This demonstrates the difference between:

```text
reference type
vs
runtime object type
```

---

## Q147. What is upcasting?

```java
Dog dog = new Dog();

Animal animal = dog;
```

A subclass reference is assigned to a superclass reference.

This is usually implicit.

---

## Q148. What is downcasting?

```java
Animal animal = new Dog();

Dog dog = (Dog) animal;
```

The cast is explicit.

If the runtime object isn't a Dog:

```java
Animal animal = new Cat();

Dog dog = (Dog) animal;
```

you get:

```text
ClassCastException
```

---

# 54. instanceof

## Q149. What does instanceof do?

It checks whether an object is compatible with a type.

```java
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;
}
```

Modern Java can combine checking and binding:

```java
if (animal instanceof Dog dog) {
    dog.bark();
}
```

---

# 55. Object Equality vs Identity

## Q150. What is identity?

Identity asks:

> Are these references pointing to the exact same object?

Use:

```java
a == b
```

for reference identity.

Equality asks:

> Do these objects represent equivalent values according to equals()?

Use:

```java
a.equals(b)
```

when the class defines meaningful value equality.

---

# 56. Immutability

## Q151. What makes a class immutable?

Typical characteristics:

```text
State initialized once
Fields private
Fields final where appropriate
No setters that mutate state
Defensive copies for mutable inputs/outputs
No exposing internal mutable objects
Class behavior cannot allow state mutation
```

Example:

```java
public final class Money {

    private final BigDecimal amount;

    public Money(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getAmount() {
        return amount;
    }
}
```

For mutable component types such as Date, List, Map, arrays, defensive copying may be necessary.

---

# 57. Composition vs Inheritance

## Q152. What is composition?

Composition means building a class using other objects.

```java
class Car {

    private final Engine engine;

    Car(Engine engine) {
        this.engine = engine;
    }
}
```

Car:

```text
has an Engine
```

Inheritance:

```text
Dog is an Animal
```

Composition often provides lower coupling and more flexibility than inheritance.

---

## Q153. Why is "composition over inheritance" often recommended?

Inheritance creates a strong relationship between parent and child.

Changes to the superclass can affect subclasses.

Composition lets you replace behavior by changing collaborating objects.

Example:

```text
PaymentService
    ↓
PaymentProcessor interface
    ↓
StripeProcessor
PayPalProcessor
BankProcessor
```

The service composes behavior rather than inheriting it.

---

# 58. SOLID in Java Interviews

## Q154. What is SOLID?

```text
S → Single Responsibility
O → Open/Closed
L → Liskov Substitution
I → Interface Segregation
D → Dependency Inversion
```

---

## Q155. Single Responsibility Principle?

A class should have one coherent reason to change.

Bad:

```text
UserService
 ├── validation
 ├── database
 ├── email
 ├── PDF generation
 └── reporting
```

Better separation can reduce coupling.

---

## Q156. Open/Closed Principle?

Software entities should generally be open for extension but closed for modification.

Interfaces and polymorphism are common mechanisms.

Instead of:

```java
if (type == CARD) ...
else if (type == PAYPAL) ...
else if (type == BANK) ...
```

you can use strategy implementations:

```text
PaymentProcessor
 ├── CardProcessor
 ├── PayPalProcessor
 └── BankProcessor
```

---

## Q157. Liskov Substitution Principle?

Subtypes should be usable wherever their base type is expected without breaking correctness.

Classic bad example:

```text
Rectangle
   ↑
Square
```

If Rectangle allows width and height to change independently but Square enforces equality, inherited assumptions can break.

---

# 59. Dependency Inversion

## Q158. What is dependency inversion?

High-level modules should depend on abstractions rather than concrete low-level implementations.

Instead of:

```java
class OrderService {
    private StripePayment payment =
        new StripePayment();
}
```

prefer:

```java
class OrderService {

    private final PaymentProcessor processor;

    OrderService(PaymentProcessor processor) {
        this.processor = processor;
    }
}
```

This is particularly important in Spring because dependency injection naturally supports this style.

---

# 60. Common Design Patterns

For a Java/Spring full-stack interview, understand at least:

```text
Singleton
Factory
Builder
Strategy
Observer
Decorator
Adapter
Proxy
Template Method
Command
Repository
Dependency Injection
```

You don't need to implement every GoF pattern from memory.

You should understand:

```text
Problem
→ Pattern
→ Why it helps
→ Trade-offs
→ Real-world Java/Spring example
```

---

# 61. Singleton

## Q159. What is Singleton?

A Singleton restricts creation to one instance within the intended scope.

Classic lazy implementation:

```java
public final class Singleton {

    private Singleton() {}

    private static class Holder {
        private static final Singleton INSTANCE =
            new Singleton();
    }

    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

In Spring, however, singleton is normally managed by the container:

```java
@Service
class UserService {
}
```

Spring's singleton scope is a container-level concept and should not be confused with manually enforcing a JVM-wide Singleton class.

---

# 62. Builder Pattern

Builder is useful when objects have many optional parameters or complex construction.

```java
User user =
    User.builder()
        .name("Alice")
        .age(30)
        .role("ADMIN")
        .build();
```

Benefits:

- Readability
- Avoid telescoping constructors
- Easier validation
- Can support immutable objects

---

# 63. Strategy Pattern

Strategy encapsulates interchangeable behavior.

```java
interface PaymentStrategy {
    void pay();
}
```

Implementations:

```text
CardPayment
PayPalPayment
BankPayment
```

Then:

```java
class PaymentService {

    private final PaymentStrategy strategy;

    PaymentService(PaymentStrategy strategy) {
        this.strategy = strategy;
    }
}
```

This pattern maps naturally to Spring dependency injection.

---

# 64. Factory Pattern

Factory centralizes object creation.

```java
PaymentProcessor processor =
    PaymentProcessorFactory
        .create(type);
```

Useful when object creation depends on:

```text
type
configuration
environment
business rules
```

---

# 65. Proxy Pattern

A proxy controls access to another object.

Spring uses proxy-based mechanisms extensively for features such as:

```text
@Transactional
Spring AOP
security interception
caching
```

This is why understanding Java proxies becomes useful when learning Spring.

---

# 66. Reflection + Proxies + Spring

A strong Java/Spring interviewer may connect these topics:

```text
Java reflection
       ↓
Spring container
       ↓
Bean creation
       ↓
Dependency injection
       ↓
Proxy
       ↓
@Transactional / Security / AOP
```

You don't need JVM-internals expertise for every interview, but you should understand this high-level chain.

---

# 67. BigDecimal and Financial Calculations

## Q160. Why prefer BigDecimal for financial calculations?

Floating-point types such as:

```java
double
```

cannot represent many decimal fractions exactly.

For monetary calculations, `BigDecimal` provides decimal arithmetic semantics appropriate for many financial use cases.

Example:

```java
BigDecimal price =
    new BigDecimal("10.25");
```

Prefer constructing from String for exact decimal intent rather than:

```java
new BigDecimal(10.25)
```

which starts from the binary floating-point approximation of the literal.

---

# 68. Date and Time

## Q161. Why should modern Java applications prefer java.time?

The modern date/time API provides clearer immutable types.

Important classes:

```text
LocalDate
LocalTime
LocalDateTime
Instant
ZonedDateTime
OffsetDateTime
Duration
Period
```

Avoid relying on legacy:

```text
Date
Calendar
```

for new application design unless interoperability requires them.

---

## Q162. LocalDate vs Instant?

### LocalDate

Represents a date without time or timezone.

```text
2026-08-17
```

Useful for:

- Birthday
- Due date
- Holiday

### Instant

Represents a point on the UTC timeline.

Useful for:

- Event timestamps
- Database/audit timestamps
- Distributed systems

---

# 69. Serialization

## Q163. What is Java serialization?

Traditional Java serialization uses `Serializable` to convert object state into a byte stream.

```java
class User
        implements Serializable {
}
```

It was historically useful for persistence/transport but has significant security and compatibility concerns.

For modern backend APIs, formats such as:

```text
JSON
Protobuf
Avro
```

are often preferable depending on architecture.

---

# 70. transient

## Q164. What is transient?

`transient` marks a field to be excluded from default Java serialization.

```java
private transient String password;
```

Important:

`transient` is about Java serialization semantics; it is not a universal annotation for:

```text
JSON serialization
JPA persistence
Spring
```

Those frameworks have their own mechanisms.

---

# 71. Common Modifier Combinations

## Q165. Can a class be both abstract and final?

No.

```java
abstract final class Test {}
```

is contradictory.

`abstract` means:

```text
must be subclassed
```

while `final` means:

```text
cannot be subclassed
```

---

## Q166. Can a method be both abstract and final?

No.

An abstract method requires overriding.

A final method prohibits overriding.

---

## Q167. Can a method be private and abstract?

No.

A private method cannot be overridden by subclasses, while abstract methods require subclass implementation.

---

## Q168. Can a method be private and final?

Yes.

But `final` is effectively redundant for a private method because it cannot be overridden anyway.

---

## Q169. Can a constructor be final?

No.

Constructors are not inherited or overridden.

---

## Q170. Can an interface be final?

No.

Interfaces are designed to be implemented, although sealed interfaces can restrict permitted implementations.

---

## Q171. Can an interface extend another interface?

Yes.

```java
interface A {}

interface B extends A {}
```

An interface can extend multiple interfaces:

```java
interface C extends A, B {}
```

---

## Q172. Can a class extend multiple classes?

No.

```java
class C extends A, B {}
```

is invalid.

A class can:

```text
extend one class
+
implement multiple interfaces
```

---

# 72. Constructor Traps

## Q173. What happens if you don't call super() explicitly?

The compiler inserts an implicit no-argument superclass constructor call if applicable.

If the superclass does not have an accessible no-argument constructor, the subclass constructor must explicitly invoke an appropriate superclass constructor.

---

## Q174. Can you call an instance method from a constructor?

Yes.

But be careful.

Calling overridable methods from constructors can invoke subclass behavior before the subclass has finished initialization.

This can expose partially initialized state.

Therefore:

> Avoid calling overridable methods from constructors unless you fully understand the consequences.

---

# 73. Exception Traps

## Q175. Can finally change a thrown exception?

Yes, if it throws another exception or returns.

Example:

```java
try {
    throw new RuntimeException("A");
}
finally {
    throw new RuntimeException("B");
}
```

The exception from finally can replace the original exception.

This is another reason not to throw/return carelessly from finally.

---

## Q176. Can you catch Throwable?

Technically yes:

```java
catch (Throwable t) {
}
```

But usually you should not.

It includes:

```text
Exception
Error
```

Catching serious Errors can interfere with JVM/system failure behavior.

---

# 74. Varargs

## Q177. What is varargs?

Varargs allows a method to accept zero or more arguments.

```java
void print(String... values) {
}
```

Calling:

```java
print();
print("A");
print("A", "B");
```

Internally, varargs is handled using an array.

---

## Q178. Can a method have both normal parameters and varargs?

Yes.

```java
void process(String name,
             int age,
             String... roles) {
}
```

The varargs parameter must be last.

---

## Q179. Can there be multiple varargs parameters?

No.

Only one variable-arity parameter is allowed, and it must be the final parameter.

---

# 75. Overload Resolution Traps

## Q180. Why is this ambiguous?

```java
void test(String s) {}
void test(Integer i) {}
```

Then:

```java
test(null);
```

is ambiguous because null can be assigned to both String and Integer and neither type is more specific than the other.

This is a common interview trick.

---

## Q181. Which overload is selected?

```java
void test(Object o) {}
void test(String s) {}
```

Then:

```java
test("hello");
```

selects:

```text
test(String)
```

because String is more specific than Object.

Overload resolution happens at compile time.

---

## Q182. What happens with primitive vs wrapper overloads?

Consider:

```java
void test(int x) {}
void test(Integer x) {}
```

Calling:

```java
test(10);
```

prefers:

```text
test(int)
```

because an exact primitive match is preferred over boxing.

---

# 76. Static Method Hiding Trap

Consider:

```java
class Parent {

    static void print() {
        System.out.println("Parent");
    }
}

class Child extends Parent {

    static void print() {
        System.out.println("Child");
    }
}
```

Now:

```java
Parent p = new Child();

p.print();
```

prints:

```text
Parent
```

because static method selection is not runtime polymorphism.

This differs from instance method overriding.

---

# 77. Field Hiding Trap

Fields are not polymorphic in the same way methods are.

```java
class Parent {
    String name = "Parent";
}

class Child extends Parent {
    String name = "Child";
}

Parent p = new Child();

System.out.println(p.name);
```

prints:

```text
Parent
```

because field access is based on the reference type.

Methods can use runtime dispatch; fields do not work the same way.

---

# 78. Inner Class and Outer Class Traps

## Q183. Can a static nested class access an outer instance field directly?

No.

```java
class Outer {

    int value = 10;

    static class Nested {

        void test() {
            // System.out.println(value); // invalid
        }
    }
}
```

A static nested class has no implicit outer instance.

It can access the outer instance if one is explicitly supplied:

```java
Outer outer = new Outer();
System.out.println(outer.value);
```

---

## Q184. Can an inner class access static members of the outer class?

Yes.

```java
class Outer {

    static int count;

    class Inner {

        void test() {
            System.out.println(count);
        }
    }
}
```

---

# 79. Immutability and Defensive Copying

## Q185. Why shouldn't you expose a mutable internal List?

Bad:

```java
class User {

    private final List<String> roles;

    public List<String> getRoles() {
        return roles;
    }
}
```

Caller can mutate internal state:

```java
user.getRoles().clear();
```

Better options:

```java
return List.copyOf(roles);
```

or a carefully designed immutable representation.

This is an encapsulation and immutability issue.

---

## Q186. Why is returning an unmodifiable view different from returning a copy?

```java
Collections.unmodifiableList(list)
```

creates a view.

If the original list changes, the view can reflect those changes.

```java
List.copyOf(list)
```

creates an unmodifiable snapshot/copy of the collection structure.

This distinction matters when designing APIs.

---

## Q187. What does defensive copying mean?

If a constructor receives a mutable object:

```java
class User {

    private final List<String> roles;

    User(List<String> roles) {
        this.roles = roles;
    }
}
```

the caller still controls the same List.

Instead:

```java
this.roles = List.copyOf(roles);
```

prevents the caller from mutating the internal collection through the original reference.

---

# 80. Java Coding Interview Patterns

For Core Java interviews, be comfortable implementing:

```text
Reverse String
Palindrome
Character frequency
Word frequency
First non-repeating character
Anagram check
Remove duplicates
Sorting with Comparator
Custom object equality
Immutable class
Singleton
Builder
Factory
LRU cache
Producer-consumer
Thread-safe counter
```

The important part is not memorizing solutions.

Be able to explain:

```text
data structure
time complexity
space complexity
edge cases
thread safety
API choices
```

---

# 81. High-Value Interview Follow-Up Chains

## Chain 1 — OOP

```text
What is OOP?
      ↓
Encapsulation?
      ↓
Inheritance?
      ↓
Polymorphism?
      ↓
Abstraction?
      ↓
Overloading vs overriding?
      ↓
Runtime dispatch?
      ↓
Abstract class vs interface?
      ↓
Composition vs inheritance?
```

---

## Chain 2 — Access Modifiers

```text
What is private?
      ↓
Can subclass access it?
      ↓
What is package-private?
      ↓
What is protected?
      ↓
Protected across packages?
      ↓
Can top-level class be protected?
      ↓
Can nested class be private?
```

---

## Chain 3 — String

```text
Why immutable?
      ↓
String pool?
      ↓
== vs equals?
      ↓
new String()?
      ↓
StringBuilder?
      ↓
StringBuffer?
      ↓
HashMap key?
```

---

## Chain 4 — Exceptions

```text
Exception hierarchy?
      ↓
Error vs Exception?
      ↓
Checked vs unchecked?
      ↓
throw vs throws?
      ↓
finally?
      ↓
try-with-resources?
      ↓
suppressed exception?
      ↓
custom exception?
```

---

## Chain 5 — Generics

```text
Why generics?
      ↓
Wildcards?
      ↓
? extends?
      ↓
? super?
      ↓
PECS?
      ↓
Type erasure?
      ↓
Why can't new T()?
      ↓
Generic arrays?
```

---

## Chain 6 — Modern Java

```text
Java 8
 ↓
Lambda
 ↓
Functional Interface
 ↓
Stream
 ↓
Optional
 ↓
Java 10 var
 ↓
Switch expressions
 ↓
Pattern matching
 ↓
Records
 ↓
Sealed classes
 ↓
Virtual threads
```

---

# 82. Must-Know Questions for a Java Interview

If you have limited preparation time, prioritize these:

```text
1. Explain OOP pillars with real examples.
2. Overloading vs overriding.
3. How does runtime polymorphism work?
4. Abstract class vs interface.
5. Interface default methods.
6. Why doesn't Java support multiple class inheritance?
7. Access modifiers and exactly where each can/cannot be used.
8. static vs instance.
9. final variable/reference/object.
10. this vs super.
11. Constructor chaining and initialization order.
12. String immutability.
13. String pool.
14. == vs equals().
15. equals/hashCode contract.
16. Java pass-by-value.
17. Checked vs unchecked exceptions.
18. throw vs throws.
19. try-with-resources.
20. suppressed exceptions.
21. final vs finally vs finalize.
22. Inner vs static nested class.
23. Anonymous vs lambda.
24. Generic types and wildcards.
25. PECS.
26. Type erasure.
27. Functional interfaces.
28. Stream lazy evaluation.
29. Optional.
30. Record vs normal class.
31. Sealed classes.
32. JVM memory basics.
33. Garbage collection.
34. ClassLoader.
35. Reflection.
36. BigDecimal and floating-point issues.
37. java.time.
38. Composition vs inheritance.
39. SOLID.
40. Common design patterns.
41. Thread safety of shared mutable state.
42. Modern Java features relevant to your target Java version.
```

---

# 83. Final Mental Model

Don't learn Java as:

```text
100 keywords
500 methods
50 classes
```

Learn it as a system:

```text
                         JAVA
                           │
          ┌────────────────┼────────────────┐
          │                │                │
        OOP             Language           JVM
          │                │                │
   ┌──────┼──────┐    ┌────┼────┐       ┌───┼────┐
   │      │      │    │    │    │       │   │    │
Encap  Poly   Abstr  final static this   Heap Stack GC
   │      │      │
   │   inherit  interface
   │
access modifiers
   │
constructors
   │
immutability
   │
equals/hashCode
   │
collections
   │
exceptions
   │
generics
   │
lambdas/streams
   │
modern Java
   │
concurrency
   │
Spring
```

The strongest interview answers connect concepts.

For example:

```text
Spring singleton
      ↓
shared object
      ↓
multiple request threads
      ↓
mutable state
      ↓
Java thread safety
      ↓
ConcurrentHashMap / synchronization
```

Or:

```text
HashMap
      ↓
hashCode()
      ↓
equals()
      ↓
immutability
      ↓
Object contract
```

Or:

```text
Spring @Transactional
      ↓
proxy
      ↓
method interception
      ↓
reflection / runtime infrastructure
      ↓
Java OOP + interfaces
```

That is how you should think about Java for a **Java + Spring Boot full-stack interview**.

---

# 84. Final Rule for Java Interviews

When the interviewer asks:

> "What is X?"

Don't stop at the definition.

Use this mental framework:

```text
1. What is it?
        ↓
2. Why does it exist?
        ↓
3. How does it work?
        ↓
4. Where can I use it?
        ↓
5. Where can I NOT use it?
        ↓
6. Why can't I use it there?
        ↓
7. What are the alternatives?
        ↓
8. What are the trade-offs?
        ↓
9. What is a common mistake?
        ↓
10. What happens in production?
```

For example, for `protected`, don't just memorize:

> "Protected means subclasses can access it."

Understand:

```text
same class?
same package?
subclass in another package?
arbitrary parent reference?
static?
instance?
nested class?
```

For `final`, don't just memorize:

> "Final means cannot change."

Ask:

```text
final variable?
final reference?
final object?
final method?
final class?
```

For `HashMap`, don't just memorize:

> "O(1)."

Ask:

```text
Why?
hashCode?
bucket?
collision?
equals?
resize?
load factor?
mutable key?
thread safety?
ConcurrentHashMap?
```

That style of thinking is what turns **Java knowledge into interview-level Java knowledge**.


---


# MASTER SECTION — Java Collections


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

> **Cross-reference:** Comparable/Comparator and PECS are intentionally kept
> in this Collections note because they are heavily exercised through the
> Collections APIs. The Core Java note only needs a short cross-reference
> rather than duplicating the full treatment.

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

# 28. Important Collection Traps and Specialized APIs

## Q74. What is `Arrays.asList()`?

`Arrays.asList()` creates a **fixed-size List backed by the supplied array**.

```java
String[] array = {"A", "B", "C"};
List<String> list = Arrays.asList(array);
```

You can replace existing elements:

```java
list.set(0, "X");
```

and the backing array is affected:

```text
array → [X, B, C]
list  → [X, B, C]
```

But you cannot change the List's size:

```java
list.add("D");
list.remove("B");
```

These throw `UnsupportedOperationException`.

### Interview distinction

```text
Arrays.asList()
→ fixed-size
→ backed by original array
→ set() allowed
→ add()/remove() not allowed
```

For a resizable independent List:

```java
List<String> copy =
    new ArrayList<>(Arrays.asList("A", "B", "C"));
```

---

## Q75. What is the primitive-array trap with `Arrays.asList()`?

This is a classic interview trap.

```java
int[] numbers = {1, 2, 3};
List<int[]> list = Arrays.asList(numbers);
```

The entire `int[]` is treated as **one element**:

```text
List
 └── int[] {1, 2, 3}
```

It does not become `[1, 2, 3]` because the primitive array is passed as one
varargs argument.

If you want a `List<Integer>`:

```java
List<Integer> list =
    Arrays.stream(numbers)
          .boxed()
          .toList();
```

If you need it mutable:

```java
List<Integer> mutable =
    new ArrayList<>(
        Arrays.stream(numbers)
              .boxed()
              .toList()
    );
```

### Memory rule

```text
Object[] / String[] / Integer[]
→ List of the array elements

int[] / long[] / double[]
→ primitive array becomes one List element
```

---

## Q76. What is NavigableMap?

`NavigableMap` extends `SortedMap` and provides navigation around keys.

Important methods:

```java
floorKey(key)    // greatest key <= key
ceilingKey(key)  // smallest key >= key
lowerKey(key)    // greatest key < key
higherKey(key)   // smallest key > key
```

Example:

```java
NavigableMap<Integer, String> map = new TreeMap<>();
map.put(10, "A");
map.put(20, "B");
map.put(30, "C");
map.put(40, "D");
```

For `key = 25`:

```text
lowerKey(25)    → 20
floorKey(25)    → 20
ceilingKey(25)  → 30
higherKey(25)   → 30
```

This is a major reason to choose `TreeMap` over `HashMap` when ordered
navigation is required.

---

## Q77. What range-view methods does NavigableMap provide?

Important methods include:

```java
headMap(toKey)
tailMap(fromKey)
subMap(fromKey, toKey)
```

There are also overloads controlling endpoint inclusiveness:

```java
headMap(toKey, inclusive)
tailMap(fromKey, inclusive)
subMap(fromKey, fromInclusive, toKey, toInclusive)
```

Example:

```java
map.subMap(20, true, 40, false);
```

represents:

```text
20 ≤ key < 40
```

### Interview mental model

```text
HashMap
→ fast lookup

TreeMap
→ sorted keys

NavigableMap
→ sorted keys + navigation/range queries
```

---

## Q78. What is NavigableSet?

`NavigableSet` is the Set counterpart of `NavigableMap`.

Important methods:

```java
lower(value)
floor(value)
ceiling(value)
higher(value)
```

Example:

```java
NavigableSet<Integer> set =
    new TreeSet<>(List.of(10, 20, 30, 40));
```

```java
set.floor(25);   // 20
set.ceiling(25); // 30
set.lower(20);   // 10
set.higher(20);  // 30
```

It also provides range views such as `headSet()`, `tailSet()`, and `subSet()`
with overloads controlling endpoint inclusiveness.

---

## Q79. How does ConcurrentHashMap iteration differ from HashMap iteration?

A regular `HashMap` iterator is generally **fail-fast on detected structural
modification**:

```text
iterate HashMap
      ↓
structural modification elsewhere
      ↓
may throw ConcurrentModificationException
```

`ConcurrentHashMap` uses **weakly consistent iterators**.

They:

- do not throw `ConcurrentModificationException` merely because the map is concurrently modified
- may reflect some modifications made during iteration
- are not guaranteed to represent one instantaneous snapshot
- continue safely while concurrent updates occur

Conceptually:

```text
Thread A → iterating
Thread B → modifying
             ↓
ConcurrentHashMap iterator
             ↓
continues safely
             ↓
may or may not observe B's changes
```

### Interview distinction

```text
HashMap iterator
→ fail-fast best-effort detection

ConcurrentHashMap iterator
→ weakly consistent
→ safe under concurrent access
→ no snapshot guarantee
```

Do not describe a `ConcurrentHashMap` iterator as a fully immutable snapshot.

---

## Q80. What are EnumSet and EnumMap?

`EnumSet` and `EnumMap` are specialized collections for enum types.

```java
enum Permission {
    READ, WRITE, DELETE
}
```

Use `EnumSet` when the elements are enum constants:

```java
EnumSet<Permission> permissions =
    EnumSet.of(Permission.READ, Permission.WRITE);
```

Use `EnumMap` when enum constants are the keys:

```java
EnumMap<Permission, String> descriptions =
    new EnumMap<>(Permission.class);
```

They are specialized for enum keys/elements and can be more compact and
efficient than general-purpose hash-based alternatives.

### Mental model

```text
Enum values as a Set
→ EnumSet

Enum values as keys
→ EnumMap
```

---

## Q81. How do you perform set union, intersection, and difference?

Existing `Set` methods make these operations straightforward.

### Union

```java
Set<Integer> union = new HashSet<>(a);
union.addAll(b);
```

### Intersection

```java
Set<Integer> intersection = new HashSet<>(a);
intersection.retainAll(b);
```

### Difference

```java
Set<Integer> difference = new HashSet<>(a);
difference.removeAll(b);
```

For example, if:

```text
a = {1, 2, 3}
b = {3, 4, 5}
```

then:

```text
addAll()    → {1, 2, 3, 4, 5}
retainAll() → {3}
removeAll() → {1, 2}
```

These methods mutate the receiving Set, so copy first when the original must
remain unchanged.

### Memory trick

```text
addAll()
→ union

retainAll()
→ intersection

removeAll()
→ difference
```

---

## Q82. What is WeakHashMap?

`WeakHashMap` is a Map implementation whose keys are held using weak
references.

The important consequence is:

```text
Key has no strong reference elsewhere
        ↓
key becomes eligible for GC
        ↓
entry can disappear from WeakHashMap
```

If the application's strong reference disappears, garbage collection may
make the key eligible for removal and the corresponding entry can disappear.

This can be useful for certain cache/metadata patterns where the map should
not keep keys alive indefinitely.

### Important interview warning

Do not describe `WeakHashMap` as a normal cache with deterministic eviction.
Garbage collection determines when keys become eligible for removal, so this
is fundamentally different from an LRU cache.

### Cross-document connection

See the Core Java note's garbage-collection section for the underlying
strong-reference vs weak-reference model.

---

## Q83. How should equals() and hashCode() be implemented idiomatically?

When equality depends on fields such as `id` and `name`, modern Java code can
use `Objects.equals()` and `Objects.hash()`.

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof User other)) return false;

    return Objects.equals(id, other.id)
        && Objects.equals(name, other.name);
}

@Override
public int hashCode() {
    return Objects.hash(id, name);
}
```

`Objects.equals(a, b)` is null-safe, while `Objects.hash(...)` is a convenient
way to combine the fields participating in the hash.

The contract remains:

```text
a.equals(b) == true
        ↓
a.hashCode() == b.hashCode()
```

And fields participating in equality/hashCode should not be mutated while an
object is being used as a hash-based collection key.

---

# 28. Important Collection Comparisons

## Q84. ArrayList vs LinkedList?

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

## Q85. HashMap vs LinkedHashMap?

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

## Q86. HashMap vs TreeMap?

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

## Q87. HashSet vs TreeSet?

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

## Q88. HashMap vs ConcurrentHashMap?

```text
HashMap
→ not thread-safe

ConcurrentHashMap
→ designed for concurrent access
→ no null keys/values
```

Don't use ConcurrentHashMap merely because "threads might exist." Use it when shared concurrent map access is actually required.

---

## Q89. ArrayDeque vs Stack?

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

## Q90. What happens with this code?

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

## Q91. What happens if you modify a HashMap key after inserting it?

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

## Q92. Does HashMap use equals() before hashCode()?

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

## Q93. Can two objects with the same hashCode be stored in HashMap?

Yes.

Hash collisions are allowed.

HashMap uses equality checks to distinguish different keys that land in the same bucket.

---

## Q94. Does TreeSet use equals() to determine duplicates?

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

## Q95. Can HashSet contain two objects with the same hashCode?

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

## Q96. Does ArrayList allow null?

Yes.

```java
List<String> list =
    new ArrayList<>();

list.add(null);
```

Multiple null elements can be stored.

---

## Q97. Does TreeSet allow null?

With natural ordering, TreeSet generally does not support null because comparison requires an ordering relationship.

With custom comparators, behavior depends on the comparator and its handling of null, but relying on null ordering should be deliberate.

---

## Q98. Is Collections.synchronizedList() the same as CopyOnWriteArrayList?

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

## Q99. What is CopyOnWriteArrayList?

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

## Q100. When would you use CopyOnWriteArrayList?

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

## Q101. What is BlockingQueue useful for?

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

## Q102. What collection should you use for O(1) average lookup by key?

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

## Q103. What collection should you use when you need unique elements and preserve insertion order?

```java
LinkedHashSet
```

---

## Q104. What collection should you use when you need unique elements in sorted order?

```java
TreeSet
```

---

## Q105. What collection should you use for a stack?

Prefer:

```java
Deque<T> stack =
    new ArrayDeque<>();
```

---

## Q106. What collection should you use for a priority-based task scheduler?

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

## Q107. You need to remove duplicates from a List while preserving the original order. What would you use?

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

## Q108. You need to count how many times each word appears. What collection would you use?

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

## Q109. You need the top 10 highest-priority elements from millions of records. Would you sort everything?

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

## Q110. You need a cache that removes the least recently used entry. Which collection could help?

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

## Q111. You have a Map shared by many threads. Which collection might you use?

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

## Q112. Why is this code not necessarily thread-safe?

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

## Q113. You need to process tasks concurrently and block when the queue is full. What would you use?

A bounded `BlockingQueue`, such as:

```java
BlockingQueue<Task> queue =
    new ArrayBlockingQueue<>(1000);
```

A bounded queue can help prevent unlimited memory growth and provides a form of backpressure.

---

## Q114. You need sorted keys but also frequent lookup. Should you use HashMap and sort keys every time?

If sorted traversal is a core requirement and must be maintained continuously, `TreeMap` may be more appropriate.

If sorting is rare and lookup dominates, a `HashMap` plus occasional sorting may be more efficient.

The correct answer depends on workload frequency and performance requirements.

---

# 33. Advanced Scenario Questions

## Q115. You have 10 million objects and only need to know whether an ID has already been seen. What collection might you use?

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

## Q116. What is the difference between lookup complexity and real-world performance?

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

## Q117. Why might ArrayList be better than LinkedList even when both can perform an operation in O(n)?

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

## Q118. An interviewer asks: "Which collection should I use?"

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

## Chain 5 — Arrays.asList()

```text
What does Arrays.asList() return?
      ↓
Is it resizable?
      ↓
Can set() be used?
      ↓
What happens with add()/remove()?
      ↓
Is it backed by the original array?
      ↓
What happens with int[]?
      ↓
Arrays.asList() vs List.of()?
      ↓
Arrays.asList() vs new ArrayList<>(...)?
```

---

## Chain 6 — NavigableMap / NavigableSet

```text
Why TreeMap?
      ↓
What is NavigableMap?
      ↓
floorKey() vs ceilingKey()?
      ↓
lowerKey() vs higherKey()?
      ↓
headMap() / tailMap() / subMap()?
      ↓
What is NavigableSet?
      ↓
floor() / ceiling() / lower() / higher()?
```

---

## Chain 7 — ConcurrentHashMap Iteration

```text
What does ConcurrentHashMap provide?
      ↓
Is it completely lock-free?
      ↓
What happens while iterating?
      ↓
Does it throw ConcurrentModificationException?
      ↓
What is a weakly-consistent iterator?
      ↓
Does it provide a snapshot?
```

---

## Chain 8 — Specialized Collections

```text
Enum keys?
      ↓
EnumMap

Enum values as a Set?
      ↓
EnumSet

Keys should not keep objects alive?
      ↓
WeakHashMap
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
51. What is Arrays.asList()?
52. Why is Arrays.asList() fixed-size?
53. What happens when Arrays.asList() receives an int[]?
54. NavigableMap?
55. floorKey() vs ceilingKey()?
56. lowerKey() vs higherKey()?
57. NavigableMap range views?
58. NavigableSet?
59. ConcurrentHashMap weakly-consistent iterator?
60. Fail-fast vs weakly-consistent iteration?
61. EnumSet?
62. EnumMap?
63. addAll() / retainAll() / removeAll()?
64. Union / intersection / difference of Sets?
65. WeakHashMap?
66. WeakHashMap vs LRU cache?
67. Objects.equals()?
68. Objects.hash()?

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


---


# MASTER SECTION — Java Threads + Concurrency


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


---


# MASTER SECTION — Modern Java + JVM


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


---


# MASTER SECTION — Spring Boot + JDBC + Hibernate + Security + REST


title: Spring Boot + JDBC + Hibernate/JPA + REST + Security — Interview Preparation
tags:
  - spring
  - spring-boot
  - spring-core
  - spring-mvc
  - rest-api
  - jdbc
  - jpa
  - hibernate
  - spring-data-jpa
  - spring-security
  - jwt
  - oauth2
  - transactions
  - testing
  - interview
---

# Spring Boot + JDBC + Hibernate/JPA + REST + Security — Interview Preparation

> [!note]
> This note is designed for senior/full-stack/Java + Spring Boot interviews.
>
> The goal is not to memorize annotations.
>
> Learn each topic as:
>
> **What → Why → How → Internals → Production usage → Trade-offs → Interview traps**

---

# 1. The Spring Mental Model

A typical Spring Boot request can be understood as:

```text
Client
  ↓
Load Balancer / API Gateway
  ↓
Embedded Server
  ↓
Spring Security Filter Chain
  ↓
DispatcherServlet
  ↓
Controller
  ↓
Validation / DTO mapping
  ↓
Service
  ↓
Transaction boundary
  ↓
Repository
  ↓
JPA/Hibernate OR JDBC
  ↓
Database
  ↓
Result mapping
  ↓
Service
  ↓
DTO
  ↓
Jackson
  ↓
JSON Response
```

The most important interview skill is being able to explain what happens at every boundary.

---

# 2. Spring vs Spring Boot

## Q1. What is Spring?

Spring is an application framework centered around:

- Dependency Injection
- Inversion of Control
- Modular infrastructure
- Transaction management
- Web development
- Data access
- Security
- Testing

The core idea is:

```text
Your application objects
        ↓
Spring creates/manages/wires them
```

## Q2. What is Spring Boot?

Spring Boot simplifies Spring application development by providing:

- Auto-configuration
- Starter dependencies
- Embedded servers
- Externalized configuration
- Production-ready features
- Sensible defaults

Spring Boot does not replace Spring. It uses Spring underneath.

## Q3. Spring Framework vs Spring Boot

| Spring | Spring Boot |
|---|---|
| Core framework | Opinionated layer over Spring |
| More explicit configuration | Auto-configuration |
| More setup | Faster bootstrap |
| Infrastructure configured manually more often | Embedded server and starters |

---

# 3. IoC and Dependency Injection

## Q4. What is IoC?

Inversion of Control means application code does not manually control creation and wiring of every dependency.

Without IoC:

```java
class OrderService {
    private PaymentService paymentService =
        new PaymentService();
}
```

With Spring:

```java
class OrderService {
    private final PaymentService paymentService;

    OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

Spring provides the dependency.

## Q5. What is Dependency Injection?

Dependency Injection is providing an object's dependencies from outside the object.

Common forms:

```text
Constructor injection
Setter injection
Field injection
```

Preferred:

```java
@Service
class OrderService {

    private final PaymentRepository repository;

    OrderService(PaymentRepository repository) {
        this.repository = repository;
    }
}
```

## Q6. Why prefer constructor injection?

- Dependencies are explicit
- Object can be immutable
- Easier unit testing
- Works naturally with `final`
- Partially initialized objects are harder to create
- Circular dependencies become easier to detect

---

# 4. Spring Bean Lifecycle

Simplified:

```text
Bean definition
      ↓
Instantiate
      ↓
Dependency injection
      ↓
Aware callbacks
      ↓
BeanPostProcessor before initialization
      ↓
@PostConstruct
      ↓
InitializingBean
      ↓
BeanPostProcessor after initialization
      ↓
Bean ready
      ↓
Application uses bean
      ↓
@PreDestroy
      ↓
Bean destroyed
```

Important interview concept:

`BeanPostProcessor` can modify or wrap beans and is heavily involved in Spring infrastructure.

---

# 5. Bean Scopes

Important scopes:

```text
singleton
prototype
request
session
application
websocket
```

Default:

```text
singleton
```

Important:

> Spring singleton means one bean instance per Spring ApplicationContext, not one object for the entire JVM.

A singleton bean is also not automatically thread-safe.

---

# 6. Stereotype Annotations

Conceptually:

```text
@Component
   ├── @Service
   ├── @Repository
   └── @Controller
```

```text
@Component → generic Spring component
@Service   → service/business layer
@Repository → persistence layer
@Controller → MVC controller
```

`@Repository` also participates in persistence exception translation.

---

# 7. @Bean vs @Component

`@Component`:

```java
@Component
class PaymentClient {
}
```

Spring discovers it through component scanning.

`@Bean`:

```java
@Configuration
class AppConfig {

    @Bean
    PaymentClient paymentClient() {
        return new PaymentClient();
    }
}
```

Use `@Bean` when you need explicit construction/configuration, especially for third-party classes.

---

# 8. @Configuration and Proxies

```java
@Configuration
class AppConfig {

    @Bean
    ServiceA serviceA() {
        return new ServiceA(serviceB());
    }

    @Bean
    ServiceB serviceB() {
        return new ServiceB();
    }
}
```

Spring can intercept configuration methods to preserve bean semantics.

Modern Spring also supports:

```java
@Configuration(proxyBeanMethods = false)
```

when inter-bean method interception is unnecessary.

---

# 9. Component Scanning

A Spring Boot application commonly starts component scanning from the package containing the main application class.

```java
@SpringBootApplication
public class Application {
}
```

Conceptually:

```text
@SpringBootApplication
       ↓
@Configuration
@EnableAutoConfiguration
@ComponentScan
```

---

# 10. Auto-Configuration

One of the most important Spring Boot concepts.

Auto-configuration uses:

- Classpath
- Existing beans
- Properties
- Environment
- Conditional configuration

Conceptually:

```text
Classpath
   +
Properties
   +
Existing beans
   ↓
Conditional configuration
   ↓
Auto-configured beans
```

Important conditions:

```text
@ConditionalOnClass
@ConditionalOnMissingBean
@ConditionalOnProperty
@ConditionalOnBean
@ConditionalOnWebApplication
```

Example:

```java
@Bean
@ConditionalOnMissingBean
PaymentClient paymentClient() {
    return new PaymentClient();
}
```

---

# 11. Spring Boot Starters

Examples:

```text
spring-boot-starter-web
spring-boot-starter-data-jpa
spring-boot-starter-jdbc
spring-boot-starter-security
spring-boot-starter-validation
spring-boot-starter-test
```

A starter is primarily a convenient dependency bundle.

---

# 12. Configuration and Profiles

Common sources:

```text
application.properties
application.yml
environment variables
command-line arguments
external configuration
profile-specific configuration
```

Profiles:

```text
application-dev.yml
application-test.yml
application-prod.yml
```

Activate a profile with:

```text
spring.profiles.active=prod
```

Secrets should not be hard-coded into application source.

---

# 13. @Value vs @ConfigurationProperties

Simple property:

```java
@Value("${payment.timeout}")
private Duration timeout;
```

Grouped configuration:

```java
@ConfigurationProperties(prefix = "payment")
public class PaymentProperties {
    private Duration timeout;
    private URI endpoint;
}
```

`@ConfigurationProperties` is generally better for structured configuration because it is type-safe, testable, and easier to validate.

---

# 14. REST API Fundamentals

A REST API exposes resources through HTTP.

```text
GET    /users
GET    /users/{id}
POST   /users
PUT    /users/{id}
PATCH  /users/{id}
DELETE /users/{id}
```

Think:

```text
Resource
+
HTTP method
+
representation
+
status code
```

---

# 15. @RestController

```java
@RestController
@RequestMapping("/users")
class UserController {

    @GetMapping("/{id}")
    UserResponse getUser(@PathVariable Long id) {
        return service.getUser(id);
    }
}
```

`@RestController` effectively combines:

```java
@Controller
@ResponseBody
```

---

# 16. @RequestParam vs @PathVariable vs @RequestBody

Path:

```http
GET /users/42
```

```java
@GetMapping("/{id}")
User get(@PathVariable Long id)
```

Query parameter:

```http
GET /users?status=ACTIVE
```

```java
@GetMapping
List<User> get(@RequestParam String status)
```

Request body:

```http
POST /users
Content-Type: application/json

{
  "name": "Alice"
}
```

```java
@PostMapping
User create(@RequestBody CreateUserRequest request) {
    ...
}
```

---

# 17. DTOs

Prefer:

```text
Entity
  ↓
Service
  ↓
DTO
  ↓
JSON
```

rather than automatically exposing JPA entities.

Benefits:

- API contract isolation
- Prevent persistence details leaking into API
- Control serialized fields
- Avoid accidental sensitive-field exposure
- Easier API evolution

---

# 18. Jackson

Spring Boot commonly uses Jackson.

```text
Java Object
    ↓
Jackson
    ↓
JSON
```

and:

```text
JSON
 ↓
Jackson
 ↓
Java Object
```

Important:

```text
ObjectMapper
@JsonProperty
@JsonIgnore
@JsonFormat
@JsonInclude
@JsonCreator
```

---

# 19. HTTP Status Codes

Important:

```text
200 OK
201 Created
202 Accepted
204 No Content

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Content
429 Too Many Requests

500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
```

Important distinction:

```text
401 → authentication missing/invalid
403 → authenticated but not allowed
```

---

# 20. REST Error Handling

Centralize errors:

```java
@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    ResponseEntity<ApiError> handle(
            UserNotFoundException ex) {

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ApiError("USER_NOT_FOUND"));
    }
}
```

For modern Spring applications, also understand `ProblemDetail`.

---

# 21. Validation

Use:

```text
spring-boot-starter-validation
```

Example:

```java
record CreateUserRequest(
    @NotBlank String name,
    @Email String email,
    @Min(18) int age
) {}
```

```java
@PostMapping
UserResponse create(
    @Valid @RequestBody CreateUserRequest request) {
    ...
}
```

Know:

```text
@NotNull
@NotBlank
@NotEmpty
@Size
@Min
@Max
@Positive
@Email
@Pattern
```

---

# 22. Custom Validation

Use:

```text
@Constraint
ConstraintValidator
```

Useful for:

```text
startDate < endDate
password == confirmPassword
```

---

# 23. JDBC Fundamentals

JDBC is Java's low-level relational database API.

```text
Application
   ↓
JDBC API
   ↓
JDBC Driver
   ↓
Database
```

Important:

```text
Connection
PreparedStatement
Statement
ResultSet
DataSource
```

---

# 24. Statement vs PreparedStatement

Avoid:

```java
Statement statement = connection.createStatement();

statement.executeQuery(
    "SELECT * FROM users WHERE id = " + id
);
```

Prefer:

```java
PreparedStatement ps =
    connection.prepareStatement(
        "SELECT * FROM users WHERE id = ?"
    );

ps.setLong(1, id);
```

Benefits:

- Parameter binding
- SQL injection protection when used correctly
- Cleaner SQL
- Potential statement reuse

---

# 25. DataSource and Connection Pool

Application code generally obtains connections through:

```text
DataSource
   ↓
Connection
```

Production applications commonly use a pool such as HikariCP.

```text
Application threads
       ↓
Connection Pool
  ┌────┬────┬────┐
  │ C1 │ C2 │ C3 │
  └────┴────┴────┘
       ↓
     Database
```

Important tuning:

```text
maximum pool size
connection timeout
idle timeout
max lifetime
leak detection
```

A huge pool is not automatically better.

---

# 26. Spring JDBC / JdbcTemplate

`JdbcTemplate` removes much repetitive JDBC plumbing.

```java
List<User> users =
    jdbcTemplate.query(
        "SELECT id, name FROM users",
        (rs, rowNum) ->
            new User(
                rs.getLong("id"),
                rs.getString("name")
            )
    );
```

Know:

```text
query()
queryForObject()
queryForList()
update()
batchUpdate()
execute()
```

---

# 27. JDBC Batch Operations

```java
jdbcTemplate.batchUpdate(
    "INSERT INTO users(name) VALUES (?)",
    users,
    users.size(),
    (ps, user) -> ps.setString(1, user.name())
);
```

Batching can reduce database round trips.

Measure actual driver/database behavior.

---

# 28. JDBC Transactions

A transaction groups operations into an atomic unit.

```text
BEGIN
  ↓
operation A
  ↓
operation B
  ↓
COMMIT
```

Failure:

```text
ROLLBACK
```

ACID:

```text
Atomicity
Consistency
Isolation
Durability
```

---

# 29. JPA vs Hibernate

Critical distinction:

```text
JPA
→ specification/API

Hibernate
→ implementation/provider
```

JPA defines concepts such as:

```text
@Entity
@Id
@OneToMany
@ManyToOne
EntityManager
```

Hibernate implements JPA and adds its own capabilities.

---

# 30. Spring Data JPA

Stack:

```text
Spring Data JPA
       ↓
JPA
       ↓
Hibernate
       ↓
JDBC
       ↓
Database
```

Know what each layer contributes.

---

# 31. Entity

```java
@Entity
@Table(name = "users")
class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
```

An entity represents persistent state managed by a persistence context.

---

# 32. Entity Lifecycle

Important states:

```text
Transient
   ↓ persist
Managed
   ↓ detach/clear
Detached
   ↓ remove
Removed
```

Managed entities are tracked by the persistence context.

---

# 33. Persistence Context

Think of the persistence context as:

```text
identity map
+
change tracking
+
first-level cache
```

Example:

```java
User a = entityManager.find(User.class, 1L);
User b = entityManager.find(User.class, 1L);
```

Within the same persistence context, `a == b` can be true.

---

# 34. Dirty Checking

One of Hibernate's most important concepts.

```java
@Transactional
public void updateUser(Long id) {

    User user = repository.findById(id).orElseThrow();

    user.setName("Bob");
}
```

For a managed entity, explicit `save()` is not necessarily required for the update.

Conceptually:

```text
Load entity
   ↓
snapshot
   ↓
modify entity
   ↓
dirty checking
   ↓
SQL UPDATE
   ↓
flush
```

---

# 35. Flush vs Commit

Not identical.

```text
flush
→ synchronize persistence-context changes with DB

commit
→ finalize database transaction
```

A flush can occur before commit.

---

# 36. persist vs merge

JPA:

```text
persist()
→ make a new entity managed

merge()
→ copy state from a detached entity into a managed instance
```

Important:

The object passed to `merge()` does not necessarily become the managed instance.

---

# 37. Spring Data save()

```java
repository.save(entity);
```

Do not describe `save()` as "always insert."

Depending on entity state and repository implementation, Spring Data JPA can use `persist()` or `merge()`.

---

# 38. EntityManager

Important operations:

```text
persist()
find()
merge()
remove()
refresh()
detach()
clear()
flush()
```

---

# 39. Repository Interfaces

Common hierarchy:

```text
Repository
CrudRepository
PagingAndSortingRepository
JpaRepository
```

Typical:

```java
interface UserRepository
        extends JpaRepository<User, Long> {
}
```

---

# 40. Derived Query Methods

```java
List<User> findByStatus(Status status);
```

Multiple conditions:

```java
List<User> findByStatusAndAgeGreaterThan(
    Status status,
    int age
);
```

Use derived queries for simple, readable cases. Very long method names become difficult to maintain.

---

# 41. JPQL

JPQL works with entities rather than raw database tables.

```java
@Query("""
    select u
    from User u
    where u.status = :status
""")
List<User> findActive(@Param("status") Status status);
```

Mental model:

```text
JPQL → entity model
SQL  → database model
```

---

# 42. Native SQL

```java
@Query(
    value = "SELECT * FROM users WHERE status = :status",
    nativeQuery = true
)
```

Useful for:

- Database-specific features
- Complex SQL
- Exact SQL tuning
- Existing SQL reuse

Trade-off:

```text
less database portability
```

---

# 43. Pagination

Avoid loading millions of rows.

```java
Page<User> findByStatus(
    Status status,
    Pageable pageable
);
```

Know:

```text
Page
Slice
Pageable
Sort
```

`Page` generally requires total-count information. `Slice` can avoid a count query when only "has next" behavior is required.

---

# 44. N+1 Query Problem

Example:

```text
1 query → users

then for every user:
1 query → orders
```

100 users can produce:

```text
1 + 100 = 101 queries
```

This is N+1.

---

# 45. Solving N+1

Possible strategies:

```text
fetch join
EntityGraph
batch fetching
DTO projection
explicit query design
```

Example:

```java
@Query("""
    select distinct u
    from User u
    left join fetch u.orders
""")
List<User> findUsersWithOrders();
```

Do not blindly make every relationship `EAGER`.

---

# 46. LAZY vs EAGER

```text
LAZY
→ association loaded when needed

EAGER
→ association is intended to be available eagerly
```

Production principle:

> Prefer deliberate fetch plans rather than globally making relationships eager.

---

# 47. LazyInitializationException

Common scenario:

```text
transaction ends
     ↓
persistence context closes
     ↓
lazy association accessed
     ↓
LazyInitializationException
```

Better solutions:

```text
proper transaction boundaries
fetch required data explicitly
DTO projections
fetch joins
EntityGraph
```

Do not solve it by blindly making everything EAGER.

---

# 48. Entity Relationships

Important:

```text
@OneToOne
@OneToMany
@ManyToOne
@ManyToMany
```

Most common practical relationship:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "department_id")
private Department department;
```

---

# 49. Owning Side and mappedBy

Owning side controls the foreign-key mapping.

```java
@ManyToOne
@JoinColumn(name = "department_id")
private Department department;
```

Inverse side:

```java
@OneToMany(mappedBy = "department")
private List<User> users;
```

`mappedBy` says the relationship is mapped by the other field.

---

# 50. Cascade

Important cascade types:

```text
PERSIST
MERGE
REMOVE
REFRESH
DETACH
ALL
```

Cascade means an operation propagates to associated entities.

Cascade is not the same thing as orphan removal.

---

# 51. orphanRemoval

```java
@OneToMany(
    mappedBy = "order",
    orphanRemoval = true
)
private List<OrderItem> items;
```

Removing a child from a managed collection can cause the child row to be deleted.

Use deliberately.

---

# 52. Entity equals/hashCode

Entity equality is tricky because an entity may have:

```text
database identity
business identity
provider/session identity
```

Do not blindly generate equality/hash code across all mutable fields or associations.

Design it deliberately.

---

# 53. Optimistic Locking

```java
@Version
private Long version;
```

Conceptually:

```text
Read version = 5
     ↓
Modify
     ↓
UPDATE ... WHERE version = 5
     ↓
version becomes 6
```

If another transaction already changed it:

```text
UPDATE affects 0 rows
      ↓
optimistic locking failure
```

Useful when conflicts are relatively rare.

---

# 54. Pessimistic Locking

Examples:

```text
PESSIMISTIC_READ
PESSIMISTIC_WRITE
```

Useful when database locking is appropriate under contention.

Trade-offs:

```text
blocking
deadlocks
lower concurrency
database resource usage
```

---

# 55. Transactions with @Transactional

```java
@Transactional
public void transfer(
    Long from,
    Long to,
    BigDecimal amount) {

    debit(from, amount);
    credit(to, amount);
}
```

Conceptually:

```text
method enters
   ↓
transaction starts
   ↓
business operations
   ↓
method returns
   ↓
commit

exception
   ↓
rollback
```

---

# 56. Transaction Propagation

Important:

```text
REQUIRED
REQUIRES_NEW
SUPPORTS
MANDATORY
NOT_SUPPORTED
NEVER
NESTED
```

### REQUIRED

Join an existing transaction or create one.

### REQUIRES_NEW

Suspend existing transaction and create a new transaction.

Classic example:

```text
outer transaction
     ↓
auditService.save()
     ↓
REQUIRES_NEW
```

The audit transaction can commit independently.

---

# 57. Transaction Isolation

Common:

```text
READ_UNCOMMITTED
READ_COMMITTED
REPEATABLE_READ
SERIALIZABLE
```

Know:

```text
Dirty read
Non-repeatable read
Phantom read
```

Actual behavior depends on database and configuration.

---

# 58. Rollback Rules

Do not memorize:

> "All exceptions cause rollback."

Spring's default rollback behavior primarily covers unchecked exceptions and errors.

Checked exceptions generally do not cause rollback by default.

Customize:

```java
@Transactional(
    rollbackFor = SomeCheckedException.class
)
```

---

# 59. @Transactional Self-Invocation

Classic trap:

```java
@Service
class PaymentService {

    public void outer() {
        inner();
    }

    @Transactional
    public void inner() {
    }
}
```

External call:

```text
Caller
  ↓
Spring proxy
  ↓
transaction interceptor
  ↓
target
```

Self-call:

```text
target
  ↓
this.inner()
```

does not necessarily pass through the proxy.

---

# 60. Spring AOP

Spring uses proxies for many cross-cutting features.

Examples:

```text
@Transactional
@Cacheable
@Async
method security
```

Mental model:

```text
Caller
  ↓
Proxy
  ↓
Interceptor
  ↓
Target
```

Know:

```text
JDK dynamic proxy
CGLIB/class-based proxy
```

---

# 61. Spring Security Architecture

Important flow:

```text
HTTP Request
     ↓
Security Filter Chain
     ↓
Authentication
     ↓
SecurityContext
     ↓
Authorization
     ↓
Controller
```

Security is not simply a controller annotation.

---

# 62. Authentication vs Authorization

Authentication:

```text
Who are you?
```

Authorization:

```text
What are you allowed to do?
```

Example:

```text
Authentication
→ user = Alice

Authorization
→ role = ADMIN
→ may access /admin
```

---

# 63. SecurityFilterChain

Modern configuration commonly uses:

```java
@Bean
SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception {

    return http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**").permitAll()
            .anyRequest().authenticated()
        )
        .build();
}
```

The exact DSL evolves, but the filter-chain mental model is fundamental.

---

# 64. UserDetailsService

`UserDetailsService` loads user information for username/password authentication.

```text
username
   ↓
UserDetailsService
   ↓
UserDetails
   ↓
Authentication
```

---

# 65. PasswordEncoder

Never store plaintext passwords.

Use:

```java
PasswordEncoder
```

Common choice:

```text
BCrypt
```

or another appropriate adaptive password hashing algorithm.

Password hashing should be intentionally expensive enough to resist brute-force attacks.

---

# 66. JWT Authentication

Typical stateless flow:

```text
Login
 ↓
username/password
 ↓
authenticate
 ↓
issue JWT
 ↓
client sends JWT
 ↓
Authorization header
 ↓
security filter validates token
 ↓
SecurityContext
 ↓
Controller
```

Header:

```http
Authorization: Bearer <token>
```

---

# 67. JWT Structure

```text
header.payload.signature
```

Claims can include:

```text
sub
iat
exp
roles
scope
```

Important:

> JWT payload is encoded, not automatically encrypted.

Never put secrets into ordinary JWT claims.

---

# 68. JWT Pros and Cons

Advantages:

```text
stateless validation
easy horizontal scaling
no server-side session lookup for each request
```

Trade-offs:

```text
revocation complexity
token theft risk
payload visibility
token size
key management
refresh-token design
```

JWT is not automatically better than sessions.

---

# 69. Session-Based Authentication

Flow:

```text
Login
 ↓
server creates session
 ↓
session ID returned
 ↓
client sends session ID
 ↓
server looks up session
```

Comparison:

| Session | JWT |
|---|---|
| Server-side state | Usually stateless access token |
| Easier revocation | More complex revocation |
| Session store at scale | Easier horizontal scaling |
| Small client identifier | Claims carried by token |

---

# 70. OAuth 2.0

OAuth is primarily an authorization framework.

Roles:

```text
Resource Owner
Client
Authorization Server
Resource Server
```

Authorization Code flow:

```text
User
 ↓
Client
 ↓
Authorization Server
 ↓
Authorization Code
 ↓
Client
 ↓
Token Endpoint
 ↓
Access Token
 ↓
Resource Server
```

---

# 71. OpenID Connect

OIDC builds authentication/identity on OAuth 2.0.

```text
OAuth 2.0
→ authorization

OpenID Connect
→ authentication + identity
```

Know:

```text
ID Token
Access Token
Refresh Token
```

---

# 72. CSRF

CSRF exploits authenticated browser requests where credentials are automatically attached.

Important:

> CSRF and CORS are different problems.

CSRF is especially relevant to cookie/session-based authentication.

For bearer-token APIs, the threat model is different. Do not blindly disable CSRF without understanding how credentials are transported.

---

# 73. CORS

CORS controls whether browser JavaScript can make cross-origin requests.

Example:

```text
frontend.example.com
       ↓
api.example.com
```

CORS is not authentication.

---

# 74. Method Security

Examples:

```java
@PreAuthorize("hasRole('ADMIN')")
```

or:

```java
@PreAuthorize(
    "#userId == authentication.principal.id"
)
```

Use method security when authorization naturally belongs at the business-operation boundary.

---

# 75. Roles vs Authorities

Think:

```text
Role
→ coarse-grained grouping

Authority
→ permission
```

Example:

```text
ROLE_ADMIN

USER_READ
USER_WRITE
PAYMENT_REFUND
```

For complex authorization, fine-grained authorities can be more expressive than creating huge numbers of roles.

---

# 76. SecurityContext

After authentication:

```text
SecurityContext
      ↓
Authentication
      ↓
Principal
Authorities
```

The context is commonly accessed through:

```java
SecurityContextHolder
```

Do not assume ordinary thread-local context automatically follows every asynchronous or reactive execution model.

---

# 77. REST API Security Checklist

Consider:

```text
TLS
authentication
authorization
input validation
rate limiting
secure password storage
token expiry
refresh-token strategy
CORS
CSRF where applicable
security headers
audit logging
secret management
least privilege
safe error responses
```

---

# 78. Spring Transactions + JDBC + JPA

Can JDBC and JPA participate in the same Spring transaction?

Yes, when compatible transaction infrastructure and resource configuration allow both to participate in the same underlying database transaction.

Conceptually:

```text
@Transactional
      ↓
Spring transaction manager
      ↓
Database transaction
      ├── JPA/Hibernate
      └── JDBC
```

Do not assume unrelated databases/resources automatically become one atomic transaction.

---

# 79. JdbcTemplate vs JPA/Hibernate

Use JDBC when:

```text
SQL control is important
simple queries
bulk operations
reporting
database-specific SQL
predictable SQL
```

Use JPA/Hibernate when:

```text
domain entities
object relationships
unit-of-work
dirty checking
identity management
ORM productivity
```

Many real applications use both.

---

# 80. Hibernate First-Level Cache

The first-level cache belongs to the persistence context.

```text
EntityManager / Persistence Context
          ↓
First-level cache
```

Within one persistence context:

```text
find(User, 1)
find(User, 1)
```

does not necessarily cause two database queries.

---

# 81. Second-Level Cache

Hibernate can support a second-level cache.

```text
Persistence Context
      ↓
First-level cache

Shared across sessions
      ↓
Second-level cache
```

Use carefully because stale data and invalidation can become correctness problems.

---

# 82. Query Cache

Query caching is different from entity caching.

```text
query
 ↓
cached result information
```

It requires careful invalidation and workload analysis.

Do not enable it just because "cache = faster."

---

# 83. Fetch Join

Example:

```java
@Query("""
    select distinct u
    from User u
    left join fetch u.orders
""")
List<User> findUsersWithOrders();
```

Fetch joins can eliminate N+1 for a specific response shape.

Multiple collection fetches can cause row multiplication and may hit Hibernate-specific limitations, so use deliberately.

---

# 84. EntityGraph

Example:

```java
@EntityGraph(attributePaths = {"orders"})
Optional<User> findById(Long id);
```

Useful for expressing fetch plans without writing fetch joins for every repository method.

---

# 85. Projections

Instead of loading full entities:

```java
interface UserSummary {
    Long getId();
    String getName();
}
```

Or use DTO queries.

Benefits:

```text
less data
less memory
less entity management
better read-model performance
```

---

# 86. Hibernate Performance

Important tools:

```text
indexes
fetch strategy
batch fetching
JDBC batching
DTO projections
pagination
read-only transactions
query analysis
SQL logging
database execution plans
connection pool sizing
```

Always inspect generated SQL when debugging ORM performance.

---

# 87. SQL Knowledge

Know:

```text
SELECT
WHERE
JOIN
GROUP BY
HAVING
ORDER BY
LIMIT/OFFSET
subqueries
CTEs
window functions
indexes
transactions
locking
normalization
```

Spring Boot does not eliminate the need to understand SQL.

---

# 88. Database Indexes

Example:

```text
SELECT * FROM users WHERE email = ?
```

with:

```text
INDEX(email)
```

can improve lookup.

But indexes cost:

```text
storage
write overhead
maintenance
cache pressure
```

Do not index every column.

---

# 89. Composite Index

Example:

```text
INDEX(status, created_at)
```

Column order matters.

Understand the database's index rules and verify with `EXPLAIN` / execution plans.

---

# 90. Spring Caching

Important:

```text
@Cacheable
@CachePut
@CacheEvict
```

Example:

```java
@Cacheable("users")
public User getUser(Long id) {
    return repository.findById(id).orElseThrow();
}
```

Mental model:

```text
request
 ↓
cache lookup
 ↓
hit → return
miss
 ↓
DB
 ↓
cache
 ↓
return
```

---

# 91. Redis

Common use cases:

```text
cache
session store
distributed locks
rate limiting
counters
short-lived data
```

Know:

```text
TTL
eviction
cache stampede
cache penetration
cache avalanche
```

A cache introduces consistency and invalidation problems.

---

# 92. Async Processing

Spring supports asynchronous execution:

```java
@Async
public void sendEmail() {
}
```

Understand:

```text
Executor
thread pool
queue
rejection policy
backpressure
```

Proxy-based features such as `@Async` can be affected by self-invocation.

Do not create unbounded thread pools casually.

---

# 93. Scheduling

```java
@Scheduled(fixedRate = 60000)
public void process() {
}
```

Production questions:

```text
What happens with multiple application instances?
Can the job run twice?
Do we need distributed locking?
What happens after restart?
```

---

# 94. Spring Events

```text
ApplicationEventPublisher
@EventListener
```

Useful for decoupling internal components.

Important:

```text
in-process Spring event
≠
durable distributed message
```

For reliable cross-service communication, messaging infrastructure may be more appropriate.

---

# 95. Kafka with Spring

Know:

```text
Producer
Consumer
Topic
Partition
Offset
Consumer Group
Broker
```

Flow:

```text
Spring Service
    ↓
Kafka Producer
    ↓
Topic / Partition
    ↓
Kafka Consumer
    ↓
Spring Service
```

Important:

```text
at-least-once delivery
idempotency
consumer offsets
partition ordering
rebalancing
retry
dead-letter topics
```

---

# 96. Observability

Production applications need:

```text
logs
metrics
traces
health checks
```

Spring Boot Actuator provides operational visibility.

Know:

```text
health
readiness
liveness
metrics
info
```

Do not expose sensitive management endpoints publicly.

---

# 97. Micrometer

Micrometer provides metrics instrumentation.

```text
Application
    ↓
Micrometer
    ↓
Metrics backend
```

Useful metrics:

```text
request latency
request count
error count
JVM memory
database pool usage
```

---

# 98. Distributed Tracing

Typical flow:

```text
Request
 ↓
Service A
 ↓
Service B
 ↓
Database
```

Tracing correlates work using:

```text
trace
span
trace ID
span ID
context propagation
sampling
```

---

# 99. Logging

Use structured logging where possible.

Useful context:

```text
request ID
trace ID
operation
duration
result
safe business identifiers
```

Never log:

```text
passwords
tokens
API secrets
private keys
sensitive personal data
```

---

# 100. Testing Pyramid

```text
        E2E
       /   \
 Integration
   /         \
Unit Tests
```

Spring testing:

```text
unit tests
@WebMvcTest
@DataJpaTest
@SpringBootTest
integration tests
Testcontainers
```

---

# 101. @SpringBootTest

Loads a broad Spring application context.

Useful for integration testing.

Trade-off:

```text
realistic
but slower
```

Do not use it for every small unit test.

---

# 102. @WebMvcTest

Focuses on MVC/controller behavior.

Test:

```text
Controller
MockMvc
validation
serialization
exception handling
security
```

Mock service dependencies rather than loading the whole application.

---

# 103. @DataJpaTest

Focused on persistence.

Useful for:

```text
repositories
entity mappings
queries
database behavior
```

---

# 104. MockMvc

```java
mockMvc.perform(
    get("/users/1")
)
.andExpect(status().isOk());
```

Test:

```text
status
headers
JSON
validation
security
```

---

# 105. Testcontainers

Useful for realistic integration testing against:

```text
PostgreSQL
MySQL
Redis
Kafka
```

Mental model:

```text
Test
 ↓
real dependency in container
 ↓
test
```

This catches issues mocks cannot.

---

# 106. Unit vs Integration Testing

Unit:

```text
one class
isolated dependencies
fast
```

Integration:

```text
multiple components
real framework/infrastructure
slower
```

Strong systems use both.

---

# 107. Production Architecture

A common structure:

```text
controller/
service/
repository/
entity/
dto/
mapper/
exception/
config/
security/
client/
```

The important boundaries are:

```text
API
Business Logic
Persistence
Infrastructure
```

---

# 108. Typical Request Flow

```text
POST /orders
      ↓
Controller
      ↓
validate DTO
      ↓
Service
      ↓
business rules
      ↓
@Transactional
      ↓
Repository
      ↓
JPA/JDBC
      ↓
Database
      ↓
DTO mapping
      ↓
201 Created
```

---

# 109. Common Anti-Patterns

Avoid:

```text
fat controllers
business logic inside repositories
entities exposed directly as public API contracts
field injection everywhere
catching Exception everywhere
returning 500 for validation errors
N+1 queries
EAGER relationships everywhere
huge transactions
database calls inside loops
unbounded thread pools
hard-coded secrets
logging tokens/passwords
blindly using JWT
blindly using Redis
blindly using ConcurrentHashMap
```

---

# 110. Singleton Is Not Thread-Safe

Critical interview trap:

```java
@Service
class CounterService {

    private int count;
}
```

Singleton means many requests can share the same object.

Therefore:

```text
singleton
+
mutable state
+
multiple request threads
=
potential race condition
```

Prefer stateless services where possible.

---

# 111. @Transactional Does Not Solve Everything

Transactions provide atomicity/isolation according to configuration and database behavior.

They do not automatically solve:

```text
race conditions
distributed transactions
external API failures
duplicate messages
idempotency
```

---

# 112. External API + Database Transaction

Bad assumption:

```text
BEGIN DB TX
 ↓
DB update
 ↓
call payment API
 ↓
COMMIT
```

If the external API succeeds but DB commit fails:

```text
inconsistent state
```

A database transaction does not roll back an ordinary external HTTP request.

Possible patterns:

```text
outbox
saga
idempotency
retry
compensation
```

---

# 113. Idempotency

An operation is idempotent when repeating it produces the same intended result.

Important for:

```text
payments
orders
webhooks
retries
message consumers
```

Example:

```http
POST /payments
Idempotency-Key: abc123
```

Store the key/result so retries do not accidentally create duplicate effects.

---

# 114. Outbox Pattern

For reliable DB + event publishing:

```text
Transaction
 ├── update business data
 └── insert outbox event
        ↓
Commit
        ↓
Outbox publisher
        ↓
Kafka
```

Avoids:

```text
DB commit succeeds
event publish fails
```

---

# 115. API Versioning

Common:

```text
/v1/users
/v2/users
```

or header/media-type versioning.

Version APIs deliberately and avoid accidental breaking changes.

---

# 116. API Pagination

Offset:

```text
?page=10&size=50
```

Simple, but can become inefficient/inconsistent for very large or high-churn datasets.

Cursor/keyset:

```text
?after=<cursor>
```

Often better for large datasets.

---

# 117. Rate Limiting

Common algorithms:

```text
fixed window
sliding window
token bucket
leaky bucket
```

Distributed rate limiting often needs shared infrastructure such as Redis or an API gateway.

---

# 118. HTTP Caching

Know:

```text
Cache-Control
ETag
Last-Modified
If-None-Match
If-Modified-Since
```

Different layers solve different problems:

```text
HTTP cache
application cache
database/cache layer
```

---

# 119. PUT vs PATCH

PUT generally represents replacement semantics.

PATCH represents partial modification.

```http
PATCH /users/1

{
  "name": "Bob"
}
```

Define API semantics clearly.

---

# 120. REST Idempotency

Typically:

```text
GET    idempotent
PUT    idempotent
DELETE idempotent
POST   not inherently idempotent
```

This concerns intended state semantics.

---

# 121. Spring Boot Startup

High-level:

```text
main()
 ↓
SpringApplication.run()
 ↓
ApplicationContext created
 ↓
Environment prepared
 ↓
Bean definitions discovered
 ↓
Auto-configuration
 ↓
Beans instantiated
 ↓
Embedded server starts
 ↓
Application ready
```

---

# 122. Actuator

Useful operational features:

```text
health
metrics
info
loggers
mappings
beans
```

Expose only what is appropriate.

---

# 123. Graceful Shutdown

```text
shutdown signal
 ↓
stop accepting new traffic
 ↓
finish in-flight work where possible
 ↓
close resources
 ↓
exit
```

Important for containers and Kubernetes.

---

# 124. Docker + Spring Boot

Production concerns:

```text
small image
non-root user
JVM memory limits
health checks
graceful shutdown
externalized configuration
secret management
```

---

# 125. Kubernetes Concepts

Know:

```text
Pod
Deployment
Service
ConfigMap
Secret
Readiness probe
Liveness probe
Horizontal Pod Autoscaler
```

Important:

```text
liveness
→ should container be restarted?

readiness
→ should traffic be sent to it?
```

---

# 126. Resilience

For external dependencies:

```text
timeouts
retries
circuit breakers
bulkheads
rate limits
fallbacks
```

Retry only failures that are actually retryable.

Retries without backoff can amplify outages.

---

# 127. Timeout Design

Every network call should have intentional timeouts.

Think:

```text
connect timeout
read/response timeout
overall deadline
```

Avoid infinite waits.

---

# 128. Circuit Breaker

```text
Closed
  ↓ failures
Open
  ↓ timeout
Half-Open
  ↓ success
Closed
```

Purpose:

```text
prevent repeated calls to unhealthy dependency
```

Circuit breakers are not substitutes for timeouts.

---

# 129. Bulkhead

Bulkhead isolation prevents one workload from consuming all shared resources.

```text
Payment calls
   ↓
Pool A

Email calls
   ↓
Pool B
```

If email becomes unhealthy, payment processing can continue.

---

# 130. Spring + Microservices

Important:

```text
service boundaries
REST/gRPC
service discovery
API gateway
configuration
authentication
distributed tracing
timeouts
retries
circuit breakers
messaging
idempotency
distributed transactions
observability
```

Do not choose microservices merely because Spring Boot makes them easy.

---

# 131. Most Important Spring Core Questions

1. What is IoC?
2. What is dependency injection?
3. Constructor vs setter vs field injection?
4. Why prefer constructor injection?
5. What is a Spring bean?
6. What is ApplicationContext?
7. BeanFactory vs ApplicationContext?
8. Bean lifecycle?
9. Bean scopes?
10. Singleton bean thread safety?
11. `@Component` vs `@Bean`?
12. `@Component` vs `@Service` vs `@Repository`?
13. What is `@Configuration`?
14. Component scanning?
15. `@Primary` vs `@Qualifier`?
16. Circular dependencies?
17. BeanPostProcessor?
18. Spring AOP?
19. JDK proxy vs CGLIB?
20. How do Spring proxies affect method calls?

---

# 132. Spring Boot Questions

21. Spring vs Spring Boot?
22. What does `@SpringBootApplication` contain?
23. Auto-configuration?
24. How does Boot decide what to configure?
25. Conditional beans?
26. Starters?
27. Externalized configuration?
28. Profiles?
29. `@Value` vs `@ConfigurationProperties`?
30. How do you override auto-configuration?
31. Embedded server startup?
32. Actuator?
33. Health vs readiness vs liveness?
34. How do you diagnose startup failure?
35. How do you inspect auto-configuration?
36. Production configuration strategy?

---

# 133. REST Questions

37. What makes an API RESTful?
38. GET vs POST vs PUT vs PATCH vs DELETE?
39. Path variable vs query parameter?
40. `@RequestBody`?
41. `@RestController`?
42. DTO vs entity?
43. HTTP status codes?
44. 401 vs 403?
45. 400 vs 422?
46. Global exception handling?
47. `@ControllerAdvice` vs `@RestControllerAdvice`?
48. `ProblemDetail`?
49. Validation?
50. Custom validation?
51. Jackson serialization?
52. API versioning?
53. Pagination?
54. Offset vs cursor pagination?
55. Idempotency?
56. Rate limiting?
57. CORS?
58. CSRF?
59. HTTP caching?
60. ETag?
61. How do you secure REST APIs?

---

# 134. JDBC Questions

62. What is JDBC?
63. JDBC driver?
64. Connection?
65. Statement vs PreparedStatement?
66. SQL injection?
67. ResultSet?
68. DataSource?
69. Connection pooling?
70. HikariCP?
71. JdbcTemplate?
72. `query()` vs `queryForObject()`?
73. `update()`?
74. Batch updates?
75. JDBC transactions?
76. Auto-commit?
77. Connection leaks?
78. How do you debug slow JDBC calls?

---

# 135. JPA/Hibernate Questions

79. JPA vs Hibernate?
80. Spring Data JPA vs JPA?
81. What is an entity?
82. Entity lifecycle?
83. Persistence context?
84. First-level cache?
85. Second-level cache?
86. Dirty checking?
87. Flush vs commit?
88. persist vs merge?
89. EntityManager?
90. JpaRepository?
91. Derived queries?
92. JPQL?
93. Native query?
94. Lazy vs eager?
95. N+1 problem?
96. Fetch join?
97. EntityGraph?
98. DTO projection?
99. One-to-many?
100. Many-to-one?
101. Owning side?
102. `mappedBy`?
103. Cascade?
104. orphanRemoval?
105. `@Version`?
106. Optimistic locking?
107. Pessimistic locking?
108. LazyInitializationException?
109. How does Hibernate generate SQL?
110. How do you optimize Hibernate?
111. How do indexes affect ORM performance?
112. How do you inspect generated SQL?

---

# 136. Transaction Questions

113. What is `@Transactional`?
114. Where should transaction boundaries live?
115. Propagation?
116. REQUIRED vs REQUIRES_NEW?
117. Isolation levels?
118. Dirty read?
119. Non-repeatable read?
120. Phantom read?
121. Rollback rules?
122. Checked vs unchecked exception rollback?
123. Self-invocation trap?
124. Proxy-based transaction management?
125. Read-only transaction?
126. Nested transaction?
127. What happens if external API fails inside transaction?
128. Distributed transactions?
129. Outbox pattern?
130. Saga?

---

# 137. Spring Security Questions

131. Authentication vs authorization?
132. What is SecurityFilterChain?
133. Request flow through Spring Security?
134. Authentication object?
135. SecurityContext?
136. UserDetails?
137. UserDetailsService?
138. PasswordEncoder?
139. BCrypt?
140. Session vs JWT?
141. JWT structure?
142. JWT signing vs encryption?
143. Access token vs refresh token?
144. JWT revocation?
145. OAuth 2.0?
146. OpenID Connect?
147. Authorization Code flow?
148. CSRF?
149. CORS?
150. Roles vs authorities?
151. `@PreAuthorize`?
152. RBAC?
153. Service-to-service authentication?
154. Key rotation?
155. Refresh-token security?
156. What happens if a JWT is stolen?

---

# 138. Production Questions

157. How would you diagnose high API latency?
158. How would you diagnose high DB CPU?
159. How would you diagnose connection pool exhaustion?
160. How would you diagnose memory growth?
161. How would you diagnose N+1?
162. How would you handle downstream timeout?
163. How would you prevent retry storms?
164. How would you design idempotent APIs?
165. How would you handle duplicate Kafka messages?
166. How would you implement distributed rate limiting?
167. How would you make an API horizontally scalable?
168. How would you handle graceful shutdown?
169. What metrics would you monitor?
170. What should readiness check?
171. How do you trace a request across services?
172. How do you handle secrets?
173. How do you safely deploy database schema changes?

---

# 139. High-Value Follow-Up Chains

## Chain 1 — Dependency Injection

```text
What is IoC?
   ↓
What is DI?
   ↓
How does Spring create beans?
   ↓
ApplicationContext
   ↓
Component scanning
   ↓
Constructor injection
   ↓
Bean lifecycle
   ↓
BeanPostProcessor
   ↓
Spring proxies
```

## Chain 2 — Auto-Configuration

```text
Spring Boot
   ↓
@SpringBootApplication
   ↓
Auto-configuration
   ↓
Starters
   ↓
Classpath
   ↓
Conditional beans
   ↓
@ConditionalOnClass
   ↓
@ConditionalOnMissingBean
   ↓
Override auto-config
```

## Chain 3 — REST Request

```text
HTTP request
   ↓
Security filters
   ↓
DispatcherServlet
   ↓
HandlerMapping
   ↓
Controller
   ↓
Validation
   ↓
Service
   ↓
Repository
   ↓
Database
   ↓
DTO
   ↓
Jackson
   ↓
HTTP response
```

## Chain 4 — JPA Query

```text
Repository method
   ↓
Spring Data
   ↓
EntityManager
   ↓
Hibernate
   ↓
JPQL / SQL generation
   ↓
JDBC
   ↓
Connection pool
   ↓
Database
   ↓
ResultSet
   ↓
Hibernate mapping
   ↓
Entity
```

## Chain 5 — N+1

```text
Load parent list
   ↓
Access lazy association
   ↓
One query per parent
   ↓
N+1
   ↓
Inspect generated SQL
   ↓
Fetch join / EntityGraph / projection
   ↓
Measure again
```

## Chain 6 — @Transactional

```text
Caller
   ↓
Spring proxy
   ↓
Transaction interceptor
   ↓
Begin transaction
   ↓
Service method
   ↓
Repository
   ↓
Flush
   ↓
Commit
```

Then ask:

```text
What if exception?
What if checked exception?
What if self-invocation?
What if REQUIRES_NEW?
What if external API?
```

## Chain 7 — Spring Security

```text
HTTP request
   ↓
SecurityFilterChain
   ↓
Authentication
   ↓
UserDetails / JWT
   ↓
SecurityContext
   ↓
Authorization
   ↓
Controller
```

---

# 140. Scenario-Based Questions

## Q174. API latency increased from 200ms to 2 seconds. What do you investigate?

Break down:

```text
Client
 ↓
network
 ↓
gateway
 ↓
security
 ↓
controller
 ↓
service
 ↓
DB
 ↓
external APIs
 ↓
serialization
```

Use:

```text
metrics
logs
distributed tracing
DB execution plans
connection-pool metrics
generated SQL
profiling
```

Do not immediately blame Spring.

---

## Q175. API gets DB connection timeout errors.

Investigate:

```text
connection pool size
active connections
idle connections
connection acquisition time
long-running queries
unclosed connections
DB max connections
traffic spike
transaction duration
```

A common mistake is simply increasing pool size.

---

## Q176. Endpoint returns 10,000 users and becomes slow.

Potential fixes:

```text
pagination
projection
database indexes
select only required columns
compression
HTTP caching where appropriate
cursor pagination
```

---

## Q177. Loading users triggers one query per user.

Diagnosis:

```text
N+1
```

Possible fixes:

```text
fetch join
EntityGraph
batch fetching
projection
```

Choose based on response shape and cardinality.

---

## Q178. Two users update the same record.

Consider:

```text
optimistic locking
pessimistic locking
application-level conflict handling
```

Ask whether conflicts are rare or frequent.

---

## Q179. Payment API receives the same request twice.

Use:

```text
idempotency key
persistent request state
unique database constraint
safe retry semantics
```

Do not rely on POST being magically deduplicated.

---

## Q180. DB transaction succeeds but Kafka publish fails.

Consider:

```text
transactional outbox
```

rather than assuming one ordinary database transaction can atomically include Kafka.

---

## Q181. JWT is stolen.

Possible defenses:

```text
short access-token lifetime
secure refresh-token handling
token rotation
key rotation
TLS
revocation/deny-list strategy where needed
least privilege
session/device controls
```

A valid stolen bearer token remains dangerous until it expires or is otherwise invalidated.

---

# 141. Architecture Mental Model

```text
                    CLIENT
                       │
                       ▼
                API Gateway / LB
                       │
                       ▼
              Spring Security
                       │
                       ▼
                REST Controller
                       │
                 DTO + Validation
                       │
                       ▼
                    Service
                       │
                  Transaction
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
       Spring Data JPA        JdbcTemplate
            │                     │
            ▼                     ▼
         Hibernate               JDBC
            │                     │
            └──────────┬──────────┘
                       ▼
                    Database
```

Around the application:

```text
Redis
Kafka
External APIs
Metrics
Tracing
Logging
Secrets
Docker
Kubernetes
```

---

# 142. Golden Rules

### Rule 1

Prefer constructor injection.

### Rule 2

Keep controllers thin.

### Rule 3

Keep business logic in services.

### Rule 4

Treat transactions as business-operation boundaries.

### Rule 5

Understand Spring proxies before explaining AOP behavior.

### Rule 6

Never expose JPA entities blindly from public APIs.

### Rule 7

Inspect generated SQL when debugging ORM performance.

### Rule 8

Do not solve N+1 by making everything EAGER.

### Rule 9

Do not assume `@Transactional` protects external systems.

### Rule 10

Do not assume JWT is automatically superior to sessions.

### Rule 11

Authentication and authorization are different.

### Rule 12

CORS and CSRF are different.

### Rule 13

Do not store passwords; store password hashes.

### Rule 14

Do not blindly increase connection-pool size.

### Rule 15

Every network call needs an intentional timeout.

### Rule 16

Retries require backoff and idempotency awareness.

### Rule 17

Do not use Redis/Kafka/microservices merely because they are available.

### Rule 18

Measure before optimizing.

### Rule 19

Use DTOs to define API contracts.

### Rule 20

Think about concurrency whenever a Spring singleton contains mutable state.

---

# 143. Study Order

Recommended:

```text
1. Spring fundamentals
2. IoC / DI
3. Beans / lifecycle / scopes
4. AOP / proxies
5. Spring Boot
6. Configuration / profiles
7. REST / HTTP
8. DTOs / Jackson
9. Validation / exception handling
10. JDBC
11. DataSource / HikariCP
12. JdbcTemplate
13. SQL fundamentals
14. Transactions
15. JPA
16. Hibernate
17. Persistence context
18. Dirty checking
19. Relationships
20. Lazy/eager fetching
21. N+1
22. JPQL / native SQL
23. Pagination / projections
24. Optimistic/pessimistic locking
25. Spring Data JPA
26. Spring Security
27. Sessions
28. JWT
29. OAuth2 / OIDC
30. CORS / CSRF
31. Method security
32. Testing
33. Actuator / observability
34. Redis / caching
35. Kafka / messaging
36. Resilience
37. Docker / Kubernetes basics
38. Production troubleshooting
39. System-design scenarios
40. Interview self-test
```

---

# 144. Final Interview Framework

When asked:

> "What is X?"

Answer:

```text
1. Definition
      ↓
2. Why it exists
      ↓
3. How it works
      ↓
4. Small example
      ↓
5. Internal mechanism
      ↓
6. Production use
      ↓
7. Trade-offs
      ↓
8. Common trap
```

Example:

> "What is @Transactional?"

Do not stop at:

> "It manages database transactions."

Instead:

```text
@Transactional
   ↓
Spring proxy
   ↓
transaction interceptor
   ↓
transaction manager
   ↓
DB transaction
   ↓
service/repository operations
   ↓
flush
   ↓
commit/rollback
```

Then discuss:

```text
propagation
isolation
rollback rules
self-invocation
read-only
external API limitations
```

---

# 145. Final Self-Test

You should eventually be able to explain, without notes:

```text
1. IoC
2. Dependency Injection
3. ApplicationContext
4. Bean lifecycle
5. Singleton scope
6. Constructor injection
7. @Component vs @Bean
8. @Service vs @Repository
9. BeanPostProcessor
10. Spring AOP
11. JDK proxy vs CGLIB

12. Spring Boot
13. @SpringBootApplication
14. Auto-configuration
15. Starters
16. Conditional beans
17. Profiles
18. ConfigurationProperties
19. Actuator

20. REST
21. HTTP methods
22. Status codes
23. DTO
24. Jackson
25. Validation
26. Global exception handling
27. Pagination
28. Idempotency
29. CORS
30. HTTP caching

31. JDBC
32. PreparedStatement
33. DataSource
34. HikariCP
35. JdbcTemplate
36. Batch operations
37. JDBC transactions

38. JPA vs Hibernate
39. Spring Data JPA
40. Entity lifecycle
41. Persistence context
42. First-level cache
43. Dirty checking
44. Flush vs commit
45. persist vs merge
46. Lazy vs eager
47. N+1
48. Fetch join
49. EntityGraph
50. Projections
51. Relationships
52. mappedBy
53. Cascade
54. orphanRemoval
55. Optimistic locking
56. Pessimistic locking
57. LazyInitializationException

58. @Transactional
59. Propagation
60. Isolation
61. Rollback rules
62. Self-invocation
63. External API + DB transaction
64. Outbox
65. Saga

66. Spring Security
67. SecurityFilterChain
68. Authentication
69. Authorization
70. SecurityContext
71. UserDetailsService
72. PasswordEncoder
73. JWT
74. Sessions
75. OAuth2
76. OIDC
77. CSRF
78. CORS
79. Roles/Authorities
80. Method security

81. Unit testing
82. @WebMvcTest
83. @DataJpaTest
84. @SpringBootTest
85. Testcontainers

86. Redis
87. Kafka
88. Timeouts
89. Retries
90. Circuit breakers
91. Bulkheads
92. Observability
93. Metrics
94. Tracing
95. Actuator
96. Graceful shutdown
97. Docker
98. Kubernetes
99. Production troubleshooting
100. Distributed-system failure scenarios
```

---

# Final Rule for Spring Interviews

When the interviewer asks:

> "How does Spring Boot work?"

Do not answer with annotations.

Think:

```text
HTTP
 ↓
Security
 ↓
DispatcherServlet
 ↓
Controller
 ↓
DTO / Validation
 ↓
Service
 ↓
Transaction
 ↓
Repository
 ↓
JPA / Hibernate / JDBC
 ↓
Connection Pool
 ↓
Database
 ↓
SQL
 ↓
Result
 ↓
Entity
 ↓
DTO
 ↓
Jackson
 ↓
HTTP Response
```

Then connect the cross-cutting systems:

```text
AOP
Security
Transactions
Caching
Messaging
Observability
Resilience
Testing
Deployment
```

That is the real Spring Boot skill.


---


# MASTER SECTION — Redis + Kafka


title: Redis + Kafka — Interview Questions and Answers
tags:
  - redis
  - kafka
  - spring-boot
  - spring-data-redis
  - spring-kafka
  - caching
  - messaging
  - distributed-systems
  - interview
---

# Redis + Kafka — Interview Preparation

> [!note]
> This note is designed for a Java/Spring Boot full-stack developer preparing for senior-level interviews.
>
> The goal is not to memorize Redis commands or Kafka annotations.
>
> Learn each topic through:
>
> **What → Why → How → Internals → Production usage → Trade-offs → Failure modes → Interview traps**

---

# PART I — REDIS

# 1. What is Redis?

Redis is an in-memory data store commonly used for:

```text
Caching
Session storage
Counters
Rate limiting
Distributed coordination
Queues
Pub/Sub
Short-lived state
Leaderboards
Deduplication
```

Redis is primarily memory-oriented, but it can also persist data.

Mental model:

```text
Application
    ↓
Redis
    ↓
Fast in-memory operations
```

Important:

> Redis is not simply "a cache". It is a data-structure server with persistence, replication, clustering, and several messaging/coordination capabilities.

---

# 2. Why is Redis fast?

Redis is fast because:

```text
Data primarily resides in memory
+
Efficient data structures
+
Simple request/response model
+
Low overhead for many operations
```

But:

> "Redis is in memory, therefore every Redis operation is O(1)" is false.

Different commands have different complexity.

For example:

```text
GET → approximately O(1)
HGET → approximately O(1)
SADD → approximately O(1) average
ZRANGE → depends on requested range
```

Always understand the complexity of the command being used.

---

# 3. Redis vs Traditional Database

| Redis | Relational DB |
|---|---|
| Memory-oriented | Disk/storage-oriented |
| Very low latency | Generally higher latency |
| Key/data-structure model | Relational model |
| Great for cache/state | Great for durable business data |
| Limited query model | Rich SQL |
| TTL built-in | Usually application/schema dependent |
| Persistence available | Primarily durable storage |

Redis does not automatically replace PostgreSQL/MySQL.

---

# 4. Redis Data Types

Important Redis structures:

```text
String
Hash
List
Set
Sorted Set
Stream
Bitmap
HyperLogLog
Geospatial
```

Interview priority:

```text
String
Hash
List
Set
Sorted Set
Stream
```

---

# 5. Redis String

Example:

```text
SET user:1:name "Alice"
GET user:1:name
```

Strings can also store:

```text
numbers
JSON
serialized values
counters
tokens
```

Counter:

```text
INCR page:view:count
```

This is useful because increment operations can be atomic.

---

# 6. Redis Hash

Example:

```text
HSET user:1 name Alice age 30
HGET user:1 name
HGETALL user:1
```

Useful for representing an object:

```text
user:1
 ├── name
 ├── email
 ├── age
 └── status
```

Compared with storing the entire object as one serialized String:

```text
Hash
→ individual fields can be updated

String JSON
→ usually read/modify/write the whole value
```

---

# 7. Redis List

Example:

```text
LPUSH queue task1
RPUSH queue task2
LPOP queue
```

Useful for:

```text
simple queues
recent items
ordered collections
```

But Redis Lists should not automatically be considered a replacement for Kafka or a durable job queue.

---

# 8. Redis Set

Sets contain unique members.

```text
SADD users:active 101
SADD users:active 102
SADD users:active 101
```

The second `101` is not duplicated.

Useful for:

```text
unique membership
tags
deduplication
set intersection
set difference
```

---

# 9. Redis Sorted Set

A sorted set stores:

```text
member + score
```

Example:

```text
ZADD leaderboard 100 Alice
ZADD leaderboard 250 Bob
ZADD leaderboard 180 Charlie
```

Useful for:

```text
leaderboards
ranking
priority queues
time-based indexes
score-based retrieval
```

---

# 10. Redis Streams

Redis Streams provide an append-oriented log structure.

Useful concepts:

```text
stream
entry ID
consumer group
consumer
pending entries
acknowledgment
```

Example mental model:

```text
Producer
   ↓
Redis Stream
   ↓
Consumer Group
   ├── Consumer A
   ├── Consumer B
   └── Consumer C
```

Streams are substantially more capable for durable event processing than simple Pub/Sub.

---

# 11. Redis Pub/Sub

Pub/Sub:

```text
Publisher
    ↓
Channel
    ↓
Subscribers
```

Important property:

> Traditional Redis Pub/Sub is not a durable message log.

If a subscriber is disconnected when a message is published, it does not automatically receive the missed message later.

Use Streams when durable consumption and replay are required.

---

# 12. Redis TTL

Example:

```text
SET session:123 abc EX 3600
```

The key expires after the TTL.

Useful for:

```text
sessions
OTP state
temporary locks
cache entries
rate-limit windows
short-lived tokens
```

---

# 13. Cache-Aside Pattern

Most common caching pattern:

```text
Request
   ↓
Check Redis
   ↓
Hit?
 ┌───┴───┐
Yes      No
 ↓        ↓
Return   Database
          ↓
        Redis
          ↓
        Return
```

Pseudo-code:

```java
User user = redis.get(key);

if (user == null) {
    user = database.find(id);
    redis.set(key, user, ttl);
}

return user;
```

---

# 14. Why Cache-Aside Is Popular

Benefits:

```text
Application controls what gets cached
Database remains source of truth
Easy to introduce incrementally
Works well with read-heavy workloads
```

But:

```text
Cache misses
stale data
cache stampede
invalidation
cold cache
```

must be handled.

---

# 15. Cache Invalidation

Classic problem:

```text
Database
   ↓ update
Database = new value

Redis
   ↓
old value
```

Possible strategies:

```text
TTL
explicit eviction
write-through
write-behind
event-driven invalidation
versioned keys
```

Classic interview statement:

> Cache invalidation is one of the hardest parts of caching because correctness depends on keeping cached state consistent enough with the source of truth.

---

# 16. Cache-Aside Write Strategy

One common approach:

```text
Update DB
   ↓
Delete Redis key
```

Why delete instead of blindly writing cache first?

Because the database remains the source of truth.

But even this has race conditions.

Example:

```text
T1 reads old DB value
T2 updates DB
T2 deletes cache
T1 writes old value into cache
```

This is why cache consistency requires careful design.

---

# 17. Write-Through Cache

```text
Application
   ↓
Cache
   ↓
Database
```

Application writes to cache and cache synchronously updates the database.

Benefits:

```text
cache stays populated
```

Trade-off:

```text
more write latency
more coupling
```

---

# 18. Write-Behind Cache

```text
Application
   ↓
Cache
   ↓
asynchronous write
   ↓
Database
```

Potentially lower write latency.

But failure handling becomes more complex.

Risk:

```text
cache updated
database write not completed
system crashes
```

---

# 19. Cache Stampede

Suppose a popular key expires:

```text
1000 requests
     ↓
same cache miss
     ↓
1000 DB queries
```

This can overload the database.

Solutions:

```text
request coalescing
distributed lock
early refresh
randomized TTL
stale-while-revalidate
prewarming
```

---

# 20. Cache Penetration

Requests repeatedly ask for data that does not exist.

```text
Request ID=999999
 ↓
Redis miss
 ↓
DB miss
 ↓
No cache entry
```

Attack/request pattern repeats.

Solutions:

```text
negative caching
Bloom filter
input validation
rate limiting
```

---

# 21. Cache Avalanche

Large numbers of cache entries expire around the same time.

```text
Redis
 ↓
many keys expire
 ↓
massive DB traffic
```

Mitigation:

```text
TTL jitter
staggered expiration
prewarming
load protection
```

---

# 22. Redis Eviction

When Redis reaches its configured memory limit, an eviction policy may determine what gets removed.

Common policies include:

```text
noeviction
allkeys-lru
volatile-lru
allkeys-lfu
volatile-lfu
allkeys-random
volatile-random
volatile-ttl
```

Understand:

```text
LRU → least recently used
LFU → least frequently used
```

Important:

> Choosing an eviction policy is a workload decision.

---

# 23. Redis Persistence

Redis supports persistence mechanisms such as:

```text
RDB
AOF
```

### RDB

Periodic snapshots.

Advantages:

```text
compact
fast restart/load
good backup characteristics
```

Trade-off:

```text
recent writes may be lost depending on snapshot interval
```

### AOF

Records write operations.

Advantages:

```text
more frequent durability options
```

Trade-offs:

```text
larger logs
rewrite/maintenance overhead
```

---

# 24. RDB vs AOF

| RDB | AOF |
|---|---|
| Snapshot | Operation log |
| Compact | Usually larger |
| Fast restore | More write history |
| Possible larger loss window | Can offer stronger durability |
| Good backups | Good recovery characteristics |

Some systems use both.

---

# 25. Redis Replication

Typical:

```text
Primary
   ↓
Replica
```

Replication improves:

```text
read scaling
availability
failover capabilities
```

But replication is commonly asynchronous.

Therefore:

> A successful write on the primary does not automatically mean every replica has received it.

---

# 26. Redis Sentinel

Sentinel provides monitoring/failover coordination for Redis deployments.

Conceptually:

```text
Primary
  ↓
Replicas

Sentinels
  ↓
Monitor
  ↓
Detect failure
  ↓
Promote replica
```

Sentinel is different from Redis Cluster.

---

# 27. Redis Cluster

Redis Cluster distributes data across nodes.

Conceptually:

```text
Client
  ↓
Cluster
 ├── Node A
 ├── Node B
 ├── Node C
 └── replicas
```

Redis Cluster uses hash slots.

```text
16384 hash slots
```

Keys are mapped to slots.

---

# 28. Redis Cluster vs Sentinel

| Sentinel | Cluster |
|---|---|
| High availability/failover | Sharding + HA |
| Primarily one logical dataset | Dataset distributed |
| Replica promotion | Multiple shards |
| No data sharding by itself | Hash-slot partitioning |

---

# 29. Redis Hash Tags

Redis Cluster supports hash tags:

```text
user:{123}:profile
user:{123}:orders
```

The portion inside `{}` determines the hash slot.

Useful when multiple related keys need to be colocated.

This matters because multi-key operations generally require keys to belong to the same hash slot.

---

# 30. Redis Atomicity

Redis executes individual commands atomically from the perspective of other Redis commands.

For example:

```text
INCR counter
```

is atomic.

But:

```text
GET
application calculation
SET
```

is not automatically atomic as a sequence.

For multi-step atomic behavior, consider:

```text
MULTI / EXEC
Lua scripts
server-side functions
appropriate atomic commands
```

---

# 31. Redis Transactions

Redis transactions use:

```text
MULTI
EXEC
DISCARD
```

Example:

```text
MULTI
SET a 10
SET b 20
EXEC
```

Important:

> Redis transactions are not identical to relational database transactions.

Redis does not provide the same rollback model as a traditional SQL database.

---

# 32. Lua Scripts

Lua scripts can execute multiple Redis operations atomically from the perspective of other commands.

Useful for:

```text
rate limiting
atomic check-and-set
distributed coordination
multi-key logic
```

But avoid huge scripts because they can block Redis processing.

---

# 33. Distributed Lock with Redis

A common pattern:

```text
SET lock:key unique-value NX EX 30
```

Meaning conceptually:

```text
NX → only if key does not exist
EX → expiration
```

Important:

> A distributed lock is not simply "SET a key".

You must consider:

```text
ownership
expiration
safe release
client crashes
clock/time issues
lock renewal
network partitions
```

---

# 34. Safe Lock Release

Do not blindly:

```text
DEL lock:key
```

because another client might have acquired the lock after your lock expired.

Use an owner token and atomically verify ownership before deletion.

Conceptually:

```text
if value == myToken:
    delete
```

This is typically implemented atomically with a server-side script.

---

# 35. Redis Rate Limiting

Common approaches:

```text
fixed window
sliding window
token bucket
leaky bucket
```

Redis is useful because operations can be atomic and state can be shared across application instances.

Example:

```text
API request
   ↓
Redis counter
   ↓
limit exceeded?
 ├── yes → 429
 └── no  → continue
```

---

# 36. Redis and Sessions

Redis is commonly used as a shared session store:

```text
Client
 ↓
Application instance A
 ↓
Redis

or

Client
 ↓
Application instance B
 ↓
Redis
```

This allows horizontal scaling without requiring sticky sessions.

---

# 37. Redis Serialization

When storing Java objects, consider:

```text
JSON
binary serialization
String
Hash
```

Be careful with Java native serialization because of:

```text
security concerns
compatibility
versioning
coupling
```

Prefer an explicit, controlled serialization format for distributed systems.

---

# 38. Redis Key Design

Bad:

```text
user
```

Better:

```text
user:123
user:123:profile
user:123:orders
```

A key convention should make ownership and purpose obvious.

Think:

```text
domain:identifier:resource
```

---

# 39. Redis Big Keys

A "big key" can cause:

```text
high memory usage
slow operations
network overhead
replication impact
eviction problems
```

Avoid storing enormous blobs or giant collections without understanding access patterns.

---

# 40. Redis Hot Keys

A hot key receives enormous traffic.

Example:

```text
homepage:config
```

10 million requests may target the same key.

Potential solutions:

```text
local cache
key replication/sharding strategy
request coalescing
precomputation
CDN
```

---

# 41. Redis Failure Modes

Be prepared for:

```text
Redis unavailable
network partition
replica lag
memory exhaustion
eviction
hot keys
big keys
cache stampede
stale data
serialization incompatibility
slow commands
connection-pool exhaustion
```

A production application should define:

```text
cache failure behavior
timeouts
fallback
circuit breaking
```

Do not let Redis being unavailable automatically take down the entire application if Redis is only a cache.

---

# 42. Spring Data Redis

Spring Boot commonly integrates Redis using Spring Data Redis.

Common abstractions:

```text
RedisTemplate
StringRedisTemplate
Spring Cache
```

Example conceptual flow:

```text
@Service
 ↓
RedisTemplate
 ↓
Redis
```

For straightforward caching:

```java
@Cacheable("users")
public User getUser(Long id) {
    ...
}
```

---

# 43. Redis Interview Traps

### Trap 1

"Redis is always persistent."

False.

Redis can be configured for persistence, but it is fundamentally memory-oriented and durability depends on configuration.

### Trap 2

"Redis is a database replacement."

Not generally.

### Trap 3

"Pub/Sub guarantees delivery."

Traditional Pub/Sub does not provide durable replay.

### Trap 4

"All Redis commands are O(1)."

False.

### Trap 5

"DEL lock:key is a safe distributed lock release."

Not necessarily.

### Trap 6

"TTL solves cache consistency."

TTL reduces staleness duration but does not solve all consistency races.

---

# PART II — KAFKA

# 44. What is Apache Kafka?

Kafka is a distributed event streaming platform.

It is commonly used for:

```text
Event streaming
Messaging
Data pipelines
Log aggregation
Asynchronous processing
Event-driven architectures
Integration between services
```

Mental model:

```text
Producer
   ↓
Kafka Topic
   ↓
Partitions
   ↓
Consumer Groups
   ↓
Consumers
```

---

# 45. Why Kafka?

Kafka is designed for:

```text
high throughput
durable event storage
horizontal scalability
partitioned processing
replay
decoupling
```

Kafka is not simply a queue.

A Kafka topic behaves more like a distributed append-only log.

---

# 46. Kafka Core Components

Know:

```text
Broker
Topic
Partition
Producer
Consumer
Consumer Group
Offset
Replica
Leader
Follower
```

---

# 47. Kafka Broker

A broker is a Kafka server.

A Kafka cluster contains multiple brokers.

```text
Kafka Cluster
 ├── Broker 1
 ├── Broker 2
 └── Broker 3
```

Partitions are distributed across brokers.

---

# 48. Kafka Topic

A topic is a logical stream/category of events.

Example:

```text
payment-events
order-events
user-events
```

A topic contains partitions.

```text
payment-events
 ├── partition 0
 ├── partition 1
 └── partition 2
```

---

# 49. Kafka Partition

A partition is an ordered append-only log.

```text
Partition 0:

offset 0 → event A
offset 1 → event B
offset 2 → event C
offset 3 → event D
```

Important:

> Kafka guarantees ordering within a partition, not globally across an entire topic.

---

# 50. Why Partitions?

Partitions provide:

```text
parallelism
scalability
distribution
ordering boundaries
```

Example:

```text
Topic
 ├── P0 → Consumer A
 ├── P1 → Consumer B
 └── P2 → Consumer C
```

---

# 51. Kafka Offset

Each record in a partition has an offset.

```text
P0
0
1
2
3
4
```

Offset identifies the position of a record within that partition.

Offsets are partition-specific.

---

# 52. Consumer

A consumer reads records from Kafka.

```text
Kafka
  ↓
Consumer
  ↓
Application logic
```

Consumers track their progress through offsets.

---

# 53. Consumer Group

A consumer group allows multiple consumers to divide partitions.

Example:

```text
Topic: 4 partitions

Consumer Group A
 ├── Consumer 1 → P0
 ├── Consumer 2 → P1
 ├── Consumer 3 → P2
 └── Consumer 4 → P3
```

Within one consumer group:

> A partition is assigned to at most one active consumer at a time.

---

# 54. More Consumers Than Partitions

Suppose:

```text
4 partitions
6 consumers
```

Only four consumers can actively consume partitions.

```text
C1 → P0
C2 → P1
C3 → P2
C4 → P3
C5 → idle
C6 → idle
```

Therefore:

> Maximum active parallelism for a consumer group is bounded by partition count.

---

# 55. Multiple Consumer Groups

Suppose:

```text
Topic
 ↓
Group A
Group B
Group C
```

Each group gets its own logical consumption position.

Therefore the same event can be independently processed by:

```text
Payment service
Analytics service
Notification service
```

This is one of Kafka's most important differences from a traditional work queue.

---

# 56. Kafka Ordering

Kafka guarantees ordering:

```text
within a partition
```

Not:

```text
across all partitions
```

If events for the same entity must remain ordered, use a stable key.

Example:

```text
key = orderId
```

Then events for the same order can be routed to the same partition.

---

# 57. Kafka Message Key

Example:

```java
producer.send(
    new ProducerRecord<>(
        "orders",
        orderId,
        orderEvent
    )
);
```

The key influences partition selection.

Common strategy:

```text
key = entity ID
```

This gives:

```text
same entity
   ↓
same partition
   ↓
preserved ordering for that entity
```

---

# 58. Kafka Producer

Producer sends records:

```text
Application
   ↓
Kafka Producer
   ↓
Broker
```

Important producer settings/concepts:

```text
acks
retries
batching
linger
compression
idempotence
delivery timeout
```

---

# 59. acks

Important settings conceptually:

```text
acks=0
acks=1
acks=all
```

### acks=0

Producer does not wait for broker acknowledgment.

Lower latency but weaker delivery guarantees.

### acks=1

Leader acknowledges.

### acks=all

Acknowledgment waits for required in-sync replicas according to replication configuration.

Stronger durability.

---

# 60. Kafka Replication

A partition can have multiple replicas.

```text
Partition P0
 ├── Leader
 ├── Follower
 └── Follower
```

Producer normally writes to the leader.

Followers replicate the data.

---

# 61. ISR — In-Sync Replicas

ISR means replicas considered sufficiently caught up with the leader according to Kafka's replication rules.

Example:

```text
Leader
Follower A
Follower B
```

If a follower falls too far behind, it may leave ISR.

This matters for durability and leader failover.

---

# 62. Replication Factor

Example:

```text
replication.factor = 3
```

means each partition has three replicas.

Higher replication improves resilience but costs:

```text
storage
network
replication overhead
```

---

# 63. Producer Batching

Kafka producers can batch records.

Conceptually:

```text
event
event
event
event
 ↓
batch
 ↓
broker
```

Benefits:

```text
higher throughput
fewer network requests
better compression
```

Trade-off:

```text
potentially increased latency
```

---

# 64. Kafka Compression

Common compression codecs:

```text
gzip
snappy
lz4
zstd
```

Compression can reduce:

```text
network bandwidth
disk usage
```

but uses CPU.

---

# 65. Kafka Consumer Poll Model

Consumers typically poll Kafka for records.

Conceptually:

```text
consumer.poll()
      ↓
records
      ↓
application processing
      ↓
commit offset
```

Important:

> Consumer liveness and processing time are connected to polling behavior and consumer configuration.

---

# 66. Kafka Offset Commit

Offsets indicate processed position.

Common approaches:

```text
automatic commit
manual commit
manual immediate commit
```

For critical processing, understand exactly when the offset is committed relative to business processing.

---

# 67. At-Most-Once

Conceptually:

```text
commit offset
   ↓
process message
```

If processing fails after the commit:

```text
message may be lost
```

Guarantee:

```text
at-most-once
```

---

# 68. At-Least-Once

Conceptually:

```text
process message
   ↓
commit offset
```

If the application crashes after processing but before committing:

```text
message processed again
```

Therefore duplicates are possible.

Kafka applications commonly use at-least-once processing plus idempotent business logic.

---

# 69. Exactly-Once

Exactly-once semantics are more nuanced than:

> "Kafka never processes a message twice."

Kafka supports transactional/idempotent mechanisms for specific processing patterns.

You must distinguish:

```text
Kafka's transactional guarantees
vs
external side effects
```

If a consumer:

```text
reads Kafka
 ↓
charges external payment API
 ↓
commits Kafka transaction
```

Kafka cannot automatically roll back the external payment.

---

# 70. Idempotent Consumer

Suppose:

```text
event ID = 123
```

Consumer receives it twice.

Store processed IDs:

```text
event:123 → processed
```

or use a database uniqueness constraint.

Then:

```text
duplicate event
 ↓
detect
 ↓
skip duplicate side effect
```

---

# 71. Consumer Rebalancing

When group membership changes:

```text
consumer joins
consumer leaves
consumer crashes
partition count changes
```

Kafka may rebalance partitions.

Example:

```text
Before:
C1 → P0,P1
C2 → P2,P3

After C2 leaves:
C1 → P0,P1,P2,P3
```

Rebalancing can temporarily affect throughput and processing.

---

# 72. Consumer Group Coordinator

Kafka coordinates consumer groups so partitions can be assigned to consumers.

Know conceptually:

```text
group membership
heartbeats
partition assignment
rebalance
offset management
```

---

# 73. Consumer Lag

Consumer lag indicates how far behind a consumer/group is from the latest available records.

Conceptually:

```text
Latest offset = 1000
Consumer offset = 700

Lag ≈ 300
```

High lag may indicate:

```text
slow processing
traffic spike
too few partitions/consumers
downstream bottleneck
consumer failures
rebalancing
```

---

# 74. How to Reduce Kafka Consumer Lag

Possible approaches:

```text
increase consumer instances
increase partition count where appropriate
optimize processing
batch processing
parallelize work carefully
increase downstream capacity
reduce expensive DB calls
avoid unnecessary retries
```

Important:

> Adding consumers does nothing if there are not enough partitions to distribute.

---

# 75. Kafka Delivery Flow

Producer:

```text
Application
 ↓
Producer
 ↓
Partition leader
 ↓
Replication
```

Consumer:

```text
Partition
 ↓
Consumer
 ↓
Business processing
 ↓
Offset commit
```

---

# 76. Kafka vs Redis Pub/Sub

| Kafka | Redis Pub/Sub |
|---|---|
| Durable log | Ephemeral delivery |
| Replay | No normal replay |
| Consumer groups | Subscribers |
| Partitioning | Channels |
| High-scale event streaming | Lightweight real-time messaging |
| Persistent events | Messages can be missed while offline |

---

# 77. Kafka vs Redis Streams

| Kafka | Redis Streams |
|---|---|
| Distributed event log | Redis-based stream |
| Built for large event pipelines | Useful inside Redis ecosystem |
| Strong partition model | Stream/consumer groups |
| Large-scale retention | Memory/storage-oriented Redis deployment |
| Ecosystem for event streaming | Convenient when Redis already exists |

Choose based on architecture, scale, durability, operational requirements, and existing infrastructure.

---

# 78. Kafka vs RabbitMQ

Kafka:

```text
event log
replay
high throughput
partitioning
stream processing
```

RabbitMQ:

```text
message broker
routing
work queues
acknowledgment
complex routing patterns
```

The correct choice depends on the workload.

---

# 79. Kafka Retention

Kafka normally retains records based on configured policies rather than deleting them immediately after consumption.

Retention can be based on:

```text
time
size
```

This allows consumers to replay older events as long as they remain available.

---

# 80. Log Compaction

Compaction keeps the latest record for a key, subject to Kafka's compaction semantics.

Example:

```text
key=user123 value=ACTIVE
key=user123 value=SUSPENDED
key=user123 value=DELETED
```

Compaction can eventually retain the latest state representation for that key.

Useful for:

```text
latest state
configuration
CDC/state topics
```

---

# 81. Tombstone Records

In compacted topics, a null-value record for a key can act as a tombstone indicating deletion.

Conceptually:

```text
key=user123
value=null
```

This allows deletion information to propagate through a compacted log.

---

# 82. Kafka Partition Count

Choosing partitions is an architectural decision.

More partitions can provide:

```text
more parallelism
higher throughput
more consumer concurrency
```

But also:

```text
more metadata
more open resources
more operational overhead
more complicated rebalancing
```

Do not choose an enormous partition count without a scaling reason.

---

# 83. Can You Reduce Kafka Partitions?

Changing partition count downward is not a normal supported operation.

Therefore:

> Partition count should be chosen carefully because increasing partitions later is possible, but it can change key-to-partition distribution and therefore affect ordering behavior.

---

# 84. Kafka Schema Evolution

Events are APIs.

If producers and consumers evolve independently, schema compatibility matters.

Common technologies:

```text
Avro
Protobuf
JSON Schema
```

Schema registry systems can enforce compatibility policies.

Important compatibility concepts:

```text
backward
forward
full
```

---

# 85. Kafka Event Design

A good event should contain enough context for consumers.

Example:

```json
{
  "eventId": "evt-123",
  "eventType": "ORDER_CREATED",
  "version": 1,
  "occurredAt": "2026-08-17T10:00:00Z",
  "orderId": "order-123",
  "customerId": "customer-42"
}
```

Important fields:

```text
event ID
event type
schema/version
timestamp
entity identifier
relevant payload
```

---

# 86. Event vs Command

Event:

```text
OrderCreated
```

Means:

> Something happened.

Command:

```text
CreateOrder
```

Means:

> Please perform an action.

This distinction helps design event-driven systems.

---

# 87. Kafka Dead Letter Topic

If a message repeatedly fails:

```text
Consumer
 ↓
process
 ↓
failure
 ↓
retry
 ↓
failure
 ↓
DLT
```

DLT/DLQ can retain failed records for investigation or later reprocessing.

Important:

> A DLT is not a substitute for fixing the underlying failure.

---

# 88. Retry Strategies

Possible:

```text
immediate retry
fixed delay
exponential backoff
retry topic
dead letter topic
```

Be careful with:

```text
retry storms
poison messages
ordering
duplicate processing
```

---

# 89. Poison Message

A poison message consistently fails processing.

Bad pattern:

```text
message
 ↓
fail
 ↓
retry
 ↓
fail
 ↓
retry forever
```

This can block progress or consume resources.

Better:

```text
bounded retries
 ↓
DLT
 ↓
investigate
```

---

# 90. Kafka Transactions

Kafka supports transactions for certain producer/consumer workflows.

Conceptually:

```text
Consume input
   ↓
Process
   ↓
Produce output
   ↓
Commit transaction
```

Useful for Kafka-to-Kafka processing.

But remember:

```text
Kafka transaction
≠
global transaction across arbitrary external systems
```

---

# 91. Kafka Exactly-Once Processing Trap

Question:

> If Kafka supports exactly-once semantics, can I safely call an external payment API exactly once?

No.

Kafka can coordinate Kafka-side transactional operations, but an external API is outside that transaction.

For external side effects, consider:

```text
idempotency
outbox/inbox
deduplication
sagas
transactional state
```

---

# 92. Kafka Backpressure

Suppose:

```text
Kafka produces 100k events/sec
Consumer processes 20k/sec
```

Lag increases.

Possible strategies:

```text
increase partitions
increase consumers
batch processing
optimize consumer
buffer carefully
rate-limit producer
scale downstream systems
```

Do not solve every backpressure problem by simply adding memory.

---

# 93. Kafka Ordering vs Parallelism

Suppose an order needs:

```text
CREATED
PAID
SHIPPED
```

If all events use:

```text
key = orderId
```

they can go to the same partition.

Then:

```text
CREATED
  ↓
PAID
  ↓
SHIPPED
```

ordering is preserved for that order.

If you use random keys:

```text
CREATED → P0
PAID    → P1
SHIPPED → P2
```

global ordering for that order is no longer guaranteed.

---

# 94. Kafka Consumer Concurrency

In Spring Kafka, consumer concurrency can create multiple consumer instances/threads.

But:

```text
concurrency > partition count
```

does not create additional partition-level parallelism.

Think:

```text
parallelism ≤ available partitions
```

---

# 95. Spring Kafka

Spring Boot commonly integrates Kafka through Spring Kafka.

Typical concepts:

```text
KafkaTemplate
@KafkaListener
ConsumerFactory
ProducerFactory
ConcurrentKafkaListenerContainerFactory
```

Producer:

```java
kafkaTemplate.send(
    "orders",
    orderId,
    event
);
```

Consumer:

```java
@KafkaListener(
    topics = "orders",
    groupId = "payment-service"
)
public void consume(OrderEvent event) {
    ...
}
```

---

# 96. @KafkaListener

A listener receives Kafka records.

Important configuration areas:

```text
group ID
concurrency
ack mode
error handling
retry
deserialization
batch listeners
```

---

# 97. Spring Kafka Error Handling

Production consumers should define what happens when processing fails.

Possible:

```text
retry
backoff
dead-letter topic
skip
recover
```

A listener should not simply crash forever on one malformed message.

---

# 98. Kafka Serialization

Producer:

```text
Java object
 ↓
Serializer
 ↓
bytes
```

Consumer:

```text
bytes
 ↓
Deserializer
 ↓
Java object
```

Common:

```text
StringSerializer
JsonSerializer
Avro
Protobuf
```

Schema evolution must be considered.

---

# 99. Kafka Consumer Database Transaction

A common pattern:

```text
Kafka message
 ↓
DB transaction
 ├── update DB
 └── record processed event
 ↓
commit DB
 ↓
commit Kafka offset
```

If the DB commit succeeds but offset commit fails:

```text
message may be consumed again
```

Therefore the DB operation should be idempotent.

A uniqueness constraint on `event_id` can be an effective deduplication mechanism.

---

# 100. Inbox Pattern

The inbox pattern stores incoming event IDs before applying business effects.

```text
Kafka event
 ↓
Inbox table
 ↓
business transaction
 ↓
mark processed
```

Useful for:

```text
deduplication
at-least-once consumers
```

---

# 101. Outbox + Kafka

A common reliable architecture:

```text
Application
   ↓
DB transaction
 ├── business update
 └── outbox event
        ↓
Outbox publisher
        ↓
Kafka
        ↓
Consumer
        ↓
DB transaction
 ├── inbox/dedup
 └── business update
```

This creates a robust event-driven pipeline.

---

# 102. Kafka Consumer Failure

Suppose:

```text
Consumer reads message
 ↓
DB update
 ↓
Consumer crashes
 ↓
offset not committed
```

The message may be delivered again.

Therefore:

```text
at-least-once
+
idempotent processing
```

is a very common production design.

---

# 103. Kafka Consumer Rebalance Trap

Long processing can interfere with consumer group membership if the consumer does not poll within configured limits.

Potential symptoms:

```text
rebalances
duplicate processing
lag
partition ownership changes
```

Mitigations include:

```text
shorter processing batches
appropriate poll configuration
pause/resume strategies where appropriate
moving slow work to controlled executors
scaling consumers
```

Do not simply increase every timeout without understanding why processing is slow.

---

# 104. Kafka Large Messages

Large messages create:

```text
memory pressure
network overhead
serialization overhead
broker storage impact
consumer latency
```

Better:

```text
store large payload externally
put reference/metadata in Kafka
```

Example:

```json
{
  "documentId": "doc-123",
  "storageUri": "..."
}
```

Kafka should usually carry events, not giant binary objects.

---

# 105. Kafka Security

Important:

```text
TLS
authentication
authorization
ACLs
secret/key management
encryption in transit
```

Kafka security should be designed around:

```text
who can produce?
who can consume?
which topics?
which consumer groups?
```

---

# 106. Kafka Monitoring

Important metrics:

```text
consumer lag
records in/out
request latency
producer errors
consumer errors
under-replicated partitions
ISR changes
broker disk usage
network throughput
CPU
GC
request queue time
```

Consumer lag is important but not sufficient.

---

# 107. Under-Replicated Partitions

If a partition has fewer in-sync replicas than expected:

```text
replication health problem
```

Potential causes:

```text
broker failure
network problems
disk pressure
slow broker
resource saturation
```

This is a critical Kafka health signal.

---

# 108. Kafka Failure Modes

Be prepared for:

```text
broker failure
leader election
consumer crash
producer retries
duplicate delivery
consumer lag
rebalancing
poison messages
DLT growth
under-replicated partitions
disk exhaustion
network partition
schema incompatibility
hot partitions
```

---

# 109. Hot Partition

Suppose:

```text
99% of events
key = celebrityUser
```

All events may go to one partition.

Then:

```text
P0 → overloaded
P1 → low traffic
P2 → low traffic
```

Increasing total partition count does not automatically fix a hot key.

You may need:

```text
better key distribution
key salting where ordering allows
different partitioning strategy
local aggregation
```

But salting can destroy ordering for that entity.

---

# 110. Kafka Partitioning Strategy

Choose a key based on the business ordering requirement.

Examples:

```text
orderId → order ordering
customerId → customer ordering
accountId → account ordering
```

Question to ask:

> What entity must remain ordered?

That entity is often the partition key.

---

# 111. Redis + Kafka Together

They solve different problems.

Typical architecture:

```text
                  ┌──────────┐
                  │  Kafka   │
                  │ Event Log│
                  └────┬─────┘
                       │
                       ▼
                 Consumers
                       │
              ┌────────┴────────┐
              ▼                 ▼
           Database           Redis
        Source of truth       Cache
```

Kafka:

```text
events
durability
replay
decoupling
```

Redis:

```text
low-latency state
cache
counters
shared ephemeral state
```

---

# 112. Example: Order System

```text
Client
  ↓
Order Service
  ├── PostgreSQL
  ├── Redis
  └── Kafka
```

Create order:

```text
POST /orders
 ↓
DB transaction
 ├── create order
 └── outbox event
 ↓
Outbox publisher
 ↓
Kafka: OrderCreated
 ↓
 ├── Payment Service
 ├── Inventory Service
 └── Notification Service
```

Redis can store:

```text
order:123
inventory counters
rate limits
short-lived state
```

---

# 113. Example: Rate Limiting

```text
Request
 ↓
API Gateway
 ↓
Redis
 ↓
counter/token bucket
 ↓
Allowed?
 ├── no → 429
 └── yes
       ↓
      API
```

Kafka is not the natural choice for the per-request counter itself.

---

# 114. Example: Notification System

```text
Order Service
   ↓
Kafka
   ↓
Notification Service
   ↓
Redis / DB
   ↓
Email/SMS/Push providers
```

Kafka decouples notification processing from order creation.

Redis can be used for:

```text
deduplication
rate limits
provider state
short-lived delivery state
```

---

# 115. Redis vs Kafka Decision Framework

Ask:

### Do I need a cache?

```text
Redis
```

### Do I need an event log and replay?

```text
Kafka
```

### Do I need extremely low-latency shared state?

```text
Redis
```

### Do I need multiple independent consumers?

```text
Kafka
```

### Do messages need durable retention?

```text
Kafka
```

### Do I need a simple counter?

```text
Redis
```

### Do I need stream processing?

```text
Kafka
```

### Do I need a temporary distributed lock?

```text
Redis
```

---

# 116. Senior Interview Trap: Redis Is Not Automatically the Source of Truth

Bad architecture:

```text
DB
 ↓
Redis

Application assumes Redis is always correct
```

If Redis is being used as a cache:

```text
Database = source of truth
Redis = acceleration layer
```

Unless the architecture explicitly defines Redis as authoritative state.

---

# 117. Senior Interview Trap: Kafka Is Not a Database

Kafka stores events durably, but using Kafka as the primary transactional query database for arbitrary application queries is usually a poor design.

Kafka is excellent for:

```text
event history
stream processing
integration
replay
```

A database is generally better for:

```text
arbitrary queries
transactions
constraints
relational integrity
```

---

# 118. Senior Interview Trap: Kafka Does Not Guarantee Business Exactly-Once

Even if Kafka processing is exactly-once within Kafka's transactional model:

```text
Kafka
 ↓
external payment API
```

does not become exactly-once automatically.

External side effects require:

```text
idempotency
deduplication
transactional state
compensation
```

---

# 119. Senior Interview Trap: More Partitions Is Not Always Better

More partitions provide potential parallelism.

But also increase:

```text
metadata
resources
rebalancing cost
operational complexity
```

Choose based on expected throughput and consumer parallelism.

---

# 120. Senior Interview Trap: More Redis Memory Is Not a Scaling Strategy

If memory grows because of:

```text
big keys
missing TTL
unbounded collections
hot data
```

simply increasing RAM may hide the architectural problem.

Investigate:

```text
key sizes
TTL
eviction
access patterns
memory fragmentation
```

---

# 121. Senior Interview Scenario: Redis Goes Down

If Redis is only a cache:

```text
Redis unavailable
 ↓
fallback to DB
```

But:

```text
100k requests
 ↓
Redis unavailable
 ↓
100k DB requests
```

can cause a database meltdown.

Therefore use:

```text
timeouts
circuit breaker
request coalescing
local cache
rate limiting
load shedding
```

---

# 122. Senior Interview Scenario: Kafka Consumer Is Slow

Start with:

```text
Is consumer lag increasing?
```

Then investigate:

```text
processing latency
DB latency
external API latency
partition distribution
consumer count
partition count
rebalances
retry rate
GC
CPU
```

Do not automatically add consumers.

---

# 123. Senior Interview Scenario: Messages Are Duplicated

Possible reasons:

```text
consumer processed message
 ↓
crashed before offset commit
 ↓
message replayed
```

Solution:

```text
idempotent consumer
```

Possible implementation:

```text
eventId UNIQUE
```

in a database table.

---

# 124. Senior Interview Scenario: Messages Are Out of Order

Ask:

```text
Are events in the same partition?
```

If not:

```text
same entity
 ↓
different partitions
 ↓
no ordering guarantee
```

Use a stable partition key where ordering is required.

---

# 125. Senior Interview Scenario: One Kafka Consumer Group Is Slow

Remember:

```text
one consumer group
```

does not affect another consumer group directly in terms of partition ownership.

Example:

```text
Topic
 ├── Payment Group
 ├── Analytics Group
 └── Notification Group
```

Each group maintains its own consumption position.

---

# 126. Senior Interview Scenario: Redis Cache Has Stale Data

Ask:

```text
When is cache written?
When is cache invalidated?
What is TTL?
Can concurrent requests race?
Can stale values be written after invalidation?
Is DB the source of truth?
```

Possible solutions:

```text
explicit invalidation
versioning
short TTL
event-driven invalidation
locking/coalescing
```

---

# 127. Senior Interview Scenario: Need a Distributed Lock

Before Redis locking, ask:

```text
Can the operation be made idempotent?
Can a DB unique constraint solve it?
Can the workload be partitioned?
```

A distributed lock should not be the first tool for every concurrency problem.

---

# 128. Senior Interview Scenario: Redis and DB Must Stay Consistent

Possible architecture:

```text
DB
 ↓
Outbox/event
 ↓
Kafka
 ↓
Cache invalidation consumer
 ↓
Redis
```

This can decouple cache invalidation from the DB transaction.

But asynchronous invalidation means temporary staleness must be accepted.

---

# 129. Senior Interview Scenario: Kafka Event Is Published Before DB Commit

Bad:

```text
publish Kafka event
 ↓
DB transaction
 ↓
DB fails
```

Kafka contains an event describing something that never committed.

Prefer:

```text
DB transaction
 ├── business data
 └── outbox
       ↓
commit
       ↓
publisher
       ↓
Kafka
```

---

# 130. Senior Interview Scenario: Consumer DB Update Succeeds, Kafka Offset Commit Fails

Then:

```text
same message
 ↓
consumed again
```

Therefore:

```text
DB operation must be idempotent
```

Use:

```text
unique event ID
upsert
version check
inbox table
```

---

# 131. Redis Interview Questions — Basic to Advanced

1. What is Redis?
2. Why is Redis fast?
3. Redis vs database?
4. What Redis data types do you know?
5. String vs Hash?
6. When would you use Set?
7. When would you use Sorted Set?
8. What are Redis Streams?
9. Redis Pub/Sub?
10. Pub/Sub vs Streams?
11. What is TTL?
12. What is cache-aside?
13. Write-through vs write-behind?
14. What is cache invalidation?
15. What is cache stampede?
16. What is cache penetration?
17. What is cache avalanche?
18. What are Redis eviction policies?
19. LRU vs LFU?
20. What is RDB?
21. What is AOF?
22. RDB vs AOF?
23. What is Redis replication?
24. What is Sentinel?
25. Sentinel vs Cluster?
26. What are Redis hash slots?
27. What are hash tags?
28. Why can multi-key operations be problematic in Cluster?
29. Are Redis commands atomic?
30. What are MULTI/EXEC?
31. Does Redis support rollback like SQL?
32. What are Lua scripts used for?
33. How do you implement a Redis lock?
34. Why is `SET NX EX` useful?
35. Why should lock release verify ownership?
36. How do you implement distributed rate limiting?
37. Redis sessions?
38. Redis serialization?
39. How do you design Redis keys?
40. What is a big key?
41. What is a hot key?
42. How do you monitor Redis?
43. What happens when Redis memory is full?
44. What happens if Redis goes down?
45. How do you prevent Redis from becoming a single point of failure?
46. Redis Cluster vs database sharding?
47. How would you handle stale cache data?
48. How would you prevent cache stampede?
49. How would you design a distributed lock?
50. When should Redis NOT be used?

---

# 132. Kafka Interview Questions — Basic to Advanced

51. What is Kafka?
52. Kafka vs traditional message queue?
53. What is a broker?
54. What is a topic?
55. What is a partition?
56. Why do partitions exist?
57. What is an offset?
58. What is a producer?
59. What is a consumer?
60. What is a consumer group?
61. What happens when consumers exceed partitions?
62. Can multiple consumer groups consume the same topic?
63. What ordering guarantees does Kafka provide?
64. How does the message key affect partitioning?
65. What is a partition leader?
66. What are follower replicas?
67. What is replication factor?
68. What is ISR?
69. What does `acks=all` mean?
70. What is producer idempotence?
71. What is producer batching?
72. What is compression?
73. How does a consumer commit offsets?
74. Auto vs manual offset commits?
75. At-most-once vs at-least-once?
76. What is exactly-once semantics?
77. Why is exactly-once difficult with external APIs?
78. What is consumer lag?
79. How do you reduce lag?
80. What is consumer rebalancing?
81. What causes rebalancing?
82. What is a poison message?
83. What is a dead-letter topic?
84. How should retries work?
85. What is Kafka retention?
86. What is log compaction?
87. What is a tombstone record?
88. Why does partition count matter?
89. Can Kafka partition count be reduced?
90. What is a hot partition?
91. How do you design a partition key?
92. What is schema evolution?
93. Avro vs JSON vs Protobuf?
94. What is Schema Registry?
95. Event vs command?
96. What is Kafka Streams?
97. What are Kafka transactions?
98. What is the outbox pattern?
99. What is the inbox pattern?
100. How do you implement an idempotent Kafka consumer?
101. Kafka vs Redis Pub/Sub?
102. Kafka vs Redis Streams?
103. Kafka vs RabbitMQ?
104. How do you monitor Kafka?
105. What are under-replicated partitions?
106. What happens if a broker dies?
107. What happens if a consumer dies?
108. What happens if the producer retries?
109. How do you handle duplicate messages?
110. How do you guarantee per-order ordering?
111. How do you handle large Kafka messages?
112. How do you secure Kafka?
113. How do you design Kafka for high throughput?
114. How do you design Kafka for high availability?
115. When should Kafka NOT be used?

---

# 133. Combined Redis + Kafka Questions

116. Redis vs Kafka?
117. Why would you use both Redis and Kafka?
118. Redis cache + Kafka event invalidation?
119. Kafka event + Redis materialized view?
120. Redis for rate limiting and Kafka for audit events?
121. How would you prevent duplicate Kafka processing using Redis?
122. Redis vs Kafka for distributed locking?
123. Redis Pub/Sub vs Kafka?
124. Redis Streams vs Kafka?
125. How would you build a notification system with Kafka and Redis?
126. How would you build an order system with Kafka, Redis, and PostgreSQL?
127. How would you maintain cache consistency after Kafka events?
128. What if Redis is unavailable but Kafka is healthy?
129. What if Kafka is unavailable but Redis is healthy?
130. How would you handle DB → Kafka reliability?
131. How would you handle Kafka → DB reliability?
132. How would you implement idempotency using Redis?
133. Why might a database uniqueness constraint be safer than Redis-only deduplication?
134. How would you handle cache stampede in a Kafka-driven system?
135. How would you build a distributed rate limiter using Redis?
136. How would you build an event-driven cache invalidation system?
137. How would you handle ordering + caching?
138. How would you design a payment system using Kafka and Redis?
139. How would you design inventory reservation?
140. How would you prevent overselling inventory?

---

# 134. High-Value Follow-Up Chain — Redis

```text
What is Redis?
   ↓
Why is it fast?
   ↓
What data structures exist?
   ↓
Why String vs Hash?
   ↓
What is TTL?
   ↓
Cache-aside?
   ↓
Cache invalidation?
   ↓
Stampede?
   ↓
Eviction?
   ↓
Persistence?
   ↓
Replication?
   ↓
Cluster?
   ↓
Hot key?
   ↓
Distributed lock?
   ↓
Failure handling?
```

---

# 135. High-Value Follow-Up Chain — Kafka

```text
What is Kafka?
   ↓
Topic?
   ↓
Partition?
   ↓
Offset?
   ↓
Producer?
   ↓
Consumer?
   ↓
Consumer group?
   ↓
Ordering?
   ↓
Partition key?
   ↓
Replication?
   ↓
ISR?
   ↓
acks?
   ↓
Consumer lag?
   ↓
Rebalancing?
   ↓
At-least-once?
   ↓
Idempotency?
   ↓
Exactly-once?
   ↓
External side effects?
```

---

# 136. High-Value Follow-Up Chain — Event-Driven Architecture

```text
REST request
   ↓
Service
   ↓
Database transaction
   ↓
Outbox
   ↓
Kafka
   ↓
Consumer Group
   ↓
Consumer
   ↓
Idempotency / Inbox
   ↓
Database
   ↓
Redis cache
   ↓
API read
```

Be able to explain:

```text
What happens if DB commit fails?
What happens if Kafka publish fails?
What happens if consumer crashes?
What happens if offset commit fails?
What happens if Redis is unavailable?
What happens if the same event arrives twice?
What happens if events arrive out of order?
```

---

# 137. Redis + Kafka Architecture Example

```text
                         ┌──────────────┐
                         │   Client     │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ Spring Boot  │
                         │ API Service  │
                         └──────┬───────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
              Redis          Database        Outbox
              Cache          Source           Table
                 │              │              │
                 │              │              ▼
                 │              │           Publisher
                 │              │              │
                 │              │              ▼
                 │              │           Kafka
                 │              │              │
                 │              │       ┌──────┼──────┐
                 │              │       ▼      ▼      ▼
                 │              │    Payment Inventory Notification
                 │              │
                 └──────────────┴───────────────┘
```

---

# 138. Final Mental Model

## Redis

Think:

```text
FAST SHARED STATE
      │
      ├── Cache
      ├── TTL
      ├── Counter
      ├── Set
      ├── Sorted Set
      ├── Session
      ├── Rate Limiter
      ├── Lock
      └── Stream
```

## Kafka

Think:

```text
DURABLE EVENT LOG
       │
       ├── Topic
       │
       ├── Partition
       │
       ├── Offset
       │
       ├── Consumer Group
       │
       ├── Replication
       │
       ├── Ordering
       │
       ├── Replay
       │
       └── Event Processing
```

---

# 139. Golden Rules

### Redis

1. Redis is not automatically a database replacement.
2. Redis is not automatically persistent.
3. Not every command is O(1).
4. TTL does not solve every consistency problem.
5. Cache invalidation requires deliberate design.
6. Do not blindly use Redis locks.
7. Verify lock ownership before release.
8. Avoid huge keys.
9. Watch for hot keys.
10. Cache failure must have a defined fallback.
11. Use TTL for temporary data where appropriate.
12. Choose eviction policies based on workload.
13. Do not treat Pub/Sub as durable messaging.
14. Redis Streams are different from Pub/Sub.
15. Serialization is part of the distributed-system contract.

### Kafka

16. Kafka is an event log, not simply a queue.
17. Ordering is guaranteed within a partition.
18. Partition key determines ordering boundaries.
19. Consumer parallelism is bounded by partitions.
20. More partitions are not always better.
21. At-least-once processing means duplicates are possible.
22. Idempotency is essential for many consumers.
23. Exactly-once Kafka semantics do not make external APIs exactly-once.
24. Consumer lag is a critical metric.
25. Rebalancing affects processing.
26. Poison messages need bounded retry/DLT strategies.
27. Schema evolution must be designed.
28. Large messages are usually a smell.
29. Kafka retention enables replay.
30. Kafka should not automatically become the source of truth for arbitrary queries.
31. Outbox solves an important DB → Kafka reliability gap.
32. Inbox/deduplication helps Kafka → DB reliability.
33. Monitor under-replicated partitions.
34. Choose partition keys around business ordering requirements.
35. Treat Kafka events as public contracts between services.

---

# 140. Final Interview Framework

When asked:

> "What is Redis?"

Do not answer:

> "Redis is an in-memory cache."

Instead:

```text
Definition
 ↓
Why it is fast
 ↓
Data structures
 ↓
Persistence
 ↓
Replication
 ↓
Cluster
 ↓
Typical use cases
 ↓
Failure modes
 ↓
Trade-offs
```

When asked:

> "What is Kafka?"

Do not answer:

> "Kafka is a messaging system."

Instead:

```text
Distributed event log
 ↓
Topic
 ↓
Partitions
 ↓
Offsets
 ↓
Consumer groups
 ↓
Ordering
 ↓
Replication
 ↓
Retention
 ↓
Delivery semantics
 ↓
Idempotency
 ↓
Failure handling
```

That is the level expected in a strong Java/Spring Boot interview.

---

# 141. Final Self-Test

You are interview-ready on Redis when you can explain without notes:

```text
Redis
Data types
Strings
Hashes
Sets
Sorted Sets
Streams
Pub/Sub
TTL
Cache-aside
Write-through
Write-behind
Invalidation
Stampede
Penetration
Avalanche
Eviction
RDB
AOF
Replication
Sentinel
Cluster
Hash slots
Hash tags
Atomicity
MULTI/EXEC
Lua
Distributed locks
Rate limiting
Sessions
Serialization
Big keys
Hot keys
Failure handling
Spring Data Redis
```

You are interview-ready on Kafka when you can explain:

```text
Kafka
Broker
Topic
Partition
Offset
Producer
Consumer
Consumer Group
Partition key
Ordering
Replication
Leader
Follower
ISR
Replication factor
acks
Producer retries
Idempotent producer
Batching
Compression
Offset commits
At-most-once
At-least-once
Exactly-once
Consumer lag
Rebalancing
Retention
Compaction
Tombstones
Schema evolution
DLT
Retries
Poison messages
Transactions
Outbox
Inbox
Idempotent consumer
Hot partitions
Large messages
Security
Monitoring
Spring Kafka
```

And finally, you should be able to design:

```text
1. Distributed cache
2. Rate limiter
3. Distributed lock
4. Notification system
5. Order event pipeline
6. Payment event pipeline
7. Inventory reservation
8. Event-driven cache invalidation
9. Kafka-based audit system
10. Redis + Kafka + PostgreSQL architecture
```

---

# 142. The Most Important Mental Model

For a full-stack Java/Spring Boot developer, remember:

```text
                 USER REQUEST
                      │
                      ▼
                 REST API
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
            Redis          Database
             Cache         Source of Truth
              │               │
              │               │
              │            Transaction
              │               │
              │               ▼
              │             Outbox
              │               │
              │               ▼
              │             Kafka
              │               │
              │        ┌──────┼──────┐
              │        ▼      ▼      ▼
              │     Service Service Service
              │        │      │      │
              │        └──────┴──────┘
              │               │
              └───────────────┘
```

The core distinction:

```text
Redis
→ "What state do I need extremely quickly right now?"

Kafka
→ "What happened, and which services need to know about it?"
```

That distinction will help you answer a surprisingly large number of senior interview questions.


---


# MASTER SECTION — SQL + NoSQL


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


---


# MASTER SECTION — Microservices


title: Microservices — Interview Preparation
tags:
  - microservices
  - spring-boot
  - java
  - distributed-systems
  - kafka
  - redis
  - rest
  - resilience
  - api-gateway
  - observability
  - interview
---

# Microservices — Interview Preparation

> [!note]
> This note is designed for a Java/Spring Boot full-stack developer.
>
> You do not need to become a distributed-systems researcher.
>
> You do need to understand how services communicate, fail, scale, secure themselves, own data, and remain observable.
>
> Core mental model:
>
> **Service boundary → API → data ownership → communication → consistency → resilience → observability → deployment**

---

# PART I — FUNDAMENTALS

# 1. What Is a Microservice?

A microservice is a relatively small, independently deployable service organized around a business capability or bounded context.

Typical properties:

```text
independently deployable
business capability oriented
owns its logic
often owns its data
communicates through APIs/events
can scale independently
```

Important:

> "Small service" alone does not make a good microservice.

---

# 2. Monolith vs Microservices

Monolith:

```text
             Application
 ┌─────────────────────────────┐
 │ User │ Order │ Payment │ ...│
 └─────────────────────────────┘
          ↓
       Database
```

Microservices:

```text
User Service     → User DB
Order Service    → Order DB
Payment Service  → Payment DB
Inventory Service→ Inventory DB
```

Microservices introduce independence but also distributed-system complexity.

---

# 3. When Should You Use Microservices?

Good reasons:

```text
independent scaling
independent deployment
clear domain boundaries
large organization/team boundaries
different reliability requirements
different technology/runtime needs
```

Bad reason:

> "Everyone uses microservices."

---

# 4. Monolith Advantages

```text
simple deployment
simple debugging
local transactions
simple calls
easy refactoring
low operational overhead
```

For a small team/product, a modular monolith can be an excellent architecture.

---

# 5. Microservice Costs

```text
network calls
distributed failures
distributed tracing
eventual consistency
deployment complexity
service discovery
configuration
monitoring
security
cross-service transactions
data duplication
```

Senior answer:

> Microservices trade local simplicity for organizational and deployment scalability.

---

# 6. What Is a Service Boundary?

A service boundary should usually follow a business capability/bounded context rather than a technical layer.

Bad:

```text
UserController Service
UserRepository Service
PaymentRepository Service
```

Better:

```text
Order Service
Payment Service
Inventory Service
Notification Service
```

---

# 7. Bounded Context

A bounded context defines where a particular domain model and terminology apply.

For example:

```text
Order
```

may mean:

```text
Order Service → purchase lifecycle
Payment Service → payment transaction
Shipping Service → shipment
```

Do not force one giant universal domain model across services.

---

# 8. Database per Service

Preferred microservice principle:

```text
Order Service
 ↓
Order DB

Payment Service
 ↓
Payment DB
```

Benefits:

```text
ownership
independent scaling
schema independence
failure isolation
```

Costs:

```text
distributed queries
distributed transactions
data duplication
eventual consistency
```

---

# 9. Shared Database

```text
Order Service ─┐
Payment Service├──→ same DB
User Service ──┘
```

This can be practical during migration, but it creates:

```text
coupling
schema coordination
ownership ambiguity
```

It weakens independent service evolution.

---

# 10. API Gateway

Typical:

```text
Client
  ↓
API Gateway
  ↓
Services
```

Gateway responsibilities may include:

```text
routing
authentication
authorization
rate limiting
TLS termination
request aggregation
observability
```

Avoid putting large amounts of business logic into the gateway.

---

# 11. API Gateway vs Load Balancer

Load balancer primarily distributes traffic.

API Gateway can provide higher-level API concerns:

```text
routing
auth
rate limits
aggregation
transformation
```

They can coexist.

---

# 12. Service Discovery

Services need to find other services.

Options:

```text
DNS
service registry
Kubernetes Service
client-side discovery
server-side discovery
```

Kubernetes often provides service discovery through DNS and Services.

---

# 13. Synchronous Communication

Example:

```text
Order Service
    ↓ HTTP
Payment Service
```

Benefits:

```text
simple request/response
immediate result
easy to understand
```

Costs:

```text
latency
availability coupling
cascading failures
```

---

# 14. Asynchronous Communication

```text
Order Service
     ↓
   Kafka
     ↓
Payment Service
```

Benefits:

```text
decoupling
buffering
replay
independent processing
```

Costs:

```text
eventual consistency
debugging complexity
duplicate events
ordering
retry/DLT management
```

---

# 15. REST vs Messaging

REST:

```text
"I need an answer now."
```

Event:

```text
"Something happened."
```

Command:

```text
"Please perform this action."
```

This distinction helps determine communication style.

---

# 16. REST vs gRPC

REST:

```text
HTTP/JSON
widely accessible
browser-friendly
simple debugging
```

gRPC:

```text
HTTP/2
binary serialization
strong contracts
streaming
efficient service-to-service communication
```

For browser-facing APIs, REST is often simpler.

For internal high-performance service-to-service calls, gRPC can be attractive.

---

# PART II — DATA AND CONSISTENCY

# 17. Why Is Database per Service Important?

Because the service should own:

```text
schema
data lifecycle
business rules
```

Other services should ideally access it through:

```text
API
events
```

rather than direct SQL queries.

---

# 18. Distributed Transactions

Suppose:

```text
Order DB
+
Payment DB
```

must commit atomically.

A normal local DB transaction cannot cover both independently.

Options:

```text
2PC
Saga
outbox
compensation
```

---

# 19. Two-Phase Commit

2PC conceptually:

```text
Coordinator
 ↓
prepare
 ↓
all participants agree
 ↓
commit
```

Problem:

```text
coordination
blocking
latency
failure complexity
```

Many microservice architectures prefer eventual consistency and Saga-style workflows instead.

---

# 20. Saga Pattern

A Saga breaks a distributed transaction into local transactions.

Example:

```text
Create Order
 ↓
Reserve Inventory
 ↓
Charge Payment
 ↓
Confirm Order
```

If payment fails:

```text
release inventory
 ↓
cancel order
```

The reverse actions are compensating transactions.

---

# 21. Choreography Saga

Services react to events.

```text
OrderCreated
 ↓
InventoryReserved
 ↓
PaymentCompleted
 ↓
OrderConfirmed
```

Advantages:

```text
less central orchestration
loosely coupled
```

Disadvantages:

```text
event flow becomes hard to understand
business process can become scattered
```

---

# 22. Orchestration Saga

A central orchestrator coordinates:

```text
Order Saga
 ├── reserve inventory
 ├── charge payment
 ├── confirm order
 └── compensate failures
```

Advantages:

```text
central workflow visibility
easier business process reasoning
```

Disadvantages:

```text
orchestrator complexity
central coordination
```

---

# 23. Idempotency

An operation is idempotent when repeating it produces the same intended business outcome.

Example:

```text
POST /payments
Idempotency-Key: abc123
```

If request is retried:

```text
same key
 ↓
same payment result
```

Important for:

```text
retries
network failures
Kafka duplicate delivery
client retries
```

---

# 24. Idempotency Implementation

Possible:

```text
idempotency key
 ↓
database unique constraint
 ↓
stored result
```

Redis can accelerate lookup:

```text
Redis
 ↓
fast duplicate detection
```

But durable correctness often belongs in the database.

---

# 25. Outbox Pattern

Problem:

```text
DB update succeeds
Kafka publish fails
```

Outbox:

```text
DB transaction
 ├── business data
 └── outbox event
        ↓
      COMMIT
        ↓
Outbox Publisher
        ↓
      Kafka
```

This prevents the business update and event record from becoming inconsistent due to a simple dual-write failure.

---

# 26. Inbox Pattern

Consumer receives:

```text
eventId=123
```

Store it:

```text
inbox(eventId)
```

inside the same business transaction.

If event 123 arrives again:

```text
already processed
 ↓
skip
```

Useful for at-least-once delivery.

---

# 27. Eventual Consistency

Microservices often accept:

```text
Service A updated
 ↓
event published
 ↓
Service B eventually updates
```

For a short period:

```text
A = new
B = old
```

This is eventual consistency.

---

# 28. Strong Consistency vs Eventual Consistency

Use strong consistency where correctness requires it:

```text
ledger
inventory constraints
critical state transition
```

Eventual consistency can be acceptable for:

```text
notifications
analytics
search indexes
recommendation data
read models
```

---

# 29. Distributed Cache

Typical:

```text
Service
 ↓
Redis
```

Questions:

```text
What is source of truth?
How is invalidation handled?
What happens when Redis fails?
How stale can data be?
```

---

# PART III — RESILIENCE

# 30. Network Calls Are Not Method Calls

Java method:

```java
paymentService.charge();
```

is typically:

```text
in-process
```

Microservice call:

```text
HTTP POST /payments
```

can fail due to:

```text
network
DNS
timeout
service overload
connection pool
load balancer
serialization
deployment
```

Therefore:

> Treat remote calls as unreliable boundaries.

---

# 31. Timeout

Every remote call should have an appropriate timeout.

Without timeout:

```text
Service B hangs
 ↓
Service A thread waits
 ↓
many requests accumulate
 ↓
thread pool exhaustion
```

Timeouts are a fundamental resilience mechanism.

---

# 32. Retry

Retry transient failures:

```text
temporary network failure
503
connection reset
```

Do not blindly retry:

```text
validation error
authentication failure
business rejection
non-idempotent operation
```

---

# 33. Exponential Backoff

Instead of:

```text
retry immediately
retry immediately
retry immediately
```

use increasing delay:

```text
100ms
200ms
400ms
800ms
...
```

This reduces pressure on a struggling service.

---

# 34. Jitter

If 10,000 clients retry at exactly:

```text
1 second
```

they create another traffic spike.

Jitter randomizes retry timing.

```text
1.0s
1.2s
0.9s
1.4s
...
```

---

# 35. Circuit Breaker

Concept:

```text
CLOSED
 ↓ failures
OPEN
 ↓ timeout
HALF-OPEN
 ↓ test
CLOSED
```

When a dependency is failing repeatedly:

```text
stop sending traffic
```

This prevents cascading failures.

---

# 36. Bulkhead

Separate resources so one dependency cannot consume everything.

Example:

```text
Service
 ├── payment pool
 ├── notification pool
 └── reporting pool
```

If reporting becomes slow:

```text
reporting resources exhausted
```

Payment can continue.

---

# 37. Rate Limiting

Protect services from excessive traffic.

Common algorithms:

```text
fixed window
sliding window
token bucket
leaky bucket
```

Redis is often useful for distributed rate limiting.

---

# 38. Load Shedding

When overloaded, reject some work rather than allowing the entire system to collapse.

Example:

```text
system overloaded
 ↓
return 429/503
```

This protects remaining capacity.

---

# 39. Backpressure

Producer:

```text
100k events/sec
```

Consumer:

```text
20k/sec
```

Without control:

```text
queue/lag grows
```

Backpressure mechanisms:

```text
bounded queues
rate limiting
consumer scaling
batching
load shedding
```

---

# 40. Cascading Failure

Example:

```text
A → B → C → D
```

If D becomes slow:

```text
C waits
 ↓
B waits
 ↓
A waits
```

Soon the whole system can become unhealthy.

Mitigate with:

```text
timeouts
circuit breakers
bulkheads
bounded concurrency
fallbacks
```

---

# 41. Fallback

If recommendation service fails:

```text
Recommendation unavailable
 ↓
return popular products
```

Fallback should be:

```text
safe
useful
bounded
```

Do not hide serious correctness failures with fake fallback data.

---

# PART IV — API DESIGN

# 42. API Versioning

Strategies:

```text
/v1/orders
/v2/orders
```

or:

```text
header versioning
content negotiation
```

URL versioning is easy to understand, but the right strategy depends on organizational API policy.

---

# 43. Backward Compatibility

A new service version should ideally not break old clients.

Safer:

```text
add optional field
```

Risky:

```text
rename/remove field
change meaning
change type incompatibly
```

---

# 44. API Error Model

Use a consistent error format.

Example:

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "Order does not exist",
  "traceId": "abc123"
}
```

Avoid leaking:

```text
stack traces
database errors
internal secrets
```

---

# 45. API Gateway Aggregation

Client needs:

```text
user
orders
recommendations
```

Instead of three browser calls:

```text
Client
 ↓
Gateway
 ├── User
 ├── Orders
 └── Recommendations
 ↓
combined response
```

This can reduce client complexity and round trips.

Trade-off:

```text
gateway coupling
latency
failure handling
```

---

# 46. Pagination

For large collections:

```text
page + size
```

or preferably for deep pagination:

```text
cursor
```

Cursor pagination often scales better than huge OFFSET queries.

---

# 47. PUT vs PATCH

PUT commonly represents replacement of a resource representation.

PATCH represents partial modification.

Be precise about API semantics rather than saying:

> PUT is always idempotent and PATCH is never idempotent.

HTTP method semantics and implementation determine actual behavior.

---

# 48. API Idempotency

Important operations:

```text
payment
order creation
refund
inventory reservation
```

Use:

```text
Idempotency-Key
```

when clients may retry.

---

# PART V — SERVICE SECURITY

# 49. Authentication vs Authorization

Authentication:

```text
Who are you?
```

Authorization:

```text
What are you allowed to do?
```

---

# 50. Service-to-Service Authentication

Possible:

```text
OAuth2 client credentials
mTLS
signed tokens
service identity
```

Do not assume a private network means trusted traffic.

---

# 51. JWT

JWT can carry claims:

```text
sub
iss
aud
exp
scope
roles
```

Service should validate:

```text
signature
issuer
audience
expiry
```

Do not blindly trust decoded payloads.

---

# 52. Token Propagation

Example:

```text
Client
 ↓ token
Gateway
 ↓ token/context
Order Service
 ↓
Payment Service
```

Be careful about:

```text
audience
scope
token lifetime
least privilege
```

---

# 53. mTLS

Mutual TLS authenticates both sides of a connection.

Useful for:

```text
service identity
encrypted communication
zero-trust environments
```

---

# PART VI — OBSERVABILITY

# 54. Three Pillars

```text
Logs
Metrics
Traces
```

---

# 55. Correlation ID

Request:

```text
X-Request-ID: abc123
```

Propagate it:

```text
Gateway
 ↓ abc123
Order
 ↓ abc123
Payment
 ↓ abc123
Kafka event
```

Then logs can be correlated.

Distributed tracing is generally more powerful than a manually propagated correlation ID alone.

---

# 56. Distributed Tracing

Example:

```text
Trace
 └── Gateway 20ms
      └── Order 50ms
           ├── Redis 2ms
           ├── DB 15ms
           └── Payment 100ms
```

You immediately see:

```text
Payment
```

is the major contributor.

---

# 57. OpenTelemetry

OpenTelemetry provides standard instrumentation concepts for:

```text
traces
metrics
logs
```

It can export telemetry to compatible observability systems.

---

# 58. Metrics

Useful microservice metrics:

```text
request rate
error rate
latency
CPU
memory
DB connections
Kafka lag
Redis hit ratio
queue depth
circuit breaker state
```

---

# 59. SLI / SLO / SLA

SLI:

```text
measured indicator
```

SLO:

```text
target
```

SLA:

```text
contract/commitment
```

Example:

```text
SLI = successful request percentage

SLO = 99.9% success

SLA = contractual commitment
```

---

# PART VII — DEPLOYMENT

# 60. Containerization

Spring Boot:

```text
Docker image
 ↓
container
 ↓
Kubernetes
```

Benefits:

```text
consistent environment
packaging
deployment automation
```

---

# 61. Kubernetes Deployment

Conceptual:

```text
Deployment
 ↓
Pods
 ↓
Spring Boot containers
```

Kubernetes handles:

```text
replicas
rolling deployment
service discovery
health checks
```

---

# 62. Readiness vs Liveness

Readiness:

```text
Should this instance receive traffic?
```

Liveness:

```text
Is this process alive?
```

Do not use liveness to detect every temporary dependency failure.

Otherwise Kubernetes may continuously restart healthy applications.

---

# 63. Graceful Shutdown

During deployment:

```text
instance receives SIGTERM
 ↓
stop accepting new traffic
 ↓
finish in-flight requests
 ↓
close resources
 ↓
exit
```

Spring Boot supports graceful shutdown features.

This matters for:

```text
HTTP requests
Kafka consumers
DB transactions
```

---

# 64. Rolling Deployment

```text
old v1
old v1
old v1

 ↓

old v1
old v1
new v2

 ↓

old v1
new v2
new v2

 ↓

new v2
new v2
new v2
```

Requires backward-compatible APIs/schema during transition.

---

# 65. Blue-Green Deployment

```text
Blue → current
Green → new
```

Switch traffic:

```text
Blue
 ↓
Green
```

Rollback can be fast.

Cost:

```text
duplicate environment capacity
```

---

# 66. Canary Deployment

Send a small percentage of traffic to the new version.

```text
95% → v1
5%  → v2
```

Monitor:

```text
errors
latency
business metrics
```

Then gradually increase.

---

# PART VIII — MICROSERVICE DESIGN PATTERNS

# 67. API Gateway

```text
Client
 ↓
Gateway
 ↓
Services
```

---

# 68. Backend for Frontend (BFF)

Different clients can have tailored APIs:

```text
Web BFF
Mobile BFF
```

Useful when:

```text
client requirements differ significantly
```

---

# 69. Strangler Fig Pattern

Used to migrate a monolith incrementally.

```text
Monolith
 ↓
new service extracts one capability
 ↓
traffic routed to new service
 ↓
repeat
```

This is safer than rewriting everything at once.

---

# 70. Sidecar

A helper process/container runs beside the service.

Common historical/service-mesh uses:

```text
proxy
telemetry
security
network policy
```

---

# 71. Service Mesh

A service mesh can provide infrastructure-level:

```text
traffic management
mTLS
observability
retries
service identity
```

Examples include ecosystems built around Envoy.

But do not add a service mesh merely because the architecture is microservices.

---

# PART IX — MICROSERVICE FAILURE SCENARIOS

# 72. Service B Is Down

Bad:

```text
A → B
```

A waits indefinitely.

Better:

```text
A
 ↓ timeout
 ↓ retry if appropriate
 ↓ circuit breaker
 ↓ fallback
```

---

# 73. Service B Is Slow

This can be more dangerous than B being completely down.

Why?

Because requests accumulate.

```text
B slow
 ↓
A waits
 ↓
threads/connections consumed
 ↓
A becomes slow
 ↓
cascading failure
```

Use:

```text
timeout
bounded concurrency
bulkhead
circuit breaker
```

---

# 74. Service B Returns 500

Ask:

```text
Is failure transient?
Is operation idempotent?
Should we retry?
Should we fallback?
Should we fail fast?
```

Never blindly retry all 500 responses.

---

# 75. Kafka Is Down

If Kafka is asynchronous:

```text
API request
 ↓
DB
 ↓
outbox
 ↓
Kafka temporarily unavailable
```

The business transaction can still succeed if the event remains safely in the outbox.

Publisher retries later.

This is one reason the Outbox pattern is powerful.

---

# 76. Redis Is Down

If Redis is a cache:

```text
Redis unavailable
 ↓
fallback to DB
```

But protect the DB from a cache stampede.

Use:

```text
timeouts
circuit breaker
local cache
request coalescing
rate limiting
```

---

# 77. Database Is Down

Unlike a cache, the database may be the source of truth.

Possible:

```text
fail fast
retry carefully
queue asynchronous commands where appropriate
return degraded response
```

Do not pretend the system succeeded if the business transaction did not commit.

---

# 78. Duplicate Kafka Event

```text
eventId=123
 ↓
processed
 ↓
same event arrives
```

Use:

```text
idempotency
inbox
unique constraint
state/version checks
```

---

# 79. Out-of-Order Event

Suppose:

```text
OrderPaid
OrderCreated
```

arrive in wrong order.

Solutions:

```text
partition by orderId
sequence number
event version
state machine
ignore stale events
buffering
```

---

# 80. Distributed Clock Problem

Do not rely blindly on:

```text
server timestamp A
server timestamp B
```

for ordering distributed events.

Use:

```text
Kafka partition ordering
sequence numbers
database version
logical timestamps
event IDs
```

where appropriate.

---

# 81. Retry Storm

```text
dependency fails
 ↓
10k requests retry
 ↓
dependency becomes more overloaded
 ↓
more failures
 ↓
more retries
```

Mitigate:

```text
exponential backoff
jitter
retry budgets
circuit breakers
load shedding
```

---

# 82. Thundering Herd

A popular cache key expires:

```text
100k requests
 ↓
all miss cache
 ↓
100k DB calls
```

Solutions:

```text
request coalescing
jittered TTL
early refresh
distributed lock
stale-while-revalidate
```

---

# PART X — MICROSERVICE INTERVIEW QUESTIONS

# 83. Fundamentals

1. What is a microservice?
2. Microservice vs monolith?
3. When should you use microservices?
4. What are the disadvantages?
5. What is a bounded context?
6. How do you identify service boundaries?
7. What is database-per-service?
8. Why avoid shared databases?
9. What is an API Gateway?
10. API Gateway vs Load Balancer?
11. What is service discovery?
12. Client-side vs server-side discovery?
13. REST vs messaging?
14. REST vs gRPC?
15. Event vs command?
16. Synchronous vs asynchronous communication?
17. What is eventual consistency?
18. What is strong consistency?

---

# 84. Data / Transactions

19. Why is distributed transaction difficult?
20. What is 2PC?
21. What is Saga?
22. Choreography vs orchestration?
23. What is a compensating transaction?
24. What is idempotency?
25. How do you implement idempotency?
26. What is the Outbox pattern?
27. What is the Inbox pattern?
28. DB + Kafka dual-write problem?
29. How do you handle DB → Kafka reliability?
30. How do you handle Kafka → DB reliability?
31. How do you handle duplicate events?
32. How do you handle out-of-order events?
33. How do you handle stale read models?

---

# 85. Resilience

34. Why are remote calls different from method calls?
35. What is a timeout?
36. How should retries work?
37. When should you NOT retry?
38. What is exponential backoff?
39. What is jitter?
40. What is a circuit breaker?
41. What is bulkhead isolation?
42. What is rate limiting?
43. What is backpressure?
44. What is load shedding?
45. What is a cascading failure?
46. What is a retry storm?
47. What is a thundering herd?
48. What is graceful degradation?

---

# 86. API

49. How do you version APIs?
50. How do you maintain backward compatibility?
51. PUT vs PATCH?
52. How do you implement pagination?
53. Offset vs cursor pagination?
54. How do you design error responses?
55. How do you make POST idempotent?
56. What is API aggregation?
57. What is BFF?
58. How do you handle partial failure in API aggregation?

---

# 87. Security

59. Authentication vs authorization?
60. Service-to-service authentication?
61. OAuth2 client credentials?
62. JWT validation?
63. Token propagation?
64. mTLS?
65. How do you implement least privilege?
66. Should internal services trust each other automatically?

---

# 88. Observability

67. Logs vs metrics vs traces?
68. What is distributed tracing?
69. What is OpenTelemetry?
70. What is correlation ID?
71. What metrics would you monitor?
72. What is consumer lag?
73. What is an SLI?
74. What is an SLO?
75. What is an SLA?
76. How do you debug a slow request across 5 services?

---

# 89. Deployment

77. What is rolling deployment?
78. Blue-green vs canary?
79. What is graceful shutdown?
80. Readiness vs liveness?
81. What happens during Kubernetes pod termination?
82. How do you avoid breaking API compatibility during deployment?
83. How do you perform zero-downtime DB migration?
84. What is Strangler Fig?

---

# 90. Senior Scenario Questions

85. Design an order microservice architecture.
86. Design a payment microservice.
87. Design inventory reservation.
88. Design notification service.
89. Design a ride-booking backend.
90. Design a URL-shortening service.
91. Design a distributed rate limiter.
92. Design an event-driven order pipeline.
93. How would you migrate a monolith to microservices?
94. How would you split a large monolith?
95. How would you handle service B being unavailable?
96. How would you handle service B being slow?
97. How would you prevent cascading failure?
98. How would you guarantee no duplicate payment?
99. How would you guarantee DB + Kafka consistency?
100. How would you maintain cache consistency?
101. How would you handle Kafka duplicate events?
102. How would you handle out-of-order events?
103. How would you debug a production latency spike?
104. How would you handle a database outage?
105. How would you handle a Redis outage?
106. How would you handle Kafka outage?
107. How would you scale one extremely hot service?
108. How would you handle a hot database partition?
109. How would you deploy a breaking schema change safely?
110. How would you design multi-region microservices?

---

# PART XI — DEEP SCENARIOS

# 91. Order System

Requirements:

```text
create order
reserve inventory
charge payment
send notification
```

Possible architecture:

```text
                    Client
                      ↓
                 API Gateway
                      ↓
                 Order Service
                      ↓
                PostgreSQL
                      ↓
                    Outbox
                      ↓
                    Kafka
              ┌───────┼────────┐
              ↓       ↓        ↓
         Inventory  Payment  Notification
           Service   Service    Service
              ↓       ↓
             DB      DB
```

Redis:

```text
cache
rate limiting
idempotency acceleration
```

---

# 92. Order Failure

Payment fails:

```text
OrderCreated
 ↓
InventoryReserved
 ↓
PaymentFailed
 ↓
ReleaseInventory
 ↓
OrderCancelled
```

This is a Saga-style workflow.

---

# 93. Payment Idempotency

Client:

```text
POST /payments
Idempotency-Key: abc
```

Payment service:

```text
BEGIN
 ↓
check idempotency record
 ↓
create payment
 ↓
store result
 ↓
COMMIT
```

Retry:

```text
same key
 ↓
return stored result
```

---

# 94. Inventory Reservation

Use atomic database operation:

```sql
UPDATE inventory
SET available = available - 1
WHERE product_id = ?
  AND available > 0;
```

Then:

```text
affected rows = 1
→ success

affected rows = 0
→ unavailable
```

This can be preferable to a distributed lock.

---

# 95. Notification Service

```text
Kafka
 ↓
Notification Consumer
 ↓
Provider
```

Provider may fail.

Use:

```text
retry
backoff
DLT
idempotency
provider-specific rate limits
```

---

# 96. Multi-Region

Possible:

```text
Region A
 ├── services
 └── database

Region B
 ├── services
 └── database
```

Questions:

```text
active-active?
active-passive?
data replication?
conflict resolution?
latency?
data residency?
failover?
```

Multi-region is not automatically better; it dramatically increases complexity.

---

# 97. Service Ownership

Each service should have:

```text
clear owner
clear API contract
clear data ownership
clear SLO
clear operational responsibility
```

Microservices without ownership become distributed monoliths.

---

# 98. Distributed Monolith

A system can have many services and still behave like a monolith:

```text
A requires B
B requires C
C requires D
D requires A
```

Every deployment requires all services.

This is a distributed monolith.

Warning signs:

```text
tight synchronous coupling
shared database
shared release cycle
shared codebase/domain model
```

---

# 99. How to Avoid Distributed Monolith

Use:

```text
clear boundaries
asynchronous events where appropriate
independent data ownership
backward-compatible APIs
failure isolation
independent deployment
```

But don't force asynchronous messaging everywhere.

---

# 100. Microservices vs Modular Monolith

A modular monolith can provide:

```text
strong module boundaries
single deployment
local method calls
simple transactions
```

Microservices add:

```text
deployment independence
scaling independence
network boundaries
operational complexity
```

A well-designed modular monolith can be a better starting point.

---

# 101. Final Mental Model

```text
                    CLIENT
                       │
                       ▼
                 API GATEWAY
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
   ORDER SERVICE   PAYMENT SERVICE  USER SERVICE
       │               │                │
       ▼               ▼                ▼
   Order DB        Payment DB         User DB
       │
       ▼
    OUTBOX
       │
       ▼
     KAFKA
       │
 ┌─────┼──────────────┐
 ▼     ▼              ▼
Inventory Notification Analytics
Service   Service      Service
   │
   ▼
  Redis
```

Cross-cutting:

```text
Security
Observability
Resilience
Configuration
Service discovery
Deployment
```

---

# 102. The Golden Rules

1. Microservices are about boundaries and independent deployment, not small classes.
2. Split by business capability, not technical layer.
3. Prefer clear data ownership.
4. A shared database creates coupling.
5. Remote calls are unreliable.
6. Every remote call needs a timeout.
7. Retry only when failure is plausibly transient and the operation is safe to retry.
8. Use exponential backoff and jitter.
9. Circuit breakers prevent repeated calls to unhealthy dependencies.
10. Bulkheads prevent one dependency from exhausting shared resources.
11. Idempotency is essential when retries and duplicate delivery exist.
12. Database constraints provide durable correctness.
13. Outbox solves an important DB-to-event dual-write problem.
14. Inbox/deduplication helps with event-to-database reliability.
15. Eventual consistency must be explicitly accepted.
16. Sagas use local transactions plus compensation.
17. Kafka gives durable event streaming; it does not magically provide distributed transactions across arbitrary systems.
18. Redis is usually a cache/state layer, not automatically the source of truth.
19. API contracts must evolve backward-compatibly.
20. Observability is part of the architecture, not an afterthought.
21. Logs tell you what happened; metrics tell you how much; traces tell you where.
22. Readiness and liveness are different.
23. Graceful shutdown matters during rolling deployments.
24. More services do not automatically mean better architecture.
25. A distributed monolith is often worse than a modular monolith.
26. Do not introduce microservices before understanding the boundaries.
27. Prefer simple synchronous communication when the workflow requires an immediate answer and failure coupling is acceptable.
28. Prefer asynchronous communication when decoupling, buffering, and independent processing are valuable.
29. Multi-region architecture introduces substantial consistency and operational complexity.
30. The best microservice architecture is the simplest architecture that satisfies the business and scaling requirements.

---

# 103. Interview Answer Framework

When asked:

> "How would you design this microservice system?"

Answer in this order:

```text
1. Requirements
2. Service boundaries
3. APIs
4. Synchronous vs asynchronous communication
5. Database ownership
6. Cache
7. Kafka/events
8. Consistency
9. Idempotency
10. Failure handling
11. Scaling
12. Security
13. Observability
14. Deployment
15. Trade-offs
```

Do not jump directly to:

```text
Kafka + Redis + Kubernetes
```

Technology should follow requirements.

---

# 104. Final Self-Test

You should be able to explain without notes:

```text
Microservices
Monolith
Modular monolith
Service boundary
Bounded context
Database per service
API Gateway
Service discovery
REST
gRPC
Kafka
Synchronous communication
Asynchronous communication
Event
Command
Distributed transaction
2PC
Saga
Choreography
Orchestration
Compensation
Eventual consistency
Strong consistency
Idempotency
Outbox
Inbox
Timeout
Retry
Backoff
Jitter
Circuit breaker
Bulkhead
Rate limiting
Backpressure
Load shedding
Cascading failure
Retry storm
Thundering herd
API versioning
Backward compatibility
BFF
JWT
OAuth2
mTLS
Distributed tracing
OpenTelemetry
Correlation ID
SLI
SLO
SLA
Docker
Kubernetes
Readiness
Liveness
Graceful shutdown
Rolling deployment
Blue-green
Canary
Strangler Fig
Distributed monolith
Multi-region
```

And you should be able to design:

```text
Order system
Payment system
Inventory system
Notification system
Ride booking
Rate limiter
Event-driven pipeline
Monolith migration
Multi-region service
```

with explicit discussion of:

```text
data ownership
failure modes
consistency
idempotency
scaling
observability
security
trade-offs
```


---


# MASTER SECTION — Docker + Kubernetes + Maven + CI/CD


title: Docker + Kubernetes + Maven + CI/CD — Interview Preparation
tags:
  - docker
  - kubernetes
  - maven
  - cicd
  - devops
  - spring-boot
  - java
  - interview
---

# Docker + Kubernetes + Maven + CI/CD — Interview Preparation

> [!note]
> This note is designed for a Java/Spring Boot full-stack developer.
>
> You do NOT need to become a DevOps/SRE specialist for a typical full-stack interview.
> You should, however, be able to explain how a Spring Boot application is built, packaged, containerized, deployed, scaled, monitored, and safely released.
>
> Core mental model:
>
> **Code → Maven → Tests → Artifact → Docker Image → Registry → Kubernetes → Traffic → Observability → Rollout/Rollback**

---

# PART I — DOCKER

# 1. What Is Docker?

Docker packages an application and its runtime dependencies into a container image.

Conceptually:

```text
Application
+
Runtime
+
Dependencies
+
Configuration
        ↓
     Image
        ↓
   Container
```

A container is an isolated process environment sharing the host kernel.

---

# 2. Image vs Container

Image:

```text
immutable-ish package/template
```

Container:

```text
running instance of an image
```

One image can create many containers:

```text
             Spring Boot Image
              /      |      \
             ↓       ↓       ↓
          Pod/Container instances
```

---

# 3. Dockerfile

Example Spring Boot Dockerfile:

```dockerfile
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Flow:

```text
Dockerfile
   ↓
docker build
   ↓
Image
   ↓
docker run
   ↓
Container
```

---

# 4. CMD vs ENTRYPOINT

`ENTRYPOINT` defines the primary executable.

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
```

`CMD` provides default arguments/command that can be overridden more easily.

Example:

```dockerfile
CMD ["--server.port=8080"]
```

A common production pattern is:

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
```

with runtime configuration supplied through environment variables/arguments.

---

# 5. Why Use Multi-Stage Builds?

Without multi-stage:

```text
JDK
Maven
source code
dependencies
build tools
application
```

may all remain in the final image.

Multi-stage:

```text
Build image
 ├── JDK
 ├── Maven
 └── source
       ↓
     build
       ↓
Runtime image
 └── JRE/runtime
     + application
```

Benefits:

```text
smaller image
smaller attack surface
faster deployment
less unnecessary tooling
```

---

# 6. Multi-Stage Spring Boot Example

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
```

For production, use appropriate pinned/versioned images rather than casually relying on mutable tags.

---

# 7. Docker Layers

Docker images are built from layers.

```text
Layer 1 → base image
Layer 2 → dependencies
Layer 3 → application
```

Docker can reuse unchanged layers.

Therefore Dockerfile ordering matters.

Bad:

```dockerfile
COPY . .
RUN mvn package
```

Every source change can invalidate large portions of the build.

Better:

```dockerfile
COPY pom.xml .
download dependencies

COPY src ./src
build application
```

This can improve build caching.

---

# 8. .dockerignore

Use `.dockerignore` to prevent unnecessary files from entering the build context.

Example:

```text
.git
.idea
target
node_modules
*.log
.env
```

Never casually send secrets into the Docker build context.

---

# 9. Docker Image Tags

Example:

```text
orders:1.4.2
orders:2026-08-17
orders:git-sha
```

Avoid relying on:

```text
latest
```

for production deployment identity.

Immutable identifiers such as commit SHA or release version are safer.

---

# 10. Docker Registry

Typical flow:

```text
Developer
   ↓
docker build
   ↓
Image
   ↓
docker push
   ↓
Container Registry
```

Examples:

```text
Amazon ECR
Google Artifact Registry
Azure Container Registry
GitHub Container Registry
Docker Hub
```

---

# 11. Port Mapping

Container:

```text
8080
```

Host:

```text
8080
```

Example:

```bash
docker run -p 8080:8080 app
```

The mapping means:

```text
host:8080
    ↓
container:8080
```

---

# 12. Environment Variables

Do not bake environment-specific secrets into the image.

Instead:

```text
Image
 ↓
runtime environment
 ↓
configuration
```

Example:

```bash
docker run \
  -e DB_HOST=db \
  -e DB_USER=app \
  app
```

---

# 13. Secrets in Docker

Do NOT put:

```text
password
API key
private key
database credential
```

directly into:

```text
Dockerfile
Git repository
image layers
```

Use a proper secrets mechanism.

Kubernetes Secrets, cloud secret managers, and CI/CD secret stores are common approaches.

---

# 14. Docker Networking

Containers can communicate through Docker networks.

Conceptually:

```text
Spring container
      ↓
Docker network
      ↓
Redis container
```

Do not hard-code container IP addresses.

Use service/container DNS provided by the networking environment.

---

# 15. Container Is Not a VM

VM:

```text
Application
 ↓
Guest OS
 ↓
Hypervisor
 ↓
Host OS
```

Container:

```text
Application
 ↓
Container isolation
 ↓
Host kernel
```

Containers are generally lighter and faster to start.

---

# 16. Container Process Model

A container generally runs around a primary process.

For Spring Boot:

```text
PID 1
 ↓
java -jar app.jar
```

Signal handling and graceful shutdown therefore matter.

---

# 17. SIGTERM and Graceful Shutdown

Deployment system may send:

```text
SIGTERM
```

Application should:

```text
stop accepting new work
finish in-flight work
close resources
exit
```

Spring Boot supports graceful shutdown configuration.

---

# 18. Docker Healthcheck

Docker can define:

```dockerfile
HEALTHCHECK ...
```

But in Kubernetes, readiness/liveness/startup probes are generally the more important deployment-level mechanism.

---

# 19. Docker Resource Limits

Containers can be constrained by:

```text
CPU
memory
PIDs
```

If memory is exhausted, the process/container can be killed.

Important:

```text
JVM heap
≠
total container memory
```

The JVM also uses:

```text
metaspace
thread stacks
direct memory
native memory
JIT/code cache
```

---

# 20. Docker Security

Important practices:

```text
minimal base image
non-root user
patched dependencies
image scanning
read-only filesystem where appropriate
drop unnecessary Linux capabilities
do not embed secrets
pin trusted base images
```

---

# 21. Docker Interview Trap

Question:

> If the Docker image contains everything, why does the application still depend on environment configuration?

Because:

```text
application artifact
```

should be portable while:

```text
database
credentials
URLs
feature flags
environment-specific behavior
```

vary by environment.

---

# PART II — MAVEN

# 22. What Is Maven?

Maven is a build and dependency-management tool commonly used in Java projects.

It handles:

```text
dependency management
compilation
testing
packaging
plugins
repositories
build lifecycle
```

---

# 23. pom.xml

Typical:

```xml
<project>
    <groupId>com.example</groupId>
    <artifactId>orders</artifactId>
    <version>1.0.0</version>

    <dependencies>
        ...
    </dependencies>

    <build>
        <plugins>
            ...
        </plugins>
    </build>
</project>
```

---

# 24. Maven Coordinates

A Maven artifact is commonly identified by:

```text
groupId
artifactId
version
```

Example:

```text
com.company
orders-service
1.4.2
```

Together they identify a dependency/artifact.

---

# 25. Maven Repositories

Common repositories:

```text
Local repository
      ↓
Remote repository
```

Local:

```text
~/.m2/repository
```

Remote:

```text
Maven Central
Nexus
Artifactory
cloud/private repositories
```

---

# 26. Maven Dependency

Example:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Maven resolves:

```text
direct dependency
 ↓
transitive dependencies
```

---

# 27. Transitive Dependencies

If:

```text
A → B
B → C
```

and your project depends on A:

```text
A
 ↓
B
 ↓
C
```

C can become a transitive dependency.

This is convenient but can cause version conflicts.

---

# 28. Dependency Scope

Important Maven scopes:

```text
compile
provided
runtime
test
```

High-level:

```text
compile → needed to compile and generally runtime
provided → provided by environment
runtime → needed at runtime, not compile
test → tests only
```

---

# 29. Maven Dependency Conflict

Suppose:

```text
A → X 1.0
B → X 2.0
```

Maven must choose a version.

Understand:

```text
dependency mediation
dependency tree
explicit dependency management
```

Use:

```bash
mvn dependency:tree
```

to investigate.

---

# 30. dependencyManagement

`dependencyManagement` controls versions for dependencies used by modules without necessarily adding those dependencies automatically.

This is particularly useful in multi-module projects.

Spring Boot's dependency management/BOM approach is heavily used here.

---

# 31. Maven BOM

BOM:

```text
Bill of Materials
```

defines a compatible set of dependency versions.

Spring Boot manages many dependency versions so developers don't need to specify every version independently.

---

# 32. Maven Lifecycle

Important lifecycle phases:

```text
validate
compile
test
package
verify
install
deploy
```

The exact phase invokes earlier required phases.

Example:

```bash
mvn package
```

runs the lifecycle through packaging.

---

# 33. mvn clean package

```bash
mvn clean package
```

`clean` removes previous build output.

`package`:

```text
compile
test
package
```

subject to lifecycle/plugin configuration.

---

# 34. mvn install

```bash
mvn install
```

builds the project and installs the artifact into the local Maven repository.

It is useful when another local project/module needs the artifact.

---

# 35. mvn deploy

```bash
mvn deploy
```

publishes the artifact to a configured remote repository.

Do not confuse:

```text
install → local repository
deploy  → remote repository
```

---

# 36. Maven Plugins

Maven itself relies heavily on plugins.

Examples:

```text
maven-compiler-plugin
maven-surefire-plugin
maven-failsafe-plugin
maven-jar-plugin
spring-boot-maven-plugin
```

Plugins perform much of the actual build work.

---

# 37. Surefire vs Failsafe

Common interview question:

```text
Surefire
→ unit tests during test phase

Failsafe
→ integration tests during integration-test/verify lifecycle
```

Typical naming:

```text
*Test
```

vs:

```text
*IT
```

depending on configuration.

---

# 38. Maven Profiles

Profiles allow environment/build-specific configuration.

Example:

```text
dev
test
prod
```

But avoid using Maven profiles as a substitute for runtime application configuration.

A common principle:

```text
Build artifact should remain environment-independent.
```

---

# 39. Maven Wrapper

Files:

```text
mvnw
mvnw.cmd
.mvn/
```

allow the project to use a defined Maven version without requiring developers to install the exact Maven version globally.

---

# 40. Maven Multi-Module Project

Example:

```text
parent
├── common
├── order-service
├── payment-service
└── notification-service
```

A parent POM can manage:

```text
versions
plugins
shared configuration
modules
```

---

# 41. Maven Interview Trap

Question:

> Does Maven download a dependency every time you run the build?

No.

Maven uses the local repository/cache when the required artifact is already available and resolution rules permit it.

---

# PART III — CI/CD

# 42. What Is CI?

Continuous Integration means frequently integrating changes into a shared codebase with automated validation.

Typical:

```text
git push
 ↓
build
 ↓
unit tests
 ↓
static analysis
 ↓
integration tests
```

Goal:

```text
find problems early
```

---

# 43. What Is CD?

CD can mean:

```text
Continuous Delivery
```

or:

```text
Continuous Deployment
```

Continuous Delivery:

```text
software is always in a deployable state
```

Continuous Deployment:

```text
validated changes automatically reach production
```

---

# 44. CI/CD Pipeline

Typical Spring Boot pipeline:

```text
Developer
   ↓
Git push
   ↓
CI
   ↓
Checkout
   ↓
Maven build
   ↓
Unit tests
   ↓
Integration tests
   ↓
Static analysis
   ↓
Security scan
   ↓
Package JAR
   ↓
Docker build
   ↓
Image scan
   ↓
Push image
   ↓
Deploy
   ↓
Health checks
   ↓
Monitor
```

---

# 45. Build Once, Deploy Many

Important principle:

```text
Build artifact once
        ↓
same artifact
        ↓
dev
        ↓
staging
        ↓
production
```

Do not rebuild different binaries for each environment.

Otherwise you lose confidence that the tested artifact is the deployed artifact.

---

# 46. Artifact vs Docker Image

Artifact:

```text
app.jar
```

Container image:

```text
runtime
+
app.jar
```

Pipeline can:

```text
Maven → JAR
JAR → Docker image
Image → registry
```

---

# 47. CI Pipeline Stages

Good pipeline structure:

```text
Fast checks
 ↓
Unit tests
 ↓
Build
 ↓
Integration tests
 ↓
Security/static analysis
 ↓
Package
 ↓
Image
 ↓
Deployment
```

Keep fast feedback early.

---

# 48. Unit Tests vs Integration Tests

Unit:

```text
fast
isolated
mock dependencies where appropriate
```

Integration:

```text
real components
database
Kafka
Redis
HTTP
```

For Java/Spring:

```text
JUnit
Mockito
Spring Boot Test
Testcontainers
```

are common.

---

# 49. Testcontainers in CI

Testcontainers can start real dependencies in containers:

```text
CI
 ↓
Testcontainers
 ├── PostgreSQL
 ├── Kafka
 └── Redis
```

This can make integration tests much more realistic than mocking infrastructure.

---

# 50. Static Analysis

Examples:

```text
SonarQube
Checkstyle
SpotBugs
PMD
```

Depending on the organization.

Detect:

```text
bugs
code smells
style violations
security issues
```

---

# 51. Dependency Security Scanning

Scan dependencies for known vulnerabilities.

Conceptually:

```text
pom.xml
 ↓
dependency graph
 ↓
CVE database
 ↓
report
```

Do not treat a scan as perfect security; it is one layer.

---

# 52. Container Image Scanning

After Docker build:

```text
image
 ↓
scanner
 ↓
OS/package/library vulnerabilities
```

Only trusted, scanned images should move toward production according to organizational policy.

---

# 53. Secrets in CI/CD

Never hard-code:

```text
AWS keys
database passwords
private keys
production tokens
```

into:

```text
pom.xml
Dockerfile
Git repository
pipeline YAML
```

Use the CI/CD platform's secret store or a dedicated secret manager.

---

# 54. Environment Variables in CI/CD

Typical:

```text
CI
 ↓
deploy
 ↓
environment-specific configuration
```

Application image stays the same.

Example:

```text
DB_HOST
DB_PORT
SPRING_PROFILES_ACTIVE
```

Secrets should be injected securely rather than exposed in logs.

---

# 55. Deployment Strategies

Important:

```text
Rolling
Blue-Green
Canary
```

---

# 56. Rolling Deployment

Replace instances gradually.

```text
v1 v1 v1
 ↓
v2 v1 v1
 ↓
v2 v2 v1
 ↓
v2 v2 v2
```

Benefits:

```text
no full outage
lower infrastructure cost
```

Risks:

```text
old/new versions coexist
compatibility required
```

---

# 57. Blue-Green

```text
Blue  → production
Green → new version
```

Validate Green, then switch traffic.

Benefits:

```text
fast rollback
clean environment separation
```

Cost:

```text
extra capacity
```

---

# 58. Canary

```text
95% → v1
5%  → v2
```

Monitor:

```text
errors
latency
business metrics
```

Then:

```text
5%
 ↓
20%
 ↓
50%
 ↓
100%
```

---

# 59. Feature Flags

Feature deployment and feature release can be separated.

```text
code deployed
 ↓
feature disabled
 ↓
enable for 1%
 ↓
10%
 ↓
100%
```

Benefits:

```text
controlled rollout
fast disable
experimentation
```

---

# 60. Rollback

If release is unhealthy:

```text
new version
 ↓
metrics degrade
 ↓
rollback
```

Good rollback requires:

```text
previous artifact/image
backward-compatible DB
automated deployment
```

---

# 61. Database Migration Problem

Suppose v2 needs:

```text
new_column
```

But old v1 instances still run.

Unsafe:

```text
remove old_column immediately
```

Better expand/contract:

```text
Phase 1
add new column

Phase 2
deploy code writing both

Phase 3
migrate/read from new

Phase 4
remove old column later
```

This is a major zero-downtime deployment concept.

---

# 62. CI/CD and Database Migrations

Common migration tools:

```text
Flyway
Liquibase
```

Pipeline:

```text
migration
 ↓
application compatibility
 ↓
deployment
```

Be careful with destructive migrations.

---

# 63. Kubernetes Deployment Pipeline

Typical:

```text
Git
 ↓
CI
 ↓
Maven
 ↓
Tests
 ↓
Docker
 ↓
Registry
 ↓
Kubernetes manifest/Helm
 ↓
Deployment
 ↓
Readiness
 ↓
Traffic
```

---

# 64. Helm

Helm is commonly used to package/manage Kubernetes application deployments.

It can template:

```text
Deployment
Service
ConfigMap
Ingress
HPA
```

Example conceptual:

```text
values-dev.yaml
values-prod.yaml
       ↓
Helm chart
       ↓
Kubernetes manifests
```

---

# 65. Kubernetes ConfigMap

Used for non-secret configuration.

Example:

```text
SPRING_PROFILES_ACTIVE=prod
LOG_LEVEL=INFO
```

Do not use ConfigMap as a secret store.

---

# 66. Kubernetes Secret

Used for sensitive configuration such as:

```text
password
token
credential
```

Important:

> Kubernetes Secret is not automatically equivalent to a fully secure external secrets manager. Understand encryption-at-rest, RBAC, access paths, and your cluster's configuration.

---

# 67. Kubernetes Deployment

A Deployment manages replicated Pods.

Conceptually:

```yaml
spec:
  replicas: 3
```

means Kubernetes attempts to maintain three replicas.

---

# 68. Pod

Pod is the basic deployable unit in Kubernetes.

Usually:

```text
1 application container
```

but can contain sidecars.

Pods are ephemeral.

Do not treat Pod IPs as permanent identities.

---

# 69. Service

Kubernetes Service provides stable networking to Pods.

```text
Client
 ↓
Service
 ↓
Pod
Pod
Pod
```

Pods can come and go while the Service remains the stable access point.

---

# 70. Ingress

Ingress provides HTTP/HTTPS routing into services.

Conceptually:

```text
Internet
 ↓
Ingress
 ├── /orders → order-service
 ├── /users  → user-service
 └── /pay    → payment-service
```

Modern Kubernetes environments may also use Gateway API depending on the platform.

---

# 71. Readiness Probe

Readiness asks:

```text
Can this Pod receive traffic?
```

If not ready:

```text
Pod remains running
but is removed from ready endpoints
```

---

# 72. Liveness Probe

Liveness asks:

```text
Is the application still alive?
```

If liveness repeatedly fails:

```text
Kubernetes may restart the container
```

Do not make liveness depend on every downstream system.

---

# 73. Startup Probe

Useful for slow-starting applications.

```text
container starts
 ↓
startup probe
 ↓
application initialization
 ↓
startup succeeds
 ↓
liveness/readiness become active
```

This prevents liveness from killing an application while it is still starting.

---

# 74. HPA

Horizontal Pod Autoscaler changes replica count based on metrics.

```text
load increases
 ↓
HPA
 ↓
3 pods → 6 pods
```

Scaling a service does not automatically solve:

```text
database bottleneck
Kafka partition limit
external API limit
connection pool bottleneck
```

---

# 75. Kubernetes Resource Requests and Limits

Requests:

```text
resource amount used for scheduling
```

Limits:

```text
maximum resource constraint
```

Example:

```yaml
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "1"
    memory: "1Gi"
```

Misconfigured resources can cause:

```text
CPU throttling
OOMKilled
poor scheduling
```

---

# 76. CI/CD + Kubernetes Failure Scenario

Deployment says:

```text
success
```

but users receive errors.

Investigate:

```text
Pod status
readiness
logs
events
Service endpoints
Ingress
image version
configuration
secrets
DB connectivity
dependency health
```

Never assume "deployment succeeded" means "application is healthy."

---

# PART IV — ADVANCED INTERVIEW SCENARIOS

# 77. Build Is Green but Production Fails

Possible reasons:

```text
environment configuration
missing secret
different database
network policy
dependency version
resource limits
startup timing
migration problem
```

CI validates only what the pipeline actually validates.

---

# 78. Docker Build Is Very Slow

Investigate:

```text
build context
Dockerfile layer ordering
dependency downloads
cache usage
large COPY
node_modules
target/
```

Use:

```text
.dockerignore
multi-stage builds
dependency caching
BuildKit
```

---

# 79. Image Is Huge

Possible causes:

```text
full JDK runtime
build tools
source code
package caches
logs
unnecessary OS packages
```

Solutions:

```text
multi-stage build
smaller runtime image
.dockerignore
remove build caches
minimal dependencies
```

---

# 80. Container Starts but Application Is Unreachable

Check:

```text
application listening port
container port
Service port
targetPort
Ingress
network policy
readiness
```

Common mistake:

```text
EXPOSE 8080
```

does not itself publish the port.

---

# 81. Kubernetes Pod Keeps Restarting

Check:

```text
kubectl describe pod
kubectl logs
previous logs
events
liveness probe
startup probe
OOMKilled
application exception
configuration
secret
```

Possible causes:

```text
crash
bad configuration
liveness failure
OOM
dependency startup
```

---

# 82. Pod Is Running but Receives No Traffic

Likely investigate:

```text
readiness probe
Service selector
Service endpoints
Ingress
labels
port/targetPort
```

"Running" does not mean "Ready."

---

# 83. Application Is OOMKilled

Investigate:

```text
container memory limit
JVM heap
metaspace
direct memory
thread count
native memory
allocation rate
heap dump
GC
```

Do not simply increase `-Xmx` until the container limit is exhausted.

---

# 84. CPU Is Throttled

Possible:

```text
CPU limit too low
CPU-heavy workload
GC
serialization
compression
bad algorithm
traffic spike
```

Check:

```text
CPU usage
throttling metrics
profiling
request rate
```

---

# 85. Deployment Causes Errors

Classic cause:

```text
v1 + v2
```

are running simultaneously.

If v2 changes an API/database schema incompatibly:

```text
v1 → breaks
```

Therefore design:

```text
backward-compatible APIs
expand/contract DB migrations
```

---

# 86. Pipeline Takes 30 Minutes

Optimize:

```text
parallel tests
dependency caching
Maven cache
Docker layer cache
test categorization
faster feedback stages
```

Do not blindly remove tests.

---

# 87. Tests Pass Locally but Fail in CI

Common causes:

```text
timezone
locale
environment variables
port collision
dependency versions
filesystem assumptions
race conditions
Docker availability
database state
```

Use reproducible environments.

---

# 88. Maven Build Works Locally but Not CI

Check:

```text
Java version
Maven version
Maven wrapper
environment variables
credentials
private repository
dependency cache
OS assumptions
```

Use Maven Wrapper where practical.

---

# 89. Dependency Works Locally but CI Downloads Different Version

Investigate:

```text
pom.xml
dependencyManagement
repository configuration
snapshot dependencies
local cache
```

Avoid mutable/reproducibility-sensitive dependency practices.

---

# 90. Security Scan Blocks Deployment

Process:

```text
identify vulnerability
 ↓
determine actual exploitability
 ↓
upgrade dependency/base image
 ↓
test compatibility
 ↓
rescan
```

Do not blindly suppress every vulnerability.

---

# 91. CI/CD Pipeline Security

Protect:

```text
source code
artifact repository
container registry
deployment credentials
secrets
production environment
```

Use:

```text
least privilege
short-lived credentials
secret managers
branch protections
approval gates
audit logs
```

---

# 92. Supply Chain Security

Modern software delivery should consider:

```text
dependency vulnerabilities
malicious packages
compromised base images
artifact tampering
CI credential theft
```

Useful concepts:

```text
SBOM
dependency scanning
image signing
provenance
trusted builders
```

---

# 93. SBOM

Software Bill of Materials describes components included in an artifact/image.

Useful for:

```text
vulnerability response
compliance
dependency visibility
supply-chain security
```

---

# 94. Artifact Promotion

A mature pipeline can promote the same artifact:

```text
Build once
 ↓
artifact/image
 ↓
Dev
 ↓
Test
 ↓
Staging
 ↓
Production
```

rather than rebuilding each time.

---

# 95. Immutable Infrastructure

Prefer replacing deployed artifacts/containers rather than manually modifying running instances.

Conceptually:

```text
old image
 ↓
new image
 ↓
new deployment
```

rather than:

```text
SSH into server
 ↓
manually modify
```

---

# 96. GitOps

In GitOps-style workflows:

```text
Git
 ↓
desired deployment state
 ↓
controller
 ↓
Kubernetes
```

The repository becomes an important source of truth for deployment configuration.

Tools may include:

```text
Argo CD
Flux
```

depending on the organization.

---

# 97. CI vs CD vs GitOps

CI:

```text
validate/build
```

CD:

```text
deliver/deploy
```

GitOps:

```text
deployment desired state represented in Git
and reconciled by automation
```

They can be used together.

---

# PART V — IMPORTANT INTERVIEW QUESTIONS

# 98. Docker Questions

1. What is Docker?
2. Image vs container?
3. Container vs VM?
4. What is a Dockerfile?
5. CMD vs ENTRYPOINT?
6. What is a Docker layer?
7. Why does Dockerfile ordering matter?
8. What is multi-stage build?
9. Why use .dockerignore?
10. Why avoid `latest` in production?
11. How do containers communicate?
12. How do you inject configuration?
13. How do you handle secrets?
14. What is a Docker registry?
15. What does `EXPOSE` actually do?
16. How does container networking work?
17. Why should containers avoid running as root?
18. Why can container memory exceed JVM heap?
19. How do you reduce image size?
20. How do you debug a container that exits immediately?

---

# 99. Maven Questions

21. What is Maven?
22. What is pom.xml?
23. What are Maven coordinates?
24. What is a transitive dependency?
25. What is dependency scope?
26. compile vs runtime vs test?
27. What is dependencyManagement?
28. What is a BOM?
29. What is Maven lifecycle?
30. `mvn package` vs `mvn install`?
31. `mvn install` vs `mvn deploy`?
32. What are Maven plugins?
33. Surefire vs Failsafe?
34. What is Maven Wrapper?
35. What is a Maven profile?
36. How do you inspect dependency conflicts?
37. What does `mvn dependency:tree` show?
38. How do you make builds reproducible?
39. What is a multi-module Maven project?
40. How does Spring Boot dependency management work?

---

# 100. CI/CD Questions

41. What is CI?
42. Continuous Delivery vs Continuous Deployment?
43. What does a typical Java CI pipeline look like?
44. Why build once and deploy many?
45. Artifact vs Docker image?
46. Unit vs integration testing?
47. Why use Testcontainers?
48. What is static analysis?
49. What is dependency scanning?
50. What is image scanning?
51. How do you handle secrets in CI?
52. What is rolling deployment?
53. Blue-green vs canary?
54. What is a feature flag?
55. How do you rollback?
56. How do you perform zero-downtime DB migrations?
57. What is expand-and-contract migration?
58. What is artifact promotion?
59. What is immutable infrastructure?
60. What is GitOps?

---

# 101. Kubernetes Questions

61. What is Kubernetes?
62. What is a Pod?
63. What is a Deployment?
64. What is a Service?
65. What is Ingress?
66. What is ConfigMap?
67. What is Secret?
68. What is HPA?
69. What are resource requests and limits?
70. Readiness vs liveness?
71. What is a startup probe?
72. What happens when a Pod is terminated?
73. How does Kubernetes perform rolling deployment?
74. How does Service discovery work?
75. What happens when a Pod crashes?
76. Why are Pod IPs not stable identities?
77. How do you debug CrashLoopBackOff?
78. How do you debug OOMKilled?
79. Why can a running Pod receive no traffic?
80. How do you scale a Spring Boot application in Kubernetes?

---

# 102. Senior Scenario Questions

81. Design a CI/CD pipeline for a Spring Boot service.
82. How would you deploy the same service to dev, staging, and production?
83. How would you ensure the artifact tested in staging is exactly the one in production?
84. How would you implement zero-downtime deployment?
85. How would you roll back a bad release?
86. How would you handle database schema changes during rolling deployment?
87. How would you debug a Pod that is running but not receiving traffic?
88. How would you debug CrashLoopBackOff?
89. How would you debug OOMKilled?
90. How would you debug high CPU?
91. How would you reduce a 2 GB Docker image?
92. How would you secure a CI/CD pipeline?
93. How would you handle a critical dependency CVE?
94. How would you design a canary release?
95. How would you prevent secrets from leaking into logs?
96. How would you make Maven builds reproducible?
97. How would you speed up a slow CI pipeline?
98. How would you handle a failed deployment halfway through?
99. How would you design Kubernetes autoscaling for a Spring Boot API?
100. How would you deploy a Kafka-consuming Spring Boot application safely?

---

# PART VI — PRACTICAL SPRING BOOT DEPLOYMENT

# 103. From Code to Production

Complete mental model:

```text
Developer
   │
   ▼
Git
   │
   ▼
CI Pipeline
   │
   ├── Maven compile
   ├── Unit tests
   ├── Integration tests
   ├── Static analysis
   └── Security scan
   │
   ▼
app.jar
   │
   ▼
Docker build
   │
   ▼
Container Image
   │
   ▼
Image Registry
   │
   ▼
Kubernetes
   │
   ├── Deployment
   ├── Pods
   ├── Service
   ├── ConfigMap
   ├── Secret
   ├── Ingress
   └── HPA
   │
   ▼
Users
```

---

# 104. Production Configuration

Keep:

```text
application code
```

separate from:

```text
environment configuration
```

Typical Spring Boot configuration:

```text
application.yml
environment variables
ConfigMap
Secret
external configuration system
```

---

# 105. Spring Boot Health

Kubernetes commonly needs:

```text
startup
readiness
liveness
```

Spring Boot Actuator can expose health information.

But health endpoints should be designed carefully.

For example:

```text
liveness
```

should generally indicate whether the application process is fundamentally alive, not whether every downstream dependency is available.

---

# 106. Kafka Consumer Deployment

Suppose:

```text
Kafka topic
 ↓
3 partitions
```

and:

```text
6 consumer instances
```

Only up to the partition count can have active consumers in a consumer group for that topic at one time.

Therefore:

```text
3 partitions
≈
maximum 3 active consumers for that partition set
```

Additional instances may remain idle for that topic/group.

---

# 107. Database Connection Pool + Kubernetes

Suppose:

```text
10 Pods
```

and each has:

```text
HikariCP maxPoolSize = 20
```

Potential maximum:

```text
10 × 20
=
200 DB connections
```

Scaling Pods can therefore overload the database.

This is a very important production interview scenario.

---

# 108. HPA + Database Bottleneck

Bad reasoning:

```text
CPU high
 ↓
increase replicas
```

But if the actual bottleneck is:

```text
database
```

then:

```text
more Pods
 ↓
more DB connections
 ↓
more DB load
 ↓
worse performance
```

Autoscaling must consider the true bottleneck.

---

# 109. Kubernetes + Redis

Multiple Pods:

```text
Pod A ─┐
Pod B ─┼──→ Redis
Pod C ─┘
```

Redis provides shared cache/state across replicas.

Local in-memory cache:

```text
Pod A → cache A
Pod B → cache B
```

can become inconsistent across instances.

---

# 110. Kubernetes + Kafka

Multiple replicas of the same consumer group:

```text
Pod A ─┐
Pod B ─┼──→ Kafka
Pod C ─┘
```

Partitions are distributed among consumers.

Scaling consumers is constrained by:

```text
partition count
```

and processing capacity.

---

# 111. Final Architecture

```text
                    ┌─────────────┐
                    │    Git      │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ CI Pipeline │
                    │ Maven       │
                    │ Tests       │
                    │ Scan        │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Docker      │
                    │ Image       │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Registry    │
                    └──────┬──────┘
                           │
                           ▼
                 ┌─────────────────────┐
                 │     Kubernetes      │
                 │                     │
                 │ Deployment          │
                 │  ├─ Pod             │
                 │  ├─ Pod             │
                 │  └─ Pod             │
                 │                     │
                 │ Service             │
                 │ Ingress             │
                 │ ConfigMap           │
                 │ Secret              │
                 │ HPA                 │
                 └──────────┬──────────┘
                            │
                            ▼
                         Users
```

Cross-cutting:

```text
Security
Observability
Secrets
Autoscaling
Resilience
Rollback
```

---

# 112. Golden Rules

1. An image is a package; a container is a running instance.
2. Containers are not lightweight VMs in the architectural sense; they share the host kernel.
3. Use multi-stage builds for smaller production images.
4. Dockerfile layer ordering affects build-cache efficiency.
5. `.dockerignore` prevents unnecessary build context.
6. Do not put secrets into Docker images.
7. Avoid mutable production tags such as `latest`.
8. `EXPOSE` does not publish a port by itself.
9. Maven manages dependencies and builds artifacts.
10. `install` means local repository; `deploy` means remote repository.
11. Understand transitive dependency conflicts.
12. Use Maven Wrapper for reproducible developer/CI tooling.
13. CI validates changes; CD delivers/deploys them.
14. Build once and promote the same artifact/image.
15. Do not rebuild separately for every environment.
16. Keep fast checks early in the pipeline.
17. Unit tests and integration tests solve different problems.
18. Testcontainers can make infrastructure integration tests realistic.
19. Never store production credentials in Git.
20. Rolling deployments require backward compatibility.
21. Blue-green deployments simplify rollback but require more capacity.
22. Canary deployments reduce blast radius.
23. Database migrations must be compatible with old and new application versions during rollout.
24. Expand-and-contract is a powerful zero-downtime migration strategy.
25. Kubernetes Pods are ephemeral.
26. Kubernetes Services provide stable networking to Pods.
27. Running is not the same as ready.
28. Readiness controls traffic; liveness controls restart decisions.
29. Startup probes protect slow-starting applications.
30. Resource limits must account for total process memory, not only JVM heap.
31. HPA cannot fix a database bottleneck.
32. More Pods can create more DB connections.
33. More Kafka consumers do not help beyond available partitions.
34. CI/CD success does not prove application health.
35. Production debugging requires logs, metrics, events, traces, and resource data.
36. Security belongs throughout the pipeline, not only at deployment.
37. Prefer least privilege for CI/CD credentials.
38. Immutable artifacts make releases safer.
39. GitOps represents desired deployment state declaratively.
40. The goal of CI/CD is fast, repeatable, observable, and reversible delivery.

---

# 113. Interview Answer Framework

When asked:

> "How would you deploy your Spring Boot application to production?"

Answer:

```text
1. Code is pushed to Git.
2. CI checks out the repository.
3. Maven compiles and runs tests.
4. Integration tests validate infrastructure behavior.
5. Static/security checks run.
6. Maven creates the JAR.
7. Docker creates an immutable image.
8. Image is scanned and pushed to a registry.
9. Kubernetes Deployment references that image.
10. ConfigMap/Secrets provide runtime configuration.
11. Readiness/startup/liveness probes protect traffic.
12. Service exposes Pods.
13. Ingress/API Gateway routes external traffic.
14. HPA can scale replicas.
15. Metrics/logs/traces monitor the rollout.
16. Canary/rolling/blue-green strategy controls blast radius.
17. Rollback uses the previous known-good image.
18. Database changes follow expand-and-contract compatibility rules.
```

Then discuss trade-offs.

That is a much stronger interview answer than:

> "We use Docker and Kubernetes."

---

# 114. Final Self-Test

You should be able to explain from memory:

```text
Docker
Image
Container
Dockerfile
Layers
Multi-stage builds
.dockerignore
Registry
Container networking
Secrets
Resource limits

Maven
pom.xml
Coordinates
Dependencies
Transitive dependencies
Scopes
BOM
dependencyManagement
Lifecycle
Plugins
Surefire
Failsafe
Wrapper
Profiles
Multi-module builds

CI/CD
CI
Continuous Delivery
Continuous Deployment
Build once
Artifact promotion
Testing
Security scanning
Image scanning
Secrets
Rolling
Blue-Green
Canary
Feature flags
Rollback
Database migration
Expand/Contract

Kubernetes
Pod
Deployment
Service
Ingress
ConfigMap
Secret
HPA
Requests
Limits
Readiness
Liveness
Startup
Graceful shutdown
Rolling updates
Service discovery
Helm

Production
JVM + container memory
DB connection pools
Kafka partitions
Redis
Autoscaling
Observability
Security
Supply chain
GitOps
```

If you can explain the above and connect it to:

```text
Spring Boot
SQL
Hibernate
Redis
Kafka
Microservices
```

you have the level of infrastructure knowledge expected from a strong full-stack engineer without needing to become a dedicated DevOps engineer.


---


# MASTER ADDENDUM — HIGH-VALUE GAPS AND CROSS-DOCUMENT TRAPS

This section consolidates the questions that are easy to miss when studying separate documents.

## Java traps worth knowing cold

### Static method hiding vs overriding

Static methods are resolved by the reference/class context rather than dynamically dispatched like instance methods. A child declaration with the same signature hides the parent's static method.

### Constructor modifiers

Constructors cannot be `static`, `abstract`, or `final` because constructors participate in object creation rather than inheritance-based overriding. A constructor can have access modifiers such as `private`, which is useful for factories, singletons and controlled construction.

### Abstract vs final

`abstract class` means the class is intended to participate in inheritance; `final class` forbids subclassing. Therefore `abstract final class X` is contradictory. The same reasoning explains why an `abstract final` method is invalid: an abstract method must be implemented, while a final method cannot be overridden.

### Covariant returns

An overriding method may return a subtype of the parent's return type:

```java
class Parent {
    Animal create() { return new Animal(); }
}

class Child extends Parent {
    @Override
    Dog create() { return new Dog(); }
}
```

The reverse is not legal because the child would weaken the parent's contract.

### `Arrays.asList()`

`Arrays.asList()` produces a fixed-size list backed by the array. `set()` is supported; `add()` and `remove()` are not. A primitive array passed to varargs is a classic trap because `int[]` is itself one reference argument rather than a sequence of `Integer` values.

### `remove(int)` vs `remove(Object)`

For `List<Integer>`, `remove(1)` means remove index 1. `remove(Integer.valueOf(1))` means remove the value 1.

### ConcurrentHashMap iteration

A regular `HashMap` iterator may detect structural modification and throw `ConcurrentModificationException`; a `ConcurrentHashMap` iterator is weakly consistent and can proceed while concurrent updates occur. Fail-fast behavior is diagnostic, not synchronization.

### ThreadLocal leak in pools

A pooled worker thread can process request A and later request B. If request A puts security/request/MDC state into a `ThreadLocal` and does not clear it, B can observe stale state. Use `try/finally` cleanup and framework-supported context propagation rather than assuming the worker thread is discarded after a request.

### Interrupt handling

Do not write:

```java
catch (InterruptedException e) {
}
```

unless there is an exceptionally deliberate reason. Usually propagate the interruption or restore the interrupt status:

```java
catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    // cleanup / return
}
```

### Executor factory trap

`Executors.newFixedThreadPool()` uses an unbounded queue by default. A fixed number of workers does **not** mean bounded memory: queued tasks can grow without bound. For production systems, an explicitly configured `ThreadPoolExecutor` is often preferable when queue size and rejection behavior must be controlled.

### Virtual threads and scarce resources

Virtual threads make blocking I/O concurrency cheap; they do not make databases, CPU cores or downstream APIs infinite. If 10,000 virtual threads compete for 50 DB connections, the DB pool is still the bottleneck. Bound concurrency where the scarce resource exists.

---

# Spring interview chains

## `@Transactional` chain

```text
HTTP request
   ↓
Controller
   ↓
Spring proxy
   ↓
Transaction interceptor
   ↓
Service method
   ↓
Repository / JDBC / Hibernate
   ↓
Flush
   ↓
Commit / rollback
```

Be ready for:

- Why self-invocation can bypass it.
- Why private methods are problematic for proxy-based interception.
- Why catching an exception can prevent rollback.
- Checked vs unchecked rollback rules.
- `REQUIRED` vs `REQUIRES_NEW`.
- Isolation vs propagation.
- What happens when another service is called inside the transaction.
- Why a database transaction does not cover Kafka or another microservice automatically.

## Security chain

```text
HTTP request
   ↓
Security filter chain
   ↓
Authentication
   ↓
SecurityContext
   ↓
Authorization
   ↓
Controller / method security
```

Be ready for:

- JWT signature validation vs decoding.
- 401 vs 403.
- CORS vs CSRF.
- Session vs bearer token.
- Roles vs authorities.
- Password hashing.
- Method-level authorization.
- SecurityContext and thread/context propagation.

## JPA chain

```text
Entity
   ↓
Persistence Context
   ↓
Managed state
   ↓
Dirty checking
   ↓
Flush
   ↓
SQL
   ↓
Database transaction
```

Be ready for:

- Lazy vs eager.
- N+1.
- Fetch join.
- Entity graph.
- First-level cache.
- Second-level cache.
- Detached entities.
- `@Version` optimistic locking.
- Cascade vs orphan removal.
- Owning side / `mappedBy`.
- Open Session in View.

---

# Distributed-system failure chains

## DB succeeds, Kafka fails

```text
Business DB update
      ↓
commit succeeds
      ↓
Kafka publish fails
      ↓
state changed but event missing
```

Use a transactional outbox where appropriate:

```text
DB transaction
 ├─ business state
 └─ outbox event
        ↓
commit
        ↓
outbox publisher
        ↓
Kafka
```

## Kafka succeeds, consumer crashes

The message can be delivered again. Consumers should be idempotent. A stable event ID plus a unique constraint or processed-event table is a common pattern.

## REST retry creates duplicates

Use an idempotency key with a durable uniqueness constraint and deterministic response handling.

## Downstream service is slow

Think in this order:

```text
timeout
→ bounded concurrency
→ retry only when safe
→ exponential backoff + jitter
→ circuit breaker
→ bulkhead
→ fallback / degraded behavior
→ metrics + tracing
```

## Kubernetes scaling overloads DB

```text
5 Pods × 20 DB connections = potentially 100 connections
10 Pods × 20 = potentially 200
```

Horizontal application scaling must therefore be designed together with database capacity and connection-pool sizing.

---

# Dynamic SQL/product attributes interview question

Suppose a phone catalog has five mandatory fields but arbitrary additional attributes that vary by phone model.

A strong answer is **not** 'ALTER TABLE every time a new attribute appears.' Keep stable, highly queried fields as typed relational columns and choose an extension model for dynamic attributes:

### JSON/JSONB

```text
phones
 ├─ id
 ├─ brand
 ├─ model
 ├─ price
 ├─ release_date
 └─ attributes JSON/JSONB
```

Good for sparse, evolving attributes. Index frequently queried JSON paths where the database supports it.

### EAV

```text
phone_attributes
 ├─ phone_id
 ├─ attribute_name
 └─ attribute_value
```

Very flexible but introduces type validation, query complexity and often multiple self-joins.

### Separate typed extension tables

Use when groups of attributes are stable and important enough to deserve strong relational constraints.

The interview answer should explicitly say the choice depends on **query patterns, typing, indexing, constraints and update frequency**.

---

# Senior interview answer framework

When asked a system question, use:

```text
1. Clarify requirements
2. State assumptions
3. Define API/data model
4. Explain happy path
5. Explain failure path
6. Discuss concurrency
7. Discuss consistency
8. Discuss scaling
9. Discuss caching/messaging
10. Discuss observability
11. Discuss security
12. Discuss trade-offs
```

When asked a Java/Spring question:

```text
Definition
   ↓
Mechanism
   ↓
Small example
   ↓
Common trap
   ↓
Version-specific caveat
   ↓
Production scenario
```

---

# Final readiness checklist

- [ ] Explain Java OOP without memorized definitions.
- [ ] Explain `equals()`/`hashCode()` and HashMap internals.
- [ ] Explain Collections selection from requirements.
- [ ] Explain generics and PECS.
- [ ] Explain exceptions and try-with-resources.
- [ ] Explain threads, JMM, `volatile`, synchronization and executors.
- [ ] Explain ThreadLocal and interrupt handling.
- [ ] Explain virtual threads and bounded concurrency.
- [ ] Explain modern Java records, sealed classes and pattern matching.
- [ ] Explain JVM memory, GC, JIT, JFR and production diagnostics.
- [ ] Explain Spring IoC, DI, lifecycle and scopes.
- [ ] Explain Boot auto-configuration instead of calling it magic.
- [ ] Explain MVC request flow.
- [ ] Explain REST semantics, validation, pagination and idempotency.
- [ ] Explain Spring Security request flow, JWT, CSRF, CORS and authorization.
- [ ] Explain JDBC vs JPA vs Hibernate.
- [ ] Explain persistence context and dirty checking.
- [ ] Explain lazy loading, N+1 and fetch strategies.
- [ ] Explain transactions, propagation, isolation and rollback.
- [ ] Explain optimistic locking and lost updates.
- [ ] Explain SQL indexes and execution plans.
- [ ] Explain Redis cache-aside, TTL and stampede.
- [ ] Explain Kafka partitions, offsets, consumer groups and ordering.
- [ ] Explain Kafka retries, DLT and idempotent consumers.
- [ ] Explain microservice boundaries and database ownership.
- [ ] Explain Saga and Outbox.
- [ ] Explain timeouts, retry/backoff, circuit breakers and bulkheads.
- [ ] Explain testing strategy and Testcontainers.
- [ ] Explain Maven lifecycle and dependency management.
- [ ] Explain Docker image/container and multi-stage builds.
- [ ] Explain Kubernetes Pod/Deployment/Service and probes.
- [ ] Explain CI/CD, rollout strategies and rollback.
- [ ] Explain zero-downtime database migrations.
- [ ] Explain logs, metrics, traces and production debugging.

# The real goal

You do **not** need to become a person who can recite every Java/Spring annotation.

You need to become the engineer who can hear:

> 'We have a Spring Boot API, PostgreSQL, Redis and Kafka. Traffic suddenly increased 10x and some orders are duplicated.'

and immediately reason:

```text
HTTP retries?
   ↓
Idempotency?
   ↓
DB unique constraint / transaction?
   ↓
Connection-pool saturation?
   ↓
Redis cache stampede?
   ↓
Kafka consumer lag?
   ↓
Duplicate delivery?
   ↓
Consumer idempotency?
   ↓
Kubernetes HPA?
   ↓
DB capacity?
   ↓
Metrics + traces + logs?
```

That is the level this superset is intended to prepare you for.
