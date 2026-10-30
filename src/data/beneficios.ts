/**
 * Benefícios, exibidos como chips na seção "O problema e a solução".
 * `icone` referencia um ícone em components/icons.
 */
import type { NomeIcone } from '@/components/icons/icons';

export interface Beneficio {
  titulo: string;
  icone: NomeIcone;
  /** Depende de um recurso ainda não implementado (ex.: Wi-Fi). */
  previsto?: boolean;
}

export const BENEFICIOS: readonly Beneficio[] = [
  { titulo: 'Economia na conta de luz', icone: 'moeda' },
  { titulo: 'Segurança mantida', icone: 'escudo' },
  { titulo: 'Menos poluição luminosa', icone: 'estrela' },
  { titulo: 'LED dura mais', icone: 'ciclo' },
  { titulo: 'Dados para a prefeitura', icone: 'grafico', previsto: true },
  { titulo: 'ODS 7 e 11 da ONU', icone: 'globo' },
];
