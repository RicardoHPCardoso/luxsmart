import { useInView } from 'framer-motion';
import { useCallback, useEffect, useState, type RefObject } from 'react';
import {
  adicionarAgente,
  criarEstadoInicial,
  estaOciosa,
  passo,
  type ConfigSimulacao,
  type TipoAgente,
} from '@/lib/simulation';

/** Maior passo de tempo aceito (s): evita "saltos" quando a aba volta do segundo plano. */
const DT_MAXIMO = 0.05;

/**
 * Roda a simulação com requestAnimationFrame.
 * O laço só existe enquanto há algo acontecendo (agentes ou luz mudando) e a
 * rua está visível — parado, não consome CPU nem bateria.
 *
 * @param cfg precisa ser estável (constante de módulo), senão o laço reinicia.
 */
export function useStreetSimulation(
  cfg: ConfigSimulacao,
  alvoVisibilidade: RefObject<Element | null>,
) {
  const [estado, setEstado] = useState(() => criarEstadoInicial(cfg));
  const visivel = useInView(alvoVisibilidade, { margin: '100px 0px' });
  const emAndamento = !estaOciosa(estado, cfg);

  useEffect(() => {
    if (!emAndamento || !visivel) return;

    let quadro = 0;
    let anterior: number | null = null;
    const avancar = (agora: number) => {
      const dt = anterior === null ? 0 : Math.min(DT_MAXIMO, (agora - anterior) / 1000);
      anterior = agora;
      setEstado((atual) => passo(atual, dt, cfg));
      quadro = requestAnimationFrame(avancar);
    };
    quadro = requestAnimationFrame(avancar);
    return () => cancelAnimationFrame(quadro);
  }, [emAndamento, visivel, cfg]);

  const adicionar = useCallback(
    (tipo: TipoAgente, x?: number) => setEstado((atual) => adicionarAgente(atual, tipo, cfg, x)),
    [cfg],
  );

  const limpar = useCallback(() => setEstado(criarEstadoInicial(cfg)), [cfg]);

  return { estado, adicionar, limpar, emAndamento };
}
