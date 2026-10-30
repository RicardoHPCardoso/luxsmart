/**
 * Gerador pseudoaleatório determinístico (Park–Miller): a mesma semente gera
 * sempre a mesma sequência, então desenhos "aleatórios" não mudam a cada render.
 */
export function aleatorio(semente: number): () => number {
  let s = semente;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}
