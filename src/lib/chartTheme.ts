/**
 * Cores dos cenários, usadas no gráfico de Resultados e no bloco "Simule".
 *
 * A cor segue o CENÁRIO (nunca a posição):
 *   - LuxSmart     → amarelo da marca (a "luz"), série em destaque;
 *   - Atual (LED)  → azul;
 *   - Convencional → cinza-azulado de baixa ênfase (referência histórica).
 *
 * Paleta validada sobre a superfície azul-noite (#0A1A33): separação para
 * daltonismo (protan/deutan) ≥ 17 ΔE, visão normal ≥ 18 ΔE e contraste ≥ 3:1.
 * Por isso as barras ficam sobre fundo escuro, e toda barra tem rótulo e valor
 * em texto ao lado — a identidade nunca depende só da cor.
 */
import type { Cenario } from './energy';

export const COR_CENARIO: Record<Cenario, string> = {
  convencional: '#8C9BB8',
  atual: '#3B76FF',
  luxsmart: '#FFC83D',
};
