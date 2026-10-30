import { Fragment } from 'react';
import { Icone } from '@/components/icons/icons';
import { Toggletip } from '@/components/ui/Toggletip';
import {
  FLUXO_PRINCIPAL,
  HARDWARE,
  PROTOTIPO,
  ROTULO_STATUS_COMPONENTE,
  type IdComponente,
} from '@/data/hardware';
import { cn } from '@/lib/cn';

/** Os dois primeiros itens do fluxo são os sensores (lidos juntos pelo ESP32). */
const SENSORES = FLUXO_PRINCIPAL.slice(0, 2);
const CADEIA = FLUXO_PRINCIPAL.slice(2);

/**
 * Linha compacta do protótipo: LDR + PIR/HC-SR04 → ESP32 → PWM → LEDs.
 * Cada componente abre um cartão curto com a sua função (toque, clique,
 * mouse ou teclado). O Wi-Fi aparece só como selo "Previsto".
 * No celular a linha fica na vertical; a partir de 768 px, na horizontal.
 */
export function ComponentFlow() {
  return (
    <figure className="mt-10 rounded-3xl border border-linha-noite bg-white/[0.03] p-5 sm:p-6">
      <figcaption className="text-lg font-semibold">
        Os componentes do protótipo{' '}
        <span className="font-normal text-nevoa">(toque para ver a função)</span>
      </figcaption>

      <ol
        role="list"
        className="mt-5 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-center"
      >
        <li className="grid grid-cols-2 gap-2 md:flex md:items-center">
          {SENSORES.map((id, i) => (
            <span key={id} className="contents md:flex md:items-center md:gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="hidden text-xl text-amarelo-luz md:inline">
                  +
                </span>
              )}
              <Componente id={id} />
            </span>
          ))}
        </li>
        {CADEIA.map((id) => (
          <li key={id} className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
            <Seta />
            <Componente id={id} />
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-col gap-3 border-t border-linha-noite pt-4 md:flex-row md:items-center md:justify-between">
        <p className="flex items-start gap-2 text-nevoa">
          <Icone nome="maquete" className="mt-0.5 size-5 shrink-0 text-amarelo-luz" />
          {PROTOTIPO.descricao}
        </p>
        <p className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-dashed border-azul-brilho/60 px-3 py-1 text-[0.9375rem] text-azul-brilho">
          <Icone nome={HARDWARE.wifi.icone} className="size-4" />
          {HARDWARE.wifi.sigla}: {ROTULO_STATUS_COMPONENTE.previsto}
        </p>
      </div>
    </figure>
  );
}

function Componente({ id }: { id: IdComponente }) {
  const componente = HARDWARE[id];

  return (
    <Toggletip
      conteudo={
        <>
          <span className="block font-semibold text-white">{componente.nome}</span>
          <span className="mt-1 block text-nevoa">{componente.funcao}</span>
        </>
      }
      className={cn(
        'flex min-h-11 w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-amarelo-luz/50 bg-amarelo-luz/10 px-3 py-2 font-semibold text-white transition-colors hover:border-amarelo-luz hover:bg-amarelo-luz/20 md:w-auto',
      )}
    >
      <Icone nome={componente.icone} className="size-5 shrink-0 text-amarelo-luz" />
      <span className="text-center">
        {/* Em telas estreitas, quebra só depois da barra ("PIR /" e "HC-SR04"), nunca no hífen. */}
        {componente.sigla.split(' / ').map((parte, i, partes) => (
          <Fragment key={parte}>
            {i > 0 && ' '}
            <span className="whitespace-nowrap">
              {i < partes.length - 1 ? `${parte} /` : parte}
            </span>
          </Fragment>
        ))}
      </span>
    </Toggletip>
  );
}

/** Seta do fluxo: para baixo no celular, para a direita a partir de 768 px. */
function Seta() {
  return (
    <span aria-hidden="true" className="flex justify-center text-amarelo-luz">
      <Icone nome="seta" className="size-5 rotate-90 md:rotate-0" />
    </span>
  );
}
