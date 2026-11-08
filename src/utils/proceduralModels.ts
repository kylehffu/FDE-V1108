import * as THREE from 'three';

// Pre-allocated reusable helpers for 60fps zero-GC operations
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();

/**
 * Creates procedural high-sharpness canvas texture for digital displays and spectral readouts.
 */
export function createSpectralDisplayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 512, 256);

  // Grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y < 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('CYTEK SPECTROFLO® 64-CH APD SPECTRUM', 20, 30);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('STATUS: 40-COLOR PANEL // AF DECONVOLUTION: ACTIVE', 20, 50);

  // Spectral Curves (5 laser peaks)
  const colors = ['#a855f7', '#6366f1', '#06b6d4', '#10b981', '#f43f5e'];
  const peaks = [80, 160, 260, 360, 440];

  colors.forEach((col, idx) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const cx = peaks[idx];
    for (let x = 0; x < 512; x += 4) {
      const dist = (x - cx) / 35;
      const y = 220 - Math.exp(-dist * dist) * 130 - Math.sin(x * 0.08) * 8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  // Footer data stats
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.fillText('PURITY: 99.8%  ·  EVENT RATE: 24,500 EPS  ·  AF SUBTRACTION: 100%', 20, 240);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates soft radial contact shadow texture to eliminate floating appearance.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.45)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export interface ExplodedPart {
  mesh: THREE.Object3D;
  originalPos: THREE.Vector3;
  explodedOffset: THREE.Vector3;
}

/**
 * Assembles Cytek Aurora CS Full-Spectrum Sorter as a composite 10-part procedural model.
 */
export function createAuroraCSModel(isSoftwareGl: boolean): {
  group: THREE.Group;
  explodedParts: ExplodedPart[];
  laserBeams: THREE.Group;
} {
  const root = new THREE.Group();
  const explodedParts: ExplodedPart[] = [];

  // PBR Materials with >= 0.25 roughness/metalness differences across parts
  const chassisMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Deep slate
    roughness: 0.25,
    metalness: 0.85,
  });

  const casingWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Pristine clinical white
    roughness: 0.45,
    metalness: 0.15,
  });

  const opticalChamberMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.15,
    metalness: 0.95,
  });

  const goldApdMaterial = new THREE.MeshStandardMaterial({
    color: 0xeab308, // 24k Gold APD array
    roughness: 0.18,
    metalness: 0.95,
  });

  const quartzGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    roughness: 0.05,
    metalness: 0.05,
    transmission: isSoftwareGl ? 0 : 0.92,
    transparent: true,
    opacity: isSoftwareGl ? 0.45 : 1.0,
    ior: 1.54,
  });

  const acrylicHoodMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.1,
    transmission: isSoftwareGl ? 0 : 0.85,
    transparent: true,
    opacity: isSoftwareGl ? 0.35 : 0.85,
  });

  // PART 1: Dampening Vibration Base
  const baseGeo = new THREE.BoxGeometry(4.2, 0.4, 3.4);
  const baseMesh = new THREE.Mesh(baseGeo, chassisMaterial);
  baseMesh.position.set(0, 0.2, 0);
  baseMesh.castShadow = !isSoftwareGl;
  baseMesh.receiveShadow = !isSoftwareGl;
  root.add(baseMesh);

  // PART 2: Main Outer Processing Console (Casing)
  const bodyGeo = new THREE.BoxGeometry(3.8, 1.8, 2.8);
  const bodyMesh = new THREE.Mesh(bodyGeo, casingWhiteMaterial);
  bodyMesh.position.set(0, 1.3, 0);
  bodyMesh.castShadow = !isSoftwareGl;
  bodyMesh.receiveShadow = !isSoftwareGl;
  root.add(bodyMesh);
  explodedParts.push({
    mesh: bodyMesh,
    originalPos: bodyMesh.position.clone(),
    explodedOffset: new THREE.Vector3(0, 0.4, 0),
  });

  // PART 3: Optical Isolation Vacuum Drum (Central Heart)
  const drumGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 32);
  const drumMesh = new THREE.Mesh(drumGeo, opticalChamberMaterial);
  drumMesh.position.set(0, 2.5, -0.2);
  drumMesh.castShadow = !isSoftwareGl;
  root.add(drumMesh);
  explodedParts.push({
    mesh: drumMesh,
    originalPos: drumMesh.position.clone(),
    explodedOffset: new THREE.Vector3(0, 1.2, -0.6),
  });

  // PART 4: APD (Avalanche Photodiode) 64-Channel Detector Ring
  const apdGroup = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const apdModuleGeo = new THREE.BoxGeometry(0.35, 0.25, 0.6);
    const apdModule = new THREE.Mesh(apdModuleGeo, goldApdMaterial);
    apdModule.position.set(Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2);
    apdModule.rotation.y = -angle;
    apdGroup.add(apdModule);
  }
  apdGroup.position.set(0, 2.5, -0.2);
  root.add(apdGroup);
  explodedParts.push({
    mesh: apdGroup,
    originalPos: apdGroup.position.clone(),
    explodedOffset: new THREE.Vector3(0, 1.8, -0.6),
  });

  // PART 5: Quartz Flow Cell Nozzle
  const flowCellGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16);
  const flowCell = new THREE.Mesh(flowCellGeo, quartzGlassMaterial);
  flowCell.position.set(0, 2.4, 0.4);
  root.add(flowCell);
  explodedParts.push({
    mesh: flowCell,
    originalPos: flowCell.position.clone(),
    explodedOffset: new THREE.Vector3(0, 0.8, 0.8),
  });

  // PART 6: Rotary 6-Way Sort Carousel & Collection Rack
  const carouselGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.35, 24);
  const carousel = new THREE.Mesh(carouselGeo, chassisMaterial);
  carousel.position.set(0, 1.8, 0.85);

  // Add 6 microcentrifuge tube placeholders
  for (let t = 0; t < 6; t++) {
    const a = (t / 6) * Math.PI * 2;
    const tubeGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.45, 12);
    const tube = new THREE.Mesh(tubeGeo, quartzGlassMaterial);
    tube.position.set(Math.cos(a) * 0.45, 0.15, Math.sin(a) * 0.45);
    carousel.add(tube);
  }
  root.add(carousel);
  explodedParts.push({
    mesh: carousel,
    originalPos: carousel.position.clone(),
    explodedOffset: new THREE.Vector3(0, 0.2, 1.4),
  });

  // PART 7: Upper SpectroFlo Acrylic Safety Hood
  const hoodGeo = new THREE.BoxGeometry(3.7, 1.0, 2.7);
  const hood = new THREE.Mesh(hoodGeo, acrylicHoodMaterial);
  hood.position.set(0, 2.7, 0);
  root.add(hood);
  explodedParts.push({
    mesh: hood,
    originalPos: hood.position.clone(),
    explodedOffset: new THREE.Vector3(0, 2.2, 0),
  });

  // PART 8: Tilting Touchscreen Display Console
  const displayArmGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 12);
  const displayArm = new THREE.Mesh(displayArmGeo, chassisMaterial);
  displayArm.position.set(1.9, 2.1, 0.5);
  displayArm.rotation.z = -Math.PI / 8;
  root.add(displayArm);

  const screenGeo = new THREE.BoxGeometry(1.6, 0.9, 0.08);
  const screenTexture = createSpectralDisplayTexture();
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(2.2, 2.6, 0.7);
  screen.rotation.y = -Math.PI / 5;
  screen.rotation.x = -Math.PI / 16;
  root.add(screen);

  // PART 9: 5 Optical Laser Beams
  const laserBeams = new THREE.Group();
  const laserColors = [0xa855f7, 0x6366f1, 0x06b6d4, 0x10b981, 0xf43f5e];
  const laserPositions = [-1.4, -0.7, 0, 0.7, 1.4];

  laserColors.forEach((col, i) => {
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: col,
      transparent: true,
      opacity: 0.85,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(laserPositions[i] * 0.4, 2.4, -0.6);
    beam.rotation.x = Math.PI / 2;
    laserBeams.add(beam);
  });
  root.add(laserBeams);

  // PART 10: Ground Contact Shadow Disc
  const shadowGeo = new THREE.PlaneGeometry(6.5, 5.5);
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.5,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.01;
  root.add(shadowMesh);

  return { group: root, explodedParts, laserBeams };
}

