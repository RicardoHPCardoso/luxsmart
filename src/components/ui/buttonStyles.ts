import { cn } from '@/lib/cn';

export type VarianteBotao = 'luz' | 'contorno';
export type TamanhoBotao = 'md' | 'lg';

export interface EstiloBotao {
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
}

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,box-shadow,scale] duration-200 ease-luz active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTES: Record<VarianteBotao, string> = {
  // Amarelo como FUNDO, texto azul-noite: contraste AA garantido.
  luz: 'bg-amarelo-luz text-azul-noite shadow-glow-sm hover:shadow-glow',
  contorno: 'border-2 border-current bg-transparent hover:border-amarelo-luz hover:bg-white/5',
};

const TAMANHOS: Record<TamanhoBotao, string> = {
  md: 'px-5 py-2 text-sm',
  lg: 'px-7 py-3 text-base',
};

/** Classes do botão — útil para estilizar links ou outros elementos como botão. */
export function classesBotao({ variante = 'luz', tamanho = 'md' }: EstiloBotao = {}): string {
  return cn(BASE, VARIANTES[variante], TAMANHOS[tamanho]);
}
