# Async rollback workflow (Saga pattern)

An order needs to reserve stock, charge a card, and create a shipment — across
three services. If step 3 fails, steps 1 and 2 have already committed.

**There is no distributed `ROLLBACK`.** A database transaction cannot span
services. The saga answer: every step declares how to **undo itself**, and on
failure you run those compensations in reverse.

```
reserve stock → charge card → create shipment ✗
     ↓ compensate          ↓ compensate
release stock  ←  refund card
```

## Why reverse order

Later steps may depend on earlier ones. Refunding the card before cancelling
the shipment it paid for can leave an inconsistent intermediate state — so
unwind in the exact opposite order to the forward run.

## Compensation is not rollback

This is the point interviewers listen for. A rollback makes it as if nothing
happened. A compensation is **a new forward action** that semantically negates
the old one:

- Rollback: the row was never inserted.
- Compensation: a **refund** exists alongside the charge. The customer sees both
  on their statement.

The intermediate state was genuinely visible to the outside world. That is the
price of no distributed transaction.

## Compensations must be idempotent

They will be retried, and they may run after a partial failure. "Refund order
123" must be safe to execute twice — usually via an idempotency key.

## When compensation itself fails

The hard case, and it must not be ignored. Options: retry with backoff, keep
unwinding and record the failure for manual reconciliation (what the code here
does), or push to a dead-letter queue. Aborting the unwind on the first failed
compensation strands everything before it.

## Orchestration vs choreography

- **Orchestration** — a coordinator drives the steps (this implementation).
  Easy to follow and debug; the coordinator is a single point of failure.
- **Choreography** — services emit events and react to each other. No central
  point, but the flow exists nowhere explicitly and is very hard to trace.

## Related

The **outbox pattern** for reliably emitting events with a DB write, and
two-phase commit — which does give atomicity but requires locking across
services, which is exactly why sagas exist.
