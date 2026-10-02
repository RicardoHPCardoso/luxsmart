/**
 * DADOS DE REFERÊNCIA — Indaiatuba (SP)
 * ---------------------------------------------------------------------------
 * Todos os números usados nos cálculos do site vêm deste arquivo.
 * Para ajustar um valor, altere apenas `valor` (e, se for o caso, `fonte`,
 * `observacao` e `status`). Os componentes e gráficos se atualizam sozinhos.
 *
 * `status` indica a procedência do número:
 *   - 'fonte'       → publicado por fonte identificada;
 *   - 'estimativa'  → calculado/aproximado a partir de outros dados;
 *   - 'hipotese'    → premissa do projeto, ainda sem medição;
 *   - 'verificar'   → referência que precisa ser conferida na fonte oficial;
 *   - 'placeholder' → valor provisório, a substituir.
 * Tudo que não for 'fonte' aparece no site com o selo "estimativa"/"a verificar".
 */
import type { DadoReferencia } from './tipos';

export type TipoVia = 'residencial' | 'coletora' | 'avenida';

export const TIPOS_VIA: readonly TipoVia[] = ['residencial', 'coletora', 'avenida'];

export const ROTULO_VIA: Record<TipoVia, string> = {
  residencial: 'Vias residenciais',
  coletora: 'Vias coletoras',
  avenida: 'Avenidas',
};

export interface DadosVia {
  /** Potência típica da luminária LED usada neste tipo de via. */
  potenciaLed: DadoReferencia;
  /** Potência de sistema equivalente em vapor de sódio (cenário histórico). */
  potenciaVaporSodio: DadoReferencia;
  /** Fração da noite com carro/pedestre dentro do raio do sensor. */
  movimento: DadoReferencia;
  /** Fração dos pontos de LED da cidade instalados neste tipo de via. */
  participacao: DadoReferencia;
}

export interface DadosCidade {
  cidade: string;
  pontosLed: DadoReferencia;
  percentualLed: DadoReferencia;
  totalPontos: DadoReferencia;
  horasPorNoite: DadoReferencia;
  tarifa: DadoReferencia;
  fatorEmissao: DadoReferencia;
  dimerizacao: DadoReferencia;
  custoKit: DadoReferencia;
  vias: Record<TipoVia, DadosVia>;
  perfilMovimentoNoturno: DadoReferencia<readonly number[]>;
}

const FONTE_PREFEITURA = 'Prefeitura de Indaiatuba / Correio da Manhã (set/2026)';
const FONTE_POTENCIAS =
  'Potências típicas de luminárias LED de iluminação pública usadas na cidade';
const OBS_MOVIMENTO =
  'Hipótese do projeto. Deve ser substituída por medições do protótipo (contagem de detecções por noite).';

const pontosLed: DadoReferencia = {
  rotulo: 'Pontos de iluminação em LED',
  valor: 28_000,
  unidade: 'pontos',
  status: 'fonte',
  fonte: FONTE_PREFEITURA,
  observacao: 'Número aproximado ("cerca de 28 mil pontos em LED") divulgado pela Prefeitura.',
};

const percentualLed: DadoReferencia = {
  rotulo: 'Parcela da rede já em LED',
  valor: 0.9,
  unidade: '%',
  status: 'fonte',
  fonte: FONTE_PREFEITURA,
  observacao: 'Cerca de 90% da iluminação pública da cidade já utiliza LED.',
};

