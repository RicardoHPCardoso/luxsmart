import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  /** Pequeno rótulo acima do título. */
  sobretitulo: string;
  titulo: ReactNode;
  descricao?: ReactNode;
  /** Define as cores para fundo escuro (`noite`) ou claro (`dia`). */
  tema?: 'noite' | 'dia';
  alinhamento?: 'esquerda' | 'centro';
  /** id do <h2>, para ser referenciado por aria-labelledby se necessário. */
  id?: string;
  className?: string;
}

/**
 * Cabeçalho padrão das seções. O pontinho ao lado do sobretítulo é uma
 * "lâmpada" que acende quando o cabeçalho entra na tela — a metáfora do
 * site inteiro: a luz reage a quem chega.
 */
export function SectionHeading({
  sobretitulo,
  titulo,
  descricao,
  tema = 'dia',
  alinhamento = 'esquerda',
  id,
  className,
}: SectionHeadingProps) {
  const noite = tema === 'noite';

  return (
    <motion.header
      className={cn('max-w-3xl', alinhamento === 'centro' && 'mx-auto text-center', className)}
      initial="apagado"
      whileInView="aceso"
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
    >
      <p
        className={cn(
          'mb-4 inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase',
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
        id={id}
        className="text-3xl font-bold sm:text-4xl lg:text-5xl"
        variants={{
          apagado: { opacity: 0, y: 16 },
          aceso: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        {titulo}
      </motion.h2>
      {descricao && (
        <motion.div
          className={cn('mt-5 text-lg', noite ? 'text-nevoa' : 'text-tinta-suave')}
          variants={{
            apagado: { opacity: 0 },
            aceso: { opacity: 1, transition: { duration: 0.7, delay: 0.15 } },
          }}
        >
          {descricao}
        </motion.div>
      )}
    </motion.header>
  );
}
