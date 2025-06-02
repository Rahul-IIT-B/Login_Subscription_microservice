// utils/retry.js

/**
 * Retry an async function up to `retries` times with `delay` ms between attempts.
 */
async function retry(fn, retries = 3, delay = 500) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.error(`DB write failed on attempt ${attempt}:`, err.message);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
  throw lastError;
}

module.exports = retry;
