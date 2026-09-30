/**
 * Constantes da cena 3D do hero (unidades do three.js ≈ metros).
 * A rua corre no eixo X; os postes ficam na calçada do fundo (z negativo) e
 * o carro anda na faixa da frente, sempre da esquerda para a direita.
 */
import { INDAIATUBA } from '@/data/indaiatuba';
import type { RegraPoste } from '@/lib/simulation';

export const POSTES = {
  quantidade: 8,
  espacamento: 6,
  /** X do primeiro poste (os demais seguem para a direita). */
  inicioX: -21,
  zTronco: -3.6,
  altura: 5.2,
  /** Comprimento do braço que leva a luminária sobre a rua. */
  braco: 1.3,
} as const;

export const CARRO = {
  z: 1.1,
  velocidade: 7,
  inicioX: -36,
  fimX: 36,
  /** Pausa (s) antes de o carro reaparecer no começo da rua. */
  pausaS: 1.5,
} as const;

/** Alcance do sensor de presença (menor que metade do espaçamento: zonas não se sobrepõem). */
export const RAIO_DETECCAO = 3.4;

export const REGRA_POSTE: RegraPoste = {
  tempoEsperaS: 1.6,
  rampaSubidaPorS: 4,
  rampaDescidaPorS: 0.8,
  dimerizacao: INDAIATUBA.dimerizacao.valor,
};

export const CORES = {
  ceuNoite: '#060F22',
  ceuDia: '#9CC3FF',
  chaoNoite: '#07101F',
  chaoDia: '#8FA3C4',
  predioNoite: '#0E2244',
  predioDia: '#B7CAEA',
  ruaNoite: '#0B1528',
  ruaDia: '#5B6B86',
  calcadaNoite: '#1B2E52',
  calcadaDia: '#C9D5EA',
  poste: '#2B4170',
  luminaria: '#34507F',
  luz: '#FFC83D',
  luzClara: '#FFF4D1',
  carro: '#1E5EFF',
  sensor: '#8AB0FF',
  arvore: '#12325E',
} as const;

export const CAMERA = {
  fov: 42,
  /** Posição e alvo para telas largas (16:9) e estreitas (≈ 4:3 ou retrato). */
  larga: { posicao: [19, 6.5, 14], alvo: [-3, 2.4, -3] },
  estreita: { posicao: [26, 9, 21], alvo: [-4, 2.4, -3] },
  /** Amplitude do parallax que segue o ponteiro. */
  parallax: [0.9, 0.45],
} as const;

/** Velocidade da transição dia ⇄ noite (fração por segundo). */
export const VELOCIDADE_TRANSICAO_CEU = 0.9;

export const POSICOES_POSTES = Array.from(
  { length: POSTES.quantidade },
  (_, i) => POSTES.inicioX + i * POSTES.espacamento,
);

/** Z da luminária (e do sensor), já sobre a rua. */
export const Z_LUMINARIA = POSTES.zTronco + POSTES.braco;
