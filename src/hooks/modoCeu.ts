import { createContext, useContext } from 'react';
import type { ModoCeu } from '@/components/ui/DayNightToggle';

export interface ContextoModoCeu {
  modo: ModoCeu;
  definirModo: (modo: ModoCeu) => void;
}

export const ModoCeuContext = createContext<ContextoModoCeu>({
  modo: 'noite',
  definirModo: () => undefined,
});

/**
 * Modo Dia/Noite escolhido no hero. Compartilhado com o cabeçalho, que
 * precisa trocar as cores quando está transparente sobre um céu de dia.
 */
export function useModoCeu(): ContextoModoCeu {
  return useContext(ModoCeuContext);
}
