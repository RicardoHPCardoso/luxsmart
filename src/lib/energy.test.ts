import { describe, expect, it } from 'vitest';
import {
  co2Evitado,
  compararCenarios,
  consumoAnual,
  consumoMensalAcumulado,
  custoAnual,
  economiaPercentual,
  economiaReais,
  fatorUsoLuxSmart,
  investimentoKit,
  paybackAnos,
  potenciaInstantaneaKw,
  somarComparacoes,
  type ParametrosCenario,
} from './energy';

const BASE: ParametrosCenario = {
  pontos: 1000,
  potenciaLedW: 100,
  potenciaVaporSodioW: 200,
  horasNoite: 12,
  movimento: 0.2,
  dimerizacao: 0.3,
  tarifa: 0.5,
  fatorEmissao: 0.04,
  custoKitPorPonto: 400,
};

describe('consumoAnual', () => {
  it('calcula pontos × kW × horas × 365 × fator', () => {
    // 1 ponto de 100 W, 10 h/noite → 0,1 kW × 10 h × 365 = 365 kWh
    expect(consumoAnual(1, 100, 10, 1)).toBeCloseTo(365);
    expect(consumoAnual(1000, 84, 11 + 52 / 60, 1)).toBeCloseTo(363_832, 0);
  });

  it('é proporcional ao fator de uso', () => {
    expect(consumoAnual(10, 100, 12, 0.5)).toBeCloseTo(consumoAnual(10, 100, 12, 1) / 2);
  });

  it('retorna 0 para fator de uso 0, zero pontos ou potência 0', () => {
    expect(consumoAnual(100, 100, 12, 0)).toBe(0);
    expect(consumoAnual(0, 100, 12, 1)).toBe(0);
    expect(consumoAnual(100, 0, 12, 1)).toBe(0);
  });

  it('rejeita entradas inválidas', () => {
    expect(() => consumoAnual(-1, 100, 12, 1)).toThrow(RangeError);
    expect(() => consumoAnual(1, -100, 12, 1)).toThrow(RangeError);
    expect(() => consumoAnual(1, 100, 25, 1)).toThrow(RangeError);
    expect(() => consumoAnual(1, 100, 12, 1.5)).toThrow(RangeError);
    expect(() => consumoAnual(Number.NaN, 100, 12, 1)).toThrow(RangeError);
  });
});

describe('fatorUsoLuxSmart', () => {
  it('reproduz o exemplo do projeto: 20% de movimento e 30% de dimerização → 0,44', () => {
    expect(fatorUsoLuxSmart(0.2, 0.3)).toBeCloseTo(0.44);
  });

  it('0% de movimento → fica sempre dimerizado', () => {
    expect(fatorUsoLuxSmart(0, 0.3)).toBeCloseTo(0.3);
  });

  it('100% de movimento → sempre a 100%, qualquer que seja a dimerização', () => {
    expect(fatorUsoLuxSmart(1, 0.3)).toBe(1);
    expect(fatorUsoLuxSmart(1, 0)).toBe(1);
  });

  it('dimerização 0 → a luz só gasta energia quando há movimento', () => {
    expect(fatorUsoLuxSmart(0.2, 0)).toBeCloseTo(0.2);
    expect(fatorUsoLuxSmart(0, 0)).toBe(0);
  });

  it('dimerização 1 → equivale ao LED sempre a 100%', () => {
    expect(fatorUsoLuxSmart(0, 1)).toBe(1);
    expect(fatorUsoLuxSmart(0.2, 1)).toBe(1);
  });

  it('rejeita frações fora de [0, 1]', () => {
    expect(() => fatorUsoLuxSmart(-0.1, 0.3)).toThrow(RangeError);
    expect(() => fatorUsoLuxSmart(0.2, 1.1)).toThrow(RangeError);
  });
});

describe('custo, economia, CO₂ e payback', () => {
  it('custoAnual = kWh × tarifa', () => {
    expect(custoAnual(1000, 0.5)).toBe(500);
    expect(() => custoAnual(1000, -1)).toThrow(RangeError);
  });

  it('economiaReais é a diferença entre referência e novo custo', () => {
    expect(economiaReais(1000, 440)).toBe(560);
    expect(economiaReais(100, 150)).toBe(-50);
  });

  it('economiaPercentual: ~56% no exemplo do projeto e 0 sem referência', () => {
    expect(economiaPercentual(1000, 440)).toBeCloseTo(0.56);
    expect(economiaPercentual(0, 0)).toBe(0);
  });

  it('co2Evitado converte kg em toneladas', () => {
    // 1.000 kWh × 0,04 kg/kWh = 40 kg = 0,04 t
    expect(co2Evitado(1000, 0.04)).toBeCloseTo(0.04);
    expect(co2Evitado(0, 0.04)).toBe(0);
  });

  it('investimentoKit = pontos × custo por ponto', () => {
    expect(investimentoKit(1000, 400)).toBe(400_000);
  });

  it('paybackAnos: investimento ÷ economia anual, com casos-limite', () => {
    expect(paybackAnos(1000, 500)).toBe(2);
    expect(paybackAnos(0, 500)).toBe(0);
    expect(paybackAnos(1000, 0)).toBe(Infinity);
    expect(paybackAnos(1000, -10)).toBe(Infinity);
  });

  it('potenciaInstantaneaKw soma a potência dos pontos acesos', () => {
    expect(potenciaInstantaneaKw(8, 100, 1)).toBeCloseTo(0.8);
    expect(potenciaInstantaneaKw(8, 100, 0.3)).toBeCloseTo(0.24);
  });
});

