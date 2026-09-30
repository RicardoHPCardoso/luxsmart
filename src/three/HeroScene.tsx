import { PerformanceMonitor, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Color,
  Vector3,
  type AmbientLight,
  type DirectionalLight,
  type Fog,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  type Points,
} from 'three';
import type { ModoCeu } from '@/components/ui/DayNightToggle';
import { atualizarPoste, type EstadoPoste } from '@/lib/simulation';
import { Car } from './Car';
import {
  CAMERA,
  CARRO,
  CORES,
  POSICOES_POSTES,
  RAIO_DETECCAO,
  REGRA_POSTE,
  VELOCIDADE_TRANSICAO_CEU,
} from './sceneConfig';
import { Scenery } from './Scenery';
import { criarMateriaisPostes, type RegistrarMaterial } from './lampMaterials';
import { StreetLamps } from './StreetLamps';
import { criarTexturaBrilho, criarTexturaCone } from './textures';

interface HeroSceneProps {
  modo: ModoCeu;
  /** Quando falso (hero fora da tela), o laço de renderização para. */
  ativo: boolean;
  /** Chamado quando a cena está pronta para aparecer. */
  aoPronto?: () => void;
}

/** Faixa de densidade de pixels: nítido em telas retina, mas com teto para manter 60 fps. */
const DPR_MAXIMO = 1.75;

/**
 * Cena 3D do hero: rua noturna low-poly, carro em loop e postes que acendem
 * em sequência. Carregada sob demanda (React.lazy) — este arquivo e o three.js
 * ficam fora do bundle inicial.
 */
export default function HeroScene({ modo, ativo, aoPronto }: HeroSceneProps) {
  const [dpr, setDpr] = useState(DPR_MAXIMO);

  return (
    <Canvas
      aria-hidden="true"
      frameloop={ativo ? 'always' : 'never'}
      dpr={[1, dpr]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: CAMERA.fov, position: [...CAMERA.larga.posicao], near: 0.1, far: 300 }}
      onCreated={() => aoPronto?.()}
    >
      {/* Se o FPS cair, reduz a resolução em vez de travar a animação. */}
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(DPR_MAXIMO)} />
      <Cena modo={modo} />
    </Canvas>
  );
}

