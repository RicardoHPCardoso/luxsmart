import { useId, type MouseEvent } from 'react';
import { CONFIG_SIMULADOR } from '@/data/simulador';
import type { Agente, EstadoPoste, EstadoSimulacao } from '@/lib/simulation';

/** Geometria do desenho (viewBox 1000 × 320). */
const ALTURA = 320;
const Y_CALCADA = 206;
const Y_RUA = 220;
const Y_FAIXA_CARRO = 268;
const Y_PEDESTRE = 204;
const Y_LUMINARIA = 46;
/** A zona de detecção cobre a calçada (pedestres) e a faixa dos carros. */
const ZONA = { cy: 240, ry: 50 } as const;
/** A luminária fica 30 unidades à direita do tronco do poste. */
const BRACO = 30;

interface StreetSceneProps {
  estado: EstadoSimulacao;
  /** Chamado ao clicar na rua, com a posição x no sistema da simulação. */
  aoClicar: (x: number) => void;
}

/**
 * Desenho da rua simulada. É redesenhado a cada quadro, por isso usa só
 * atributos SVG diretos (sem animações do Framer Motion).
 */
export function StreetScene({ estado, aoClicar }: StreetSceneProps) {
  const id = useId();
  const largura = CONFIG_SIMULADOR.comprimentoRua;

  const clicar = (e: MouseEvent<SVGSVGElement>) => {
    const caixa = e.currentTarget.getBoundingClientRect();
    aoClicar(((e.clientX - caixa.left) / caixa.width) * largura);
  };

  return (
    <svg
      viewBox={`0 0 ${largura} ${ALTURA}`}
      className="block h-auto w-full cursor-crosshair touch-manipulation select-none"
      onClick={clicar}
      role="img"
      aria-label={`Rua simulada com ${estado.postes.length} postes LuxSmart. Use os botões acima para enviar carros e pedestres.`}
    >
      <defs>
        <linearGradient id={`ceu-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050D1C" />
          <stop offset="1" stopColor="#10244A" />
        </linearGradient>
        <linearGradient id={`cone-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC83D" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFC83D" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id={`halo-${id}`}>
          <stop offset="0" stopColor="#FFF4D1" />
          <stop offset="0.4" stopColor="#FFC83D" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFC83D" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={largura} height={ALTURA} fill={`url(#ceu-${id})`} />
      <rect y={Y_CALCADA} width={largura} height={Y_RUA - Y_CALCADA} fill="#1B2E52" />
      <rect y={Y_RUA} width={largura} height={ALTURA - Y_RUA} fill="#0B1528" />
      <line
        x1="0"
        x2={largura}
        y1={Y_FAIXA_CARRO + 26}
        y2={Y_FAIXA_CARRO + 26}
        stroke="#F7F9FC"
        strokeOpacity="0.25"
        strokeWidth="3"
        strokeDasharray="28 22"
      />

      {estado.postes.map((poste, i) => (
        <Zona key={`zona-${i}`} poste={poste} />
      ))}
      {estado.postes.map((poste, i) => (
        <Poste key={`poste-${i}`} poste={poste} idCone={`cone-${id}`} idHalo={`halo-${id}`} />
      ))}
      {estado.agentes.map((agente) => (
        <AgenteDesenho key={agente.id} agente={agente} tempo={estado.tempo} />
      ))}
    </svg>
  );
}

/** Raio de detecção do sensor, desenhado sobre a rua. */
function Zona({ poste }: { poste: EstadoPoste }) {
  return (
    <ellipse
      cx={poste.x}
      cy={ZONA.cy}
      rx={CONFIG_SIMULADOR.raioDeteccao}
      ry={ZONA.ry}
      fill={poste.detectando ? 'rgb(255 200 61 / 0.12)' : 'transparent'}
      stroke={poste.detectando ? '#FFC83D' : '#8AB0FF'}
      strokeOpacity={poste.detectando ? 0.9 : 0.35}
      strokeWidth="2"
      strokeDasharray="8 7"
    />
  );
}

function Poste({ poste, idCone, idHalo }: { poste: EstadoPoste; idCone: string; idHalo: string }) {
  const { x, nivel } = poste;
  const tronco = x - BRACO;
  const percentual = Math.round(nivel * 100);

  return (
    <g>
      {/* Luz */}
      <polygon
        points={`${x - 12},${Y_LUMINARIA + 6} ${x + 12},${Y_LUMINARIA + 6} ${x + 78},${ALTURA - 20} ${x - 78},${ALTURA - 20}`}
        fill={`url(#${idCone})`}
        opacity={nivel * 0.9}
      />
      <circle cx={x} cy={Y_LUMINARIA + 4} r="26" fill={`url(#${idHalo})`} opacity={nivel} />

      {/* Estrutura */}
      <rect
        x={tronco - 3}
        y={Y_LUMINARIA - 4}
        width="6"
        height={Y_CALCADA - Y_LUMINARIA + 4}
        rx="2"
        fill="#2B4170"
      />
      <path
        d={`M${tronco} ${Y_LUMINARIA + 2} q0 -12 12 -12 h${BRACO - 14}`}
        fill="none"
        stroke="#2B4170"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x={x - 16} y={Y_LUMINARIA - 12} width="32" height="12" rx="6" fill="#34507F" />
      <rect
        x={x - 12}
        y={Y_LUMINARIA - 1}
        width="24"
        height="5"
        rx="2.5"
        fill="#FFE08A"
        opacity={0.25 + nivel * 0.75}
      />
      <circle
        cx={x}
        cy={Y_LUMINARIA - 14}
        r="3.5"
        fill={poste.detectando ? '#FFC83D' : '#8AB0FF'}
      />

      {/* Nível (só em telas largas, onde o texto fica legível) */}
      <text
        x={x}
        y={Y_LUMINARIA - 24}
        textAnchor="middle"
        fontSize="15"
        fontWeight="600"
        fill={nivel >= 0.999 ? '#FFC83D' : '#A9B8D6'}
        className="hidden sm:inline"
      >
        {percentual}%
      </text>
    </g>
  );
}

function AgenteDesenho({ agente, tempo }: { agente: Agente; tempo: number }) {
  if (agente.tipo === 'carro') {
    return (
      <g transform={`translate(${agente.x} ${Y_FAIXA_CARRO})`}>
        <polygon points="30,-4 150,-26 150,18" fill="#FFF4D1" opacity="0.25" />
        <path
          d="M-32 6 Q-30 -6 -18 -8 L-8 -20 Q-4 -24 4 -24 H18 Q24 -24 28 -18 L34 -8 Q40 -6 40 2 V12 H-32Z"
          fill="#1E5EFF"
        />
        <path d="M-4 -19 H17 L24 -10 H-10Z" fill="#DCE8FF" opacity="0.75" />
        <rect x="35" y="-3" width="5" height="5" rx="1.5" fill="#FFF4D1" />
        <circle cx="-16" cy="13" r="7" fill="#050D1C" />
        <circle cx="24" cy="13" r="7" fill="#050D1C" />
      </g>
    );
  }

  if (agente.tipo === 'pedestre') {
    // Balanço das pernas proporcional ao tempo (passada).
    const passada = Math.sin(tempo * 9) * 6;
    return (
      <g
        transform={`translate(${agente.x} ${Y_PEDESTRE})`}
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      >
        <circle cx="0" cy="-34" r="5" fill="#FFFFFF" stroke="none" />
        <path d="M0 -27 V-12" />
        <path d={`M0 -12 L${passada} 0 M0 -12 L${-passada} 0`} />
        <path d={`M0 -24 L${-passada * 0.8} -15 M0 -24 L${passada * 0.8} -15`} />
      </g>
    );
  }

  // Toque: ondas que se expandem a partir do ponto clicado.
  const progresso = 1 - agente.vida / CONFIG_SIMULADOR.duracaoToqueS;
  return (
    <g transform={`translate(${agente.x} ${Y_FAIXA_CARRO - 4})`} fill="none" stroke="#FFC83D">
      <circle r={8 + progresso * 34} strokeWidth="3" opacity={1 - progresso} />
      <circle r={4 + progresso * 18} strokeWidth="2" opacity={(1 - progresso) * 0.7} />
      <circle r="4" fill="#FFC83D" stroke="none" opacity={1 - progresso * 0.6} />
    </g>
  );
}
