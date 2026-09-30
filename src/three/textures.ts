import { CanvasTexture, SRGBColorSpace } from 'three';

const TAMANHO = 128;

function criarCanvas(desenhar: (ctx: CanvasRenderingContext2D) => void): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TAMANHO;
  canvas.height = TAMANHO;
  const ctx = canvas.getContext('2d');
  if (ctx) desenhar(ctx);
  const textura = new CanvasTexture(canvas);
  textura.colorSpace = SRGBColorSpace;
  return textura;
}

/** Brilho radial (branco → transparente): halos e poças de luz no chão. */
export function criarTexturaBrilho(): CanvasTexture {
  return criarCanvas((ctx) => {
    const meio = TAMANHO / 2;
    const g = ctx.createRadialGradient(meio, meio, 0, meio, meio, meio);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.45)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, TAMANHO, TAMANHO);
  });
}

/** Degradê vertical para o cone de luz: forte perto da luminária, some no chão. */
export function criarTexturaCone(): CanvasTexture {
  return criarCanvas((ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, TAMANHO);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, TAMANHO, TAMANHO);
  });
}
