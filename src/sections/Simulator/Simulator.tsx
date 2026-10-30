import { useRef } from 'react';
import { Icone } from '@/components/icons/icons';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SECOES } from '@/data/navegacao';
import { CONFIG_SIMULADOR } from '@/data/simulador';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { formatarNumero, formatarPercentual } from '@/lib/format';
import { consumoInstantaneo } from '@/lib/simulation';
import { PowerMeter } from './PowerMeter';
import { StreetScene } from './StreetScene';
import { useStreetSimulation } from './useStreetSimulation';

/** Espera antes de anunciar o estado da rua a leitores de tela. */
const ATRASO_ANUNCIO_MS = 1200;

export function Simulator() {
  const palco = useRef<HTMLDivElement>(null);
  const { estado, adicionar, limpar, emAndamento } = useStreetSimulation(CONFIG_SIMULADOR, palco);
  const consumo = consumoInstantaneo(estado.postes, CONFIG_SIMULADOR.potenciaW);
  const lotado = estado.agentes.length >= CONFIG_SIMULADOR.maxAgentes;

  const resumo = `${consumo.acesosTotal} de ${estado.postes.length} postes a 100%. Consumo agora: ${formatarNumero(consumo.atualW)} watts, ${formatarPercentual(consumo.fracao)} do consumo com todos acesos.`;
  const resumoAnunciado = useDebouncedValue(resumo, ATRASO_ANUNCIO_MS);

  return (
    <Section id={SECOES.simule} tema="branco" transicao="da-noite">
      <div className="container-site">
        <SectionHeading
          sobretitulo="Simulador"
          titulo="Faça a rua acender"
          descricao={
            <p>
              Uma rua residencial com {CONFIG_SIMULADOR.quantidadePostes} postes de{' '}
              {CONFIG_SIMULADOR.potenciaW} W. Envie um carro ou um pedestre — ou clique na rua — e
              veja cada poste reagir ao entrar no raio do sensor de presença (PIR e/ou HC-SR04, na
              maquete), esperar alguns segundos e voltar ao modo econômico.
            </p>
          }
        />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button onClick={() => adicionar('carro')} disabled={lotado}>
            <Icone nome="carro" className="size-5" />
            Enviar carro
          </Button>
          <Button onClick={() => adicionar('pedestre')} disabled={lotado}>
            <Icone nome="pedestre" className="size-5" />
            Enviar pedestre
          </Button>
          <Button
            variante="contorno"
            className="text-tinta hover:bg-azul-claro/40"
            onClick={limpar}
            disabled={!emAndamento}
          >
            Limpar rua
          </Button>
          <p className="flex items-center gap-2 text-sm text-tinta-suave">
            <Icone nome="toque" className="size-5 text-azul-primario" />
            Dica: clique ou toque na rua para criar movimento.
          </p>
        </div>

        <div
          ref={palco}
          className="mt-6 overflow-hidden rounded-3xl border border-linha-noite bg-azul-noite shadow-cartao"
        >
          <StreetScene estado={estado} aoClicar={(x) => adicionar('toque', x)} />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-linha-noite px-5 py-3 text-sm text-nevoa">
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-3 w-6 rounded-full border-2 border-dashed border-azul-brilho/60"
              />
              Raio de detecção
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-3 w-6 rounded-full border-2 border-dashed border-amarelo-luz bg-amarelo-luz/20"
              />
              Movimento detectado
            </span>
            <span>
              Espera após o movimento: {formatarNumero(CONFIG_SIMULADOR.tempoEsperaS, 1)} s
            </span>
          </div>
        </div>

        <div className="mt-4">
          <PowerMeter consumo={consumo} totalPostes={estado.postes.length} />
        </div>

        <p className="sr-only" aria-live="polite">
          {resumoAnunciado}
        </p>
      </div>
    </Section>
  );
}
