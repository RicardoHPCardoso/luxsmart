/**
 * Cálculos de energia, custo e emissões da iluminação pública.
 *
 * Todas as funções são PURAS (sem efeitos colaterais, sem ler configuração
 * global): recebem os parâmetros e devolvem números. Isso facilita testar,
 * reutilizar no dashboard/calculadora e explicar a metodologia.
 *
 * Unidades:
 *   potência → W (watts) · energia → kWh · dinheiro → R$ · CO₂ → toneladas
 *   frações (movimento, dimerização, fator de uso) → 0 a 1
 */

export const DIAS_POR_ANO = 365;
const WATTS_POR_KW = 1000;
const KG_POR_TONELADA = 1000;

/* -------------------------------------------------------------------------- */
/* Validação                                                                  */
/* -------------------------------------------------------------------------- */

function exigirNaoNegativo(nome: string, valor: number): void {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new RangeError(`${nome} deve ser um número finito ≥ 0 (recebido: ${valor}).`);
  }
}

function exigirFracao(nome: string, valor: number): void {
  if (!Number.isFinite(valor) || valor < 0 || valor > 1) {
    throw new RangeError(`${nome} deve estar entre 0 e 1 (recebido: ${valor}).`);
  }
}

/* -------------------------------------------------------------------------- */
/* Funções básicas                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Consumo anual de um conjunto de pontos de iluminação.
 *
 *   kWh/ano = pontos × (potência ÷ 1000) × horas por noite × 365 × fator de uso
 *
 * @param pontos     quantidade de luminárias
 * @param potenciaW  potência de cada luminária a 100% (W)
 * @param horasNoite horas de funcionamento por noite
 * @param fatorUso   fração média da potência usada durante a noite (0–1)
 */
export function consumoAnual(
  pontos: number,
  potenciaW: number,
  horasNoite: number,
  fatorUso: number,
): number {
  exigirNaoNegativo('pontos', pontos);
  exigirNaoNegativo('potenciaW', potenciaW);
  exigirFracao('horasNoite ÷ 24', horasNoite / 24);
  exigirFracao('fatorUso', fatorUso);
  return pontos * (potenciaW / WATTS_POR_KW) * horasNoite * DIAS_POR_ANO * fatorUso;
}

/**
 * Fator de uso médio do LuxSmart ao longo da noite.
 *
 *   fator = (1 − movimento) × dimerização + movimento
 *
 * Durante a fração da noite SEM movimento a luz fica dimerizada; durante a
 * fração COM movimento ela vai a 100%.
 * Ex.: 20% de movimento e 30% de dimerização → 0,8 × 0,3 + 0,2 = 0,44.
 */
export function fatorUsoLuxSmart(movimento: number, dimerizacao: number): number {
  exigirFracao('movimento', movimento);
  exigirFracao('dimerizacao', dimerizacao);
  return (1 - movimento) * dimerizacao + movimento;
}

/** Custo anual em R$: kWh × tarifa (R$/kWh). */
export function custoAnual(kwh: number, tarifa: number): number {
  exigirNaoNegativo('kwh', kwh);
  exigirNaoNegativo('tarifa', tarifa);
  return kwh * tarifa;
}

/** Economia em R$ entre um custo de referência e um custo novo (pode ser negativa). */
export function economiaReais(custoReferencia: number, custoNovo: number): number {
  return custoReferencia - custoNovo;
}

/**
 * Economia percentual (0–1) de um consumo novo em relação à referência.
 * Retorna 0 quando a referência é 0 (não há o que economizar).
 */
export function economiaPercentual(consumoReferencia: number, consumoNovo: number): number {
  exigirNaoNegativo('consumoReferencia', consumoReferencia);
  exigirNaoNegativo('consumoNovo', consumoNovo);
  if (consumoReferencia === 0) return 0;
  return (consumoReferencia - consumoNovo) / consumoReferencia;
}

/**
 * Emissões de CO₂ evitadas, em toneladas.
 *
 *   t CO₂ = kWh evitados × fator de emissão (kg CO₂/kWh) ÷ 1000
 */
export function co2Evitado(kwhEvitados: number, fatorEmissaoKgPorKwh: number): number {
  exigirNaoNegativo('fatorEmissaoKgPorKwh', fatorEmissaoKgPorKwh);
  return (kwhEvitados * fatorEmissaoKgPorKwh) / KG_POR_TONELADA;
}

/** Investimento total no kit inteligente (R$). */
export function investimentoKit(pontos: number, custoPorPonto: number): number {
  exigirNaoNegativo('pontos', pontos);
  exigirNaoNegativo('custoPorPonto', custoPorPonto);
  return pontos * custoPorPonto;
}

/**
 * Payback simples, em anos: investimento ÷ economia anual.
 * Não considera juros, inflação nem manutenção.
 * Retorna 0 sem investimento e `Infinity` quando não há economia.
 */
export function paybackAnos(investimento: number, economiaAnual: number): number {
  exigirNaoNegativo('investimento', investimento);
  if (investimento === 0) return 0;
  if (economiaAnual <= 0) return Infinity;
  return investimento / economiaAnual;
}

/** Potência instantânea de um conjunto de pontos, em kW. */
export function potenciaInstantaneaKw(pontos: number, potenciaW: number, fatorUso: number): number {
  exigirNaoNegativo('pontos', pontos);
  exigirNaoNegativo('potenciaW', potenciaW);
  exigirFracao('fatorUso', fatorUso);
  return (pontos * potenciaW * fatorUso) / WATTS_POR_KW;
}

/* -------------------------------------------------------------------------- */
/* Cenários                                                                   */
/* -------------------------------------------------------------------------- */

export type Cenario = 'convencional' | 'atual' | 'luxsmart';

