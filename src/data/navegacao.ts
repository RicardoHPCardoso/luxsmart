/**
 * IDs das seções (usados nas âncoras) e itens do menu.
 */
export const SECOES = {
  inicio: 'inicio',
  problema: 'problema',
  comoFunciona: 'como-funciona',
  simulador: 'simulador',
  dashboard: 'dashboard',
  calculadora: 'calculadora',
  beneficios: 'beneficios',
  roadmap: 'roadmap',
  equipe: 'equipe',
  metodologia: 'metodologia',
} as const;

export type IdSecao = (typeof SECOES)[keyof typeof SECOES];

export interface ItemNavegacao {
  id: IdSecao;
  rotulo: string;
  /** Exibido no menu principal em telas largas (os demais só no menu móvel). */
  destaque: boolean;
}

export const NAVEGACAO: readonly ItemNavegacao[] = [
  { id: SECOES.problema, rotulo: 'O problema', destaque: false },
  { id: SECOES.comoFunciona, rotulo: 'Como funciona', destaque: true },
  { id: SECOES.simulador, rotulo: 'Simulador', destaque: true },
  { id: SECOES.dashboard, rotulo: 'Economia', destaque: true },
  { id: SECOES.calculadora, rotulo: 'Calculadora', destaque: true },
  { id: SECOES.beneficios, rotulo: 'Benefícios', destaque: false },
  { id: SECOES.roadmap, rotulo: 'Roadmap', destaque: false },
  { id: SECOES.equipe, rotulo: 'Equipe', destaque: true },
  { id: SECOES.metodologia, rotulo: 'Metodologia', destaque: true },
];
