import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  /** Pequeno rótulo acima do título. */
  sobretitulo: string;
  titulo: ReactNode;
  /** Uma frase curta (no máximo 2 linhas). */
  descricao?: ReactNode;
  /** Define as cores para fundo escuro (`noite`) ou claro (`dia`). */
  tema?: 'noite' | 'dia';
  className?: string;
}

/**
 * Cabeçalho padrão das seções. O pontinho ao lado do sobretítulo é uma
 * "lâmpada" que acende quando o cabeçalho entra na tela.
 */
export function SectionHeading({
  sobretitulo,
  titulo,
  descricao,
  tema = 'dia',
  className,
}: SectionHeadingProps) {
  const noite = tema === 'noite';

  return (
    <motion.header
      className={cn('max-w-2xl', className)}
      initial="apagado"
      whileInView="aceso"
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
    >
      <p
        className={cn(
          'mb-3 inline-flex items-center gap-2 font-semibold',
          noite ? 'text-azul-brilho' : 'text-azul-primario',
        )}
      >
        <motion.span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-amarelo-luz"
          variants={{
            apagado: { opacity: 0.25, boxShadow: '0 0 0 rgb(255 200 61 / 0)' },
            aceso: {
              opacity: 1,
              boxShadow: '0 0 14px rgb(255 200 61 / 0.9)',
              transition: { duration: 0.6, delay: 0.2 },
            },
          }}
        />
        {sobretitulo}
      </p>
      <motion.h2
        className="text-titulo font-bold"
        variants={{
          apagado: { opacity: 0, y: 16 },
          aceso: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        {titulo}
      </motion.h2>
      {descricao && (
        <motion.p
          className={cn('mt-4 text-lg', noite ? 'text-nevoa' : 'text-tinta-suave')}
          variants={{
            apagado: { opacity: 0 },
            aceso: { opacity: 1, transition: { duration: 0.7, delay: 0.15 } },
          }}
        >
          {descricao}
        </motion.p>
      )}
    </motion.header>
  );
}
