import { motion } from 'framer-motion';
import { useMemo, useState, type ReactNode } from 'react';
import { Section } from '@/components/layout/Section';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Button } from '@/components/ui/Button';
import { EstimateBadge } from '@/components/ui/EstimateBadge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Slider } from '@/components/ui/Slider';
import { EXEMPLO_RUA, LIMITES_CALCULADORA, type ValoresCalculadora } from '@/data/calculadora';
import { INDAIATUBA } from '@/data/indaiatuba';
import { SECOES } from '@/data/navegacao';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { COR_CENARIO } from '@/lib/chartTheme';
import {
  ajustarAoLimite,
  calcularEconomia,
  criarEscalaLog,
  valoresDaCidade,
} from '@/lib/calculator';
import {
  formatarAnos,
  formatarEnergia,
  formatarHoras,
  formatarMoeda,
  formatarNumero,
  formatarPercentual,
} from '@/lib/format';

const ESCALA_PONTOS = criarEscalaLog(
  LIMITES_CALCULADORA.pontos.min,
  LIMITES_CALCULADORA.pontos.max,
);
const VALORES_CIDADE = valoresDaCidade(INDAIATUBA);
/** Espera antes de anunciar o resultado a leitores de tela (evita anúncios a cada passo do slider). */
const ATRASO_ANUNCIO_MS = 900;

const formatarPostes = (n: number) => `${formatarNumero(n)} ${n === 1 ? 'poste' : 'postes'}`;
const formatarTarifa = (v: number) => `${formatarMoeda(v, { centavos: true })}/kWh`;

export function Calculator() {
  const [valores, setValores] = useState<ValoresCalculadora>(EXEMPLO_RUA);

  const definir = <K extends keyof ValoresCalculadora>(campo: K, valor: number) =>
    setValores((atual) => ({
      ...atual,
      [campo]: ajustarAoLimite(valor, LIMITES_CALCULADORA[campo]),
    }));

  const resultado = useMemo(
    () => calcularEconomia(valores, INDAIATUBA.horasPorNoite.valor, INDAIATUBA.fatorEmissao.valor),
    [valores],
  );
  const { atual, luxsmart } = resultado.cenarios;
  const resumo = `Economia estimada: ${formatarMoeda(resultado.economiaReais)} por ano, ${formatarPercentual(resultado.economiaPercentual)} a menos de energia.`;
  const resumoAnunciado = useDebouncedValue(resumo, ATRASO_ANUNCIO_MS);

  return (
    <Section id={SECOES.calculadora} tema="noite" transicao="do-dia">
      <div className="container-site">
        <SectionHeading
          tema="noite"
          sobretitulo="Calculadora"
          titulo="Simule a sua rua (ou a cidade inteira)"
          descricao={
            <p>
              Ajuste os parâmetros e veja o resultado na hora. O período noturno considerado é de{' '}
              {formatarHoras(INDAIATUBA.horasPorNoite.valor)} por noite.
            </p>
          }
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Parâmetros */}
          <form
            className="grid gap-7 rounded-3xl border border-linha-noite bg-white/[0.03] p-6 sm:p-8"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Parâmetros da simulação"
          >
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setValores(VALORES_CIDADE)}>
                Aplicar à cidade de Indaiatuba
              </Button>
              <Button variante="contorno" onClick={() => setValores(EXEMPLO_RUA)}>
                Exemplo: uma rua
              </Button>
            </div>

            <Slider
              id="calc-pontos"
              rotulo="Número de postes"
              valor={valores.pontos}
              limite={LIMITES_CALCULADORA.pontos}
              escala={ESCALA_PONTOS}
              aoAlterar={(v) => definir('pontos', v)}
              formatar={formatarPostes}
              dica="Escala logarítmica: de uma rua até a cidade inteira."
              complemento={
                <CampoNumero
                  rotulo="Número de postes (valor exato)"
                  valor={valores.pontos}
                  min={LIMITES_CALCULADORA.pontos.min}
                  max={LIMITES_CALCULADORA.pontos.max}
                  aoAlterar={(v) => definir('pontos', v)}
                />
              }
            />
            <Slider
              id="calc-potencia"
              rotulo="Potência de cada luminária"
              valor={valores.potenciaW}
              limite={LIMITES_CALCULADORA.potenciaW}
              aoAlterar={(v) => definir('potenciaW', v)}
              formatar={(v) => `${formatarNumero(v)} W`}
              dica="Em Indaiatuba: 84 W (residenciais), 138 W (coletoras), 190 W (avenidas)."
            />
            <Slider
              id="calc-movimento"
              rotulo="Parte da noite com movimento"
              valor={valores.movimento}
              limite={LIMITES_CALCULADORA.movimento}
              aoAlterar={(v) => definir('movimento', v)}
              formatar={(v) => formatarPercentual(v)}
              dica="Tempo em que há alguém no raio do sensor e a luz fica a 100%."
            />
            <Slider
              id="calc-dimerizacao"
              rotulo="Potência sem movimento (dimerização)"
              valor={valores.dimerizacao}
              limite={LIMITES_CALCULADORA.dimerizacao}
              aoAlterar={(v) => definir('dimerizacao', v)}
              formatar={(v) => formatarPercentual(v)}
            />
            <Slider
              id="calc-tarifa"
              rotulo="Tarifa de energia"
              valor={valores.tarifa}
              limite={LIMITES_CALCULADORA.tarifa}
              aoAlterar={(v) => definir('tarifa', v)}
              formatar={formatarTarifa}
            />
            <Slider
              id="calc-kit"
              rotulo="Custo do kit por poste"
              valor={valores.custoKit}
              limite={LIMITES_CALCULADORA.custoKit}
              aoAlterar={(v) => definir('custoKit', v)}
              formatar={(v) => formatarMoeda(v)}
              dica="Usado no cálculo do retorno do investimento."
            />
          </form>

          {/* Resultados */}
          <div className="flex flex-col gap-6 rounded-3xl border border-amarelo-luz/40 bg-azul-profundo p-6 shadow-glow sm:p-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-sans text-lg font-semibold tracking-normal">Resultado</h3>
              <EstimateBadge status="estimativa" tema="noite" />
            </div>

            <div>
              <p className="text-sm text-nevoa">Economia na conta de luz</p>
              <p className="mt-1 text-5xl font-semibold tracking-tight text-amarelo-luz glow-texto sm:text-6xl">
                <AnimatedNumber
                  valor={resultado.economiaReais}
                  formatar={formatarMoeda}
                  duracao={0.8}
                />
              </p>
              <p className="mt-1 text-sm text-nevoa">por ano</p>
            </div>

            <div className="grid gap-3">
              <BarraConsumo
                rotulo="LED atual (100% a noite toda)"
                valor={atual.consumoKwh}
                fracao={1}
                cor={COR_CENARIO.atual}
              />
              <BarraConsumo
                rotulo="Com LuxSmart"
                valor={luxsmart.consumoKwh}
                fracao={atual.consumoKwh === 0 ? 0 : luxsmart.consumoKwh / atual.consumoKwh}
                cor={COR_CENARIO.luxsmart}
              />
            </div>

            <dl className="grid grid-cols-2 gap-4">
              <Indicador rotulo="Redução do consumo">
                <AnimatedNumber
                  valor={resultado.economiaPercentual}
                  formatar={formatarPercentual}
                  duracao={0.8}
                />
              </Indicador>
              <Indicador rotulo="Energia economizada">
                <AnimatedNumber
                  valor={resultado.economiaKwh}
                  formatar={formatarEnergia}
                  duracao={0.8}
                />
                <span className="text-sm font-normal text-nevoa"> /ano</span>
              </Indicador>
              <Indicador rotulo="CO₂ evitado">
                <AnimatedNumber
                  valor={resultado.co2EvitadoT}
                  formatar={(t) => `${formatarNumero(t, t < 10 ? 2 : 0)} t`}
                  duracao={0.8}
                />
                <span className="text-sm font-normal text-nevoa"> /ano</span>
              </Indicador>
              <Indicador rotulo="Retorno do investimento">
                {formatarAnos(resultado.paybackAnos)}
              </Indicador>
            </dl>

            <p className="sr-only" aria-live="polite">
              {resumoAnunciado}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

