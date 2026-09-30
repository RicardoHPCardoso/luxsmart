/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * `BASE_PATH` permite publicar em subdiretório (ex.: GitHub Pages em
 * https://usuario.github.io/luxsmart/ → BASE_PATH=/luxsmart/).
 * Na Vercel e em desenvolvimento o padrão "/" funciona sem ajustes.
 */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // A cena 3D e os gráficos são carregados via import() dinâmico, então o
    // bundler já os separa em chunks próprios, fora do carregamento inicial.
    target: 'es2022',
  },
  test: {
    // Testes de lógica rodam em Node; testes de componente declaram `@vitest-environment jsdom`.
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
    restoreMocks: true,
  },
});
