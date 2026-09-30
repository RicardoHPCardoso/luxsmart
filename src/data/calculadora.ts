/**
 * Limites e valores iniciais da CALCULADORA DE ECONOMIA.
 * Frações (movimento, dimerização) vão de 0 a 1.
 */

export interface ValoresCalculadora {
  pontos: number;
  potenciaW: number;
  movimento: number;
  dimerizacao: number;
  /** R$/kWh */
  tarifa: number;
  /** R$ por poste */
  custoKit: number;
}

export interface LimiteCampo {
  min: number;
  max: number;
  passo: number;
}

export const LIMITES_CALCULADORA: Record<keyof ValoresCalculadora, LimiteCampo> = {
  // O slider de postes usa escala logarítmica (de uma rua até a cidade toda).
  pontos: { min: 1, max: 40_000, passo: 1 },
  potenciaW: { min: 20, max: 400, passo: 1 },
  movimento: { min: 0, max: 1, passo: 0.01 },
  dimerizacao: { min: 0, max: 1, passo: 0.01 },
  tarifa: { min: 0.2, max: 2, passo: 0.01 },
  custoKit: { min: 0, max: 2000, passo: 10 },
};

/** Exemplo inicial: uma rua residencial com 30 postes. */
export const EXEMPLO_RUA: ValoresCalculadora = {
  pontos: 30,
  potenciaW: 84,
  movimento: 0.2,
  dimerizacao: 0.3,
  tarifa: 0.5,
  custoKit: 400,
};
