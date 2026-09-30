import { motion } from 'framer-motion';
import type { ModoCeu } from '@/components/ui/DayNightToggle';
import { StreetLamp } from './StreetLamp';

/** Dimensões da cena (viewBox). */
const LARGURA = 1440;
const ALTURA = 900;
const HORIZONTE = 720;

/** Gerador pseudoaleatório determinístico (mesma cena em todo render). */
function aleatorio(semente: number) {
  let s = semente;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

const rand = aleatorio(42);

const ESTRELAS = Array.from({ length: 70 }, () => ({
  x: rand() * LARGURA,
  y: rand() * 460,
  r: 0.6 + rand() * 1.3,
  o: 0.25 + rand() * 0.65,
}));

interface Predio {
  x: number;
  largura: number;
  altura: number;
  janelas: Array<{ x: number; y: number }>;
}

const PREDIOS: Predio[] = (() => {
  const lista: Predio[] = [];
  let x = -20;
  while (x < LARGURA) {
    const largura = 50 + rand() * 80;
    const altura = 70 + rand() * 170;
    const janelas: Predio['janelas'] = [];
    for (let jy = HORIZONTE - altura + 14; jy < HORIZONTE - 20; jy += 22) {
      for (let jx = x + 10; jx < x + largura - 14; jx += 18) {
        if (rand() > 0.86) janelas.push({ x: jx, y: jy });
      }
    }
    lista.push({ x, largura, altura, janelas });
    x += largura + 4 + rand() * 18;
  }
  return lista;
})();

const POSTES_X = [40, 280, 520, 760, 1000, 1240];
/** Postes perto do carro ficam a 100% na ilustração noturna. */
const INTENSIDADE_NOITE = [0.3, 0.3, 0.3, 1, 1, 0.3];
const TRANSICAO = { duration: 1.2, ease: 'easeInOut' } as const;

interface NightStreetProps {
  modo: ModoCeu;
  className?: string;
}

/**
 * Rua em ilustração vetorial — usada como fundo estático do hero enquanto a
 * cena 3D carrega, e como alternativa quando o 3D não é exibido
 * (movimento reduzido ou sem WebGL).
 */
export function NightStreet({ modo, className }: NightStreetProps) {
  const noite = modo === 'noite';

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ceu-noite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050D1C" />
          <stop offset="0.6" stopColor="#0A1A33" />
          <stop offset="1" stopColor="#16305C" />
        </linearGradient>
        <linearGradient id="ceu-dia" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA6F5" />
          <stop offset="1" stopColor="#DCE8FF" />
        </linearGradient>
        <linearGradient id="farol" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF4D1" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFF4D1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Céu */}
      <rect width={LARGURA} height={ALTURA} fill="url(#ceu-dia)" />
      <motion.rect
        width={LARGURA}
        height={ALTURA}
        fill="url(#ceu-noite)"
        initial={false}
        animate={{ opacity: noite ? 1 : 0 }}
        transition={TRANSICAO}
      />

      {/* Estrelas e lua / sol */}
      <motion.g initial={false} animate={{ opacity: noite ? 1 : 0 }} transition={TRANSICAO}>
        {ESTRELAS.map((e, i) => (
          <circle key={i} cx={e.x} cy={e.y} r={e.r} fill="#FFFFFF" opacity={e.o} />
        ))}
        <circle cx="1180" cy="150" r="46" fill="#F7F9FC" opacity="0.9" />
        <circle cx="1200" cy="138" r="44" fill="#0A1A33" opacity="0.92" />
      </motion.g>
      <motion.circle
        cx="1180"
        cy="150"
        r="54"
        fill="#FFC83D"
        initial={false}
        animate={{ opacity: noite ? 0 : 1, y: noite ? 60 : 0 }}
        transition={TRANSICAO}
      />

      {/* Silhueta da cidade */}
      <motion.g
        initial={false}
        animate={{ fill: noite ? '#0E2244' : '#B7CAEA' }}
        transition={TRANSICAO}
      >
        {PREDIOS.map((p, i) => (
          <rect key={i} x={p.x} y={HORIZONTE - p.altura} width={p.largura} height={p.altura} />
        ))}
      </motion.g>
      <motion.g
        fill="#FFC83D"
        initial={false}
        animate={{ opacity: noite ? 0.55 : 0 }}
        transition={TRANSICAO}
      >
        {PREDIOS.flatMap((p, i) =>
          p.janelas.map((j, k) => <rect key={`${i}-${k}`} x={j.x} y={j.y} width="7" height="10" />),
        )}
      </motion.g>

      {/* Calçada e rua */}
      <motion.rect
        y={HORIZONTE}
        width={LARGURA}
        height="24"
        initial={false}
        animate={{ fill: noite ? '#1B2E52' : '#C9D5EA' }}
        transition={TRANSICAO}
      />
      <motion.rect
        y={HORIZONTE + 24}
        width={LARGURA}
        height={ALTURA - HORIZONTE - 24}
        initial={false}
        animate={{ fill: noite ? '#0B1528' : '#5B6B86' }}
        transition={TRANSICAO}
      />
      <line
        x1="0"
        y1="826"
        x2={LARGURA}
        y2="826"
        stroke="#F7F9FC"
        strokeOpacity="0.5"
        strokeWidth="5"
        strokeDasharray="46 38"
      />

      {/* Postes */}
      {POSTES_X.map((x, i) => (
        <StreetLamp
          key={x}
          x={x}
          y={HORIZONTE - 346}
          width="200"
          height="360"
          intensidade={noite ? (INTENSIDADE_NOITE[i] ?? 0.3) : 0}
          detectando={noite && (INTENSIDADE_NOITE[i] ?? 0) === 1}
        />
      ))}

      {/* Carro */}
      <g transform="translate(990 770)">
        <motion.polygon
          points="150,26 520,-6 520,70"
          fill="url(#farol)"
          initial={false}
          animate={{ opacity: noite ? 0.7 : 0 }}
          transition={TRANSICAO}
        />
        <path
          d="M0 40 Q4 16 30 14 L52 -4 Q60 -10 72 -10 H112 Q124 -10 132 0 L146 16 Q156 18 156 30 V48 H0Z"
          fill="#1E5EFF"
        />
        <path d="M58 0 H104 L118 14 H48Z" fill="#DCE8FF" opacity="0.7" />
        <rect x="146" y="22" width="10" height="8" rx="2" fill="#FFF4D1" />
        <circle cx="34" cy="50" r="13" fill="#050D1C" />
        <circle cx="122" cy="50" r="13" fill="#050D1C" />
      </g>
    </svg>
  );
}
