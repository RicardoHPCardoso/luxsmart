import { useInView, useReducedMotion } from 'framer-motion';
import { lazy, Suspense, useRef, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NightStreet } from '@/components/illustrations/NightStreet';
import type { ModoCeu } from '@/components/ui/DayNightToggle';
import { useIdle } from '@/hooks/useIdle';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { suportaWebGL } from '@/lib/webgl';

const HeroScene = lazy(() => import('@/three/HeroScene'));

/**
 * O 3D só é carregado em telas a partir de 768 px: no celular o texto ocupa
 * quase todo o hero e a ilustração estática entrega o mesmo efeito sem o
 * custo de baixar e rodar o three.js.
 */
const MIDIA_3D = '(min-width: 48rem)';

interface HeroBackgroundProps {
  modo: ModoCeu;
}

/**
 * Fundo do hero. A ilustração vetorial aparece imediatamente (e é o
 * fallback); a cena 3D é baixada quando o navegador fica ocioso e surge
 * com um fade quando está pronta. Sem WebGL ou com movimento reduzido,
 * fica só a ilustração.
 */
export function HeroBackground({ modo }: HeroBackgroundProps) {
  const container = useRef<HTMLDivElement>(null);
  const reduzirMovimento = useReducedMotion();
  const telaGrande = useMediaQuery(MIDIA_3D);
  const ocioso = useIdle();
  const visivel = useInView(container);
  const [cenaPronta, setCenaPronta] = useState(false);

  const usar3D = telaGrande && !reduzirMovimento && ocioso && suportaWebGL();

  return (
    <div ref={container} className="absolute inset-0">
      <NightStreet modo={modo} className="size-full" />

      {usar3D && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-1000',
                cenaPronta ? 'opacity-100' : 'opacity-0',
              )}
            >
              <HeroScene modo={modo} ativo={visivel} aoPronto={() => setCenaPronta(true)} />
            </div>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
