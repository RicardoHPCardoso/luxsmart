import { motion } from 'framer-motion';
import { useId, type SVGProps } from 'react';

/** Transição padrão da luz: acende rápido, apaga devagar (como um LED com rampa). */
const TRANSICAO_LUZ = { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const;

interface StreetLampProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** Potência da luminária, de 0 (apagada) a 1 (100%). */
  intensidade: number;
  /** Mostra o "pulso" do sensor de presença. */
  detectando?: boolean;
  /** Esconde o chão iluminado (útil quando o poste é desenhado sobre outra cena). */
  semChao?: boolean;
}

/**
 * Poste de iluminação em SVG, com cone de luz proporcional à intensidade.
 * Pode ser usado sozinho ou aninhado em outro <svg> (use x, y, width, height).
 * viewBox: 200 × 360, base do poste em y = 350.
 */
export function StreetLamp({
  intensidade,
  detectando = false,
  semChao = false,
  ...props
}: StreetLampProps) {
  const id = useId();
  const idCone = `cone-${id}`;
  const idHalo = `halo-${id}`;
  const idChao = `chao-${id}`;
  const luz = Math.min(1, Math.max(0, intensidade));

  return (
    <svg viewBox="0 0 200 360" aria-hidden="true" overflow="visible" {...props}>
      <defs>
        <linearGradient id={idCone} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC83D" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFC83D" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={idHalo}>
          <stop offset="0" stopColor="#FFF4D1" stopOpacity="1" />
          <stop offset="0.35" stopColor="#FFC83D" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC83D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={idChao}>
          <stop offset="0" stopColor="#FFC83D" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC83D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cone de luz e chão iluminado */}
      <motion.polygon
        points="108,40 132,40 195,350 45,350"
        fill={`url(#${idCone})`}
        initial={false}
        animate={{ opacity: luz * 0.85 }}
        transition={TRANSICAO_LUZ}
      />
      {!semChao && (
        <motion.ellipse
          cx="120"
          cy="350"
          rx="90"
          ry="12"
          fill={`url(#${idChao})`}
          initial={false}
          animate={{ opacity: luz }}
          transition={TRANSICAO_LUZ}
        />
      )}

      {/* Estrutura */}
      <rect x="34" y="42" width="10" height="310" rx="3" fill="#2B4170" />
      <rect x="27" y="338" width="24" height="14" rx="3" fill="#22365A" />
      <path
        d="M39 52C39 32 54 26 74 26h36"
        fill="none"
        stroke="#2B4170"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="94" y="18" width="52" height="18" rx="9" fill="#34507F" />

      {/* Lente: escura quando apagada, amarela quando acesa */}
      <rect x="100" y="33" width="40" height="7" rx="3.5" fill="#1A2A48" />
      <motion.rect
        x="100"
        y="33"
        width="40"
        height="7"
        rx="3.5"
        fill="#FFE08A"
        initial={false}
        animate={{ opacity: luz === 0 ? 0 : 0.35 + luz * 0.65 }}
        transition={TRANSICAO_LUZ}
      />
      <motion.circle
        cx="120"
        cy="38"
        r="34"
        fill={`url(#${idHalo})`}
        initial={false}
        animate={{ opacity: luz }}
        transition={TRANSICAO_LUZ}
      />

      {/* Sensor de presença no topo da luminária */}
      <circle cx="120" cy="17" r="4.5" fill={detectando ? '#FFC83D' : '#8AB0FF'} />
      {detectando && (
        <motion.circle
          cx="120"
          cy="17"
          r="4.5"
          fill="none"
          stroke="#FFC83D"
          strokeWidth="2"
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
        />
      )}
    </svg>
  );
}
