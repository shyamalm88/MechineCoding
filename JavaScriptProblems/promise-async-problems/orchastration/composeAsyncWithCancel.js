function composeAsyncWithCancel(...fns) {
  return async function (input, signal) {
    let result = input;

    for (const fn of fns) {
      if (signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      result = await fn(result, signal);
    }

    return result;
  };
}
