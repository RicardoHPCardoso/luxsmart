/**
 * Cores e medidas dos gráficos do dashboard.
 *
 * A cor segue o CENÁRIO em todos os gráficos (nunca a posição):
 *   - LuxSmart     → amarelo da marca (a "luz"), série em destaque;
 *   - Atual (LED)  → azul;
 *   - Convencional → cinza-azulado de baixa ênfase (referência histórica).
 *
 * Paleta validada sobre a superfície azul-noite (#0A1A33) com o validador de
 * paletas de visualização: separação para daltonismo (protan/deutan) ≥ 17 ΔE,
 * visão normal ≥ 18 ΔE e contraste ≥ 3:1 em todos os pares. O amarelo fica
 * acima da faixa de luminosidade e o cinza abaixo do piso de croma DE PROPÓSITO:
 * é o padrão "destaque + contexto". Por isso toda série também tem legenda,
 * rótulo direto e tabela de dados — a identidade nunca depende só da cor.
 */
import type { Cenario } from './energy';

export const COR_CENARIO: Record<Cenario, string> = {
  convencional: '#8C9BB8',
  atual: '#3B76FF',
  luxsmart: '#FFC83D',
};

export const TEMA_GRAFICO = {
  superficie: '#0A1A33',
  grade: '#22365A',
  eixo: '#A9B8D6',
  texto: '#FFFFFF',
  cursor: '#8AB0FF',
  /** Espessura máxima das barras (px). */
  espessuraBarra: 24,
  /** Opacidade do preenchimento de áreas. */
  opacidadeArea: 0.12,
  alturaGrafico: 280,
} as const;
