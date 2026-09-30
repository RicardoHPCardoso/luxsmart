import { motion } from 'framer-motion';
import { ButtonLink } from '@/components/ui/Button';
import { DayNightToggle, type ModoCeu } from '@/components/ui/DayNightToggle';
import { INDAIATUBA } from '@/data/indaiatuba';
import { SECOES } from '@/data/navegacao';
import { useModoCeu } from '@/hooks/modoCeu';
import { useScrollTo } from '@/hooks/useScrollTo';
import { cn } from '@/lib/cn';
import { HeroBackground } from './HeroBackground';

const STATUS_MODO: Record<ModoCeu, string> = {
  noite: `Noite: os postes ficam em ${Math.round(INDAIATUBA.dimerizacao.valor * 100)}% e acendem a 100% quando o carro passa.`,
  dia: 'Dia: o sensor de luminosidade mantém todos os postes desligados.',
};

const entrada = (atraso: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay: atraso, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  const { modo, definirModo } = useModoCeu();
  const { aoClicarAncora } = useScrollTo();
  const noite = modo === 'noite';

  return (
    <section
      id={SECOES.inicio}
      className={cn(
        'relative isolate flex min-h-dvh items-end overflow-hidden pt-24 pb-16 transition-colors duration-1000 sm:items-center sm:pb-24',
        noite ? 'tema-noite' : 'tema-dia',
      )}
    >
      {/* Cena de fundo */}
      <div className="absolute inset-0 -z-10">
        <HeroBackground modo={modo} />
        {/* Véu para legibilidade do texto (não intercepta o ponteiro: o 3D reage a ele) */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-1000',
            'bg-[linear-gradient(to_top,var(--veu)_50%,transparent_95%)] sm:bg-[linear-gradient(to_right,var(--veu)_30%,transparent_75%)]',
          )}
          style={{
            ['--veu' as string]: noite ? 'rgb(5 13 28 / 0.92)' : 'rgb(247 249 252 / 0.9)',
          }}
        />
      </div>

      <div className="container-site">
        <div className="max-w-2xl">
          <motion.p
            {...entrada(0.1)}
            className={cn(
              'mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium',
              noite
                ? 'border-white/15 bg-white/5 text-nevoa'
                : 'border-azul-primario/20 bg-white/70 text-tinta-suave',
            )}
          >
            <span
              className="size-2 rounded-full bg-amarelo-luz shadow-glow-sm"
              aria-hidden="true"
            />
            Projeto acadêmico · {INDAIATUBA.cidade}
          </motion.p>

          <motion.h1
            {...entrada(0.2)}
            className="text-4xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl"
          >
            A rua que{' '}
            <span className={cn(noite ? 'text-amarelo-luz glow-texto' : 'text-azul-primario')}>
              acende
            </span>{' '}
            quando você passa.
          </motion.h1>

          <motion.p
            {...entrada(0.35)}
            className={cn(
              'mt-6 max-w-xl text-lg sm:text-xl',
              noite ? 'text-nevoa' : 'text-tinta-suave',
            )}
          >
            O <strong className={noite ? 'text-white' : 'text-tinta'}>LuxSmart</strong> é um poste
            inteligente: desligado de dia, econômico à noite e com luz total quando detecta carros
            ou pedestres. Menos energia paga para iluminar ruas vazias — sem abrir mão da segurança.
          </motion.p>

          <motion.div {...entrada(0.5)} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href={`#${SECOES.dashboard}`} onClick={aoClicarAncora} tamanho="lg">
              Veja a economia
            </ButtonLink>
            <ButtonLink
              href={`#${SECOES.comoFunciona}`}
              onClick={aoClicarAncora}
              tamanho="lg"
              variante="contorno"
            >
              Como funciona
            </ButtonLink>
          </motion.div>

          <motion.div {...entrada(0.65)} className="mt-10 flex flex-col gap-2">
            <DayNightToggle modo={modo} aoAlterar={definirModo} />
            <p
              className={cn('text-sm', noite ? 'text-nevoa' : 'text-tinta-suave')}
              aria-live="polite"
            >
              {STATUS_MODO[modo]}
            </p>
          </motion.div>
        </div>
      </div>

      <IndicadorRolagem noite={noite} />
    </section>
  );
}

function IndicadorRolagem({ noite }: { noite: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium tracking-widest uppercase sm:flex',
        noite ? 'text-nevoa' : 'text-tinta-suave',
      )}
    >
      Role para acender
      <span className="relative h-10 w-px overflow-hidden bg-current/30">
        <motion.span
          className="absolute inset-x-0 top-0 h-3 bg-amarelo-luz shadow-glow-sm"
          animate={{ y: [-12, 40] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    </div>
  );
}
