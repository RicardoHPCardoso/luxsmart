/**
 * Os três estados do poste, na ordem em que aparecem na seção "Como funciona".
 */
import type { IdComponente } from './hardware';
import { INDAIATUBA } from './indaiatuba';

export type IdEtapa = 'dia' | 'noite' | 'movimento';

export interface Etapa {
  id: IdEtapa;
  titulo: string;
  resumo: string;
  descricao: string;
  /** Potência da luminária nesta etapa (0–1). */
  intensidade: number;
  /** Componentes que estão enviando/recebendo sinal nesta etapa. */
  ativos: readonly IdComponente[];
  /** Leituras exibidas ao lado do diagrama. */
  leituras: {
    luminosidade: string;
    presenca: string;
  };
}

const dimerizacao = INDAIATUBA.dimerizacao.valor;

export const ETAPAS: readonly Etapa[] = [
  {
    id: 'dia',
    titulo: 'Dia',
    resumo: 'Desligado',
    descricao:
      'O sensor de luminosidade percebe a luz do sol e o microcontrolador mantém a luminária desligada. Nenhuma energia é gasta à toa.',
    intensidade: 0,
    ativos: ['luminosidade', 'microcontrolador'],
    leituras: { luminosidade: 'claro', presenca: 'ignorada' },
  },
  {
    id: 'noite',
    titulo: 'Noite sem movimento',
    resumo: `Econômico (${Math.round(dimerizacao * 100)}%)`,
    descricao:
      'Escureceu e não há ninguém por perto: a luz fica dimerizada, iluminando o suficiente para orientação e consumindo bem menos.',
    intensidade: dimerizacao,
    ativos: ['luminosidade', 'microcontrolador', 'driver', 'luminaria'],
    leituras: { luminosidade: 'escuro', presenca: 'ninguém' },
  },
  {
    id: 'movimento',
    titulo: 'Movimento detectado',
    resumo: 'Luz total (100%)',
    descricao:
      'Um carro ou pedestre entra no raio do sensor e a luz vai a 100% na hora. Alguns segundos depois que o movimento acaba, volta ao modo econômico.',
    intensidade: 1,
    ativos: ['luminosidade', 'presenca', 'microcontrolador', 'driver', 'luminaria'],
    leituras: { luminosidade: 'escuro', presenca: 'detectada' },
  },
];
