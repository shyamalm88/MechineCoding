---
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
