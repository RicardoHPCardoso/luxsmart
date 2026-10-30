import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useEffect, useId, useState, type MouseEvent } from 'react';
import { Logo } from '@/components/brand/Logo';
import { NAVEGACAO, SECOES } from '@/data/navegacao';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrollTo } from '@/hooks/useScrollTo';
import { cn } from '@/lib/cn';

/** A partir de quantos px de rolagem o cabeçalho ganha fundo. */
const LIMIAR_FUNDO = 24;
const IDS_SECOES = NAVEGACAO.map((item) => item.id);

/**
 * Cabeçalho fixo: logo + links para as seções. No celular, menu hambúrguer
 * (fecha ao escolher um link ou com Esc). A barra amarela no topo mostra o
 * progresso da leitura.
 */
export function Header() {
  const { scrollY, scrollYProgress } = useScroll();
  const [comFundo, setComFundo] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const idMenu = useId();
  const secaoAtiva = useActiveSection(IDS_SECOES);
  const { aoClicarAncora } = useScrollTo();
  const progresso = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollY, 'change', (y) => setComFundo(y > LIMIAR_FUNDO));

  useEffect(() => {
    if (!menuAberto) return;
    const fecharComEsc = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAberto(false);
    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [menuAberto]);

  const navegar = (evento: MouseEvent<HTMLAnchorElement>) => {
    setMenuAberto(false);
    aoClicarAncora(evento);
  };

  return (
    <header
      className={cn(
        'tema-noite fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300',
        comFundo || menuAberto
          ? 'bg-azul-noite/95 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-amarelo-luz shadow-glow-sm"
        style={{ scaleX: progresso }}
      />

      <div className="container-site flex h-16 items-center justify-between gap-6">
        <a
          href={`#${SECOES.inicio}`}
          onClick={navegar}
          className="inline-flex min-h-11 items-center rounded-lg"
          aria-label="LuxSmart — voltar ao início"
        >
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAVEGACAO.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={navegar}
                  aria-current={secaoAtiva === item.id ? 'location' : undefined}
                  className="relative inline-flex min-h-11 items-center rounded-full px-3 font-medium text-nevoa transition-colors hover:text-white aria-[current=location]:text-white"
                >
                  {item.rotulo}
                  {secaoAtiva === item.id && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-amarelo-luz shadow-glow-sm"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-white lg:hidden"
          aria-expanded={menuAberto}
          aria-controls={idMenu}
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          <span className="sr-only">Menu</span>
          <IconeMenu aberto={menuAberto} />
        </button>
      </div>

      <AnimatePresence>
        {menuAberto && (
          <motion.nav
            id={idMenu}
            aria-label="Menu móvel"
            className="border-t border-linha-noite lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="container-site grid gap-1 py-3">
              {NAVEGACAO.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={navegar}
                    aria-current={secaoAtiva === item.id ? 'location' : undefined}
                    className="flex min-h-12 items-center rounded-lg px-3 text-lg font-medium text-nevoa hover:bg-white/5 hover:text-white aria-[current=location]:text-amarelo-luz"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function IconeMenu({ aberto }: { aberto: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
        {aberto ? (
          <path d="M6 6l12 12M18 6L6 18" />
        ) : (
          <>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h10" stroke="#FFC83D" />
          </>
        )}
      </g>
    </svg>
  );
}
