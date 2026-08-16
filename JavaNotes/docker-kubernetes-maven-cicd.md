---
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
