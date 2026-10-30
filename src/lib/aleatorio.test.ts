import { describe, expect, it } from 'vitest';
import { aleatorio } from './aleatorio';

describe('aleatorio', () => {
  it('é determinístico e fica entre 0 e 1', () => {
    const a = aleatorio(7);
    const b = aleatorio(7);
    const valores = Array.from({ length: 50 }, () => a());
    expect(valores).toEqual(Array.from({ length: 50 }, () => b()));
    valores.forEach((v) => {
      expect(v).toBeGreaterThan(0);
      expect(v).toBeLessThan(1);
    });
  });
});
