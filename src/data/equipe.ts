/**
 * EQUIPE, agrupada por área de atuação (na ordem de exibição).
 *
 * Campos opcionais de cada integrante:
 *   - `foto`: coloque a imagem em `public/equipe/` e informe o caminho
 *     (ex.: "equipe/eduardo.webp"). Sem foto, o avatar mostra as iniciais;
 *   - `github` / `linkedin`: URLs completas dos perfis.
 */
import type { NomeIcone } from '@/components/icons/icons';

export interface Integrante {
  nome: string;
  foto?: string;
  github?: string;
  linkedin?: string;
}

export interface AreaEquipe {
  id: string;
  titulo: string;
  descricao: string;
  icone: NomeIcone;
  integrantes: readonly Integrante[];
}

export const EQUIPE: readonly AreaEquipe[] = [
  {
    id: 'documentacao',
    titulo: 'Documentação',
    descricao: 'Elaboração e atualização da documentação do projeto.',
    icone: 'documento',
    integrantes: [{ nome: 'Eduardo Bortoleto' }],
  },
  {
    id: 'circuito',
    titulo: 'Circuito e eletrônica',
    descricao: 'Desenvolvimento do circuito e organização dos componentes eletrônicos.',
    icone: 'circuito',
    integrantes: [{ nome: 'João Pedro Laguna' }, { nome: 'João Vitor Fonseca' }],
  },
  {
    id: 'maquete',
    titulo: 'Maquete',
    descricao: 'Construção e organização da maquete.',
    icone: 'maquete',
    integrantes: [{ nome: 'Jônatas Andrade Fonseca' }, { nome: 'Samuel Santos Cruz' }],
  },
  {
    id: 'back-end',
    titulo: 'Back-end',
    descricao: 'Programação do back-end.',
    icone: 'servidor',
    integrantes: [{ nome: 'João Pedro de Carvalho Pacheco' }],
  },
  {
    id: 'front-end',
    titulo: 'Front-end',
    descricao: 'Programação do front-end.',
    icone: 'codigo',
    integrantes: [{ nome: 'Ricardo Henrique Pereira Cardoso' }],
  },
];
