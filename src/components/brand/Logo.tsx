import { useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Símbolo LuxSmart: um poste estilizado cuja luz se espalha em ondas,
 * lembrando um ícone de sinal — luz + sensor.
 */
export function LogoMark({ className }: { className?: string }) {
  const idHalo = `logo-halo-${useId()}`;

  return (
    <svg viewBox="0 0 48 48" className={cn('shrink-0', className)} aria-hidden="true">
      {/* Halo da luminária */}
      <circle cx="33.5" cy="10" r="11" fill={`url(#${idHalo})`} />
      {/* Poste e braço */}
      <path
        d="M12 44V15a9 9 0 0 1 9-9h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M7 44h10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Luminária */}
      <rect x="26" y="4" width="15" height="6" rx="3" fill="#FFC83D" />
      {/* Ondas de luz / sinal */}
      <g fill="none" stroke="#FFC83D" strokeLinecap="round" strokeWidth="2.6">
        <path d="M30 14a4 4 0 0 0 7 0" />
        <path d="M26.6 17a8 8 0 0 0 13.8 0" opacity="0.75" />
        <path d="M23.1 20a12 12 0 0 0 20.8 0" opacity="0.5" />
      </g>
      <defs>
        <radialGradient id={idHalo}>
          <stop offset="0" stopColor="#FFC83D" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC83D" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** Símbolo + logotipo "LuxSmart" (para fundos escuros). */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight text-white',
        className,
      )}
    >
      <LogoMark className="size-9" />
      <span>
        Lux<span className="text-amarelo-luz">Smart</span>
      </span>
    </span>
  );
}
