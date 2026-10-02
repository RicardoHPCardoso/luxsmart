import { AnimatePresence, motion } from 'framer-motion';
import { Icone } from '@/components/icons/icons';
import { StreetLamp } from '@/components/illustrations/StreetLamp';
import type { Etapa } from '@/data/etapas';
import { cn } from '@/lib/cn';

interface LampPanelProps {
  etapa: Etapa;
  className?: string;
}

/** Quadro com o poste, o céu e o "visitante" que dispara o sensor. */
/** Cor do céu de dia e de noite. */
const CEU = { dia: '#DCE8FF', noite: '#0A1A33' } as const;

export function LampPanel({ etapa, className }: LampPanelProps) {
  const dia = etapa.id === 'dia';
  const percentual = Math.round(etapa.intensidade * 100);

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-3xl border border-linha-noite transition-colors duration-700',
        className,
      )}
      style={{ backgroundColor: dia ? CEU.dia : CEU.noite }}
    >
      {/* Sol / Lua */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={dia ? 'sol' : 'lua'}
          aria-hidden="true"
          className={cn(
            'absolute top-5 right-5 grid size-12 place-items-center rounded-full',
            dia ? 'bg-amarelo-luz text-azul-noite shadow-glow' : 'bg-azul-claro/90 text-azul-noite',
          )}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <Icone nome={dia ? 'sol' : 'lua'} />
        </motion.span>
      </AnimatePresence>

      {/* Poste */}
      <StreetLamp
        intensidade={etapa.intensidade}
        detectando={etapa.id === 'movimento'}
        // O poste fica em x = 19,5% do desenho; alinhamos esse ponto a 55% do quadro,
        // deixando a luminária livre do medidor (esquerda) e do sol/lua (direita).
        className="absolute bottom-[12%] left-[55%] h-[80%] -translate-x-[19.5%]"
      />

      {/* Chão */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 bottom-0 h-[12%] transition-colors duration-700',
          dia ? 'bg-[#9FB3D6]' : 'bg-azul-profundo',
        )}
      />

      {/* Pedestre que entra no raio do sensor */}
      <AnimatePresence>
        {etapa.id === 'movimento' && (
          <motion.span
            aria-hidden="true"
            className="absolute bottom-[12%] left-[58%] text-white"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Icone nome="pedestre" className="size-12 sm:size-16" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Medidor de potência */}
      <div className="absolute top-5 left-5 rounded-xl bg-azul-noite/80 px-3 py-2 text-white backdrop-blur-sm">
        <p className="text-xs text-nevoa">Intensidade (PWM)</p>
        <p className="font-display text-2xl font-bold tabular-nums">{percentual}%</p>
        <div
          className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-white/10"
          aria-hidden="true"
        >
          <motion.div
            className="h-full origin-left rounded-full bg-amarelo-luz"
            initial={false}
            animate={{ scaleX: etapa.intensidade }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </div>
  );
}
