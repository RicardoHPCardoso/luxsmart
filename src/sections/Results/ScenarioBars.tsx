import { motion } from 'framer-motion';
import { COR_CENARIO } from '@/lib/chartTheme';
import { CENARIOS, ROTULO_CENARIO, type Cenario, type ResultadoCenario } from '@/lib/energy';
import { formatarEnergia, formatarPercentual } from '@/lib/format';

interface ScenarioBarsProps {
  cenarios: Record<Cenario, ResultadoCenario>;
  economiaPercentual: number;
}

/**
 * Barras horizontais do consumo anual nos 3 cenários, feitas em HTML/CSS:
 * nome e valor em texto em cima de cada barra (legível no celular e por
 * leitores de tela); a barra é só o desenho proporcional.
 */
export function ScenarioBars({ cenarios, economiaPercentual }: ScenarioBarsProps) {
  const maior = Math.max(...CENARIOS.map((c) => cenarios[c].consumoKwh));

  return (
    <figure className="tema-noite mt-6 rounded-3xl border border-linha-noite p-5 sm:p-6">
      <figcaption className="text-lg font-semibold">
        Energia gasta por ano em cada cenário
      </figcaption>

      <ul role="list" className="mt-5 grid gap-5">
        {CENARIOS.map((cenario) => {
          const kwh = cenarios[cenario].consumoKwh;
          return (
            <li key={cenario}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-nevoa">{ROTULO_CENARIO[cenario]}</span>
                <span className="font-semibold tabular-nums">
                  {formatarEnergia(kwh)}
                  {cenario === 'luxsmart' && (
                    <span className="ml-2 rounded-full bg-amarelo-luz px-2 py-0.5 text-azul-noite">
                      −{formatarPercentual(economiaPercentual)}
                      <span className="sr-only"> em relação ao LED atual</span>
                    </span>
                  )}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-2 h-5 overflow-hidden rounded-r bg-white/[0.06]"
              >
                <motion.div
                  className="h-full origin-left rounded-r"
                  style={{ backgroundColor: COR_CENARIO[cenario] }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: maior === 0 ? 0 : kwh / maior }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
