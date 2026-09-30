import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ParallaxProps {
  children: ReactNode;
  /** Deslocamento máximo em px (para cima e para baixo). */
  intensidade?: number;
  className?: string;
}

/**
 * Parallax leve: o conteúdo desliza um pouco mais devagar que a rolagem.
 * Usa só `transform` (compositor, 60 fps). Desligado com movimento reduzido —
 * o MotionConfig global não cobre estilos ligados ao scroll, por isso a checagem aqui.
 */
export function Parallax({ children, intensidade = 32, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduzirMovimento = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [intensidade, -intensidade]);

  return (
    <motion.div ref={ref} className={className} style={{ y: reduzirMovimento ? 0 : y }}>
      {children}
    </motion.div>
  );
}
