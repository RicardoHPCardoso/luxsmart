import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { classesBotao, type EstiloBotao } from './buttonStyles';

type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & EstiloBotao;

export function Button({ variante, tamanho, className, type = 'button', ...props }: BotaoProps) {
  return (
    <button type={type} className={cn(classesBotao({ variante, tamanho }), className)} {...props} />
  );
}

type LinkBotaoProps = AnchorHTMLAttributes<HTMLAnchorElement> & EstiloBotao;

export function ButtonLink({ variante, tamanho, className, ...props }: LinkBotaoProps) {
  return <a className={cn(classesBotao({ variante, tamanho }), className)} {...props} />;
}
