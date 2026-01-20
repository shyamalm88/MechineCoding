async function retryWithBackoff(fn, retries, baseDelay = 100) {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((res) => setTimeout(res, delay));
      attempt++;
    }
  }
}