describe('compararCenarios', () => {
  it('calcula os três cenários e a economia do LuxSmart sobre o LED atual', () => {
    const r = compararCenarios(BASE);
    const atual = 1000 * 0.1 * 12 * 365; // 438.000 kWh

    expect(r.cenarios.atual.consumoKwh).toBeCloseTo(atual);
    expect(r.cenarios.convencional.consumoKwh).toBeCloseTo(atual * 2);
    expect(r.cenarios.luxsmart.consumoKwh).toBeCloseTo(atual * 0.44);
    expect(r.economiaPercentual).toBeCloseTo(0.56);
    expect(r.economiaKwh).toBeCloseTo(atual * 0.56);
    expect(r.economiaReais).toBeCloseTo(atual * 0.56 * 0.5);
    expect(r.co2EvitadoT).toBeCloseTo((atual * 0.56 * 0.04) / 1000);
    expect(r.investimento).toBe(400_000);
    expect(r.paybackAnos).toBeCloseTo(400_000 / (atual * 0.56 * 0.5));
  });

  it('100% de movimento → nenhuma economia e payback infinito', () => {
    const r = compararCenarios({ ...BASE, movimento: 1 });
    expect(r.economiaKwh).toBeCloseTo(0);
    expect(r.economiaPercentual).toBeCloseTo(0);
    expect(r.paybackAnos).toBe(Infinity);
  });

  it('0% de movimento → economia = 1 − dimerização', () => {
    const r = compararCenarios({ ...BASE, movimento: 0 });
    expect(r.economiaPercentual).toBeCloseTo(0.7);
  });

  it('dimerização 1 → sem economia; dimerização 0 e sem movimento → 100%', () => {
    expect(compararCenarios({ ...BASE, dimerizacao: 1 }).economiaPercentual).toBeCloseTo(0);
    const apagado = compararCenarios({ ...BASE, dimerizacao: 0, movimento: 0 });
    expect(apagado.cenarios.luxsmart.consumoKwh).toBe(0);
    expect(apagado.economiaPercentual).toBe(1);
  });

  it('sem pontos, tudo é zero', () => {
    const r = compararCenarios({ ...BASE, pontos: 0 });
    expect(r.cenarios.atual.consumoKwh).toBe(0);
    expect(r.economiaPercentual).toBe(0);
    expect(r.paybackAnos).toBe(0);
  });
});

describe('somarComparacoes', () => {
  it('soma os grupos e recalcula percentuais a partir dos totais', () => {
    const a = compararCenarios(BASE);
    const b = compararCenarios({ ...BASE, pontos: 500, potenciaLedW: 200, movimento: 0.7 });
    const total = somarComparacoes([a, b], BASE.fatorEmissao);

    expect(total.pontos).toBe(1500);
    expect(total.cenarios.atual.consumoKwh).toBeCloseTo(
      a.cenarios.atual.consumoKwh + b.cenarios.atual.consumoKwh,
    );
    expect(total.economiaKwh).toBeCloseTo(a.economiaKwh + b.economiaKwh);
    expect(total.economiaPercentual).toBeCloseTo(
      total.economiaKwh / total.cenarios.atual.consumoKwh,
    );
    expect(total.investimento).toBe(a.investimento + b.investimento);
  });

  it('lista vazia resulta em zeros', () => {
    const total = somarComparacoes([], 0.04);
    expect(total.pontos).toBe(0);
    expect(total.economiaPercentual).toBe(0);
  });
});

describe('consumoMensalAcumulado', () => {
  it('termina em dezembro com o consumo anual e é crescente', () => {
    const { cenarios } = compararCenarios(BASE);
    const serie = consumoMensalAcumulado(cenarios);

    expect(serie).toHaveLength(12);
    expect(serie[0]?.mes).toBe('jan');
    expect(serie.at(-1)?.atual).toBeCloseTo(cenarios.atual.consumoKwh);
    expect(serie.at(-1)?.luxsmart).toBeCloseTo(cenarios.luxsmart.consumoKwh);
    for (let i = 1; i < serie.length; i++) {
      expect(serie[i]!.atual).toBeGreaterThan(serie[i - 1]!.atual);
    }
  });
});
