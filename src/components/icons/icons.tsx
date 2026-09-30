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
  sensorLuz: (
    <>
      <path d="M12 3v2M4.9 5.9l1.4 1.4M19.1 5.9l-1.4 1.4M3 13h2M19 13h2" />
      <path d="M7 16a5 5 0 1110 0" />
      <path d="M4 20h16" />
    </>
  ),
  sensorPresenca: (
    <>
      <circle cx="12" cy="17" r="1.6" />
      <path d="M8.5 13.5a5 5 0 017 0M5.6 10.6a9 9 0 0112.8 0M2.8 7.8a13 13 0 0118.4 0" />
    </>
  ),
  chip: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </>
  ),
  driver: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M12.8 8.5l-3 4h4.4l-3 4" />
    </>
  ),
  lampada: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0012 3z" />
    </>
  ),
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
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
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
