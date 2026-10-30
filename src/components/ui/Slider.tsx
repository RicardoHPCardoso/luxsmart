import type { CSSProperties, ReactNode } from 'react';
import type { LimiteCampo } from '@/data/calculadora';

interface SliderProps {
  id: string;
  rotulo: string;
  valor: number;
  limite: LimiteCampo;
  aoAlterar: (valor: number) => void;
  /** Texto exibido e anunciado para o valor (ex.: "36%"). */
  formatar: (valor: number) => string;
  /** Dica exibida abaixo do controle e associada via aria-describedby. */
  dica?: ReactNode;
}

/**
 * Slider acessível baseado em <input type="range"> nativo: teclado (setas,
 * Page Up/Down, Home/End), toque e leitores de tela funcionam por padrão.
 * `aria-valuetext` faz o leitor anunciar o valor formatado, não o número cru.
 */
export function Slider({ id, rotulo, valor, limite, aoAlterar, formatar, dica }: SliderProps) {
  const idDica = `${id}-dica`;
  const progresso =
    limite.max === limite.min ? 0 : ((valor - limite.min) / (limite.max - limite.min)) * 100;
  const texto = formatar(valor);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <label htmlFor={id} className="font-semibold">
          {rotulo}
        </label>
        <output htmlFor={id} className="text-xl font-semibold text-amarelo-luz tabular-nums">
          {texto}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={limite.min}
        max={limite.max}
        step={limite.passo}
        value={valor}
        onChange={(e) => aoAlterar(Number(e.target.value))}
        aria-valuetext={texto}
        aria-describedby={dica ? idDica : undefined}
        className="slider mt-2"
        style={{ '--progresso': `${progresso}%` } as CSSProperties}
      />
      {dica && (
        <p id={idDica} className="mt-1 text-nevoa">
          {dica}
        </p>
      )}
    </div>
  );
}
