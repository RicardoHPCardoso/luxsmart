/**
 * Gera as imagens estáticas de compartilhamento:
 *   public/og-image.png         (1200×630, Open Graph / redes sociais)
 *   public/apple-touch-icon.png (180×180, atalho na tela inicial do iOS)
 *
 * Uso: npm run gerar:imagens
 * Edite o SVG abaixo para mudar o texto da imagem de compartilhamento.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const publico = (arquivo) => `${raiz}public/${arquivo}`;

const LARGURA = 1200;
const ALTURA = 630;
const POSTES_X = [640, 800, 960, 1120];
/** Postes perto do "carro" ficam a 100%; os outros, no modo econômico. */
const INTENSIDADES = [0.3, 1, 1, 0.3];

function poste(x, intensidade) {
  const base = 540;
  const topo = 250;
  return `
    <polygon points="${x + 58},${topo + 24} ${x + 82},${topo + 24} ${x + 150},${base} ${x - 10},${base}"
      fill="url(#cone)" opacity="${(intensidade * 0.85).toFixed(2)}"/>
    <ellipse cx="${x + 70}" cy="${base}" rx="95" ry="12" fill="url(#chao)" opacity="${intensidade}"/>
    <rect x="${x - 5}" y="${topo}" width="10" height="${base - topo}" rx="3" fill="#2B4170"/>
    <path d="M${x} ${topo + 10} q0 -18 18 -18 h40" fill="none" stroke="#2B4170" stroke-width="8" stroke-linecap="round"/>
    <rect x="${x + 44}" y="${topo - 16}" width="52" height="18" rx="9" fill="#34507F"/>
    <rect x="${x + 50}" y="${topo}" width="40" height="7" rx="3.5" fill="#FFE08A" opacity="${(0.35 + intensidade * 0.65).toFixed(2)}"/>
    <circle cx="${x + 70}" cy="${topo + 4}" r="40" fill="url(#halo)" opacity="${intensidade}"/>`;
}

const svgOg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${LARGURA}" height="${ALTURA}" viewBox="0 0 ${LARGURA} ${ALTURA}">
  <defs>
    <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050D1C"/>
      <stop offset="1" stop-color="#10244A"/>
    </linearGradient>
    <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFC83D" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#FFC83D" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="halo">
      <stop offset="0" stop-color="#FFF4D1"/>
      <stop offset="0.35" stop-color="#FFC83D" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#FFC83D" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="chao">
      <stop offset="0" stop-color="#FFC83D" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#FFC83D" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${LARGURA}" height="${ALTURA}" fill="url(#ceu)"/>
  <rect y="540" width="${LARGURA}" height="18" fill="#1B2E52"/>
  <rect y="558" width="${LARGURA}" height="72" fill="#0B1528"/>
  ${POSTES_X.map((x, i) => poste(x, INTENSIDADES[i])).join('')}

  <g transform="translate(80 150) scale(2)">
    <path d="M12 44V15a9 9 0 0 1 9-9h6" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <path d="M7 44h10" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <rect x="26" y="4" width="15" height="6" rx="3" fill="#FFC83D"/>
    <g fill="none" stroke="#FFC83D" stroke-linecap="round" stroke-width="2.6">
      <path d="M30 14a4 4 0 0 0 7 0"/>
      <path d="M26.6 17a8 8 0 0 0 13.8 0" opacity="0.75"/>
      <path d="M23.1 20a12 12 0 0 0 20.8 0" opacity="0.5"/>
    </g>
  </g>
  <text x="190" y="228" font-family="Space Grotesk, Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" fill="#FFFFFF">Lux<tspan fill="#FFC83D">Smart</tspan></text>
  <text x="80" y="340" font-family="Space Grotesk, Segoe UI, Arial, sans-serif" font-size="46" font-weight="700" fill="#FFFFFF">A rua que <tspan fill="#FFC83D">acende</tspan></text>
  <text x="80" y="398" font-family="Space Grotesk, Segoe UI, Arial, sans-serif" font-size="46" font-weight="700" fill="#FFFFFF">quando você passa.</text>
  <text x="80" y="460" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="26" fill="#A9B8D6">Poste inteligente · Indaiatuba–SP</text>
</svg>`;

await sharp(Buffer.from(svgOg)).png({ compressionLevel: 9 }).toFile(publico('og-image.png'));

const favicon = await readFile(publico('favicon.svg'));
await sharp(favicon, { density: 600 })
  .resize(180, 180)
  .png()
  .toFile(publico('apple-touch-icon.png'));

console.log('Imagens geradas: public/og-image.png e public/apple-touch-icon.png');
