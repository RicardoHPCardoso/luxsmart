/**
 * Parâmetros da rua do bloco "Simule a economia".
 * Distâncias em "unidades" da rua desenhada (0 a `comprimentoRua`) e tempos
 * em segundos. As velocidades são aceleradas para a demonstração caber em
 * poucos segundos — não representam km/h reais.
 */
import { INDAIATUBA } from './indaiatuba';

export const CONFIG_SIMULADOR = {
  quantidadePostes: 5,
  /** Com 5 postes, 600 unidades mantêm a rua alta o bastante no celular. */
  comprimentoRua: 600,
  /** Alcance do sensor de presença, medido a partir da luminária. */
  raioDeteccao: 60,
  /** Tempo a 100% depois que o movimento sai do raio ("alguns segundos"). */
  tempoEsperaS: 2.5,
  /** Velocidade de subida/descida da luz (fração da potência por segundo). */
  rampaSubidaPorS: 5,
  rampaDescidaPorS: 0.9,
  velocidade: {
    carro: 230,
    pedestre: 70,
  },
  /** Quanto dura o "movimento" criado com um clique na rua. */
  duracaoToqueS: 1.6,
  /** Distância fora da tela em que os agentes surgem e somem. */
  margem: 60,
  maxAgentes: 12,
  /** Nível econômico e potência vêm dos dados de referência (via residencial). */
  dimerizacao: INDAIATUBA.dimerizacao.valor,
  potenciaW: INDAIATUBA.vias.residencial.potenciaLed.valor,
} as const;
