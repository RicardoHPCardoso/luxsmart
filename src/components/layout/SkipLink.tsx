import { useScrollTo } from '@/hooks/useScrollTo';

/** Link "pular para o conteúdo" — primeiro item focável da página. */
export function SkipLink() {
  const { aoClicarAncora } = useScrollTo();

  return (
    <a
      href="#conteudo"
      onClick={aoClicarAncora}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-amarelo-luz focus:px-4 focus:py-2 focus:font-semibold focus:text-azul-noite focus:shadow-glow"
    >
      Pular para o conteúdo
    </a>
  );
}
