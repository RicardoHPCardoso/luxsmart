/**
 * Liga os dados de referência (`data/indaiatuba.ts`) às funções puras de
 * `energy.ts`. Recebe os dados como parâmetro para continuar testável.
 */
import type { DadosCidade, FiltroVia, TipoVia } from '@/data/indaiatuba';
import { ROTULO_VIA, TIPOS_VIA } from '@/data/indaiatuba';
import type { DadoReferencia } from '@/data/tipos';
import {
  compararCenarios,
  somarComparacoes,
  type ComparacaoCenarios,
  type ParametrosCenario,
} from './energy';
import type { GrupoIluminacao } from './nightProfile';

/** Quantidade de pontos de LED em um tipo de via (pontos LED × participação). */
export function pontosDaVia(dados: DadosCidade, via: TipoVia): number {
  return Math.round(dados.pontosLed.valor * dados.vias[via].participacao.valor);
}

export function parametrosDaVia(dados: DadosCidade, via: TipoVia): ParametrosCenario {
  const v = dados.vias[via];
  return {
    pontos: pontosDaVia(dados, via),
    potenciaLedW: v.potenciaLed.valor,
    potenciaVaporSodioW: v.potenciaVaporSodio.valor,
    horasNoite: dados.horasPorNoite.valor,
    movimento: v.movimento.valor,
    dimerizacao: dados.dimerizacao.valor,
    tarifa: dados.tarifa.valor,
    fatorEmissao: dados.fatorEmissao.valor,
    custoKitPorPonto: dados.custoKit.valor,
  };
}

function viasDoFiltro(filtro: FiltroVia): readonly TipoVia[] {
  return filtro === 'cidade' ? TIPOS_VIA : [filtro];
}

/** Comparação dos cenários para um tipo de via ou para a cidade toda. */
export function comparacaoPorFiltro(dados: DadosCidade, filtro: FiltroVia): ComparacaoCenarios {
  const comparacoes = viasDoFiltro(filtro).map((via) =>
    compararCenarios(parametrosDaVia(dados, via)),
  );
  return somarComparacoes(comparacoes, dados.fatorEmissao.valor);
}

/** Grupos de iluminação (pontos, potência, movimento) para o perfil noturno. */
export function gruposPorFiltro(dados: DadosCidade, filtro: FiltroVia): GrupoIluminacao[] {
  return viasDoFiltro(filtro).map((via) => ({
    pontos: pontosDaVia(dados, via),
    potenciaW: dados.vias[via].potenciaLed.valor,
    movimento: dados.vias[via].movimento.valor,
  }));
}

export interface ParametrosEquivalentesCidade {
  pontos: number;
  /** Potência média por ponto (W). */
  potenciaMediaW: number;
  /**
   * Movimento médio ponderado pela energia de cada via. Com ele, o modelo de
   * "um só tipo de poste" da calculadora reproduz exatamente o total da cidade.
   */
  movimentoEquivalente: number;
}

/**
 * Reduz a cidade inteira a um único "poste médio" para a calculadora.
 *   potência média = Σ(pontos × potência) ÷ Σ pontos
 *   movimento eq.  = Σ(pontos × potência × movimento) ÷ Σ(pontos × potência)
 */
export function parametrosEquivalentesCidade(dados: DadosCidade): ParametrosEquivalentesCidade {
  let pontos = 0;
  let potenciaTotal = 0;
  let potenciaComMovimento = 0;

  for (const via of TIPOS_VIA) {
    const n = pontosDaVia(dados, via);
    const potencia = n * dados.vias[via].potenciaLed.valor;
    pontos += n;
    potenciaTotal += potencia;
    potenciaComMovimento += potencia * dados.vias[via].movimento.valor;
  }

  return {
    pontos,
    potenciaMediaW: pontos === 0 ? 0 : potenciaTotal / pontos,
    movimentoEquivalente: potenciaTotal === 0 ? 0 : potenciaComMovimento / potenciaTotal,
  };
}

export interface GrupoDadosReferencia {
  titulo: string;
  dados: ReadonlyArray<DadoReferencia<number | readonly number[]>>;
}

/** Todos os dados de referência, agrupados, para a tabela de metodologia. */
export function listarDadosReferencia(dados: DadosCidade): GrupoDadosReferencia[] {
  return [
    {
      titulo: 'Rede e operação',
      dados: [
        dados.pontosLed,
        dados.percentualLed,
        dados.totalPontos,
        dados.horasPorNoite,
        dados.tarifa,
        dados.fatorEmissao,
      ],
    },
    {
      titulo: 'Premissas do LuxSmart',
      dados: [dados.dimerizacao, dados.custoKit, dados.perfilMovimentoNoturno],
    },
    ...TIPOS_VIA.map((via) => ({
      titulo: ROTULO_VIA[via],
      dados: [
        dados.vias[via].potenciaLed,
        dados.vias[via].potenciaVaporSodio,
        dados.vias[via].movimento,
        dados.vias[via].participacao,
      ],
    })),
  ];
}
