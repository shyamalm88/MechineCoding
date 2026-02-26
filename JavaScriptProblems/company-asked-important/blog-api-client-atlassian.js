/**
 * ============================================================================
 * PROBLEM: Production-Grade API Client (Atlassian Style)
 * ============================================================================
 * Implement a robust HTTP client for a Blog API that handles:
 * 1. Authentication (HttpOnly Cookies)
 * 2. Automatic Token Refresh (on 401)
 * 3. Retry Logic with Exponential Backoff
 * 4. Request Timeouts
 * 5. Centralized Error Handling
 * 6. Observability Hooks (Logging)
 *
 * ============================================================================
 * INTUITION: The "Middleware" Pipeline
 * ============================================================================
 * Instead of writing `fetch` calls everywhere, we build a pipeline:
 *
 *    Public Method (getBlog)
 *          ↓
 *    Retry Wrapper (Handles network flakes)
 *          ↓
 *    Auth Wrapper (Handles 401s & Refresh)
 *          ↓
 *    Raw Request (Handles fetch, timeout, parsing)
 *
 * Key Patterns:
 * - **Singleton Promise for Refresh**: If multiple requests fail with 401 simultaneously,
 *   we only want ONE refresh call to happen. We store the refresh promise and reuse it.
 * - **HttpOnly Cookies**: We don't store tokens in JS variables (XSS risk).
 *   We rely on the browser to send cookies automatically (`credentials: 'include'`).
 * ============================================================================
 */

/* ================================
   ERROR TYPES
   ================================ */

