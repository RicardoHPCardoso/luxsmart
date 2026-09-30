import type { TooltipContentProps } from 'recharts';

interface ChartTooltipProps extends Partial<TooltipContentProps<number, string>> {
  formatar: (valor: number) => string;
  /** Prefixo do título (ex.: "Mês"). */
  prefixoRotulo?: string;
}

/** Tooltip escuro com amostra de cor por série; o texto usa as cores de texto, não a da série. */
export function ChartTooltip({
  active,
  payload,
  label,
  formatar,
  prefixoRotulo,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-linha-noite bg-azul-profundo/95 px-3 py-2 text-sm text-white shadow-lg backdrop-blur-sm">
      {label !== undefined && label !== '' && (
        <p className="mb-1 font-semibold">{prefixoRotulo ? `${prefixoRotulo} ${label}` : label}</p>
      )}
      <ul className="grid gap-1">
        {payload.map((item) => (
          <li key={String(item.dataKey ?? item.name)} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: item.color ?? item.payload?.cor }}
            />
            <span className="text-nevoa">{item.name}</span>
            <span className="ml-auto pl-3 font-semibold tabular-nums">
              {typeof item.value === 'number' ? formatar(item.value) : item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
