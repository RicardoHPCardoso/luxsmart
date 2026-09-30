/**
 * Configuração dos testes de componente (ambiente jsdom).
 * O jsdom não implementa matchMedia nem IntersectionObserver, usados pelo
 * Framer Motion (prefers-reduced-motion, whileInView) e pelo countup.js.
 */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

if (typeof window !== 'undefined') {
  afterEach(() => cleanup());

  window.matchMedia ??= (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;

  class IntersectionObserverFalso implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '0px';
    readonly scrollMargin = '0px';
    readonly thresholds = [0];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.IntersectionObserver ??= IntersectionObserverFalso;
}
