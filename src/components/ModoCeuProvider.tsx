import { useMemo, useState, type ReactNode } from 'react';
import type { ModoCeu } from '@/components/ui/DayNightToggle';
import { ModoCeuContext } from '@/hooks/modoCeu';

export function ModoCeuProvider({ children }: { children: ReactNode }) {
  const [modo, definirModo] = useState<ModoCeu>('noite');
  const valor = useMemo(() => ({ modo, definirModo }), [modo]);
  return <ModoCeuContext.Provider value={valor}>{children}</ModoCeuContext.Provider>;
}
