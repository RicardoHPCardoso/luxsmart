import { Section } from '@/components/layout/Section';
import { EstimateBadge } from '@/components/ui/EstimateBadge';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { INDAIATUBA } from '@/data/indaiatuba';
import { SECOES } from '@/data/navegacao';
import { fatorUsoLuxSmart } from '@/lib/energy';
import { formatarDadoReferencia, formatarNumero, formatarPercentual } from '@/lib/format';
import { listarDadosReferencia } from '@/lib/indaiatubaScenarios';

const movimentoExemplo = INDAIATUBA.vias.residencial.movimento.valor;
const dimerizacaoExemplo = INDAIATUBA.dimerizacao.valor;
const fatorExemplo = fatorUsoLuxSmart(movimentoExemplo, dimerizacaoExemplo);

const FORMULAS = [
  {
    titulo: 'Consumo anual',
    formula: 'kWh/ano = pontos × potência (kW) × horas por noite × 365 × fator de uso',
    explicacao:
      'O fator de uso é a fração média da potência usada ao longo da noite: 1 no LED atual (sempre a 100%).',
  },
  {
    titulo: 'Fator de uso do LuxSmart',
    formula: 'fator = (1 − movimento) × dimerização + movimento',
    explicacao: `Sem movimento a luz fica dimerizada; com movimento, a 100%. Ex.: ${formatarNumero(1 - movimentoExemplo, 1)} × ${formatarNumero(dimerizacaoExemplo, 1)} + ${formatarNumero(movimentoExemplo, 1)} = ${formatarNumero(fatorExemplo, 2)}, ou seja, ${formatarPercentual(1 - fatorExemplo)} de economia sobre o LED atual.`,
  },
  {
    titulo: 'Custo anual',
    formula: 'R$/ano = kWh/ano × tarifa (R$/kWh)',
    explicacao: 'A tarifa é um valor de referência e deve ser ajustada pela tarifa B4a vigente.',
  },
  {
    titulo: 'CO₂ evitado',
    formula: 't CO₂ = kWh economizados × fator de emissão (kg/kWh) ÷ 1000',
    explicacao: 'Usa o fator médio de emissão do Sistema Interligado Nacional (MCTI).',
  },
  {
    titulo: 'Payback simples',
    formula: 'anos = pontos × custo do kit ÷ economia anual (R$)',
    explicacao: 'Não considera juros, inflação, manutenção nem ganhos de vida útil do LED.',
  },
] as const;

const PREMISSAS = [
  'O cenário “Atual” considera os pontos em LED a 100% durante todo o período noturno de referência, sem falhas nem dimerização existente.',
  'O cenário “Convencional” é apenas uma referência histórica: os mesmos pontos com lâmpadas de vapor de sódio equivalentes, incluindo perdas no reator.',
  'A economia, o CO₂ evitado e o payback do LuxSmart são calculados sobre o cenário Atual, pois o kit é instalado nas luminárias LED existentes.',
  'Os percentuais de movimento por tipo de via e a distribuição dos pontos entre as vias são hipóteses; serão substituídos por medições do protótipo e pelo cadastro da Prefeitura.',
  'O gráfico da noite típica distribui o movimento hora a hora (mais cedo e ao amanhecer, menos de madrugada), mantendo a mesma média — o consumo anual não muda.',
  'A calculadora usa um “poste médio” (potência média e movimento ponderado pela energia de cada via), o que reproduz o total da cidade.',
  'O tempo em que a luz fica a 100% após o fim do movimento está incluído no percentual de movimento.',
  'A demonstração física do LuxSmart é uma maquete em escala, em que LEDs representam os postes e o ESP32 controla o brilho por PWM. Os valores para Indaiatuba são projeções com luminárias reais, não medições da maquete.',
] as const;

const grupos = listarDadosReferencia(INDAIATUBA);

export function Methodology() {
  return (
    <Section id={SECOES.metodologia} tema="branco">
      <div className="container-site">
        <SectionHeading
          sobretitulo="Metodologia e fontes"
          titulo="De onde vêm os números"
          descricao={
            <p>
              Os cálculos são simples e transparentes. Valores com o selo{' '}
              <EstimateBadge status="estimativa" /> são estimativas ou hipóteses do projeto; os
              marcados com <EstimateBadge status="verificar" /> são referências que ainda precisam
              ser conferidas na fonte oficial.
            </p>
          }
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h3 className="text-2xl font-bold">Fórmulas</h3>
            <dl className="mt-6 grid gap-4">
              {FORMULAS.map((f) => (
                <div key={f.titulo} className="rounded-2xl border border-linha bg-off-white p-5">
                  <dt className="font-semibold">{f.titulo}</dt>
                  <dd className="mt-2">
                    <code className="block rounded-lg bg-azul-noite px-3 py-2 font-mono text-sm break-words text-amarelo-suave">
                      {f.formula}
                    </code>
                    <p className="mt-2 text-sm text-tinta-suave">{f.explicacao}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal atraso={0.1}>
            <h3 className="text-2xl font-bold">Premissas e limitações</h3>
            <ul className="mt-6 grid gap-3">
              {PREMISSAS.map((p) => (
                <li key={p} className="flex gap-3 text-tinta-suave">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-2 shrink-0 rounded-full bg-amarelo-luz shadow-glow-sm"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <h3 className="text-2xl font-bold" id="tabela-dados-titulo">
            Dados de referência
          </h3>
          <p className="mt-2 text-tinta-suave">
            Todos os valores usados nos cálculos, com a fonte e a situação de cada um.
          </p>
          <div
            className="relative mt-6 overflow-x-auto rounded-2xl border border-linha"
            role="region"
            aria-labelledby="tabela-dados-titulo"
            tabIndex={0}
          >
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Dados de referência de Indaiatuba usados nos cálculos do LuxSmart
              </caption>
              <thead className="bg-azul-noite text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Dado
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Valor
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Situação
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Fonte
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Observação
                  </th>
                </tr>
              </thead>
              {grupos.map((grupo) => (
                <tbody key={grupo.titulo}>
                  <tr className="bg-azul-claro/60">
                    <th
                      scope="colgroup"
                      colSpan={5}
                      className="px-4 py-2 font-display font-semibold text-azul-noite"
                    >
                      {grupo.titulo}
                    </th>
                  </tr>
                  {grupo.dados.map((dado) => (
                    <tr key={dado.rotulo} className="border-t border-linha align-top">
                      <th scope="row" className="px-4 py-3 font-medium">
                        {dado.rotulo}
                      </th>
                      <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                        {formatarDadoReferencia(dado)}
                      </td>
                      <td className="px-4 py-3">
                        {dado.status === 'fonte' ? (
                          <span className="text-xs font-semibold tracking-wide text-azul-primario uppercase">
                            fonte
                          </span>
                        ) : (
                          <EstimateBadge status={dado.status} />
                        )}
                      </td>
                      <td className="px-4 py-3 text-tinta-suave">{dado.fonte}</td>
                      <td className="px-4 py-3 text-tinta-suave">{dado.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
