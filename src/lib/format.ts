/**
 * Formatação de números em português do Brasil.
 * Todos os formatadores são criados uma única vez (Intl é caro de instanciar).
 */

const LOCALE = 'pt-BR';

const inteiro = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const umaCasa = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const compacto = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });
const moeda = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});
const moedaCentavos = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1234567 → "1.234.567" (ou com casas decimais). */
export function formatarNumero(valor: number, casas = 0): string {
  if (casas === 0) return inteiro.format(valor);
  if (casas === 1) return umaCasa.format(valor);
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: casas }).format(valor);
}

/** 1234567 → "1,2 mi"; 34500 → "34,5 mil". */
export function formatarCompacto(valor: number): string {
  return compacto.format(valor);
}

/** 1234567 → "R$ 1.234.567". Use `centavos` para valores pequenos (tarifas). */
export function formatarMoeda(valor: number, { centavos = false } = {}): string {
  return (centavos ? moedaCentavos : moeda).format(valor);
}

/** 1234567 → "R$ 1,2 mi". */
export function formatarMoedaCompacta(valor: number): string {
  return `R$ ${formatarCompacto(valor)}`;
}

/** 0.4432 → "44%". */
export function formatarPercentual(fracao: number, casas = 0): string {
  return `${formatarNumero(fracao * 100, casas)}%`;
}

const ESCALAS_ENERGIA = [
  { limite: 1e6, divisor: 1e6, unidade: 'GWh' },
  { limite: 1e3, divisor: 1e3, unidade: 'MWh' },
] as const;

/** Energia com unidade legível: 12_300_000 kWh → "12,3 GWh". */
export function formatarEnergia(kwh: number): string {
  const escala = ESCALAS_ENERGIA.find((e) => Math.abs(kwh) >= e.limite);
  if (!escala) return `${formatarNumero(kwh)} kWh`;
  return `${formatarNumero(kwh / escala.divisor, 1)} ${escala.unidade}`;
}

/** 11.8667 → "11h52min". */
export function formatarHoras(horasDecimais: number): string {
  let horas = Math.floor(horasDecimais);
  let minutos = Math.round((horasDecimais - horas) * 60);
  if (minutos === 60) {
    horas += 1;
    minutos = 0;
  }
  return minutos === 0 ? `${horas}h` : `${horas}h${String(minutos).padStart(2, '0')}min`;
}

/** Payback em anos: 2.34 → "2,3 anos"; Infinity → "sem retorno". */
export function formatarAnos(anos: number): string {
  if (!Number.isFinite(anos)) return 'sem retorno';
  if (anos < 1) {
    const meses = Math.max(1, Math.round(anos * 12));
    return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  }
  return `${formatarNumero(anos, 1)} ${anos < 2 ? 'ano' : 'anos'}`;
}
