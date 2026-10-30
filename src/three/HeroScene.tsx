import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import { BufferGeometry, Color, Float32BufferAttribute, type Group } from 'three';
import { aleatorio } from '@/lib/aleatorio';
import { atualizarPoste, type EstadoPoste } from '@/lib/simulation';
import { Car } from './Car';
import { criarMateriaisPostes, type RegistrarMaterial } from './lampMaterials';
import {
  CAMERA,
  CARRO,
  CORES,
  ESTRELAS,
  POSICOES_POSTES,
  RAIO_DETECCAO,
  REGRA_POSTE,
} from './sceneConfig';
import { Scenery } from './Scenery';
import { StreetLamps } from './StreetLamps';
import { criarTexturaBrilho, criarTexturaCone } from './textures';

interface HeroSceneProps {
  /** Quando falso (início fora da tela), o laço de renderização para. */
  ativo: boolean;
  /** Chamado quando a cena está pronta para aparecer. */
  aoPronto?: () => void;
}

/** Teto de densidade de pixels: nítido sem pesar na placa de vídeo. */
const DPR_MAXIMO = 1.5;

/**
 * Cena 3D do início (só no desktop): rua noturna low-poly, carro em loop e
 * postes que acendem em sequência. Carregada sob demanda (React.lazy) — este
 * arquivo e o three.js ficam fora do carregamento inicial.
 */
export default function HeroScene({ ativo, aoPronto }: HeroSceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      frameloop={ativo ? 'always' : 'never'}
      dpr={[1, DPR_MAXIMO]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: CAMERA.fov, position: [...CAMERA.larga.posicao], near: 0.1, far: 300 }}
      onCreated={() => aoPronto?.()}
    >
      <Cena />
    </Canvas>
  );
}

function Cena() {
  const texturaBrilho = useMemo(() => criarTexturaBrilho(), []);
  const texturaCone = useMemo(() => criarTexturaCone(), []);

  const materiaisPostes = useRef(criarMateriaisPostes());
  const registrarMaterial = useCallback<RegistrarMaterial>((tipo, indice, material) => {
    materiaisPostes.current[tipo][indice] = material;
  }, []);
  const carro = useRef<Group>(null);

  // Estado da animação (fora do React: muda a cada quadro)
  const animacao = useRef({
    carroX: CARRO.inicioX as number,
    pausa: 0,
    postes: POSICOES_POSTES.map<EstadoPoste>((x) => ({
      x,
      nivel: REGRA_POSTE.dimerizacao,
      detectando: false,
      semMovimentoHa: Infinity,
    })),
  });

  const cores = useMemo(() => ({ sensor: new Color(CORES.sensor), luz: new Color(CORES.luz) }), []);

  useFrame((state, delta) => {
    const s = animacao.current;
    const dt = Math.min(delta, 0.05);

    // 1. Carro em loop
    if (s.pausa > 0) {
      s.pausa -= dt;
    } else {
      s.carroX += CARRO.velocidade * dt;
      if (s.carroX > CARRO.fimX) {
        s.carroX = CARRO.inicioX;
        s.pausa = CARRO.pausaS;
      }
    }
    carro.current?.position.setX(s.carroX);

    // 2. Postes: mesma regra do simulador (lib/simulation)
    const m = materiaisPostes.current;
    s.postes = s.postes.map((poste, i) => {
      const atualizado = atualizarPoste(
        poste,
        Math.abs(s.carroX - poste.x) <= RAIO_DETECCAO,
        dt,
        REGRA_POSTE,
      );
      const nivel = atualizado.nivel;
      const lente = m.lentes[i];
      if (lente) lente.emissiveIntensity = 0.15 + nivel * 3;
      const cone = m.cones[i];
      if (cone) cone.opacity = nivel * 0.28;
      const poca = m.pocas[i];
      if (poca) poca.opacity = nivel * 0.75;
      const halo = m.halos[i];
      if (halo) halo.opacity = nivel * 0.9;
      const sensor = m.sensores[i];
      if (sensor) sensor.emissive.copy(atualizado.detectando ? cores.luz : cores.sensor);
      return atualizado;
    });

    // 3. Câmera: enquadramento conforme a proporção da tela
    const proporcao = state.size.width / Math.max(1, state.size.height);
    const t = Math.min(1, Math.max(0, (1.6 - proporcao) / 0.8));
    const { larga, estreita } = CAMERA;
    state.camera.position.set(
      larga.posicao[0] + (estreita.posicao[0] - larga.posicao[0]) * t,
      larga.posicao[1] + (estreita.posicao[1] - larga.posicao[1]) * t,
      larga.posicao[2] + (estreita.posicao[2] - larga.posicao[2]) * t,
    );
    state.camera.lookAt(
      larga.alvo[0] + (estreita.alvo[0] - larga.alvo[0]) * t,
      larga.alvo[1],
      larga.alvo[2],
    );
  });

  return (
    <>
      <color attach="background" args={[CORES.ceu]} />
      <fog attach="fog" args={[CORES.ceu, 30, 110]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#8AB0FF', '#07101F', 0.35]} />
      <directionalLight position={[-12, 20, 8]} intensity={0.35} color="#8AB0FF" />

      <Estrelas />
      <mesh position={[-34, 15, -80]}>
        <sphereGeometry args={[2.4, 20, 16]} />
        <meshBasicMaterial color="#F7F9FC" toneMapped={false} fog={false} />
      </mesh>

      <Scenery />
      <StreetLamps
        registrar={registrarMaterial}
        texturaBrilho={texturaBrilho}
        texturaCone={texturaCone}
      />
      <Car grupo={carro} texturaBrilho={texturaBrilho} />
    </>
  );
}

/** Céu estrelado: pontos na metade de cima de uma esfera ao redor da cena. */
function Estrelas() {
  const geometria = useMemo(() => {
    const rand = aleatorio(3);
    const posicoes: number[] = [];
    for (let i = 0; i < ESTRELAS.quantidade; i++) {
      const theta = rand() * Math.PI * 2;
      const altura = 0.08 + rand() * 0.92; // só acima do horizonte
      const r = Math.sqrt(1 - altura * altura);
      posicoes.push(
        ESTRELAS.raio * r * Math.cos(theta),
        ESTRELAS.raio * altura,
        ESTRELAS.raio * r * Math.sin(theta),
      );
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(posicoes, 3));
    return g;
  }, []);

  return (
    <points geometry={geometria}>
      <pointsMaterial
        color="#FFFFFF"
        size={ESTRELAS.tamanho}
        sizeAttenuation={false}
        transparent
        opacity={0.8}
        fog={false}
      />
    </points>
  );
}
