import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createAuroraCSModel, createIVISSpectrumModel, ExplodedPart } from '../utils/proceduralModels';
import {
  Layers,
  Sparkles,
  RotateCw,
  Eye,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Compass,
  Cpu,
  Zap,
} from 'lucide-react';

export const ThreeDStudioView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [activeModel, setActiveModel] = useState<'aurora' | 'ivis'>('aurora');
  const [explodedRatio, setExplodedRatio] = useState<number>(0); // 0 to 1
  const [lasersEnabled, setLasersEnabled] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [activeCameraView, setActiveCameraView] = useState<'iso' | 'front' | 'optics'>('iso');

  // Mutable refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentModelGroupRef = useRef<THREE.Group | null>(null);
  const explodedPartsRef = useRef<ExplodedPart[]>([]);
  const laserBeamsRef = useRef<THREE.Group | null>(null);
  const targetRatioRef = useRef<number>(0);
  const currentRatioRef = useRef<number>(0);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(7, 5, 8));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));

  useEffect(() => {
    targetRatioRef.current = explodedRatio;
  }, [explodedRatio]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Three.js Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Obsidian slate
    scene.fog = new THREE.FogExp2(0x020617, 0.028);
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight || 640;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(7, 5, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Studio PBR Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.85); // Cyan sky, slate ground
    scene.add(hemiLight);

    const dirKeyLight = new THREE.DirectionalLight(0xffedd5, 2.0); // Warm studio key
    dirKeyLight.position.set(8, 12, 6);
    dirKeyLight.castShadow = !isSoftwareGl;
    if (dirKeyLight.castShadow) {
      dirKeyLight.shadow.mapSize.width = 1024;
      dirKeyLight.shadow.mapSize.height = 1024;
      dirKeyLight.shadow.bias = -0.0005;
      dirKeyLight.shadow.normalBias = 0.02;
      dirKeyLight.shadow.camera.near = 1;
      dirKeyLight.shadow.camera.far = 30;
      dirKeyLight.shadow.camera.left = -6;
      dirKeyLight.shadow.camera.right = 6;
      dirKeyLight.shadow.camera.top = 6;
      dirKeyLight.shadow.camera.bottom = -6;
    }
    scene.add(dirKeyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.2); // Cool cyan rim
    rimLight.position.set(-8, 6, -6);
    scene.add(rimLight);

    // 5. OrbitControls with damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 2, 0);
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent viewing underneath floor
    controls.minDistance = 3;
    controls.maxDistance = 25;
    controlsRef.current = controls;

    // 6. Ground Studio Grid Plane
    const grid = new THREE.GridHelper(24, 24, 0x1e293b, 0x0f172a);
    grid.position.y = 0;
    scene.add(grid);

    // 7. Load Active Model
    const loadModel = (type: 'aurora' | 'ivis') => {
      if (currentModelGroupRef.current) {
        scene.remove(currentModelGroupRef.current);
      }

      if (type === 'aurora') {
        const { group, explodedParts, laserBeams } = createAuroraCSModel(isSoftwareGl);
        scene.add(group);
        currentModelGroupRef.current = group;
        explodedPartsRef.current = explodedParts;
        laserBeamsRef.current = laserBeams;
      } else {
        const { group, explodedParts } = createIVISSpectrumModel(isSoftwareGl);
        scene.add(group);
        currentModelGroupRef.current = group;
        explodedPartsRef.current = explodedParts;
        laserBeamsRef.current = null;
      }
    };

    loadModel(activeModel);

    // 8. Animation Loop with Software WebGL Guard & Exponential Damping
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);

      // Smooth camera position damping towards preset
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPosRef.current.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPosRef.current.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPosRef.current.z, 3.5, delta);
      controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLookAtRef.current.x, 3.5, delta);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLookAtRef.current.y, 3.5, delta);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLookAtRef.current.z, 3.5, delta);

      // Smooth exploded ratio transition
      currentRatioRef.current = THREE.MathUtils.damp(currentRatioRef.current, targetRatioRef.current, 4.0, delta);
      const ratio = currentRatioRef.current;

      explodedPartsRef.current.forEach((part) => {
        part.mesh.position.x = part.originalPos.x + part.explodedOffset.x * ratio;
        part.mesh.position.y = part.originalPos.y + part.explodedOffset.y * ratio;
        part.mesh.position.z = part.originalPos.z + part.explodedOffset.z * ratio;
      });

      // Subtle turntable rotation when enabled and user not actively dragging
      if (autoRotate && currentModelGroupRef.current) {
        currentModelGroupRef.current.rotation.y += delta * 0.25;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    if (isSoftwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [activeModel]);

  // Update laser beam visibility
  useEffect(() => {
    if (laserBeamsRef.current) {
      laserBeamsRef.current.visible = lasersEnabled;
    }
  }, [lasersEnabled]);

  // Camera presets
  const applyCameraPreset = (preset: 'iso' | 'front' | 'optics') => {
    setActiveCameraView(preset);
    if (preset === 'iso') {
      targetCamPosRef.current.set(7, 5, 8);
      targetLookAtRef.current.set(0, 2, 0);
    } else if (preset === 'front') {
      targetCamPosRef.current.set(0, 2.5, 9);
      targetLookAtRef.current.set(0, 2, 0);
    } else if (preset === 'optics') {
      targetCamPosRef.current.set(2, 3.8, 4);
      targetLookAtRef.current.set(0, 2.4, -0.2);
    }
  };

  return (
    <div className="relative w-full h-[750px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col select-none">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Minimal Spec HUD (Unobstructed Viewport Contract) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-900/90 border border-slate-700/80 px-2 py-0.5 rounded shadow-sm">
            {activeModel === 'aurora' ? 'CYTEK AURORA CS' : 'REVVITY IVIS SPECTRUM'}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            3D 物理高精度 PBR 结构仿真 · 双图谱硬件底座
          </span>
        </div>
        <h2 className="text-sm font-bold text-white tracking-tight drop-shadow-md">
          {activeModel === 'aurora'
            ? '64通道 APD 雪崩光电二极管光谱分析阵列'
            : '-90℃ 深度背照式冷却高灵敏 CCD 活体断层成像暗室'}
        </h2>
      </div>

      {/* Top Right Quick Model Switcher */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-900/95 border border-slate-800 rounded-xl shadow-lg">
          <button
            onClick={() => {
              setActiveModel('aurora');
              setExplodedRatio(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeModel === 'aurora'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cytek 全光谱流式 (320万)
          </button>
          <button
            onClick={() => {
              setActiveModel('ivis');
              setExplodedRatio(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeModel === 'ivis'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            IVIS 活体成像系统 (340万)
          </button>
        </div>
      </div>

      {/* Collapsible Sleek Bottom Control Dock (<= 15% Viewport footprint) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[860px] flex flex-col items-center">
        {/* Drawer Toggle Handle */}
        <button
          onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
          className="mb-1.5 px-3 py-1 text-[11px] font-medium text-slate-300 bg-slate-900/90 border border-slate-700/80 rounded-full hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-md"
        >
          {isControlsCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>展开 3D 光学控制台</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>隐藏控制栏 (Zen View)</span>
            </>
          )}
        </button>

        {/* Main Horizontal Control Bar */}
        {!isControlsCollapsed && (
          <div className="w-full p-3.5 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Exploded View Slider */}
            <div className="flex items-center gap-3 min-w-[240px]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>光学爆炸图：</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedRatio}
                onChange={(e) => setExplodedRatio(parseFloat(e.target.value))}
                className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-xs font-mono font-bold text-cyan-400 w-9 text-right">
                {Math.round(explodedRatio * 100)}%
              </span>
            </div>

            {/* Camera View Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                <span>视角:</span>
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg">
                <button
                  onClick={() => applyCameraPreset('iso')}
                  className={`px-2 py-1 text-[11px] font-medium rounded transition-all ${
                    activeCameraView === 'iso' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  全景
                </button>
                <button
                  onClick={() => applyCameraPreset('front')}
                  className={`px-2 py-1 text-[11px] font-medium rounded transition-all ${
                    activeCameraView === 'front' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  正前
                </button>
                <button
                  onClick={() => applyCameraPreset('optics')}
                  className={`px-2 py-1 text-[11px] font-medium rounded transition-all ${
                    activeCameraView === 'optics' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  核心光室
                </button>
              </div>
            </div>

            {/* Lasers & Turntable Toggles */}
            <div className="flex items-center gap-2">
              {activeModel === 'aurora' && (
                <button
                  onClick={() => setLasersEnabled(!lasersEnabled)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    lasersEnabled
                      ? 'bg-purple-950/80 text-purple-300 border-purple-700/80'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>5波长激光束</span>
                </button>
              )}

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  autoRotate
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                    : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>自动环绕</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