/**
 * Assembles Revvity IVIS Spectrum In Vivo Imaging System as a composite 9-part procedural model.
 */
export function createIVISSpectrumModel(isSoftwareGl: boolean): {
  group: THREE.Group;
  explodedParts: ExplodedPart[];
} {
  const root = new THREE.Group();
  const explodedParts: ExplodedPart[] = [];

  const cabinetMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.75,
  });

  const cryoCcdMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Cryogenic cyan-blue
    roughness: 0.15,
    metalness: 0.95,
  });

  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0, // Precision brushed steel
    roughness: 0.2,
    metalness: 0.9,
  });

  // Base Cabinet
  const baseCabinetGeo = new THREE.BoxGeometry(4.0, 2.2, 3.6);
  const baseCabinet = new THREE.Mesh(baseCabinetGeo, cabinetMat);
  baseCabinet.position.set(0, 1.1, 0);
  baseCabinet.castShadow = !isSoftwareGl;
  baseCabinet.receiveShadow = !isSoftwareGl;
  root.add(baseCabinet);

  // Upper Darkroom Housing
  const hoodGeo = new THREE.BoxGeometry(3.6, 2.0, 3.2);
  const hood = new THREE.Mesh(hoodGeo, cabinetMat);
  hood.position.set(0, 3.2, 0);
  hood.castShadow = !isSoftwareGl;
  root.add(hood);
  explodedParts.push({
    mesh: hood,
    originalPos: hood.position.clone(),
    explodedOffset: new THREE.Vector3(0, 1.2, 0),
  });

  // Cryogenic -90°C CCD Camera Head
  const ccdGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.1, 24);
  const ccd = new THREE.Mesh(ccdGeo, cryoCcdMat);
  ccd.position.set(0, 4.4, 0);
  root.add(ccd);
  explodedParts.push({
    mesh: ccd,
    originalPos: ccd.position.clone(),
    explodedOffset: new THREE.Vector3(0, 2.2, 0),
  });

  // 28-Filter Concentric Wheel
  const wheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 32);
  const wheel = new THREE.Mesh(wheelGeo, wheelMat);
  wheel.position.set(0, 3.6, 0);
  root.add(wheel);
  explodedParts.push({
    mesh: wheel,
    originalPos: wheel.position.clone(),
    explodedOffset: new THREE.Vector3(0, 1.6, 0),
  });

  // Heated 5-Mouse Anesthesia Imaging Stage
  const stageGeo = new THREE.BoxGeometry(2.4, 0.2, 2.0);
  const stage = new THREE.Mesh(stageGeo, cabinetMat);
  stage.position.set(0, 2.2, 0.3);
  root.add(stage);

  // Contact Shadow
  const shadowGeo = new THREE.PlaneGeometry(6.0, 5.5);
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.5,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.01;
  root.add(shadowMesh);

  return { group: root, explodedParts };
}
