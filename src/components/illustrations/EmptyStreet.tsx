import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { StreetLamp } from './StreetLamp';

const LARGURA = 1120;
const ALTURA = 460;
/** Topo da calçada; a base dos postes fica aqui. */
const CALCADA = 384;
const POSTES_X = [0, 230, 460, 690, 920];
/** Altura (no viewBox 360 do poste) do topo da luminária. */
const TOPO_LUMINARIA = 18;

/**
 * Rua vazia de madrugada com todos os postes a 100%. Pequenos "R$" sobem
 * de cada poste: é a energia paga para iluminar ninguém.
 */
export function EmptyStreet({ className }: { className?: string }) {
  const reduzirMovimento = useReducedMotion();
  const id = useId();
  const idCeu = `rua-vazia-ceu-${id}`;
  const idRecorte = `rua-vazia-recorte-${id}`;
  const yPoste = CALCADA - 350;

  return (
    <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={idCeu} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050D1C" />
          <stop offset="1" stopColor="#0E2244" />
        </linearGradient>
        <clipPath id={idRecorte}>
          <rect width={LARGURA} height={ALTURA} rx="24" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${idRecorte})`}>
        <rect width={LARGURA} height={ALTURA} fill={`url(#${idCeu})`} />
        <rect y={CALCADA} width={LARGURA} height="16" fill="#1B2E52" />
        <rect y={CALCADA + 16} width={LARGURA} height={ALTURA - CALCADA - 16} fill="#0B1528" />
        <line
          x1="0"
          y1={CALCADA + 44}
          x2={LARGURA}
          y2={CALCADA + 44}
          stroke="#F7F9FC"
          strokeOpacity="0.35"
          strokeWidth="4"
          strokeDasharray="36 30"
        />

        {POSTES_X.map((x) => (
          <StreetLamp key={x} x={x} y={yPoste} width="200" height="360" intensidade={1} />
        ))}

        {!reduzirMovimento &&
          POSTES_X.map((x, i) => (
            <motion.text
              key={x}
              x={x + 120}
              y={yPoste + TOPO_LUMINARIA}
              textAnchor="middle"
              fontFamily="Space Grotesk Variable, sans-serif"
              fontWeight="700"
              fontSize="18"
              fill="#FFC83D"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.9, 0], y: -34 }}
              transition={{
                duration: 3.2,
                delay: i * 0.55,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: 'easeOut',
              }}
            >
              R$
            </motion.text>
          ))}
      </g>
    </svg>
  );
}