export const CENARIOS: readonly Cenario[] = ['convencional', 'atual', 'luxsmart'];

export const ROTULO_CENARIO: Record<Cenario, string> = {
  convencional: 'Convencional (vapor de sódio)',
  atual: 'Atual (LED a 100%)',
  luxsmart: 'LuxSmart',
};

export interface ParametrosCenario {
  pontos: number;
  /** Potência da luminária LED (W). */
  potenciaLedW: number;
  /** Potência de sistema equivalente em vapor de sódio (W) — referência histórica. */
  potenciaVaporSodioW: number;
  horasNoite: number;
  /** Fração da noite com movimento (0–1). */
  movimento: number;
  /** Potência usada sem movimento (0–1). */
  dimerizacao: number;
  /** R$/kWh. */
  tarifa: number;
  /** kg CO₂/kWh. */
  fatorEmissao: number;
  /** R$ por ponto. */
  custoKitPorPonto: number;
}

export interface ResultadoCenario {
  consumoKwh: number;
  custoReais: number;
}

export interface ComparacaoCenarios {
  pontos: number;
  cenarios: Record<Cenario, ResultadoCenario>;
  /** Economia do LuxSmart em relação ao LED atual. */
  economiaKwh: number;
  economiaReais: number;
  economiaPercentual: number;
  co2EvitadoT: number;
  investimento: number;
  paybackAnos: number;
}

function resultado(kwh: number, tarifa: number): ResultadoCenario {
  return { consumoKwh: kwh, custoReais: custoAnual(kwh, tarifa) };
}

/**
 * Compara os três cenários para um grupo homogêneo de pontos:
 * - Convencional: vapor de sódio aceso a 100% a noite toda (referência histórica);
 * - Atual: LED aceso a 100% a noite toda (fator de uso = 1);
 * - LuxSmart: LED dimerizado sem movimento e a 100% com movimento.
 * Economia, CO₂ e payback são calculados do LuxSmart contra o cenário Atual,
 * pois o kit é instalado sobre as luminárias LED existentes.
 */
export function compararCenarios(p: ParametrosCenario): ComparacaoCenarios {
  const convencional = consumoAnual(p.pontos, p.potenciaVaporSodioW, p.horasNoite, 1);
  const atual = consumoAnual(p.pontos, p.potenciaLedW, p.horasNoite, 1);
  const luxsmart = consumoAnual(
    p.pontos,
    p.potenciaLedW,
    p.horasNoite,
    fatorUsoLuxSmart(p.movimento, p.dimerizacao),
  );

  return montarComparacao(
    p.pontos,
    {
      convencional: resultado(convencional, p.tarifa),
      atual: resultado(atual, p.tarifa),
      luxsmart: resultado(luxsmart, p.tarifa),
    },
    p.fatorEmissao,
    investimentoKit(p.pontos, p.custoKitPorPonto),
  );
}

function montarComparacao(
  pontos: number,
  cenarios: Record<Cenario, ResultadoCenario>,
  fatorEmissao: number,
  investimento: number,
): ComparacaoCenarios {
  const economiaKwh = cenarios.atual.consumoKwh - cenarios.luxsmart.consumoKwh;
  const economiaRs = economiaReais(cenarios.atual.custoReais, cenarios.luxsmart.custoReais);

  return {
    pontos,
    cenarios,
    economiaKwh,
    economiaReais: economiaRs,
    economiaPercentual: economiaPercentual(cenarios.atual.consumoKwh, cenarios.luxsmart.consumoKwh),
    co2EvitadoT: co2Evitado(economiaKwh, fatorEmissao),
    investimento,
    paybackAnos: paybackAnos(investimento, economiaRs),
  };
}

/**
 * Soma comparações de grupos diferentes (ex.: residencial + coletora + avenida)
 * e recalcula os indicadores derivados (%, payback) a partir dos totais.
 */
export function somarComparacoes(
  lista: readonly ComparacaoCenarios[],
  fatorEmissao: number,
): ComparacaoCenarios {
  const zero = (): ResultadoCenario => ({ consumoKwh: 0, custoReais: 0 });
  const cenarios: Record<Cenario, ResultadoCenario> = {
    convencional: zero(),
    atual: zero(),
    luxsmart: zero(),
  };
  let pontos = 0;
  let investimento = 0;

  for (const item of lista) {
    pontos += item.pontos;
    investimento += item.investimento;
    for (const cenario of CENARIOS) {
      cenarios[cenario].consumoKwh += item.cenarios[cenario].consumoKwh;
      cenarios[cenario].custoReais += item.cenarios[cenario].custoReais;
    }
  }

  return montarComparacao(pontos, cenarios, fatorEmissao, investimento);
}

/* -------------------------------------------------------------------------- */
/* Séries para gráficos                                                       */
/* -------------------------------------------------------------------------- */

export const DIAS_POR_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;
export const MESES = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

export interface PontoMensal extends Record<Cenario, number> {
  mes: (typeof MESES)[number];
}

/**
 * Consumo acumulado mês a mês (kWh), distribuindo o consumo anual pelo número
 * de dias de cada mês (horas por noite constantes, como no faturamento).
 */
export function consumoMensalAcumulado(cenarios: Record<Cenario, ResultadoCenario>): PontoMensal[] {
  const acumulado: Record<Cenario, number> = { convencional: 0, atual: 0, luxsmart: 0 };

  return MESES.map((mes, i) => {
    const fracaoDoAno = (DIAS_POR_MES[i] ?? 0) / DIAS_POR_ANO;
    for (const cenario of CENARIOS) {
      acumulado[cenario] += cenarios[cenario].consumoKwh * fracaoDoAno;
    }
    return { mes, ...acumulado };
  });
}
