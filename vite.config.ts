/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite';

/** Fontes usadas acima da dobra: pré-carregá-las evita o texto "pular" (CLS). */
const FONTES_CRITICAS = [
  /inter-latin-wght-normal.*\.woff2$/,
  /space-grotesk-latin-wght-normal.*\.woff2$/,
];

/**
 * Completa o index.html no build: URLs absolutas de compartilhamento (ou
 * remove canônico/og:url sem SITE_URL) e preload das fontes críticas.
 */
function metadadosDoSite(base: string, siteUrl: string): Plugin {
  return {
    name: 'luxsmart-metadados',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        let resultado = html;
        if (!siteUrl) {
          resultado = resultado
            .split('\n')
            .filter((linha) => !linha.includes('rel="canonical"') && !linha.includes('og:url'))
            .join('\n');
        }
        resultado = resultado.replaceAll('%URL_DO_SITE%', `${siteUrl}${base}`);

        const tags: HtmlTagDescriptor[] = Object.keys(ctx.bundle ?? {})
          .filter((arquivo) => FONTES_CRITICAS.some((padrao) => padrao.test(arquivo)))
          .map((arquivo) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: `${base}${arquivo}`,
              crossorigin: '',
            },
            injectTo: 'head',
          }));

        return { html: resultado, tags };
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  // Lê .env, .env.[modo] e as variáveis do ambiente (shell, Vercel, GitHub Actions).
  const env = loadEnv(mode, process.cwd(), '');

  /**
   * `BASE_PATH` permite publicar em subdiretório (ex.: GitHub Pages em
   * https://usuario.github.io/luxsmart/ → BASE_PATH=/luxsmart/).
   * Na Vercel e em desenvolvimento o padrão "/" funciona sem ajustes.
   */
  const base = env.BASE_PATH || '/';

  /**
   * `SITE_URL` (ex.: https://luxsmart.vercel.app) gera URLs absolutas para a
   * imagem do Open Graph e o link canônico — redes sociais não aceitam caminhos
   * relativos. Sem a variável, o canônico e o og:url são omitidos.
   */
  const siteUrl = (env.SITE_URL ?? '').replace(/\/$/, '');

  return {
    base,
    plugins: [react(), tailwindcss(), metadadosDoSite(base, siteUrl)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      // A cena 3D e os gráficos são carregados via import() dinâmico, então o
      // bundler já os separa em chunks próprios, fora do carregamento inicial.
      target: 'es2022',
      // O chunk da cena 3D (three.js) passa de 500 kB, mas só é baixado sob
      // demanda, em telas grandes e com o navegador ocioso.
      chunkSizeWarningLimit: 1000,
    },
    test: {
      // Testes de lógica rodam em Node; testes de componente declaram `@vitest-environment jsdom`.
      environment: 'node',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['src/test/setup.ts'],
      restoreMocks: true,
    },
  };
});
