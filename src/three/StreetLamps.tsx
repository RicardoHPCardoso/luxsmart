import { AdditiveBlending, type CanvasTexture } from 'three';
import type { RegistrarMaterial } from './lampMaterials';
import { CORES, POSICOES_POSTES, POSTES, Z_LUMINARIA } from './sceneConfig';

interface StreetLampsProps {
  /** Guarda na cena os materiais que ela anima a cada quadro. */
  registrar: RegistrarMaterial;
  texturaBrilho: CanvasTexture;
  texturaCone: CanvasTexture;
}

const ALTURA_LUMINARIA = POSTES.altura - 0.15;
const RAIO_CONE = 1.9;
const RAIO_POCA = 2.8;

/**
 * Fileira de postes low-poly. A luz é "falsa" e barata: cone e poça no chão
 * com mistura aditiva, halo em sprite e lente emissiva — sem luzes dinâmicas.
 */
export function StreetLamps({ registrar, texturaBrilho, texturaCone }: StreetLampsProps) {
  return (
    <group>
      {POSICOES_POSTES.map((x, i) => (
        <group key={x}>
          {/* Tronco, braço e luminária */}
          <mesh position={[x, POSTES.altura / 2, POSTES.zTronco]}>
            <cylinderGeometry args={[0.08, 0.12, POSTES.altura, 8]} />
            <meshStandardMaterial color={CORES.poste} flatShading />
          </mesh>
          <mesh position={[x, POSTES.altura - 0.05, POSTES.zTronco + POSTES.braco / 2]}>
            <boxGeometry args={[0.1, 0.1, POSTES.braco]} />
            <meshStandardMaterial color={CORES.poste} flatShading />
          </mesh>
          <mesh position={[x, ALTURA_LUMINARIA + 0.08, Z_LUMINARIA]}>
            <boxGeometry args={[0.7, 0.16, 0.42]} />
            <meshStandardMaterial color={CORES.luminaria} flatShading />
          </mesh>
          <mesh position={[x, ALTURA_LUMINARIA - 0.01, Z_LUMINARIA]}>
            <boxGeometry args={[0.5, 0.04, 0.28]} />
            <meshStandardMaterial
              ref={(m) => registrar('lentes', i, m)}
              color="#1A2A48"
              emissive={CORES.luz}
              emissiveIntensity={0.6}
              toneMapped={false}
            />
          </mesh>
          {/* Sensor de presença */}
          <mesh position={[x, ALTURA_LUMINARIA + 0.2, Z_LUMINARIA]}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial
              ref={(m) => registrar('sensores', i, m)}
              color={CORES.sensor}
              emissive={CORES.sensor}
              emissiveIntensity={1}
              toneMapped={false}
            />
          </mesh>

          {/* Luz: cone, poça no chão e halo */}
          <mesh position={[x, ALTURA_LUMINARIA / 2, Z_LUMINARIA]}>
            <coneGeometry args={[RAIO_CONE, ALTURA_LUMINARIA, 28, 1, true]} />
            <meshBasicMaterial
              ref={(m) => registrar('cones', i, m)}
              color={CORES.luz}
              alphaMap={texturaCone}
              transparent
              opacity={0.1}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position={[x, 0.03, Z_LUMINARIA]}>
            <circleGeometry args={[RAIO_POCA, 32]} />
            <meshBasicMaterial
              ref={(m) => registrar('pocas', i, m)}
              color={CORES.luz}
              map={texturaBrilho}
              transparent
              opacity={0.3}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <sprite position={[x, ALTURA_LUMINARIA - 0.1, Z_LUMINARIA]} scale={[2.4, 2.4, 1]}>
            <spriteMaterial
              ref={(m) => registrar('halos', i, m)}
              color={CORES.luzClara}
              map={texturaBrilho}
              transparent
              opacity={0.3}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        </group>
      ))}
    </group>
  );
}