class ApiError extends Error {
  constructor({ message, status, code }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

class NetworkError extends ApiError {
  constructor(message = "Network error") {
    super({ message, status: null, code: "NETWORK_ERROR" });
  }
}

class TimeoutError extends ApiError {
  constructor() {
    super({ message: "Request timed out", status: null, code: "TIMEOUT" });
  }
}

/* ================================
   UTILS
   ================================ */

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/* ================================
   BLOG CLIENT
   ================================ */

class BlogClient {
  /**
   * Initializes the client configuration.
   * @param {Object} config
   * @param {string} config.apiKey - API Key for initial auth.
   * @param {string} config.baseUrl - Root URL for the API.
   * @param {number} [config.timeoutMs=5000] - Request timeout in ms.
   * @param {number} [config.maxRetries=2] - Max retries for 5xx/Network errors.
   * @param {number} [config.retryDelayMs=300] - Base delay for backoff.
   * @param {Object} [config.hooks] - Hooks for observability.
   */
  constructor({
    apiKey,
    baseUrl,
    timeoutMs = 5000,
    maxRetries = 2,
    retryDelayMs = 300,
    hooks = {},
  }) {
    if (!apiKey) throw new Error("apiKey is required");
    if (!baseUrl) throw new Error("baseUrl is required");

    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;

    // Prevent multiple refresh calls at once
    this.refreshPromise = null;

    // Observability hooks
    this.hooks = {
      onRequestStart: hooks.onRequestStart || (() => {}),
      onRequestEnd: hooks.onRequestEnd || (() => {}),
      onError: hooks.onError || (() => {}),
    };
  }

  /* ================================
     AUTH
     ================================ */

  /**
   * Initial authentication.
   * Sends API key, server responds with HttpOnly cookie.
   */
  async authenticate() {
    await this._rawRequest("/api/auth", {
      method: "POST",
      body: { apiKey: this.apiKey },
      skipRetry: true,
    });
  }

  /**
   * Refreshes the auth cookie.
   * Implements "inflight promise" pattern to prevent stampeding.
   */
  async refreshAuth() {
    // If a refresh is already in progress, return that promise
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        await this._rawRequest("/api/auth/refresh", {
          method: "POST",
          skipRetry: true,
        });
      } finally {
        // Reset so next 401 triggers a new refresh
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /* ================================
     PUBLIC API
     ================================ */

  async getLatestBlog() {
    return this.request("/api/blog/latest");
  }

  /* ================================
     REQUEST PIPELINE
     ================================ */

  /**
   * Main entry point for API requests.
   * Wraps execution with Retry logic -> Auth logic -> Raw Fetch.
   */
  async request(endpoint, options = {}) {
    return this._retryable(() => this._authorizedRequest(endpoint, options));
  }

  /**
   * Handles 401 Unauthorized errors by attempting a token refresh.
   */
  async _authorizedRequest(endpoint, options) {
    try {
      return await this._rawRequest(endpoint, options);
    } catch (err) {
      // If unauthorized, attempt ONE refresh
      if (err instanceof ApiError && err.status === 401) {
        // Wait for refresh to complete (or join existing refresh)
        await this.refreshAuth();
        // Retry the original request once
        return this._rawRequest(endpoint, options);
      }
      throw err;
    }
  }

  /**
   * Retries a function with exponential backoff if it fails with a retryable error.
   */
  async _retryable(fn, attempt = 0) {
    try {
      return await fn();
    } catch (err) {
      if (attempt < this.maxRetries && this._isRetryableError(err)) {
        // Exponential backoff: 300ms, 600ms, 1200ms...
        await sleep(this.retryDelayMs * 2 ** attempt);
        return this._retryable(fn, attempt + 1);
      }
      // Log final failure
      this.hooks.onError(err);
      throw err;
    }
  }

  /* ================================
     LOW-LEVEL FETCH
     ================================ */

  /**
   * Performs the actual fetch call with timeouts and error mapping.
   */
  async _rawRequest(
    endpoint,
    { method = "GET", body, skipRetry = false } = {},
  ) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    this.hooks.onRequestStart({ url, method });

    try {
      // Assumes simpleFetch is a wrapper around native fetch
      const res = await simpleFetch(url, {
        method,
        credentials: "include", // 🔑 HttpOnly cookies sent automatically
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (res.status < 200 || res.status >= 300) {
        throw await this._mapHttpError(res);
      }

      return await res.json();
    } catch (err) {
      if (err.name === "AbortError") {
        throw new TimeoutError();
      }
      if (err instanceof ApiError) throw err;
      throw new NetworkError(err.message);
    } finally {
      clearTimeout(timeout);
      this.hooks.onRequestEnd({ url, method });
    }
  }

  /* ================================
     ERROR HANDLING
     ================================ */

  async _mapHttpError(res) {
    switch (res.status) {
      case 400:
        return new ApiError({
          status: 400,
          code: "BAD_REQUEST",
          message: "Invalid request",
        });
      case 401:
        return new ApiError({
          status: 401,
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      case 403:
        return new ApiError({
          status: 403,
          code: "FORBIDDEN",
          message: "Access denied",
        });
      case 500:
        return new ApiError({
          status: 500,
          code: "SERVER_ERROR",
          message: "Server error",
        });
      default:
        return new ApiError({
          status: res.status,
          code: "UNKNOWN_ERROR",
          message: "Unexpected error",
        });
    }
  }

  _isRetryableError(err) {
    return (
      err instanceof NetworkError ||
      err instanceof TimeoutError ||
      (err instanceof ApiError && err.status >= 500)
    );
  }
}

/* ================================
   USAGE EXAMPLE
   ================================ */

// const client = new BlogClient({
//   apiKey: "4a8e3990b0e0559b77430f4ddb28a3cb",
//   baseUrl: "https://example.com",
//   hooks: {
//     onRequestStart: ({ url }) => console.log("→", url),
//     onRequestEnd: ({ url }) => console.log("✓", url),
//     onError: (err) => console.error("API ERROR:", err),
//   },
// });

// (async () => {
//   await client.authenticate(); // sets HttpOnly cookie
//   const blog = await client.getLatestBlog();
//   console.log(blog);
// })();
