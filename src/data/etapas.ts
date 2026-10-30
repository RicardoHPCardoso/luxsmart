/**
 * Os três modos do poste, na ordem em que aparecem em "Como funciona".
 * Cada frase cita o componente responsável, em linguagem simples.
 */
import type { NomeIcone } from '@/components/icons/icons';
import { INDAIATUBA } from './indaiatuba';

export type IdEtapa = 'dia' | 'noite' | 'movimento';

export interface Etapa {
  id: IdEtapa;
  titulo: string;
  resumo: string;
  /** Uma frase (no máximo 2 linhas). */
  descricao: string;
  /** Intensidade dos LEDs neste modo (0–1), definida pelo PWM. */
  intensidade: number;
  icone: NomeIcone;
}

const NIVEL_BAIXO = Math.round(INDAIATUBA.dimerizacao.valor * 100);

export const ETAPAS: readonly Etapa[] = [
  {
    id: 'dia',
    titulo: 'Dia',
    resumo: 'Desligado',
    descricao: 'O sensor de luz (LDR) percebe o dia e o ESP32 desliga os LEDs.',
    intensidade: 0,
    icone: 'sol',
  },
  {
    id: 'noite',
    titulo: 'Noite sem movimento',
    resumo: `Luz fraca (${NIVEL_BAIXO}%)`,
    descricao: `Rua vazia: o ESP32 deixa a luz em ${NIVEL_BAIXO}% pelo PWM.`,
    intensidade: INDAIATUBA.dimerizacao.valor,
    icone: 'lua',
  },
  {
    id: 'movimento',
    titulo: 'Movimento',
    resumo: 'Luz total (100%)',
    descricao: 'O sensor de presença percebe alguém e a luz vai a 100%.',
    intensidade: 1,
    icone: 'pedestre',
  },
];
