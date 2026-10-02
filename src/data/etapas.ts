/**
 * Os três estados do poste, na ordem em que aparecem na seção "Como funciona".
 * Cada estado indica a cadeia de componentes responsável pela decisão.
 */
import type { IdComponente } from './hardware';
import { INDAIATUBA } from './indaiatuba';

export type IdEtapa = 'dia' | 'noite' | 'movimento';

/** Um passo da cadeia de decisão: qual componente age e o que ele faz. */
export interface PassoCadeia {
  componente: IdComponente;
  acao: string;
}

export interface Etapa {
  id: IdEtapa;
  titulo: string;
  resumo: string;
  descricao: string;
  /** Intensidade dos LEDs nesta etapa (0–1), definida pelo PWM. */
  intensidade: number;
  /** Componentes que estão enviando/recebendo sinal nesta etapa. */
  ativos: readonly IdComponente[];
  /** Componente(s) responsável(is) → ação, exibidos como uma cadeia. */
  cadeia: readonly PassoCadeia[];
  /** Leituras exibidas nos sensores do diagrama. */
  leituras: {
    ldr: string;
    presenca: string;
  };
}

const NIVEL_BAIXO = Math.round(INDAIATUBA.dimerizacao.valor * 100);

export const ETAPAS: readonly Etapa[] = [
  {
    id: 'dia',
    titulo: 'Dia',
    resumo: 'Desligado',
    descricao:
      'O LDR detecta a luz do dia e o ESP32 mantém os LEDs desligados. Nenhuma energia é gasta à toa.',
    intensidade: 0,
    ativos: ['ldr', 'esp32'],
    cadeia: [
      { componente: 'ldr', acao: 'detecta luz' },
      { componente: 'esp32', acao: 'desliga os LEDs' },
    ],
    leituras: { ldr: 'claro', presenca: 'ignorada' },
  },
  {
    id: 'noite',
    titulo: 'Noite sem movimento',
    resumo: `Econômico (${NIVEL_BAIXO}%)`,
    descricao: `Escureceu e ninguém está por perto: o ESP32 mantém o PWM em nível baixo (${NIVEL_BAIXO}%), iluminando o suficiente para orientação e consumindo bem menos.`,
    intensidade: INDAIATUBA.dimerizacao.valor,
    ativos: ['ldr', 'esp32', 'pwm', 'leds'],
    cadeia: [
      { componente: 'ldr', acao: 'detecta pouca luz' },
      { componente: 'pwm', acao: `em nível baixo (${NIVEL_BAIXO}%)` },
    ],
    leituras: { ldr: 'escuro', presenca: 'ninguém' },
  },
  {
    id: 'movimento',
    titulo: 'Movimento detectado',
    resumo: 'Luz total (100%)',
    descricao:
      'O PIR/HC-SR04 detecta um carro ou pedestre e o ESP32 leva o PWM a 100% na hora. Alguns segundos depois que o movimento acaba, volta ao modo econômico.',
    intensidade: 1,
    ativos: ['ldr', 'presenca', 'esp32', 'pwm', 'leds'],
    cadeia: [
      { componente: 'presenca', acao: 'detecta movimento' },
      { componente: 'pwm', acao: 'em 100%' },
    ],
    leituras: { ldr: 'escuro', presenca: 'detectada' },
  },
];
