/**
 * Perfil de potência ao longo de uma noite típica (18h → 6h).
 *
 * O movimento não é uniforme: há mais carros no início da noite e quase
 * ninguém de madrugada. Usamos um perfil de PESOS por hora (hipótese em
 * `data/indaiatuba.ts`) e o reescalamos para que a média da noite seja igual
 * ao percentual de movimento do tipo de via. Assim o gráfico por hora fica
 * coerente com o consumo anual calculado em `energy.ts`.
 */
import { fatorUsoLuxSmart, potenciaInstantaneaKw } from './energy';

const ITERACOES_BUSCA = 60;

/**
 * Converte pesos relativos em frações de movimento por hora (0–1) cuja média
 * seja exatamente `mediaAlvo`. Valores que passariam de 100% são limitados a
 * 1 e o excedente é redistribuído entre as demais horas.
 */
export function distribuirMovimento(pesos: readonly number[], mediaAlvo: number): number[] {
  if (!Number.isFinite(mediaAlvo) || mediaAlvo < 0 || mediaAlvo > 1) {
    throw new RangeError(`mediaAlvo deve estar entre 0 e 1 (recebido: ${mediaAlvo}).`);
  }
  if (pesos.some((p) => !Number.isFinite(p) || p < 0)) {
    throw new RangeError('Os pesos devem ser números finitos ≥ 0.');
  }

  const n = pesos.length;
  if (n === 0) return [];

  const positivos = pesos.filter((p) => p > 0);
  if (positivos.length === 0) return pesos.map(() => mediaAlvo);

  // Maior média possível mantendo as horas de peso 0 em zero.
  const mediaMaxima = positivos.length / n;
  if (mediaAlvo >= mediaMaxima) {
    const zeros = n - positivos.length;
    const resto = zeros === 0 ? 0 : (mediaAlvo * n - positivos.length) / zeros;
    return pesos.map((p) => (p > 0 ? 1 : resto));
  }

  // Busca binária do fator de escala s tal que média(min(1, peso × s)) = alvo.
  const media = (s: number) => pesos.reduce((acc, p) => acc + Math.min(1, p * s), 0) / n;
  let baixo = 0;
  let alto = 1 / Math.min(...positivos);
  for (let i = 0; i < ITERACOES_BUSCA; i++) {
    const meio = (baixo + alto) / 2;
    if (media(meio) < mediaAlvo) baixo = meio;
    else alto = meio;
  }
  const escala = (baixo + alto) / 2;
  return pesos.map((p) => Math.min(1, p * escala));
}

export interface GrupoIluminacao {
  pontos: number;
  potenciaW: number;
  /** Fração média da noite com movimento (0–1). */
  movimento: number;
}

export interface PontoNoite {
  /** Rótulo da hora, ex.: "18h". */
  hora: string;
  /** Potência total no cenário atual (LED a 100%), em kW. */
  atualKw: number;
  /** Potência total no cenário LuxSmart, em kW. */
  luxsmartKw: number;
}

/**
 * Potência instantânea (kW) hora a hora, somando todos os grupos.
 * Inclui um ponto final (6h) repetindo a última hora, para gráficos em degrau.
 */
export function perfilPotenciaNoite(
  grupos: readonly GrupoIluminacao[],
  dimerizacao: number,
  pesos: readonly number[],
  horaInicio: number,
): PontoNoite[] {
  const movimentoPorGrupo = grupos.map((g) => distribuirMovimento(pesos, g.movimento));

  const pontos = pesos.map((_, hora) => {
    let atualKw = 0;
    let luxsmartKw = 0;
    grupos.forEach((g, i) => {
      const movimento = movimentoPorGrupo[i]?.[hora] ?? 0;
      atualKw += potenciaInstantaneaKw(g.pontos, g.potenciaW, 1);
      luxsmartKw += potenciaInstantaneaKw(
        g.pontos,
        g.potenciaW,
        fatorUsoLuxSmart(movimento, dimerizacao),
      );
    });
    return { hora: rotuloHora(horaInicio + hora), atualKw, luxsmartKw };
  });

  const ultimo = pontos.at(-1);
  if (ultimo) pontos.push({ ...ultimo, hora: rotuloHora(horaInicio + pesos.length) });
  return pontos;
}

function rotuloHora(hora: number): string {
  return `${hora % 24}h`;
}
