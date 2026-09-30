import type { CSSProperties, ReactNode } from 'react';
import type { LimiteCampo } from '@/data/calculadora';
import type { EscalaSlider } from '@/lib/calculator';

interface SliderProps {
  id: string;
  rotulo: string;
  valor: number;
  limite: LimiteCampo;
  aoAlterar: (valor: number) => void;
  /** Texto exibido e anunciado para o valor (ex.: "30%", "R$ 0,50/kWh"). */
  formatar: (valor: number) => string;
  /** Escala não linear (ex.: logarítmica) entre a posição do slider e o valor. */
  escala?: EscalaSlider;
  /** Dica exibida abaixo do controle e associada via aria-describedby. */
  dica?: ReactNode;
  /** Controle extra ao lado do valor (ex.: campo numérico). */
  complemento?: ReactNode;
}

/**
 * Slider acessível baseado em <input type="range"> nativo: teclado (setas,
 * Page Up/Down, Home/End) e leitores de tela funcionam por padrão.
 * `aria-valuetext` faz o leitor anunciar o valor formatado, não o número cru.
 */
export function Slider({
  id,
  rotulo,
  valor,
  limite,
  aoAlterar,
  formatar,
  escala,
  dica,
  complemento,
}: SliderProps) {
  const idDica = `${id}-dica`;
  const faixa = escala ?? limite;
  const posicao = escala ? escala.paraPosicao(valor) : valor;
  const progresso =
    faixa.max === faixa.min ? 0 : ((posicao - faixa.min) / (faixa.max - faixa.min)) * 100;
  const texto = formatar(valor);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <label htmlFor={id} className="font-semibold">
          {rotulo}
        </label>
        <div className="flex items-center gap-2">
          {complemento}
          <output htmlFor={id} className="font-semibold text-amarelo-luz tabular-nums">
            {texto}
          </output>
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={faixa.min}
        max={faixa.max}
        step={faixa.passo}
        value={posicao}
        onChange={(e) => {
          const bruto = Number(e.target.value);
          aoAlterar(escala ? escala.paraValor(bruto) : bruto);
        }}
        aria-valuetext={texto}
        aria-describedby={dica ? idDica : undefined}
        className="slider mt-3"
        style={{ '--progresso': `${progresso}%` } as CSSProperties}
      />
      {dica && (
        <p id={idDica} className="mt-1 text-sm text-nevoa">
          {dica}
        </p>
      )}
    </div>
  );
}
