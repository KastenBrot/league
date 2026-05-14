import { describe, expect, it } from 'vitest';
import { generatePairs } from './matches';

describe('generatePairs (round-robin)', () => {
  it('returns no pairs for fewer than 2 players', () => {
    expect(generatePairs([])).toEqual([]);
    expect(generatePairs([{ id: 1 }])).toEqual([]);
  });

  it('returns n*(n-1)/2 unique unordered pairs', () => {
    const players = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const pairs = generatePairs(players);
    expect(pairs).toHaveLength((5 * 4) / 2);

    const set = new Set(pairs.map((p) => `${p.aId}-${p.bId}`));
    expect(set.size).toBe(pairs.length);

    for (const p of pairs) {
      expect(p.aId).toBeLessThan(p.bId);
    }
  });

  it('orders ids so the smaller id is always aId', () => {
    const pairs = generatePairs([{ id: 7 }, { id: 3 }, { id: 5 }]);
    for (const p of pairs) {
      expect(p.aId).toBeLessThan(p.bId);
    }
    const set = new Set(pairs.map((p) => `${p.aId}-${p.bId}`));
    expect(set).toEqual(new Set(['3-5', '3-7', '5-7']));
  });
});
