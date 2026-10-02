import type { SVGProps } from 'react';

/**
 * Ícones de traço (24×24) no estilo do site. Todos herdam `currentColor`
 * e são decorativos por padrão (aria-hidden) — o texto ao lado dá o sentido.
 */
const ICONES = {
  moeda: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2c-.5-.9-1.6-1.5-2.8-1.5-1.6 0-2.8.9-2.8 2.1 0 2.8 5.6 1.4 5.6 4.3 0 1.2-1.2 2.1-2.8 2.1-1.3 0-2.4-.6-2.9-1.6M12 6v1.7M12 16.3V18" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3z" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
    </>
  ),
  estrela: (
    <>
      <path d="M12 3.5l1.9 4.6 4.9.4-3.7 3.2 1.1 4.8L12 14l-4.2 2.5 1.1-4.8-3.7-3.2 4.9-.4L12 3.5z" />
      <path d="M4 20h.01M20 19h.01M19 4h.01" strokeWidth="2.6" />
    </>
  ),
  ciclo: (
    <>
      <path d="M20 12a8 8 0 01-13.7 5.6M4 12a8 8 0 0113.7-5.6" />
      <path d="M18 3v3.6h-3.6M6 21v-3.6h3.6" />
      <path d="M12 8.5v3.8l2.4 1.4" />
    </>
  ),
  grafico: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  globo: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5S9.7 5.9 12 3.5z" />
    </>
  ),
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  lua: <path d="M19.5 14.5A8 8 0 019.5 4.5a8 8 0 1010 10z" />,
  carro: (
    <>
      <path d="M4 16v-3.5l2-5h12l2 5V16" />
      <path d="M3 16h18v2.5H3z" />
      <circle cx="7.5" cy="18.5" r="1.6" />
      <circle cx="16.5" cy="18.5" r="1.6" />
      <path d="M6.5 12.5h11" />
    </>
  ),
  pedestre: (
    <>
      <circle cx="13" cy="4.5" r="1.8" />
      <path d="M10 21l2.2-6.5L15 17v4M12.2 14.5l.8-5.5-3.5 2L8 14M13 9l2.2 3 2.8.8" />
    </>
  ),
  toque: (
    <>
      <path d="M9 11V5.5a1.5 1.5 0 013 0V11m0-1.5a1.5 1.5 0 013 0V11m0-.5a1.5 1.5 0 013 0v4.5a6 6 0 01-6 6h-.7a6 6 0 01-4.9-2.5L4.6 14.9a1.5 1.5 0 012.3-1.9L9 15" />
    </>
  ),
  /* Componentes do protótipo */
  ldr: (
    <>
      {/* Fotorresistor: disco com trilha em zigue-zague e setas de luz chegando */}
      <circle cx="13" cy="13" r="6.5" />
      <path d="M10 11.5h6l-6 3h6" />
      <path d="M3 3.5l3.5 3.5M6.5 4.5V7H4M7.5 2l3 3M10.5 3v2h-2" />
    </>
  ),
  ultrassom: (
    <>
      {/* Módulo com dois "olhos" (como o HC-SR04) emitindo ondas */}
      <rect x="3" y="11" width="18" height="9" rx="2" />
      <circle cx="8" cy="15.5" r="2.4" />
      <circle cx="16" cy="15.5" r="2.4" />
      <path d="M8.5 7.5a5 5 0 017 0M6 5a8.5 8.5 0 0112 0" />
    </>
  ),
  esp32: (
    <>
      {/* Chip com antena impressa */}
      <rect x="5.5" y="8" width="13" height="12" rx="2" />
      <path d="M8 8V4.5h2.5v2h3v-2H16V8" />
      <path d="M3 11.5h2.5M3 15h2.5M18.5 11.5H21M18.5 15H21M9 20v1.5M12 20v1.5M15 20v1.5" />
    </>
  ),
  pwm: <path d="M2.5 17h3V7h4v10h2V7h2.5v10h1.5V7h1.2v10h3.3" />,
  led: (
    <>
      {/* Símbolo de LED: diodo com setas de luz */}
      <path d="M4 14h4M16 14h4M8 9.5v9l7-4.5-7-4.5zM15 9.5v9" />
      <path d="M13.5 7.5L16 5M14.3 5H16v1.7M16.5 9L19 6.5M17.3 6.5H19v1.7" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0119 0M5.5 12.5a9.5 9.5 0 0113 0M8.7 16a5 5 0 016.6 0" />
      <circle cx="12" cy="19.2" r="1.1" fill="currentColor" />
    </>
  ),
  /* Áreas da equipe */
  documento: (
    <>
      <path d="M6 3h8.5L19 7.5V21H6z" />
      <path d="M14 3v5h5M9 12h7M9 15.5h7M9 19h4" />
    </>
  ),
  circuito: (
    <>
      <rect x="8" y="8" width="8" height="8" rx="1.5" />
      <path d="M12 8V3M12 21v-5M8 12H3M21 12h-5M5 3h3M16 21h3" />
      <circle cx="5" cy="3" r="0.6" fill="currentColor" />
      <circle cx="19" cy="21" r="0.6" fill="currentColor" />
    </>
  ),
  maquete: (
    <>
      {/* Base da maquete com rua, poste e prédio */}
      <path d="M2.5 18.5l9.5 3.5 9.5-3.5-9.5-3.5z" />
      <path d="M7.5 16.7V9.5h3.5" />
      <path d="M11 9.5h1.5" strokeWidth="2.6" />
      <path d="M14.5 16.2V6.5h4v8.6" />
    </>
  ),
  servidor: (
    <>
      <rect x="4" y="3.5" width="16" height="7" rx="1.5" />
      <rect x="4" y="13.5" width="16" height="7" rx="1.5" />
      <path d="M7.5 7h.01M7.5 17h.01M11 7h5.5M11 17h5.5" strokeWidth="2" />
    </>
  ),
  codigo: (
    <>
      <path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14" />
    </>
  ),
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
} as const;

export type NomeIcone = keyof typeof ICONES;

interface IconeProps extends SVGProps<SVGSVGElement> {
  nome: NomeIcone;
}

export function Icone({ nome, className = 'size-6', ...props }: IconeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {ICONES[nome]}
    </svg>
  );
}
