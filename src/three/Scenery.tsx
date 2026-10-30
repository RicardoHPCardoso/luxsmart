import { useLayoutEffect, useMemo, useRef } from 'react';
import { Object3D, type InstancedMesh } from 'three';
import { aleatorio } from '@/lib/aleatorio';
import { CORES, POSICOES_POSTES, POSTES } from './sceneConfig';

interface Caixa {
  x: number;
  z: number;
  largura: number;
  altura: number;
  profundidade: number;
}

const QUANTIDADE_PREDIOS = 30;
const PROBABILIDADE_JANELA_ACESA = 0.22;

function gerarCidade() {
  const rand = aleatorio(7);
  const predios: Caixa[] = [];
  const janelas: Array<{ x: number; y: number; z: number }> = [];

  for (let i = 0; i < QUANTIDADE_PREDIOS; i++) {
    const largura = 2.5 + rand() * 3.5;
    const altura = 4 + rand() * 10;
    const profundidade = 3 + rand() * 3;
    const x = -60 + i * 4.2 + rand() * 1.5;
    const z = -20 - rand() * 10;
    predios.push({ x, z, largura, altura, profundidade });

    for (let jy = 1; jy < altura - 0.6; jy += 1.1) {
      for (let jx = -largura / 2 + 0.6; jx < largura / 2 - 0.4; jx += 0.9) {
        if (rand() < PROBABILIDADE_JANELA_ACESA) {
          janelas.push({ x: x + jx, y: jy, z: z + profundidade / 2 + 0.01 });
        }
      }
    }
  }
  return { predios, janelas };
}

/** Chão, rua, calçada, prédios low-poly e árvores. */
export function Scenery() {
  const { predios, janelas } = useMemo(() => gerarCidade(), []);
  const refPredios = useRef<InstancedMesh>(null);
  const refJanelas = useRef<InstancedMesh>(null);
  const refFaixas = useRef<InstancedMesh>(null);
  const faixas = useMemo(() => Array.from({ length: 24 }, (_, i) => -46 + i * 4), []);

  useLayoutEffect(() => {
    const aux = new Object3D();
    predios.forEach((p, i) => {
      aux.position.set(p.x, p.altura / 2, p.z);
      aux.scale.set(p.largura, p.altura, p.profundidade);
      aux.updateMatrix();
      refPredios.current?.setMatrixAt(i, aux.matrix);
    });
    janelas.forEach((j, i) => {
      aux.position.set(j.x, j.y, j.z);
      aux.scale.set(0.35, 0.5, 1);
      aux.updateMatrix();
      refJanelas.current?.setMatrixAt(i, aux.matrix);
    });
    faixas.forEach((x, i) => {
      aux.position.set(x, 0.02, 3);
      aux.scale.set(1.8, 1, 0.14);
      aux.updateMatrix();
      refFaixas.current?.setMatrixAt(i, aux.matrix);
    });
    for (const ref of [refPredios, refJanelas, refFaixas]) {
      if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [predios, janelas, faixas]);

  return (
    <group>
      {/* Chão */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01} receiveShadow={false}>
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial color={CORES.chao} flatShading />
      </mesh>

      {/* Rua e calçada */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 1.4]}>
        <planeGeometry args={[120, 7]} />
        <meshStandardMaterial color={CORES.rua} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.09, POSTES.zTronco - 0.1]}>
        <boxGeometry args={[120, 0.18, 2.2]} />
        <meshStandardMaterial color={CORES.calcada} flatShading />
      </mesh>
      <instancedMesh ref={refFaixas} args={[undefined, undefined, faixas.length]}>
        <boxGeometry args={[1, 0.01, 1]} />
        <meshStandardMaterial color="#F7F9FC" emissive="#F7F9FC" emissiveIntensity={0.15} />
      </instancedMesh>

      {/* Prédios e janelas */}
      <instancedMesh ref={refPredios} args={[undefined, undefined, predios.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={CORES.predio} flatShading />
      </instancedMesh>
      <instancedMesh ref={refJanelas} args={[undefined, undefined, janelas.length]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#1a2a48"
          emissive={CORES.luz}
          emissiveIntensity={0.7}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Árvores entre os postes */}
      {POSICOES_POSTES.slice(0, -1).map((x) => (
        <group key={x} position={[x + POSTES.espacamento / 2, 0, POSTES.zTronco - 0.5]}>
          <mesh position-y={0.8}>
            <cylinderGeometry args={[0.1, 0.14, 1.6, 6]} />
            <meshStandardMaterial color={CORES.calcada} flatShading />
          </mesh>
          <mesh position-y={2.3}>
            <coneGeometry args={[0.9, 2.2, 7]} />
            <meshStandardMaterial color={CORES.arvore} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}
