import { describe, expect, it } from 'vitest';
import {
  formatarAnos,
  formatarCompacto,
  formatarEnergia,
  formatarHoras,
  formatarMoeda,
  formatarNumero,
  formatarPercentual,
} from './format';

/** Intl usa espaços não separáveis; normalizamos para comparar. */
const n = (texto: string) => texto.replace(/\s/gu, ' ');

describe('formatação pt-BR', () => {
  it('números com separador de milhar', () => {
    expect(formatarNumero(1234567)).toBe('1.234.567');
    expect(formatarNumero(12.345, 1)).toBe('12,3');
  });

  it('moeda em reais', () => {
    expect(n(formatarMoeda(1234567))).toBe('R$ 1.234.567');
    expect(n(formatarMoeda(0.5, { centavos: true }))).toBe('R$ 0,50');
  });

  it('percentual a partir de fração', () => {
    expect(formatarPercentual(0.4432)).toBe('44%');
    expect(formatarPercentual(0.4432, 1)).toBe('44,3%');
  });

  it('notação compacta', () => {
    expect(n(formatarCompacto(1_234_567))).toBe('1,2 mi');
    expect(n(formatarCompacto(34_500))).toBe('34,5 mil');
  });

  it('energia escolhe kWh, MWh ou GWh', () => {
    expect(formatarEnergia(850)).toBe('850 kWh');
    expect(formatarEnergia(12_300)).toBe('12,3 MWh');
    expect(formatarEnergia(12_300_000)).toBe('12,3 GWh');
  });

  it('horas decimais em h/min', () => {
    expect(formatarHoras(11 + 52 / 60)).toBe('11h52min');
    expect(formatarHoras(12)).toBe('12h');
    expect(formatarHoras(11.9999)).toBe('12h');
  });

  it('payback em anos ou meses', () => {
    expect(formatarAnos(2.34)).toBe('2,3 anos');
    expect(formatarAnos(1)).toBe('1 ano');
    expect(formatarAnos(0.5)).toBe('6 meses');
    expect(formatarAnos(Infinity)).toBe('sem retorno');
  });
});
