/** Partículas que não entram nas iniciais ("João Pedro de Carvalho" → "JPC"). */
const PARTICULAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'd']);

/**
 * Iniciais a partir do nome completo, ignorando partículas.
 * Ex.: "Ricardo Henrique Pereira Cardoso" → "RHPC"; "Eduardo Bortoleto" → "EB".
 */
export function iniciais(nomeCompleto: string): string {
  return nomeCompleto
    .trim()
    .split(/\s+/)
    .filter((parte) => parte && !PARTICULAS.has(parte.toLocaleLowerCase('pt-BR')))
    .map((parte) => parte.charAt(0).toLocaleUpperCase('pt-BR'))
    .join('');
}
