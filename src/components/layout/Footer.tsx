import { Logo } from '@/components/brand/Logo';
import { NAVEGACAO } from '@/data/navegacao';
import { SITE } from '@/data/site';
import { useScrollTo } from '@/hooks/useScrollTo';

export function Footer() {
  const { aoClicarAncora } = useScrollTo();

  return (
    <footer className="tema-noite border-t border-linha-noite bg-azul-profundo">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_1fr]">
        <div className="max-w-md">
          <Logo />
          <p className="mt-4 text-nevoa">{SITE.descricao}</p>
          <p className="mt-6 text-sm text-nevoa">
            Projeto acadêmico · {SITE.instituicao} · {SITE.cidade} · {SITE.ano}
          </p>
          <p className="mt-2 text-sm text-nevoa">
            Os valores apresentados são estimativas para fins educacionais. Veja a seção de
            metodologia.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="font-display text-sm font-semibold tracking-wide text-white uppercase">
            Navegue
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {NAVEGACAO.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={aoClicarAncora}
                  className="inline-flex min-h-6 items-center text-nevoa hover:text-amarelo-luz"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
            {SITE.repositorio && (
              <li>
                <a
                  href={SITE.repositorio}
                  className="inline-flex min-h-6 items-center text-nevoa hover:text-amarelo-luz"
                  rel="noreferrer"
                  target="_blank"
                >
                  Repositório no GitHub
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
