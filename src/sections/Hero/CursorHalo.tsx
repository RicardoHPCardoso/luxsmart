import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState, type RefObject } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/** Mola do halo: segue o ponteiro com um leve atraso, como uma luz que "chega". */
const MOLA = { stiffness: 260, damping: 28, mass: 0.5 } as const;

interface CursorHaloProps {
  /** Área em que o halo aparece (o hero). */
  area: RefObject<HTMLElement | null>;
}

/**
 * Halo amarelo que acompanha o ponteiro no hero e "ilumina" o que está perto
 * (mistura `screen`). Só em dispositivos com mouse e sem movimento reduzido.
 */
export function CursorHalo({ area }: CursorHaloProps) {
  const reduzirMovimento = useReducedMotion();
  const temMouse = useMediaQuery('(pointer: fine)');
  const ativo = temMouse && !reduzirMovimento;
  const [visivel, setVisivel] = useState(false);
  const xBruto = useMotionValue(0);
  const yBruto = useMotionValue(0);
  const x = useSpring(xBruto, MOLA);
  const y = useSpring(yBruto, MOLA);

  useEffect(() => {
    const el = area.current;
    if (!el || !ativo) return;

    const mover = (e: PointerEvent) => {
      const caixa = el.getBoundingClientRect();
      xBruto.set(e.clientX - caixa.left);
      yBruto.set(e.clientY - caixa.top);
    };
    const entrar = () => setVisivel(true);
    const sair = () => setVisivel(false);

    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerenter', entrar);
    el.addEventListener('pointerleave', sair);
    return () => {
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerenter', entrar);
      el.removeEventListener('pointerleave', sair);
    };
  }, [area, ativo, xBruto, yBruto]);

  if (!ativo) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-10 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_200_61/0.28),rgb(255_200_61/0.08)_40%,transparent_68%)] mix-blend-screen"
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visivel ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    />
  );
}
