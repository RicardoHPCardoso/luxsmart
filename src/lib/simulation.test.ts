import { describe, expect, it } from 'vitest';
import {
  adicionarAgente,
  aproximar,
  atualizarPoste,
  consumoInstantaneo,
  criarEstadoInicial,
  criarPostes,
  detecta,
  estaOciosa,
  passo,
  type ConfigSimulacao,
  type EstadoSimulacao,
} from './simulation';

const CFG: ConfigSimulacao = {
  quantidadePostes: 4,
  comprimentoRua: 400,
  raioDeteccao: 40,
  tempoEsperaS: 2,
  rampaSubidaPorS: 10,
  rampaDescidaPorS: 1,
  velocidade: { carro: 100, pedestre: 20 },
  duracaoToqueS: 1,
  margem: 50,
  maxAgentes: 3,
  dimerizacao: 0.3,
  potenciaW: 100,
};

/** Roda a simulação por `segundos` em passos de 1/60 s. */
function rodar(estado: EstadoSimulacao, segundos: number): EstadoSimulacao {
  let e = estado;
  const dt = 1 / 60;
  for (let t = 0; t < segundos; t += dt) e = passo(e, dt, CFG);
  return e;
}

describe('criarPostes', () => {
  it('distribui os postes igualmente, começando no nível informado', () => {
    const postes = criarPostes(4, 400, 0.3);
    expect(postes.map((p) => p.x)).toEqual([50, 150, 250, 350]);
    expect(postes.every((p) => p.nivel === 0.3 && !p.detectando)).toBe(true);
  });
});

describe('detecta', () => {
  it('considera o raio do sensor (inclusive a borda)', () => {
    const agente = { id: 1, tipo: 'carro' as const, x: 90, velocidade: 0, vida: 0 };
    expect(detecta({ x: 50 }, [agente], 40)).toBe(true);
    expect(detecta({ x: 50 }, [{ ...agente, x: 91 }], 40)).toBe(false);
    expect(detecta({ x: 50 }, [], 40)).toBe(false);
  });
});

describe('aproximar', () => {
  it('sobe e desce com rampas diferentes, sem passar do alvo', () => {
    expect(aproximar(0.3, 1, 10, 1, 0.05)).toBeCloseTo(0.8);
    expect(aproximar(0.9, 1, 10, 1, 0.05)).toBe(1);
    expect(aproximar(1, 0.3, 10, 1, 0.1)).toBeCloseTo(0.9);
    expect(aproximar(0.35, 0.3, 10, 1, 0.1)).toBe(0.3);
    expect(aproximar(0.3, 0.3, 10, 1, 0.1)).toBe(0.3);
  });
});

describe('ciclo de um poste', () => {
  it('sem movimento, a rua fica no modo econômico e ociosa', () => {
    const e = rodar(criarEstadoInicial(CFG), 1);
    expect(e.postes.every((p) => p.nivel === CFG.dimerizacao)).toBe(true);
    expect(estaOciosa(e, CFG)).toBe(true);
  });

  it('um toque acende o poste, que espera e depois volta a dimerizar', () => {
    let e = adicionarAgente(criarEstadoInicial(CFG), 'toque', CFG, 150);
    expect(estaOciosa(e, CFG)).toBe(false);

    e = rodar(e, 0.3);
    const poste = e.postes[1]!;
    expect(poste.detectando).toBe(true);
    expect(poste.nivel).toBe(1);
    // Postes vizinhos não são afetados (fora do raio).
    expect(e.postes[0]!.nivel).toBe(CFG.dimerizacao);

    // O toque dura 1 s; depois o poste segura 100% durante o tempo de espera (2 s).
    e = rodar(e, 1 + 1.5);
    expect(e.agentes).toHaveLength(0);
    expect(e.postes[1]!.nivel).toBe(1);

    // Passada a espera, desce a 1/s até o nível econômico (0,7 s) e fica ociosa.
    e = rodar(e, 0.6 + 1);
    expect(e.postes[1]!.nivel).toBe(CFG.dimerizacao);
    expect(estaOciosa(e, CFG)).toBe(true);
  });

  it('um carro atravessa a rua acendendo os postes em sequência e sai', () => {
    let e = adicionarAgente(criarEstadoInicial(CFG), 'carro', CFG);
    expect(e.agentes[0]!.x).toBe(-CFG.margem);

    e = rodar(e, 1.2); // x ≈ 70: dentro do raio do 1º poste (50)
    expect(e.postes[0]!.detectando).toBe(true);
    expect(e.postes[3]!.detectando).toBe(false);

    e = rodar(e, 4); // já saiu da rua
    expect(e.agentes).toHaveLength(0);
  });

  it('pedestres entram pela direita e andam para a esquerda', () => {
    const e = adicionarAgente(criarEstadoInicial(CFG), 'pedestre', CFG);
    expect(e.agentes[0]!.x).toBe(CFG.comprimentoRua + CFG.margem);
    expect(e.agentes[0]!.velocidade).toBeLessThan(0);
  });

  it('respeita o limite de agentes', () => {
    let e = criarEstadoInicial(CFG);
    for (let i = 0; i < 5; i++) e = adicionarAgente(e, 'carro', CFG);
    expect(e.agentes).toHaveLength(CFG.maxAgentes);
  });
});

describe('consumoInstantaneo', () => {
  it('compara com todos os postes a 100%', () => {
    const e = criarEstadoInicial(CFG);
    const c = consumoInstantaneo(e.postes, CFG.potenciaW);
    expect(c.todos100W).toBe(400);
    expect(c.atualW).toBeCloseTo(120);
    expect(c.fracao).toBeCloseTo(0.3);
    expect(c.acesosTotal).toBe(0);

    const umAceso = e.postes.map((p, i) => (i === 0 ? { ...p, nivel: 1 } : p));
    expect(consumoInstantaneo(umAceso, CFG.potenciaW).acesosTotal).toBe(1);
    expect(consumoInstantaneo([], CFG.potenciaW).fracao).toBe(0);
  });
});

describe('atualizarPoste', () => {
  const poste = criarPostes(1, 100, CFG.dimerizacao)[0]!;

  it('de dia o sensor de luminosidade desliga a luz, mesmo com movimento', () => {
    let p = { ...poste, nivel: 1 };
    for (let i = 0; i < 120; i++) p = atualizarPoste(p, true, 1 / 60, CFG, true);
    expect(p.nivel).toBe(0);
  });

  it('à noite, movimento leva a 100%', () => {
    const p = atualizarPoste(poste, true, 1, CFG);
    expect(p.nivel).toBe(1);
    expect(p.semMovimentoHa).toBe(0);
  });
});
