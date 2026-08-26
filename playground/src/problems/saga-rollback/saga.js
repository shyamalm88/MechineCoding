/**
 * Saga / compensating-transaction workflow.
 *
 * There is no distributed ROLLBACK across services, so instead every step
 * declares how to UNDO itself. On failure, completed steps are compensated in
 * REVERSE order.
 */
export async function runSaga(steps, { onEvent = () => {} } = {}) {
  const completed = []

  for (const step of steps) {
    try {
      onEvent({ phase: 'run', name: step.name })
      const result = await step.execute()
      completed.push({ step, result })
    } catch (error) {
      onEvent({ phase: 'failed', name: step.name, error: error.message })

      // Compensate in reverse -- later steps may depend on earlier ones.
      for (const done of [...completed].reverse()) {
        if (!done.step.compensate) {
          onEvent({ phase: 'skip', name: done.step.name })
          continue
        }
        try {
          onEvent({ phase: 'compensate', name: done.step.name })
          await done.step.compensate(done.result)
        } catch (compError) {
          // A failed compensation cannot be retried forever -- record it and
          // keep unwinding, or one bad undo strands everything before it.
          onEvent({ phase: 'compensate-failed', name: done.step.name, error: compError.message })
        }
      }
      return { ok: false, error, compensated: completed.length }
    }
  }
  return { ok: true, results: completed.map((c) => c.result) }
}
