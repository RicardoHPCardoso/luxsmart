import { useMemo, useRef, useState } from 'react';
import { Icone } from '@/components/icons/icons';
import { Section } from '@/components/layout/Section';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Button } from '@/components/ui/Button';
import { EstimateBadge } from '@/components/ui/EstimateBadge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Slider } from '@/components/ui/Slider';
import { LIMITES_CALCULADORA } from '@/data/calculadora';
import { INDAIATUBA } from '@/data/indaiatuba';
import { SECOES } from '@/data/navegacao';
import { CONFIG_SIMULADOR } from '@/data/simulador';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ajustarAoLimite, calcularEconomia, valoresDaCidade } from '@/lib/calculator';
import { formatarMoedaCompacta, formatarPercentual } from '@/lib/format';
import { consumoInstantaneo } from '@/lib/simulation';
import { StreetScene } from './StreetScene';
import { useStreetSimulation } from './useStreetSimulation';

/** Indaiatuba inteira como um "poste médio" (mesmos totais da seção Resultados). */
const CIDADE = valoresDaCidade(INDAIATUBA);
/** Espera antes de anunciar mudanças a leitores de tela (evita anúncios a cada quadro). */
const ATRASO_ANUNCIO_MS = 900;

/**
 * Bloco interativo único: a rua com 5 postes reage ao toque, e o slider de
 * movimento recalcula a economia anual de Indaiatuba (demais valores vêm
 * dos dados de referência).
 */
export function Simulate() {
  const palco = useRef<HTMLDivElement>(null);
  const { estado, adicionar } = useStreetSimulation(CONFIG_SIMULADOR, palco);
  const consumo = consumoInstantaneo(estado.postes, CONFIG_SIMULADOR.potenciaW);
  const lotado = estado.agentes.length >= CONFIG_SIMULADOR.maxAgentes;

  const [movimento, setMovimento] = useState(CIDADE.movimento);
  const resultado = useMemo(
    () =>
      calcularEconomia(
        { ...CIDADE, movimento },
        INDAIATUBA.horasPorNoite.valor,
        INDAIATUBA.fatorEmissao.valor,
      ),
    [movimento],
  );

  const resumoRua = `${consumo.acesosTotal} de ${estado.postes.length} postes a 100%. Consumo agora: ${formatarPercentual(consumo.fracao)} do máximo.`;
  const resumoEconomia = `Economia de ${formatarPercentual(resultado.economiaPercentual)}, cerca de ${formatarMoedaCompacta(resultado.economiaReais)} por ano em Indaiatuba.`;
  const anuncio = useDebouncedValue(`${resumoEconomia} ${resumoRua}`, ATRASO_ANUNCIO_MS);

  return (
    <Section id={SECOES.simule} tema="noite">
      <div className="container-site">
        <SectionHeading
          tema="noite"
          sobretitulo="Simule a economia"
          titulo="Teste você mesmo"
          descricao="Toque na rua para criar movimento e ajuste quanto tempo ela fica movimentada."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div>
            <div
              ref={palco}
              className="overflow-hidden rounded-3xl border border-linha-noite bg-azul-profundo"
            >
              <StreetScene estado={estado} aoClicar={(x) => adicionar('toque', x)} />
              <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-linha-noite px-4 py-3 text-nevoa">
                <span>
                  <strong className="text-white tabular-nums">{consumo.acesosTotal}</strong> de{' '}
                  {estado.postes.length} postes a 100%
                </span>
                <span>
                  Consumo agora:{' '}
                  <strong className="text-white tabular-nums">
                    {formatarPercentual(consumo.fracao)}
                  </strong>{' '}
                  do máximo
                </span>
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variante="contorno" onClick={() => adicionar('carro')} disabled={lotado}>
                <Icone nome="carro" className="size-5" />
                Enviar carro
              </Button>
              <Button variante="contorno" onClick={() => adicionar('pedestre')} disabled={lotado}>
                <Icone nome="pedestre" className="size-5" />
                Enviar pedestre
              </Button>
            </div>
          </div>

          <div className="grid gap-6 rounded-3xl border border-linha-noite bg-white/[0.04] p-5 sm:p-6">
            <Slider
              id="simule-movimento"
              rotulo="% do tempo com movimento na rua"
              valor={movimento}
              limite={LIMITES_CALCULADORA.movimento}
              aoAlterar={(v) => setMovimento(ajustarAoLimite(v, LIMITES_CALCULADORA.movimento))}
              formatar={(v) => formatarPercentual(v)}
              dica={`Média estimada para a cidade: ${formatarPercentual(CIDADE.movimento)}.`}
            />

            <div className="rounded-2xl border border-amarelo-luz/60 bg-azul-profundo p-5 shadow-glow">
              <div className="flex items-center justify-between gap-2">
                <p className="text-nevoa">Resultado em Indaiatuba</p>
                <EstimateBadge status="estimativa" tema="noite" />
              </div>
              {/* Cada trecho fica inteiro numa linha: nunca separa "R$" do número. */}
              <p className="mt-2 text-2xl font-semibold sm:text-3xl">
                <span className="whitespace-nowrap">
                  Economia de{' '}
                  <span className="text-amarelo-luz glow-texto">
                    <AnimatedNumber
                      valor={resultado.economiaPercentual}
                      formatar={formatarPercentual}
                      duracao={0.6}
                    />
                  </span>
                </span>{' '}
                <span className="whitespace-nowrap">
                  ≈{' '}
                  <span className="text-amarelo-luz glow-texto">
                    <AnimatedNumber
                      valor={resultado.economiaReais}
                      formatar={formatarMoedaCompacta}
                      duracao={0.6}
                    />
                  </span>{' '}
                  por ano
                </span>
              </p>
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {anuncio}
        </p>
      </div>
    </Section>
  );
}
