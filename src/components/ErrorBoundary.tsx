import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  /** O que exibir se algo falhar (ex.: a ilustração estática no lugar do 3D). */
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  falhou: boolean;
}

/**
 * Isola partes opcionais da página (como a cena 3D): se o chunk não carregar
 * ou o WebGL falhar, o resto do site continua funcionando.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { falhou: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { falhou: true };
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.warn('Parte opcional desativada após erro:', erro, info);
  }

  render() {
    return this.state.falhou ? this.props.fallback : this.props.children;
  }
}
