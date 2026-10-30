import { useInView, useReducedMotion } from 'framer-motion';
import { lazy, Suspense, useRef, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useIdle } from '@/hooks/useIdle';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { suportaWebGL } from '@/lib/webgl';
import { HeroStreet } from './HeroStreet';

const HeroScene = lazy(() => import('@/three/HeroScene'));

/** 3D só no desktop: no celular e no tablet fica a rua 2D, sem baixar o three.js. */
const MIDIA_3D = '(min-width: 64rem)';

/**
 * Fundo animado do início. A rua 2D (CSS) aparece na hora; no desktop a cena
 * 3D é baixada quando o navegador fica ocioso e surge por cima com um fade.
 * Sem WebGL ou com movimento reduzido, fica só a rua 2D.
 */
export function HeroBackground() {
  const container = useRef<HTMLDivElement>(null);
  const reduzirMovimento = useReducedMotion();
  const desktop = useMediaQuery(MIDIA_3D);
  const ocioso = useIdle();
  const visivel = useInView(container);
  const [cenaPronta, setCenaPronta] = useState(false);

  const usar3D = desktop && !reduzirMovimento && ocioso && suportaWebGL();

  return (
    <div ref={container} className="absolute inset-0">
      <HeroStreet className="size-full" />

      {usar3D && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-1000',
                cenaPronta ? 'opacity-100' : 'opacity-0',
              )}
            >
              <HeroScene ativo={visivel} aoPronto={() => setCenaPronta(true)} />
            </div>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
