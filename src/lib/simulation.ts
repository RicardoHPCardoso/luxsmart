/**
 * Simulação de uma rua com postes LuxSmart — lógica pura, sem React/DOM.
 *
 * A cada passo de tempo `dt`:
 *   1. carros e pedestres andam; "toques" (cliques na rua) perdem vida;
 *   2. cada poste verifica se há alguém dentro do raio do sensor;
 *   3. o nível-alvo é 100% com movimento (ou durante o tempo de espera depois
 *      dele) e o nível econômico no resto do tempo;
 *   4. o nível real se aproxima do alvo com rampas (sobe rápido, desce devagar).
 */

export type TipoAgente = 'carro' | 'pedestre' | 'toque';

export interface Agente {
  id: number;
  tipo: TipoAgente;
  x: number;
  /** Unidades por segundo (negativa = anda para a esquerda). */
  velocidade: number;
  /** Segundos restantes — só para toques. */
  vida: number;
}

export interface EstadoPoste {
  /** Posição da luminária/sensor. */
  x: number;
  /** Potência atual (0–1). */
  nivel: number;
  detectando: boolean;
  /** Segundos desde a última detecção (Infinity = nunca detectou). */
  semMovimentoHa: number;
}

export interface EstadoSimulacao {
  tempo: number;
  agentes: Agente[];
  postes: EstadoPoste[];
  proximoId: number;
}

export interface ConfigSimulacao {
  quantidadePostes: number;
  comprimentoRua: number;
  raioDeteccao: number;
  tempoEsperaS: number;
  rampaSubidaPorS: number;
  rampaDescidaPorS: number;
  velocidade: { carro: number; pedestre: number };
  duracaoToqueS: number;
  margem: number;
  maxAgentes: number;
  dimerizacao: number;
  potenciaW: number;
}

/** Tolerância para considerar que o nível chegou ao alvo. */
const TOLERANCIA_NIVEL = 1e-3;

/** Postes igualmente espaçados ao longo da rua. */
export function criarPostes(quantidade: number, comprimento: number, nivel: number): EstadoPoste[] {
  const espaco = comprimento / quantidade;
  return Array.from({ length: quantidade }, (_, i) => ({
    x: (i + 0.5) * espaco,
    nivel,
    detectando: false,
    semMovimentoHa: Infinity,
  }));
}

export function criarEstadoInicial(cfg: ConfigSimulacao): EstadoSimulacao {
  return {
    tempo: 0,
    agentes: [],
    postes: criarPostes(cfg.quantidadePostes, cfg.comprimentoRua, cfg.dimerizacao),
    proximoId: 1,
  };
}

/**
 * Adiciona um agente. Carros entram pela esquerda, pedestres pela direita,
 * toques aparecem na posição `x` clicada. Respeita o limite de agentes.
 */
export function adicionarAgente(
  estado: EstadoSimulacao,
  tipo: TipoAgente,
  cfg: ConfigSimulacao,
  x?: number,
): EstadoSimulacao {
  if (estado.agentes.length >= cfg.maxAgentes) return estado;

  const novo: Agente =
    tipo === 'carro'
      ? { id: estado.proximoId, tipo, x: -cfg.margem, velocidade: cfg.velocidade.carro, vida: 0 }
      : tipo === 'pedestre'
        ? {
            id: estado.proximoId,
            tipo,
            x: cfg.comprimentoRua + cfg.margem,
            velocidade: -cfg.velocidade.pedestre,
            vida: 0,
          }
        : {
            id: estado.proximoId,
            tipo,
            x: Math.min(cfg.comprimentoRua, Math.max(0, x ?? cfg.comprimentoRua / 2)),
            velocidade: 0,
            vida: cfg.duracaoToqueS,
          };

  return { ...estado, agentes: [...estado.agentes, novo], proximoId: estado.proximoId + 1 };
}

/** Há alguém dentro do raio do sensor deste poste? */
export function detecta(
  poste: Pick<EstadoPoste, 'x'>,
  agentes: readonly Agente[],
  raio: number,
): boolean {
  return agentes.some((a) => Math.abs(a.x - poste.x) <= raio);
}

/** Aproxima `atual` de `alvo` respeitando as rampas de subida e descida. */
export function aproximar(
  atual: number,
  alvo: number,
  rampaSubida: number,
  rampaDescida: number,
  dt: number,
): number {
  if (atual < alvo) return Math.min(alvo, atual + rampaSubida * dt);
  if (atual > alvo) return Math.max(alvo, atual - rampaDescida * dt);
  return atual;
}

function agenteAtivo(a: Agente, cfg: ConfigSimulacao): boolean {
  if (a.tipo === 'toque') return a.vida > 0;
  return a.x >= -cfg.margem - 1 && a.x <= cfg.comprimentoRua + cfg.margem + 1;
}

/** Avança a simulação em `dt` segundos. */
export function passo(estado: EstadoSimulacao, dt: number, cfg: ConfigSimulacao): EstadoSimulacao {
  const agentes = estado.agentes
    .map((a) =>
      a.tipo === 'toque' ? { ...a, vida: a.vida - dt } : { ...a, x: a.x + a.velocidade * dt },
    )
    .filter((a) => agenteAtivo(a, cfg));

  const postes = estado.postes.map((p) => {
    const detectando = detecta(p, agentes, cfg.raioDeteccao);
    const semMovimentoHa = detectando ? 0 : p.semMovimentoHa + dt;
    const alvo = detectando || semMovimentoHa < cfg.tempoEsperaS ? 1 : cfg.dimerizacao;
    const nivel = aproximar(p.nivel, alvo, cfg.rampaSubidaPorS, cfg.rampaDescidaPorS, dt);
    return { ...p, detectando, semMovimentoHa, nivel };
  });

  return { ...estado, tempo: estado.tempo + dt, agentes, postes };
}

/** Sem agentes e com todos os postes estabilizados no modo econômico. */
export function estaOciosa(estado: EstadoSimulacao, cfg: ConfigSimulacao): boolean {
  return (
    estado.agentes.length === 0 &&
    estado.postes.every(
      (p) =>
        p.semMovimentoHa >= cfg.tempoEsperaS &&
        Math.abs(p.nivel - cfg.dimerizacao) < TOLERANCIA_NIVEL,
    )
  );
}

export interface ConsumoInstantaneo {
  /** Potência total agora (W). */
  atualW: number;
  /** Potência se todos estivessem a 100% (W). */
  todos100W: number;
  /** atualW ÷ todos100W (0–1). */
  fracao: number;
  /** Postes a (quase) 100%. */
  acesosTotal: number;
}

/** Consumo instantâneo da rua comparado a "todos os postes a 100%". */
export function consumoInstantaneo(
  postes: readonly EstadoPoste[],
  potenciaW: number,
): ConsumoInstantaneo {
  const todos100W = postes.length * potenciaW;
  const atualW = postes.reduce((soma, p) => soma + p.nivel * potenciaW, 0);
  return {
    atualW,
    todos100W,
    fracao: todos100W === 0 ? 0 : atualW / todos100W,
    acesosTotal: postes.filter((p) => p.nivel >= 1 - TOLERANCIA_NIVEL).length,
  };
}
