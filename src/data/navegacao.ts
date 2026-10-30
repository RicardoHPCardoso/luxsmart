/**
 * IDs das seções (usados nas âncoras) e itens do menu.
 */
export const SECOES = {
  inicio: 'inicio',
  problema: 'problema',
  comoFunciona: 'como-funciona',
  resultados: 'resultados',
  simule: 'simule',
  equipe: 'equipe',
  // Seções antigas, removidas ao longo da simplificação.
  calculadora: 'calculadora',
  beneficios: 'beneficios',
  roadmap: 'roadmap',
  metodologia: 'metodologia',
} as const;

export type IdSecao = (typeof SECOES)[keyof typeof SECOES];

export interface ItemNavegacao {
  id: IdSecao;
  rotulo: string;
}

export const NAVEGACAO: readonly ItemNavegacao[] = [
  { id: SECOES.inicio, rotulo: 'Início' },
  { id: SECOES.problema, rotulo: 'O problema' },
  { id: SECOES.comoFunciona, rotulo: 'Como funciona' },
  { id: SECOES.resultados, rotulo: 'Resultados' },
  { id: SECOES.simule, rotulo: 'Simule' },
  { id: SECOES.equipe, rotulo: 'Equipe' },
];