export const INDAIATUBA: DadosCidade = {
  cidade: 'Indaiatuba – SP',

  pontosLed,
  percentualLed,

  totalPontos: {
    rotulo: 'Total de pontos da rede',
    valor: 31_000,
    unidade: 'pontos',
    status: 'estimativa',
    fonte: 'Cálculo do projeto a partir dos dados da Prefeitura',
    observacao:
      '28 mil pontos em LED ÷ 90% ≈ 31 mil pontos no total. Confirmar com o cadastro oficial da rede.',
  },

  horasPorNoite: {
    rotulo: 'Horas de funcionamento por noite',
    valor: 11 + 52 / 60,
    unidade: 'h/noite',
    status: 'verificar',
    fonte: 'ANEEL — referência de faturamento da iluminação pública (11h52min por dia)',
    observacao:
      'Tempo diário convencionado para faturar a iluminação pública sem medição. Conferir o dispositivo na regulamentação vigente da ANEEL.',
  },

  tarifa: {
    rotulo: 'Tarifa de energia',
    valor: 0.5,
    unidade: 'R$/kWh',
    status: 'placeholder',
    fonte: 'Valor provisório do projeto',
    observacao: 'Ajustar pela tarifa B4a vigente da distribuidora local (com tributos).',
  },

  fatorEmissao: {
    rotulo: 'Fator de emissão de CO₂ do SIN',
    valor: 0.04,
    unidade: 'kg CO₂/kWh',
    status: 'verificar',
    fonte: 'MCTI — fator médio anual de emissão do Sistema Interligado Nacional',
    observacao:
      'Verificar o valor atual publicado pelo MCTI. O fator muda a cada ano conforme o uso de termelétricas.',
  },

  dimerizacao: {
    rotulo: 'Nível de dimerização sem movimento',
    valor: 0.3,
    unidade: '% da potência',
    status: 'hipotese',
    fonte: 'Premissa do projeto LuxSmart',
    observacao:
      'Potência usada à noite quando não há ninguém por perto. Ajustar conforme norma de iluminação (ABNT NBR 5101) e testes.',
  },

  custoKit: {
    rotulo: 'Custo do kit inteligente por ponto',
    valor: 400,
    unidade: 'R$/ponto',
    status: 'placeholder',
    fonte: 'Valor provisório do projeto',
    observacao:
      'Sensores (LDR e presença) + ESP32 + interface de dimerização da luminária + instalação, por poste. Substituir pelo orçamento real.',
  },

  vias: {
    residencial: {
      potenciaLed: {
        rotulo: 'Potência LED — vias residenciais',
        valor: 84,
        unidade: 'W',
        status: 'verificar',
        fonte: FONTE_POTENCIAS,
        observacao: 'Confirmar com o cadastro de iluminação pública da Prefeitura.',
      },
      potenciaVaporSodio: {
        rotulo: 'Vapor de sódio equivalente — residenciais',
        valor: 165,
        unidade: 'W',
        status: 'estimativa',
        fonte: 'Equivalência típica em projetos de substituição por LED',
        observacao:
          'Lâmpada de 150 W + cerca de 10% de perdas no reator. Apenas referência histórica.',
      },
      movimento: {
        rotulo: 'Noite com movimento — residenciais',
        valor: 0.2,
        unidade: '% da noite',
        status: 'hipotese',
        fonte: 'Premissa do projeto LuxSmart',
        observacao: OBS_MOVIMENTO,
      },
      participacao: {
        rotulo: 'Pontos em vias residenciais',
        valor: 0.7,
        unidade: '% dos pontos',
        status: 'hipotese',
        fonte: 'Premissa do projeto LuxSmart',
        observacao: 'Distribuição hipotética. Substituir pelo cadastro de pontos por tipo de via.',
      },
    },
    coletora: {
      potenciaLed: {
        rotulo: 'Potência LED — vias coletoras',
        valor: 138,
        unidade: 'W',
        status: 'verificar',
        fonte: FONTE_POTENCIAS,
        observacao: 'Confirmar com o cadastro de iluminação pública da Prefeitura.',
      },
      potenciaVaporSodio: {
        rotulo: 'Vapor de sódio equivalente — coletoras',
        valor: 275,
        unidade: 'W',
        status: 'estimativa',
        fonte: 'Equivalência típica em projetos de substituição por LED',
        observacao:
          'Lâmpada de 250 W + cerca de 10% de perdas no reator. Apenas referência histórica.',
      },
      movimento: {
        rotulo: 'Noite com movimento — coletoras',
        valor: 0.45,
        unidade: '% da noite',
        status: 'hipotese',
        fonte: 'Premissa do projeto LuxSmart',
        observacao: OBS_MOVIMENTO,
      },
      participacao: {
        rotulo: 'Pontos em vias coletoras',
        valor: 0.2,
        unidade: '% dos pontos',
        status: 'hipotese',
        fonte: 'Premissa do projeto LuxSmart',
        observacao: 'Distribuição hipotética. Substituir pelo cadastro de pontos por tipo de via.',
      },
    },
    avenida: {
      potenciaLed: {
        rotulo: 'Potência LED — avenidas',
        valor: 190,
        unidade: 'W',
        status: 'verificar',
        fonte: FONTE_POTENCIAS,
        observacao: 'Confirmar com o cadastro de iluminação pública da Prefeitura.',
      },
      potenciaVaporSodio: {
        rotulo: 'Vapor de sódio equivalente — avenidas',
        valor: 440,
        unidade: 'W',
        status: 'estimativa',
        fonte: 'Equivalência típica em projetos de substituição por LED',
        observacao:
          'Lâmpada de 400 W + cerca de 10% de perdas no reator. Apenas referência histórica.',
      },
      movimento: {
        rotulo: 'Noite com movimento — avenidas',
        valor: 0.7,
        unidade: '% da noite',
        status: 'hipotese',
        fonte: 'Premissa do projeto LuxSmart',
        observacao: OBS_MOVIMENTO,
      },
      participacao: {
        rotulo: 'Pontos em avenidas',
        valor: 0.1,
        unidade: '% dos pontos',
        status: 'hipotese',
        fonte: 'Premissa do projeto LuxSmart',
        observacao: 'Distribuição hipotética. Substituir pelo cadastro de pontos por tipo de via.',
      },
    },
  },

  /**
   * Peso relativo de movimento em cada hora da noite (18h → 5h).
   * Só a FORMA importa: os valores são reescalados para que a média da noite
   * seja igual ao `movimento` de cada tipo de via.
   */
  perfilMovimentoNoturno: {
    rotulo: 'Perfil de movimento ao longo da noite',
    valor: [1, 1, 0.85, 0.65, 0.45, 0.3, 0.18, 0.1, 0.07, 0.07, 0.15, 0.5],
    unidade: 'peso relativo por hora (18h–5h)',
    status: 'hipotese',
    fonte: 'Premissa do projeto LuxSmart',
    observacao:
      'Mais movimento no início da noite e no começo da manhã, pouco na madrugada. Substituir por medições.',
  },
};

/** Primeira hora do perfil noturno (18h). */
export const HORA_INICIO_NOITE = 18;

/** Nome do tipo de filtro "cidade toda" usado no dashboard. */
export type FiltroVia = TipoVia | 'cidade';
