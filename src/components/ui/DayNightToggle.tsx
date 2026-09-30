import { motion } from 'framer-motion';
import { Icone } from '@/components/icons/icons';
import { cn } from '@/lib/cn';

export type ModoCeu = 'noite' | 'dia';

interface DayNightToggleProps {
  modo: ModoCeu;
  aoAlterar: (modo: ModoCeu) => void;
  className?: string;
}

/**
 * Interruptor Dia/Noite (role="switch"). O botão deslizante é o "sol" ou a
 * "lua"; as palavras dos dois lados deixam o estado claro sem depender de cor.
 */
export function DayNightToggle({ modo, aoAlterar, className }: DayNightToggleProps) {
  const dia = modo === 'dia';

  return (
    <div className={cn('inline-flex items-center gap-3 text-sm font-semibold', className)}>
      <span aria-hidden="true" className={dia ? 'opacity-60' : undefined}>
        Noite
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={dia}
        aria-label="Modo dia"
        onClick={() => aoAlterar(dia ? 'noite' : 'dia')}
        className={cn(
          'relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border-2 p-0.5 transition-colors duration-500',
          dia ? 'border-azul-primario bg-azul-claro' : 'border-azul-brilho/60 bg-azul-profundo',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={cn(
            'grid size-7 place-items-center rounded-full',
            dia
              ? 'ml-auto bg-amarelo-luz text-azul-noite shadow-glow-sm'
              : 'bg-azul-claro text-azul-noite',
          )}
        >
          <Icone nome={dia ? 'sol' : 'lua'} className="size-4" />
        </motion.span>
      </button>
      <span aria-hidden="true" className={dia ? undefined : 'opacity-60'}>
        Dia
      </span>
    </div>
  );
}
