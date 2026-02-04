/**
 * ============================================================================
 * PROBLEM: Polyfill for React's useEffect Hook
 * ============================================================================
 *
 * INTUITION:
 * `useEffect` runs a function when specific dependencies change.
 * It also handles "cleanup" (running a function before the next effect or unmount).
 *
 * ALGORITHM:
 * 1. Store `prevDeps` (dependencies from previous run).
 * 2. On every call, compare `currentDeps` vs `prevDeps`.
 * 3. If changed (or first run):
 *    - Run previous cleanup function (if exists).
 *    - Run the new effect.
 *    - Store the new cleanup function returned by the effect.
 *    - Update `prevDeps`.
 *
 * ============================================================================
 * DRY RUN
 * ============================================================================
 * 1. Render 1: deps=[0]. prev=undefined. Changed=True.
 *    - Run Effect. Save Cleanup1. prev=[0].
 * 2. Render 2: deps=[1]. prev=[0]. Changed=True.
 *    - Run Cleanup1. Run Effect. Save Cleanup2. prev=[1].
 * ============================================================================
 */
function createUseEffect() {
  let prevDeps;
  let cleanup;

  return function useEffect(effect, deps) {
    const hasNoDeps = !deps;
    const depsChanged = !prevDeps || deps.some((dep, i) => dep !== prevDeps[i]);

    if (hasNoDeps || depsChanged) {
      // run cleanup before next effect
      if (typeof cleanup === "function") {
        cleanup();
      }

      cleanup = effect();
      prevDeps = deps;
    }
  };
}

const useEffect = createUseEffect();

let count = 0;

useEffect(() => {
  console.log("Effect ran:", count);

  return () => {
    console.log("Cleanup for:", count);
  };
}, [count]);

count++;

useEffect(() => {
  console.log("Effect ran:", count);

  return () => {
    console.log("Cleanup for:", count);
  };
}, [count]);
