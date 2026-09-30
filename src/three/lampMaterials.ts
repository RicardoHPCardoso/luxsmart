import type { MeshBasicMaterial, MeshStandardMaterial, SpriteMaterial } from 'three';

/** Materiais de cada poste que a cena atualiza a cada quadro. */
export interface MateriaisPostes {
  lentes: Array<MeshStandardMaterial | null>;
  cones: Array<MeshBasicMaterial | null>;
  pocas: Array<MeshBasicMaterial | null>;
  halos: Array<SpriteMaterial | null>;
  sensores: Array<MeshStandardMaterial | null>;
}

export type TipoMaterialPoste = keyof MateriaisPostes;

export function criarMateriaisPostes(): MateriaisPostes {
  return { lentes: [], cones: [], pocas: [], halos: [], sensores: [] };
}

/** Função que a cena passa aos postes para guardar a referência de cada material. */
export type RegistrarMaterial = <T extends TipoMaterialPoste>(
  tipo: T,
  indice: number,
  material: MateriaisPostes[T][number],
) => void;
