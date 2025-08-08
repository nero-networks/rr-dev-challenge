type CacheEntry<T> = {
  since: number;
  batches: T[];
};
const cache: Record<string, CacheEntry<unknown>> = {};

/**
 * calculates the number of required batches and calls the retreiver function for every missing batch.
 * the result is cached for one minute.
 * the expiry is checked every 30 seconds.
 * missing batches are added to existing caches
 *
 * downsides:
 * the cache time of additionaly added batches may not be very long sometimes.
 * the real expiry time is never exactly one minute (almost never)
 *
 * @param key a unique cache-key
 * @param duration the duration in minutes
 * @param retreiver a function doing the actual work of retriving the data
 * @returns one array containing all batches up to the given duration
 */
export async function getCached<T>(
  key: string,
  duration: number,
  retreiver: (when: Date) => Promise<T[]>,
) {
  const now = Date.now();
  if (!cache[key]) cache[key] = { since: now, batches: [] };

  const batches = Math.ceil(duration / 60); // calculate required number of batches. (results with the dbnav profile are allways full hours)
  const cached = cache[key] as CacheEntry<T[]>;

  const result: T[] = [];
  for (let i = 0; i < batches; i++) {
    if (!cached.batches[i]) {
      // if the required batch is not in the cache: retreive it
      cached.batches[i] = await retreiver(new Date(now + i * 60 * 60 * 1000));
    }

    // add all entries to the result
    result.push(...cached.batches[i]);
  }

  return result;
}

setInterval(() => {
  const since = Date.now() - 60 * 1000;
  Object.keys(cache).forEach((key) => {
    if (cache[key].since < since) {
      delete cache[key];
    }
  });
}, 30 * 1000).unref(); // unref to automatically release it on process exit. (without the process would not exit on <ctrl>-C)
