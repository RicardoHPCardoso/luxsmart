import { describe, expect, it } from 'vitest';
import { INDAIATUBA, TIPOS_VIA } from '@/data/indaiatuba';
import { consumoAnual, fatorUsoLuxSmart } from './energy';
import {
  comparacaoPorFiltro,
  gruposPorFiltro,
  parametrosEquivalentesCidade,
  pontosDaVia,
} from './indaiatubaScenarios';

describe('dados de Indaiatuba', () => {
  it('as participações por tipo de via somam 100%', () => {
    const soma = TIPOS_VIA.reduce((acc, via) => acc + INDAIATUBA.vias[via].participacao.valor, 0);
    expect(soma).toBeCloseTo(1);
  });

  it('a soma dos pontos por via é o total de pontos em LED', () => {
    const soma = TIPOS_VIA.reduce((acc, via) => acc + pontosDaVia(INDAIATUBA, via), 0);
    expect(soma).toBe(INDAIATUBA.pontosLed.valor);
  });

  it('todo dado tem fonte e observação preenchidas', () => {
    const dados = [
      INDAIATUBA.pontosLed,
      INDAIATUBA.totalPontos,
      INDAIATUBA.horasPorNoite,
      INDAIATUBA.tarifa,
      INDAIATUBA.fatorEmissao,
      INDAIATUBA.dimerizacao,
      INDAIATUBA.custoKit,
      ...TIPOS_VIA.flatMap((via) => Object.values(INDAIATUBA.vias[via])),
    ];
    dados.forEach((d) => {
      expect(d.fonte.length).toBeGreaterThan(0);
      expect(d.observacao.length).toBeGreaterThan(0);
    });
  });
});

describe('comparacaoPorFiltro', () => {
  it('"cidade" é a soma das três vias', () => {
    const cidade = comparacaoPorFiltro(INDAIATUBA, 'cidade');
    const soma = TIPOS_VIA.map((via) => comparacaoPorFiltro(INDAIATUBA, via)).reduce(
      (acc, r) => acc + r.cenarios.luxsmart.consumoKwh,
      0,
    );
    expect(cidade.cenarios.luxsmart.consumoKwh).toBeCloseTo(soma);
    expect(cidade.pontos).toBe(INDAIATUBA.pontosLed.valor);
  });

  it('via residencial com os valores padrão economiza ~56% (0,44 de fator de uso)', () => {
    const r = comparacaoPorFiltro(INDAIATUBA, 'residencial');
    expect(r.economiaPercentual).toBeCloseTo(0.56);
  });

  it('a ordem dos cenários é convencional > atual > LuxSmart', () => {
    const r = comparacaoPorFiltro(INDAIATUBA, 'cidade');
    expect(r.cenarios.convencional.consumoKwh).toBeGreaterThan(r.cenarios.atual.consumoKwh);
    expect(r.cenarios.atual.consumoKwh).toBeGreaterThan(r.cenarios.luxsmart.consumoKwh);
  });
});

describe('gruposPorFiltro', () => {
  it('retorna um grupo por via, ou todas para a cidade', () => {
    expect(gruposPorFiltro(INDAIATUBA, 'avenida')).toHaveLength(1);
    expect(gruposPorFiltro(INDAIATUBA, 'cidade')).toHaveLength(3);
  });
});

describe('parametrosEquivalentesCidade', () => {
  it('o "poste médio" reproduz exatamente o consumo LuxSmart da cidade', () => {
    const eq = parametrosEquivalentesCidade(INDAIATUBA);
    const cidade = comparacaoPorFiltro(INDAIATUBA, 'cidade');
    const consumo = consumoAnual(
      eq.pontos,
      eq.potenciaMediaW,
      INDAIATUBA.horasPorNoite.valor,
      fatorUsoLuxSmart(eq.movimentoEquivalente, INDAIATUBA.dimerizacao.valor),
    );
    expect(consumo).toBeCloseTo(cidade.cenarios.luxsmart.consumoKwh, 0);
  });
});
