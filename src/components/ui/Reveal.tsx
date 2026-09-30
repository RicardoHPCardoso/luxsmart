import { motion, type HTMLMotionProps } from 'framer-motion';

/** Deslocamento vertical inicial do reveal (px). */
const DESLOCAMENTO = 24;

interface RevealProps extends HTMLMotionProps<'div'> {
  /** Atraso em segundos — útil para escalonar itens de uma grade. */
  atraso?: number;
}

/**
 * Faz o conteúdo "acender" ao entrar na tela: sobe levemente e ganha opacidade.
 * Com `prefers-reduced-motion`, o MotionConfig global remove o deslocamento.
 */
export function Reveal({ atraso = 0, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: DESLOCAMENTO }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
