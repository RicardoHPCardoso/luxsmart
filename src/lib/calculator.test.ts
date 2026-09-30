import { describe, expect, it } from 'vitest';
import { EXEMPLO_RUA, LIMITES_CALCULADORA } from '@/data/calculadora';
import { INDAIATUBA } from '@/data/indaiatuba';
import { ajustarAoLimite, calcularEconomia, criarEscalaLog, valoresDaCidade } from './calculator';
import { comparacaoPorFiltro } from './indaiatubaScenarios';

const HORAS = INDAIATUBA.horasPorNoite.valor;
const FATOR = INDAIATUBA.fatorEmissao.valor;

describe('calcularEconomia', () => {
  it('exemplo da rua: 20% de movimento e 30% de dimerização → 56% de economia', () => {
    const r = calcularEconomia(EXEMPLO_RUA, HORAS, FATOR);
    expect(r.economiaPercentual).toBeCloseTo(0.56);
    expect(r.pontos).toBe(30);
  });

  it('"Aplicar à cidade" reproduz exatamente os totais do dashboard', () => {
    const cidade = valoresDaCidade(INDAIATUBA);
    const r = calcularEconomia(cidade, HORAS, FATOR);
    const dashboard = comparacaoPorFiltro(INDAIATUBA, 'cidade');

    expect(cidade.pontos).toBe(INDAIATUBA.pontosLed.valor);
    expect(r.cenarios.atual.consumoKwh).toBeCloseTo(dashboard.cenarios.atual.consumoKwh, 0);
    expect(r.economiaKwh).toBeCloseTo(dashboard.economiaKwh, 0);
    expect(r.economiaReais).toBeCloseTo(dashboard.economiaReais, 0);
  });
});

describe('ajustarAoLimite', () => {
  it('limita e alinha ao passo', () => {
    expect(ajustarAoLimite(50_000, LIMITES_CALCULADORA.pontos)).toBe(40_000);
    expect(ajustarAoLimite(-3, LIMITES_CALCULADORA.pontos)).toBe(1);
    expect(ajustarAoLimite(0.304, LIMITES_CALCULADORA.dimerizacao)).toBe(0.3);
    expect(ajustarAoLimite(1234, LIMITES_CALCULADORA.custoKit)).toBe(1230);
    expect(ajustarAoLimite(Number.NaN, LIMITES_CALCULADORA.potenciaW)).toBe(20);
  });
});

describe('criarEscalaLog', () => {
  const escala = criarEscalaLog(1, 40_000);

  it('mapeia os extremos', () => {
    expect(escala.paraPosicao(1)).toBe(0);
    expect(escala.paraPosicao(40_000)).toBe(1000);
    expect(escala.paraValor(0)).toBe(1);
    expect(escala.paraValor(1000)).toBe(40_000);
  });

  it('ida e volta preserva valores (com a precisão da escala)', () => {
    for (const v of [8, 30, 250, 5_600, 28_000]) {
      const volta = escala.paraValor(escala.paraPosicao(v));
      expect(Math.abs(volta - v) / v).toBeLessThan(0.012);
    }
  });

  it('rejeita faixas inválidas', () => {
    expect(() => criarEscalaLog(0, 10)).toThrow(RangeError);
    expect(() => criarEscalaLog(10, 5)).toThrow(RangeError);
  });
});
