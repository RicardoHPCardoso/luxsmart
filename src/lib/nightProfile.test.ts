import { describe, expect, it } from 'vitest';
import { INDAIATUBA } from '@/data/indaiatuba';
import { fatorUsoLuxSmart } from './energy';
import { distribuirMovimento, perfilPotenciaNoite } from './nightProfile';

const PESOS = INDAIATUBA.perfilMovimentoNoturno.valor;
const media = (valores: readonly number[]) => valores.reduce((a, b) => a + b, 0) / valores.length;

describe('distribuirMovimento', () => {
  it.each([0, 0.05, 0.2, 0.45, 0.7, 0.95, 1])('média final = %s', (alvo) => {
    const r = distribuirMovimento(PESOS, alvo);
    expect(r).toHaveLength(PESOS.length);
    expect(media(r)).toBeCloseTo(alvo, 6);
    r.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    });
  });

  it('preserva a forma do perfil quando nenhuma hora satura', () => {
    const r = distribuirMovimento([1, 0.5], 0.3);
    expect(r[0]! / r[1]!).toBeCloseTo(2);
  });

  it('limita a 100% e redistribui o excedente', () => {
    const r = distribuirMovimento([1, 0.1], 0.8);
    expect(r[0]).toBe(1);
    expect(r[1]).toBeCloseTo(0.6);
  });

  it('pesos zerados: distribui uniformemente; alvo alto preenche as horas de peso 0', () => {
    expect(distribuirMovimento([0, 0, 0], 0.4)).toEqual([0.4, 0.4, 0.4]);
    const r = distribuirMovimento([1, 0], 0.75);
    expect(r).toEqual([1, 0.5]);
  });

  it('lista vazia e entradas inválidas', () => {
    expect(distribuirMovimento([], 0.5)).toEqual([]);
    expect(() => distribuirMovimento([1], 1.2)).toThrow(RangeError);
    expect(() => distribuirMovimento([-1], 0.5)).toThrow(RangeError);
  });
});

describe('perfilPotenciaNoite', () => {
  const grupos = [
    { pontos: 100, potenciaW: 84, movimento: 0.2 },
    { pontos: 50, potenciaW: 190, movimento: 0.7 },
  ];
  const perfil = perfilPotenciaNoite(grupos, 0.3, PESOS, 18);

  it('tem uma entrada por hora + o ponto final das 6h', () => {
    expect(perfil).toHaveLength(PESOS.length + 1);
    expect(perfil[0]?.hora).toBe('18h');
    expect(perfil[6]?.hora).toBe('0h');
    expect(perfil.at(-1)?.hora).toBe('6h');
  });

  it('cenário atual é constante (LED a 100% a noite toda)', () => {
    const esperado = (100 * 84 + 50 * 190) / 1000;
    perfil.forEach((p) => expect(p.atualKw).toBeCloseTo(esperado));
  });

  it('a média do LuxSmart na noite bate com o fator de uso anual', () => {
    const horas = perfil.slice(0, -1);
    const esperado =
      (100 * 84 * fatorUsoLuxSmart(0.2, 0.3) + 50 * 190 * fatorUsoLuxSmart(0.7, 0.3)) / 1000;
    expect(media(horas.map((p) => p.luxsmartKw))).toBeCloseTo(esperado, 6);
  });

  it('LuxSmart nunca passa do cenário atual nem fica abaixo do nível dimerizado', () => {
    const atual = perfil[0]!.atualKw;
    perfil.forEach((p) => {
      expect(p.luxsmartKw).toBeLessThanOrEqual(atual + 1e-9);
      expect(p.luxsmartKw).toBeGreaterThanOrEqual(atual * 0.3 - 1e-9);
    });
  });
});
