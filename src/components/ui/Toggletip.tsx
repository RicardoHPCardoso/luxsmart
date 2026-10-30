import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

/** Distância entre o botão e o cartão (px). */
const ESPACO = 10;
/** Margem mínima até a borda da tela (px). */
const MARGEM_TELA = 8;
/** Tempo para o ponteiro sair do botão e entrar no cartão sem ele fechar (ms). */
const ATRASO_FECHAR_MS = 160;

/** `:popover-open` nativo ou a classe aplicada pelo polyfill em navegadores antigos. */
function estaAberto(el: HTMLElement): boolean {
  try {
    return el.matches(':popover-open');
  } catch {
    return el.classList.contains(':popover-open');
  }
}

interface ToggletipProps {
  /** Conteúdo do botão (ex.: um componente do diagrama). */
  children: ReactNode;
  /** Conteúdo do cartão: aparece ao passar o mouse, tocar ou apertar Enter/Espaço. */
  conteudo: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Botão com cartão informativo ("toggletip"), feito com a Popover API nativa:
 * - `popovertarget` abre/fecha com toque, clique, Enter ou Espaço e expõe o
 *   estado expandido para leitores de tela;
 * - `popover="auto"` fecha com Esc ou tocando fora e mantém um cartão por vez;
 * - com mouse, abre ao passar o ponteiro e continua aberto enquanto ele estiver
 *   sobre o botão ou o cartão (WCAG 1.4.13).
 * O texto do cartão também é a descrição acessível do botão (aria-describedby).
 */
export function Toggletip({ children, conteudo, className, style }: ToggletipProps) {
  const id = useId();
  const gatilho = useRef<HTMLButtonElement>(null);
  const cartao = useRef<HTMLDivElement>(null);
  const temporizador = useRef<number | undefined>(undefined);
  const abertoPorHover = useRef(false);
  const [aberto, setAberto] = useState(false);

  /** Abaixo do botão, centralizado; acima se não couber; sempre dentro da tela. */
  const posicionar = useCallback(() => {
    const botao = gatilho.current?.getBoundingClientRect();
    const el = cartao.current;
    if (!botao || !el) return;
    const caixa = el.getBoundingClientRect();
    let topo = botao.bottom + ESPACO;
    if (topo + caixa.height > window.innerHeight - MARGEM_TELA) {
      const acima = botao.top - ESPACO - caixa.height;
      if (acima >= MARGEM_TELA) topo = acima;
    }
    const esquerda = Math.min(
      Math.max(botao.left + botao.width / 2 - caixa.width / 2, MARGEM_TELA),
      window.innerWidth - caixa.width - MARGEM_TELA,
    );
    el.style.top = `${topo}px`;
    el.style.left = `${esquerda}px`;
  }, []);

  const cancelarFechamento = () => window.clearTimeout(temporizador.current);

  const abrirPorHover = () => {
    cancelarFechamento();
    const el = cartao.current;
    if (!el || estaAberto(el)) return;
    abertoPorHover.current = true;
    el.showPopover?.();
  };

  const fecharDepois = () => {
    cancelarFechamento();
    if (!abertoPorHover.current) return; // aberto por toque/teclado: fica até Esc ou toque fora
    temporizador.current = window.setTimeout(
      () => cartao.current?.hidePopover?.(),
      ATRASO_FECHAR_MS,
    );
  };

  // Mantém o estado React em sincronia com o popover (Esc, toque fora, outro cartão).
  useEffect(() => {
    const el = cartao.current;
    if (!el) return;
    const aoAlternar = (evento: Event) => {
      const abriu = (evento as ToggleEvent).newState === 'open';
      setAberto(abriu);
      if (abriu) posicionar();
      else abertoPorHover.current = false;
    };
    el.addEventListener('toggle', aoAlternar);
    return () => el.removeEventListener('toggle', aoAlternar);
  }, [posicionar]);

  // Enquanto aberto, acompanha rolagem e redimensionamento.
  useEffect(() => {
    if (!aberto) return;
    window.addEventListener('scroll', posicionar, { passive: true, capture: true });
    window.addEventListener('resize', posicionar);
    return () => {
      window.removeEventListener('scroll', posicionar, { capture: true });
      window.removeEventListener('resize', posicionar);
    };
  }, [aberto, posicionar]);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  return (
    <>
      <button
        ref={gatilho}
        type="button"
        popoverTarget={id}
        aria-describedby={id}
        className={cn('cursor-help text-left', className)}
        style={style}
        onClick={(evento) => {
          // Se o mouse já abriu o cartão, o clique o "fixa" em vez de fechá-lo.
          if (abertoPorHover.current && aberto) {
            evento.preventDefault();
            abertoPorHover.current = false;
            cancelarFechamento();
          }
        }}
        onPointerEnter={(evento) => evento.pointerType === 'mouse' && abrirPorHover()}
        onPointerLeave={(evento) => evento.pointerType === 'mouse' && fecharDepois()}
      >
        {children}
      </button>
      <div
        ref={cartao}
        id={id}
        popover="auto"
        className="fixed [inset:auto] m-0 w-72 max-w-[calc(100vw-1rem)] rounded-xl border border-amarelo-luz/50 bg-azul-profundo p-4 text-left text-base text-white shadow-glow"
        onPointerEnter={cancelarFechamento}
        onPointerLeave={fecharDepois}
      >
        {conteudo}
      </div>
    </>
  );
}