function Cena({ modo }: { modo: ModoCeu }) {
  const texturaBrilho = useMemo(() => criarTexturaBrilho(), []);
  const texturaCone = useMemo(() => criarTexturaCone(), []);

  // Refs dos objetos animados
  const materiaisPostes = useRef(criarMateriaisPostes());
  const registrarMaterial = useCallback<RegistrarMaterial>((tipo, indice, material) => {
    materiaisPostes.current[tipo][indice] = material;
  }, []);
  const carro = useRef<Group>(null);
  const farol = useRef<MeshBasicMaterial>(null);
  const chao = useRef<MeshStandardMaterial>(null);
  const predios = useRef<MeshStandardMaterial>(null);
  const janelas = useRef<MeshStandardMaterial>(null);
  const rua = useRef<MeshStandardMaterial>(null);
  const calcada = useRef<MeshStandardMaterial>(null);
  const ambiente = useRef<AmbientLight>(null);
  const direcional = useRef<DirectionalLight>(null);
  const neblina = useRef<Fog>(null);
  const estrelas = useRef<Points>(null);
  const lua = useRef<Mesh>(null);
  const sol = useRef<Mesh>(null);

  // Estado da simulação (fora do React: muda a cada quadro)
  const simulacao = useRef({
    fatorDia: modo === 'dia' ? 1 : 0,
    carroX: CARRO.inicioX as number,
    pausa: 0,
    parallax: new Vector3(),
    postes: POSICOES_POSTES.map<EstadoPoste>((x) => ({
      x,
      nivel: REGRA_POSTE.dimerizacao,
      detectando: false,
      semMovimentoHa: Infinity,
    })),
  });

  const cores = useMemo(
    () => ({
      ceuNoite: new Color(CORES.ceuNoite),
      ceuDia: new Color(CORES.ceuDia),
      chaoNoite: new Color(CORES.chaoNoite),
      chaoDia: new Color(CORES.chaoDia),
      predioNoite: new Color(CORES.predioNoite),
      predioDia: new Color(CORES.predioDia),
      ruaNoite: new Color(CORES.ruaNoite),
      ruaDia: new Color(CORES.ruaDia),
      calcadaNoite: new Color(CORES.calcadaNoite),
      calcadaDia: new Color(CORES.calcadaDia),
      luarCor: new Color('#8AB0FF'),
      solCor: new Color('#FFF4D1'),
      sensor: new Color(CORES.sensor),
      luz: new Color(CORES.luz),
      temp: new Color(),
      alvo: new Vector3(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const s = simulacao.current;
    const dt = Math.min(delta, 0.05);

    // 1. Transição dia ⇄ noite
    const alvoDia = modo === 'dia' ? 1 : 0;
    const passoCeu = VELOCIDADE_TRANSICAO_CEU * dt;
    s.fatorDia += Math.max(-passoCeu, Math.min(passoCeu, alvoDia - s.fatorDia));
    const f = s.fatorDia;
    const ehDia = f > 0.5;

    cores.temp.lerpColors(cores.ceuNoite, cores.ceuDia, f);
    if (state.scene.background instanceof Color) state.scene.background.copy(cores.temp);
    neblina.current?.color.copy(cores.temp);
    chao.current?.color.lerpColors(cores.chaoNoite, cores.chaoDia, f);
    predios.current?.color.lerpColors(cores.predioNoite, cores.predioDia, f);
    rua.current?.color.lerpColors(cores.ruaNoite, cores.ruaDia, f);
    calcada.current?.color.lerpColors(cores.calcadaNoite, cores.calcadaDia, f);
    if (janelas.current) janelas.current.emissiveIntensity = 0.7 * (1 - f);
    if (ambiente.current) ambiente.current.intensity = 0.35 + 0.9 * f;
    if (direcional.current) {
      direcional.current.intensity = 0.35 + 1.6 * f;
      direcional.current.color.lerpColors(cores.luarCor, cores.solCor, f);
    }
    if (estrelas.current) estrelas.current.visible = !ehDia;
    if (lua.current) lua.current.visible = !ehDia;
    if (sol.current) sol.current.visible = ehDia;

    // 2. Carro em loop
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
    if (farol.current) farol.current.opacity = 0.55 * (1 - f);

    // 3. Postes: mesma regra do simulador 2D (lib/simulation)
    const m = materiaisPostes.current;
    s.postes = s.postes.map((poste, i) => {
      const atualizado = atualizarPoste(
        poste,
        Math.abs(s.carroX - poste.x) <= RAIO_DETECCAO,
        dt,
        REGRA_POSTE,
        ehDia,
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
      if (sensor) sensor.emissive.copy(atualizado.detectando && !ehDia ? cores.luz : cores.sensor);
      return atualizado;
    });

    // 4. Câmera: enquadramento conforme a proporção da tela + parallax do ponteiro
    const proporcao = state.size.width / Math.max(1, state.size.height);
    const t = Math.min(1, Math.max(0, (1.6 - proporcao) / 0.8));
    const { larga, estreita, parallax } = CAMERA;
    s.parallax.lerp(
      cores.alvo.set(state.pointer.x * parallax[0], state.pointer.y * parallax[1], 0),
      Math.min(1, dt * 2),
    );
    state.camera.position.set(
      larga.posicao[0] + (estreita.posicao[0] - larga.posicao[0]) * t + s.parallax.x,
      larga.posicao[1] + (estreita.posicao[1] - larga.posicao[1]) * t + s.parallax.y,
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
      <color attach="background" args={[CORES.ceuNoite]} />
      <fog ref={neblina} attach="fog" args={[CORES.ceuNoite, 30, 110]} />
      <ambientLight ref={ambiente} intensity={0.35} />
      <hemisphereLight args={['#8AB0FF', '#07101F', 0.35]} />
      <directionalLight ref={direcional} position={[-12, 20, 8]} intensity={0.35} />

      <Stars ref={estrelas} radius={120} depth={40} count={1400} factor={3} fade speed={0.4} />
      <mesh ref={lua} position={[-34, 15, -80]}>
        <sphereGeometry args={[2.4, 20, 16]} />
        <meshBasicMaterial color="#F7F9FC" toneMapped={false} fog={false} />
      </mesh>
      <mesh ref={sol} position={[-34, 17, -80]} visible={false}>
        <sphereGeometry args={[3.2, 20, 16]} />
        <meshBasicMaterial color={CORES.luz} toneMapped={false} fog={false} />
      </mesh>

      <Scenery
        materialChao={chao}
        materialPredios={predios}
        materialJanelas={janelas}
        materialRua={rua}
        materialCalcada={calcada}
      />
      <StreetLamps
        registrar={registrarMaterial}
        texturaBrilho={texturaBrilho}
        texturaCone={texturaCone}
      />
      <Car grupo={carro} farol={farol} texturaBrilho={texturaBrilho} />
    </>
  );
}
