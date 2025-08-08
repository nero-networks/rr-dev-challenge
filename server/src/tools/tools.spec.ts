import { shaHash } from '.';
import { getCached } from "./cache";

describe('index.ts', () => {
  describe('hash', () => {
    it('should hash correctly', () => {
      expect(shaHash('hallo')).toBe('d3751d33f9cd5049c4af2b462735457e4d3baf130bcbb87f389e349fbaeb20b9');
    });
  });
});

describe('cache.ts', () => {
  describe('getCached', () => {
    const batches = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

    async function get(when: Date) {
      const batch = Math.abs(Math.ceil((+when - Date.now()) / 60 / 60 / 1000));
      return Promise.resolve(batches[batch]);
    }

    it('should return 2/3 of the data', async () => {
      const data = await getCached<number>('test', 120, get);
      expect(data).toEqual(batches.slice(0, 2).flat());
    });

    it('should return all data but request only the last batch', async () => {
      let count = 0;
      const data = await getCached<number>('test', 180, (when) => {
        count++;
        return get(when);
      });
      expect(count).toBe(1);
      expect(data).toEqual(batches.flat());
    });
  });
});
