async function retryWithCancel(fn, retries, signal) {
  for (let i = 0; i <= retries; i++) {
    if (signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    try {
      return await fn(signal);
    } catch (err) {
      if (i === retries) throw err;
    }
  }
}
