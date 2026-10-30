/**
 * Lógica pura da calculadora de economia.
 */
import type { LimiteCampo, ValoresCalculadora } from '@/data/calculadora';
import type { DadosCidade } from '@/data/indaiatuba';
import { compararCenarios, type ComparacaoCenarios } from './energy';
import { parametrosEquivalentesCidade } from './indaiatubaScenarios';

/**
 * Valores que representam Indaiatuba inteira como um "poste médio".
 * Não arredondamos potência e movimento: assim a calculadora mostra
 * exatamente os mesmos totais do dashboard (os sliders exibem o valor
 * arredondado e voltam ao passo normal quando o usuário os move).
 */
export function valoresDaCidade(dados: DadosCidade): ValoresCalculadora {
  const eq = parametrosEquivalentesCidade(dados);
  return {
    pontos: eq.pontos,
    potenciaW: eq.potenciaMediaW,
    movimento: eq.movimentoEquivalente,
    dimerizacao: dados.dimerizacao.valor,
    tarifa: dados.tarifa.valor,
    custoKit: dados.custoKit.valor,
  };
}

/** Calcula o comparativo Atual × LuxSmart para os valores da calculadora. */
export function calcularEconomia(
  valores: ValoresCalculadora,
  horasNoite: number,
  fatorEmissao: number,
): ComparacaoCenarios {
  return compararCenarios({
    pontos: valores.pontos,
    potenciaLedW: valores.potenciaW,
    // A calculadora compara apenas LED atual × LuxSmart.
    potenciaVaporSodioW: valores.potenciaW,
    horasNoite,
    movimento: valores.movimento,
    dimerizacao: valores.dimerizacao,
    tarifa: valores.tarifa,
    fatorEmissao,
    custoKitPorPonto: valores.custoKit,
  });
}

/** Mantém um valor dentro dos limites e alinhado ao passo do campo. */
export function ajustarAoLimite(valor: number, limite: LimiteCampo): number {
  if (!Number.isFinite(valor)) return limite.min;
  const limitado = Math.min(limite.max, Math.max(limite.min, valor));
  const passos = Math.round((limitado - limite.min) / limite.passo);
  // toFixed evita resíduos de ponto flutuante (ex.: 0.30000000000000004).
  return Number((limite.min + passos * limite.passo).toFixed(6));
}
