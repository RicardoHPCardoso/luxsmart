import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { useCountUp } from 'react-countup';
import { cn } from '@/lib/cn';

/** O countup.js arredonda cada quadro; mantemos precisão e deixamos o `formatar` decidir. */
const CASAS_DECIMAIS_CONTAGEM = 6;

interface AnimatedNumberProps {
  valor: number;
  /** Formata o número exibido (inclusive os valores intermediários da contagem). */
  formatar: (valor: number) => string;
  /** Duração da contagem em segundos. */
  duracao?: number;
  className?: string;
}

/**
 * Número que "conta" até o valor quando entra na tela e anima a transição
 * quando o valor muda (ex.: na calculadora), partindo do valor anterior.
 *
 * Leitores de tela recebem apenas o valor final (texto oculto visualmente);
 * a contagem animada é decorativa. Com movimento reduzido, mostra o valor direto.
 */
export function AnimatedNumber({ valor, formatar, duracao = 1.6, className }: AnimatedNumberProps) {
  const reduzirMovimento = useReducedMotion();
  const textoFinal = formatar(valor);

  return (
    <span className={cn('tabular-nums', className)}>
      {reduzirMovimento ? (
        textoFinal
      ) : (
        <>
          <span className="sr-only">{textoFinal}</span>
          <Contador valor={valor} formatar={formatar} duracao={duracao} />
        </>
      )}
    </span>
  );
}

function Contador({ valor, formatar, duracao }: Required<Omit<AnimatedNumberProps, 'className'>>) {
  const ref = useRef<HTMLSpanElement>(null);

  // A função de formatação precisa ser estável: se mudar, o react-countup reinicia a contagem.
  const formatarRef = useRef(formatar);
  useEffect(() => {
    formatarRef.current = formatar;
  });
  const formatarEstavel = useCallback((n: number) => formatarRef.current(n), []);

  const { getCountUp, update } = useCountUp({
    ref: ref as RefObject<HTMLElement>,
    end: valor,
    duration: duracao,
    // Casas suficientes para frações (ex.: 0,8 → "80%"); a formatação final é do `formatar`.
    decimals: CASAS_DECIMAIS_CONTAGEM,
    formattingFn: formatarEstavel,
    enableScrollSpy: true,
    scrollSpyOnce: true,
    startOnMount: false,
    enableReinitialize: false,
  });

  // Cria a instância (o scroll spy do countup.js inicia a contagem ao aparecer na tela).
  useEffect(() => {
    const instancia = getCountUp();
    return () => instancia.unobserve();
  }, [getCountUp]);

  // Valor novo: anima a partir do valor atual.
  const primeiroValor = useRef(true);
  useEffect(() => {
    if (primeiroValor.current) {
      primeiroValor.current = false;
      return;
    }
    update(valor);
  }, [valor, update]);

  return <span ref={ref} aria-hidden="true" />;
}
