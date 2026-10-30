import { Icone } from '@/components/icons/icons';
import { EstimateBadge } from '@/components/ui/EstimateBadge';
import { INDAIATUBA } from '@/data/indaiatuba';
import { formatarAnos, formatarDadoReferencia, formatarPercentual } from '@/lib/format';
import { comparacaoPorFiltro, listarDadosReferencia } from '@/lib/indaiatubaScenarios';

const nivelBaixo = formatarPercentual(INDAIATUBA.dimerizacao.valor);
const payback = formatarAnos(comparacaoPorFiltro(INDAIATUBA, 'cidade').paybackAnos);
const grupos = listarDadosReferencia(INDAIATUBA);

const FORMULAS = [
  'Consumo por ano = pontos × potência × horas por noite × 365 × fator de uso',
  `Fator de uso do LuxSmart = (1 − movimento) × ${nivelBaixo} + movimento`,
  'Economia em R$ = energia economizada × tarifa',
  'CO₂ evitado = energia economizada × fator de emissão',
  `Retorno do investimento = custo do kit ÷ economia por ano (≈ ${payback})`,
] as const;

/**
 * Acordeão "Como calculamos?", fechado por padrão: resumo do cálculo e a
 * lista de todos os dados de referência com a fonte de cada um.
 * Usa <details> nativo: teclado e leitores de tela funcionam sem JavaScript.
 */
export function HowWeCalculate() {
  return (
    <details id="como-calculamos" className="group rounded-2xl border border-linha-noite">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 font-display text-xl font-bold [&::-webkit-details-marker]:hidden">
        Como calculamos?
        <Icone
          nome="seta"
          className="size-5 shrink-0 rotate-90 text-amarelo-luz transition-transform duration-200 group-open:-rotate-90"
        />
      </summary>

      <div className="grid gap-6 border-t border-linha-noite px-5 pt-5 pb-6">
        <p className="text-nevoa">
          Comparamos o LuxSmart com o LED atual, aceso a 100% a noite toda. Números com{' '}
          <EstimateBadge status="estimativa" tema="noite" /> são estimativas ou premissas a
          confirmar.
        </p>

        <ol role="list" className="grid gap-2">
          {FORMULAS.map((formula) => (
            <li
              key={formula}
              className="rounded-lg bg-white/[0.05] px-3 py-2 font-mono text-base break-words text-amarelo-suave"
            >
              {formula}
            </li>
          ))}
        </ol>

        <div>
          <h3 className="text-lg font-semibold">Dados e fontes</h3>
          <div className="mt-3 grid gap-5 md:grid-cols-2">
            {grupos.map((grupo) => (
              <section key={grupo.titulo} aria-label={grupo.titulo}>
                <h4 className="font-semibold text-azul-brilho">{grupo.titulo}</h4>
                <dl className="mt-2 grid gap-2">
                  {grupo.dados.map((dado) => (
                    <div key={dado.rotulo} className="border-b border-linha-noite/70 pb-2">
                      <dt className="text-white">{dado.rotulo}</dt>
                      <dd className="flex flex-wrap items-center gap-x-2 text-nevoa">
                        <span className="tabular-nums">{formatarDadoReferencia(dado)}</span>
                        <EstimateBadge status={dado.status} tema="noite" />
                        <span>· {dado.fonte}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}
