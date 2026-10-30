import type { CSSProperties } from 'react';
import { INDAIATUBA } from '@/data/indaiatuba';
import { aleatorio } from '@/lib/aleatorio';

/**
 * Rua noturna em SVG, animada só com CSS: o carro atravessa a tela e cada
 * poste acende a 100% quando ele passa, voltando depois ao nível econômico.
 * É o visual do início no celular e no tablet, e o fundo do desktop enquanto
 * a cena 3D carrega (ou quando ela não é usada).
 */

/** Geometria do desenho (viewBox) e da animação. */
const RUA = {
  largura: 1200,
  altura: 640,
  calcada: 500,
  /** Linha do asfalto onde o cone de luz termina. */
  chao: 600,
  topoLuminaria: 222,
  postesX: [100, 300, 500, 700, 900, 1100],
  /** Alcance do "sensor" na animação (unidades do desenho). */
  raio: 110,
  /** Tempo de uma travessia do carro (s). */
  duracaoS: 7,
  /** O carro sai de x = -160 e anda até x = 1360. */
  carroInicio: -160,
  carroPercurso: 1520,
  carroLargura: 150,
  /** Posição do carro quando a animação está desligada (movimento reduzido). */
  carroParado: 640,
} as const;

const VELOCIDADE = RUA.carroPercurso / RUA.duracaoS;

/** Instante (s) em que o centro do carro entra no raio de cada poste. */
function atrasoAcender(x: number): number {
  const centroInicial = RUA.carroInicio + RUA.carroLargura / 2;
  return Math.max(0, (x - RUA.raio - centroInicial) / VELOCIDADE);
}

/** Com a animação desligada, só o poste perto do carro parado fica aceso. */
function pertoDoCarroParado(x: number): boolean {
  const centro = RUA.carroInicio + RUA.carroParado + RUA.carroLargura / 2;
  return Math.abs(centro - x) <= RUA.raio;
}

const rand = aleatorio(11);
const ESTRELAS = Array.from({ length: 40 }, () => ({
  x: rand() * RUA.largura,
  y: rand() * 300,
  r: 0.8 + rand() * 1.4,
  o: 0.3 + rand() * 0.6,
}));
const PREDIOS = Array.from({ length: 16 }, (_, i) => ({
  x: i * 78 - 10 + rand() * 20,
  largura: 60 + rand() * 30,
  altura: 110 + rand() * 170,
}));
const JANELAS = PREDIOS.flatMap((p) =>
  Array.from({ length: 3 }, () => ({
    x: p.x + 10 + rand() * (p.largura - 24),
    y: RUA.calcada - 20 - rand() * (p.altura - 30),
  })),
);

export function HeroStreet({ className }: { className?: string }) {
  const estiloSvg = {
    '--rua-duracao': `${RUA.duracaoS}s`,
    '--rua-percurso': `${RUA.carroPercurso}px`,
    '--rua-carro-parado': `${RUA.carroParado}px`,
    '--rua-luz-baixa': INDAIATUBA.dimerizacao.valor,
  } as CSSProperties;

  return (
    <svg
      viewBox={`0 0 ${RUA.largura} ${RUA.altura}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      style={estiloSvg}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rua-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050D1C" />
          <stop offset="1" stopColor="#13295A" />
        </linearGradient>
        <linearGradient id="rua-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC83D" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFC83D" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rua-halo">
          <stop offset="0" stopColor="#FFF4D1" />
          <stop offset="0.35" stopColor="#FFC83D" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC83D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rua-chao">
          <stop offset="0" stopColor="#FFC83D" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC83D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Céu, estrelas e lua */}
      <rect width={RUA.largura} height={RUA.altura} fill="url(#rua-ceu)" />
      {ESTRELAS.map((e, i) => (
        <circle key={i} cx={e.x} cy={e.y} r={e.r} fill="#FFFFFF" opacity={e.o} />
      ))}
      <circle cx="1080" cy="110" r="38" fill="#F7F9FC" opacity="0.92" />
      <circle cx="1098" cy="98" r="36" fill="#0A1A33" />

      {/* Cidade ao fundo */}
      <g fill="#0E2244">
        {PREDIOS.map((p, i) => (
          <rect key={i} x={p.x} y={RUA.calcada - p.altura} width={p.largura} height={p.altura} />
        ))}
      </g>
      <g fill="#FFC83D" opacity="0.5">
        {JANELAS.map((j, i) => (
          <rect key={i} x={j.x} y={j.y} width="8" height="12" />
        ))}
      </g>

      {/* Calçada e rua */}
      <rect y={RUA.calcada} width={RUA.largura} height="18" fill="#1B2E52" />
      <rect
        y={RUA.calcada + 18}
        width={RUA.largura}
        height={RUA.altura - RUA.calcada - 18}
        fill="#0B1528"
      />
      <line
        x1="0"
        x2={RUA.largura}
        y1="618"
        y2="618"
        stroke="#F7F9FC"
        strokeOpacity="0.35"
        strokeWidth="5"
        strokeDasharray="44 36"
      />

      {/* Postes: a luz (cone, halo, chão e lente) é o que a animação acende */}
      {RUA.postesX.map((x) => {
        const y = RUA.topoLuminaria;
        return (
          <g key={x}>
            <g
              className={pertoDoCarroParado(x) ? 'rua-luz perto' : 'rua-luz'}
              style={{ animationDelay: `${atrasoAcender(x).toFixed(2)}s` }}
            >
              <polygon
                points={`${x - 14},${y + 22} ${x + 14},${y + 22} ${x + 130},${RUA.chao} ${x - 130},${RUA.chao}`}
                fill="url(#rua-cone)"
              />
              <ellipse cx={x} cy={RUA.chao} rx="150" ry="18" fill="url(#rua-chao)" />
              <circle cx={x} cy={y + 16} r="48" fill="url(#rua-halo)" />
              <rect x={x - 22} y={y + 13} width="44" height="7" rx="3.5" fill="#FFE08A" />
            </g>
            <rect
              x={x - 40}
              y={y + 10}
              width="9"
              height={RUA.calcada - y - 8}
              rx="3"
              fill="#2B4170"
            />
            <path
              d={`M${x - 35} ${y + 22} q0 -14 14 -14 h7`}
              fill="none"
              stroke="#2B4170"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <rect x={x - 28} y={y} width="56" height="16" rx="8" fill="#34507F" />
          </g>
        );
      })}

      {/* Carro */}
      <g className="rua-carro">
        <g transform={`translate(${RUA.carroInicio} 548)`}>
          <polygon points="150,26 330,4 330,50" fill="#FFF4D1" opacity="0.35" />
          <path
            d="M0 40 Q4 16 30 14 L52 -4 Q60 -10 72 -10 H112 Q124 -10 132 0 L146 16 Q156 18 156 30 V48 H0Z"
            fill="#1E5EFF"
          />
          <path d="M58 0 H104 L118 14 H48Z" fill="#DCE8FF" opacity="0.7" />
          <rect x="146" y="22" width="10" height="8" rx="2" fill="#FFF4D1" />
          <circle cx="34" cy="50" r="13" fill="#050D1C" />
          <circle cx="122" cy="50" r="13" fill="#050D1C" />
        </g>
      </g>
    </svg>
  );
}