interface BarraConsumoProps {
  rotulo: string;
  valor: number;
  /** Largura da barra relativa ao cenário atual (0–1). */
  fracao: number;
  cor: string;
}

function BarraConsumo({ rotulo, valor, fracao, cor }: BarraConsumoProps) {
  return (
    <div>
      <div className="flex justify-between gap-3 text-sm">
        <span className="text-nevoa">{rotulo}</span>
        <span className="font-semibold tabular-nums">{formatarEnergia(valor)}/ano</span>
      </div>
      <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <motion.div
          className="h-full origin-left rounded-full"
          style={{ backgroundColor: cor }}
          initial={false}
          animate={{ scaleX: Math.min(1, Math.max(0, fracao)) }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

interface CampoNumeroProps {
  rotulo: string;
  valor: number;
  min: number;
  max: number;
  aoAlterar: (valor: number) => void;
}

/**
 * Campo numérico que não "briga" com a digitação: enquanto focado guarda o
 * texto digitado e só aplica valores válidos; ao sair, ajusta aos limites.
 */
function CampoNumero({ rotulo, valor, min, max, aoAlterar }: CampoNumeroProps) {
  const [texto, setTexto] = useState<string | null>(null);

  return (
    <input
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={texto ?? String(valor)}
      onFocus={() => setTexto(String(valor))}
      onChange={(e) => {
        setTexto(e.target.value);
        const n = Number(e.target.value);
        if (e.target.value !== '' && n >= min && n <= max) aoAlterar(n);
      }}
      onBlur={() => {
        if (texto !== null && texto !== '') aoAlterar(Number(texto));
        setTexto(null);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
      aria-label={rotulo}
      className="w-24 rounded-lg border border-nevoa/40 bg-azul-profundo px-2 py-1 text-right text-sm tabular-nums"
    />
  );
}

function Indicador({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-linha-noite p-4">
      <dt className="text-sm text-nevoa">{rotulo}</dt>
      <dd className="mt-1 text-xl font-semibold">{children}</dd>
    </div>
  );
}
