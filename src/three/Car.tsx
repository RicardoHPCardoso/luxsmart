import type { Ref } from 'react';
import { AdditiveBlending, type CanvasTexture, type Group, type MeshBasicMaterial } from 'three';
import { CARRO, CORES } from './sceneConfig';

interface CarProps {
  grupo: Ref<Group>;
  farol: Ref<MeshBasicMaterial>;
  texturaBrilho: CanvasTexture;
}

const RODAS: Array<[number, number]> = [
  [-0.7, 0.5],
  [0.7, 0.5],
  [-0.7, -0.5],
  [0.7, -0.5],
];

/** Carro low-poly com faróis; a cena move o grupo ao longo do eixo X. */
export function Car({ grupo, farol, texturaBrilho }: CarProps) {
  return (
    <group ref={grupo} position={[CARRO.inicioX, 0, CARRO.z]}>
      <mesh position-y={0.45}>
        <boxGeometry args={[2.2, 0.5, 1.1]} />
        <meshStandardMaterial color={CORES.carro} flatShading />
      </mesh>
      <mesh position={[-0.15, 0.88, 0]}>
        <boxGeometry args={[1.2, 0.42, 0.96]} />
        <meshStandardMaterial color="#DCE8FF" flatShading metalness={0.2} roughness={0.3} />
      </mesh>
      {RODAS.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.26, z]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.26, 0.26, 0.2, 10]} />
          <meshStandardMaterial color="#050D1C" flatShading />
        </mesh>
      ))}
      {[-0.32, 0.32].map((z) => (
        <mesh key={z} position={[1.11, 0.5, z]}>
          <boxGeometry args={[0.04, 0.12, 0.22]} />
          <meshStandardMaterial
            color={CORES.luzClara}
            emissive={CORES.luzClara}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Facho dos faróis no asfalto */}
      <mesh rotation-x={-Math.PI / 2} position={[3.8, 0.04, 0]} scale={[6, 2.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={farol}
          color={CORES.luzClara}
          map={texturaBrilho}
          transparent
          opacity={0.5}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
