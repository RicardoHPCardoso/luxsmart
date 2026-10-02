import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Popover API: nativa nos navegadores atuais; o polyfill só é baixado onde falta.
if (!('popover' in HTMLElement.prototype)) {
  void import('@oddbird/popover-polyfill');
}

const raiz = document.getElementById('root');
if (!raiz) throw new Error('Elemento #root não encontrado em index.html');

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
