/**
 * EQUIPE. Substitua pelos dados reais do grupo.
 * `foto` é opcional: coloque a imagem em `public/equipe/` e informe o caminho
 * (ex.: "equipe/ana.webp"). Sem foto, o card exibe as iniciais.
 */

export interface Integrante {
  nome: string;
  funcao: string;
  foto?: string;
  /** Link opcional (LinkedIn, GitHub...). */
  link?: string;
}

export const EQUIPE: readonly Integrante[] = [
  { nome: 'Integrante 1', funcao: 'Front-end e visualização de dados' },
  { nome: 'Integrante 2', funcao: 'Hardware e sensores' },
  { nome: 'Integrante 3', funcao: 'Firmware do microcontrolador' },
  { nome: 'Integrante 4', funcao: 'Pesquisa e análise de dados' },
  { nome: 'Integrante 5', funcao: 'Documentação e testes' },
];
