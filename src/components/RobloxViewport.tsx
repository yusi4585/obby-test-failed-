import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { RobloxGame, RobloxPart } from '../types/roblox';
import {
  playCheckpointSound,
  playCoinSound,
  playJumpPadSound,
  playJumpSound,
  playOofSound,
  playVictorySound,
} from '../utils/robloxAudio';
import {
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
} from 'lucide-react';

interface Props {
  game: RobloxGame;
  selectedPartId: string | null;
  onSelectPart: (partId: string | null) => void;
  isPlayMode: boolean;
  onTogglePlayMode: () => void;
}

/**
 * Procedural studs texture generator for classic Roblox stud pattern
 */
function createStudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2d3748';
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = '#1a202c';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 128, 128);

  // 4 studs
  const studPositions = [
    [32, 32],
    [96, 32],
    [32, 96],
    [96, 96],
  ];

  studPositions.forEach(([x, y]) => {
    // Outer stud shadow
    ctx.beginPath();
    ctx.arc(x, y + 2, 16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Stud body
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#4a5568';
    ctx.fill();

    // Stud highlight
    ctx.beginPath();
    ctx.arc(x - 2, y - 2, 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(64, 64);
  return texture;
}

export const RobloxViewport: React.FC<Props> = ({
  game,
  selectedPartId,
  onSelectPart,
  isPlayMode,
  onTogglePlayMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hudStats, setHudStats] = useState({
    coins: 0,
    stage: 1,
    health: 100,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const partsMeshMap = useRef<Map<string, THREE.Mesh>>(new Map());
  const selectionBoxRef = useRef<THREE.BoxHelper | null>(null);

  // Player state references
  const playerGroupRef = useRef<THREE.Group | null>(null);
  const limbsRef = useRef<{
    leftArm: THREE.Mesh;
    rightArm: THREE.Mesh;
    leftLeg: THREE.Mesh;
    rightLeg: THREE.Mesh;
  } | null>(null);

  const playerPhysicsRef = useRef({
    pos: new THREE.Vector3(0, 5, 0),
    vel: new THREE.Vector3(0, 0, 0),
    yaw: 0,
    isGrounded: false,
    speed: 16,
    jumpPower: 18,
    respawnPos: new THREE.Vector3(0, 5, 0),
    collectedCoins: new Set<string>(),
    unlockedCheckpoints: new Set<number>([1]),
  });

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const isOrbitDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const orbitAngle = useRef({ theta: Math.PI / 4, phi: Math.PI / 4, radius: 45 });

  // Reset or initialize player position when game or mode changes
  useEffect(() => {
    const spawnPart = game.parts.find((p) => p.type === 'SpawnLocation' || p.tag === 'spawn') || game.parts[0];
    const initialPos = spawnPart
      ? new THREE.Vector3(spawnPart.position[0], spawnPart.position[1] + 4, spawnPart.position[2])
      : new THREE.Vector3(0, 5, 0);

    playerPhysicsRef.current.pos.copy(initialPos);
    playerPhysicsRef.current.respawnPos.copy(initialPos);
    playerPhysicsRef.current.vel.set(0, 0, 0);
    playerPhysicsRef.current.collectedCoins.clear();
    playerPhysicsRef.current.unlockedCheckpoints = new Set([1]);

    setHudStats({
      coins: 0,
      stage: 1,
      health: 100,
    });
    setShowVictory(false);
  }, [game.id, isPlayMode]);

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(game.lighting.fogColor || '#12141a');
    scene.fog = new THREE.Fog(game.lighting.fogColor || '#12141a', 50, game.lighting.fogEnd || 500);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(25, 25, 25);
    camera.lookAt(0, 5, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'default' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(game.lighting.ambient || '#718096'),
      game.lighting.brightness * 0.8
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, game.lighting.brightness * 1.2);
    sunLight.position.set(40, 70, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 300;
    const d = 80;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // 5. Build Parts Meshes
    const meshMap = new Map<string, THREE.Mesh>();
    const studTex = createStudTexture();

    game.parts.forEach((part) => {
      let geo: THREE.BufferGeometry;
      const [sx, sy, sz] = part.size;

      if (part.shape === 'Ball') {
        geo = new THREE.SphereGeometry(Math.max(sx, sy, sz) / 2, 24, 24);
      } else if (part.shape === 'Cylinder') {
        geo = new THREE.CylinderGeometry(sx / 2, sx / 2, sy, 24);
      } else {
        geo = new THREE.BoxGeometry(sx, sy, sz);
      }

      let mat: THREE.Material;
      const partColor = new THREE.Color(part.color);

      if (part.material === 'Neon') {
        mat = new THREE.MeshBasicMaterial({
          color: partColor,
          transparent: part.transparency > 0,
          opacity: 1 - part.transparency,
        });
      } else if (part.tag === 'baseplate') {
        mat = new THREE.MeshStandardMaterial({
          map: studTex,
          roughness: 0.8,
          metalness: 0.1,
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          color: partColor,
          roughness: part.material === 'SmoothPlastic' ? 0.3 : 0.7,
          metalness: part.material === 'Metal' ? 0.8 : 0.05,
          transparent: part.transparency > 0,
          opacity: 1 - part.transparency,
        });
      }

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(part.position[0], part.position[1], part.position[2]);
      if (part.rotation) {
        mesh.rotation.set(
          THREE.MathUtils.degToRad(part.rotation[0]),
          THREE.MathUtils.degToRad(part.rotation[1]),
          THREE.MathUtils.degToRad(part.rotation[2])
        );
      }
      mesh.castShadow = part.tag !== 'baseplate';
      mesh.receiveShadow = true;
      mesh.userData = { partId: part.id, partData: part };

      scene.add(mesh);
      meshMap.set(part.id, mesh);
    });
    partsMeshMap.current = meshMap;

    // 6. Build Classic R6 Roblox Character Rig
    const playerGroup = new THREE.Group();
    playerGroupRef.current = playerGroup;

    // Torso (Blue block)
    const torsoGeo = new THREE.BoxGeometry(2, 2, 1);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x0055ff, roughness: 0.4 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 2;
    torso.castShadow = true;
    playerGroup.add(torso);

    // Head (Yellow)
    const headGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.1, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.3 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 3.55;
    head.castShadow = true;
    playerGroup.add(head);

    // Left Arm (Yellow)
    const armGeo = new THREE.BoxGeometry(0.8, 1.8, 0.8);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4 });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-1.45, 1.9, 0);
    leftArm.castShadow = true;
    playerGroup.add(leftArm);

    // Right Arm (Yellow)
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(1.45, 1.9, 0);
    rightArm.castShadow = true;
    playerGroup.add(rightArm);

    // Left Leg (Green)
    const legGeo = new THREE.BoxGeometry(0.9, 1.8, 0.9);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x22aa33, roughness: 0.5 });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.55, 0.9, 0);
    leftLeg.castShadow = true;
    playerGroup.add(leftLeg);

    // Right Leg (Green)
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.55, 0.9, 0);
    rightLeg.castShadow = true;
    playerGroup.add(rightLeg);

    limbsRef.current = { leftArm, rightArm, leftLeg, rightLeg };
    scene.add(playerGroup);

    // 7. Selection Helper
    const selectionBox = new THREE.BoxHelper(new THREE.Mesh(), 0x00f0ff);
    selectionBox.visible = false;
    scene.add(selectionBox);
    selectionBoxRef.current = selectionBox;

    // 8. Animation & Physics Loop
    let animId: number;
    let lastTime = performance.now();
    let limbSwing = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const pState = playerPhysicsRef.current;

      if (isPlayMode) {
        // Player Movement Calculations
        const moveDir = new THREE.Vector3();
        if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) moveDir.z -= 1;
        if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) moveDir.z += 1;
        if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) moveDir.x -= 1;
        if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) moveDir.x += 1;

        const isMoving = moveDir.lengthSq() > 0;
        if (isMoving) {
          moveDir.normalize();

          // Sprintf with Shift key
          const isSprinting = keysPressed.current['ShiftLeft'] || keysPressed.current['ShiftRight'];
          const moveSpeed = isSprinting ? pState.speed * 1.6 : pState.speed;

          // Camera-relative direction
          pState.pos.x += moveDir.x * moveSpeed * dt;
          pState.pos.z += moveDir.z * moveSpeed * dt;

          pState.yaw = Math.atan2(moveDir.x, moveDir.z);

          // Limb walking animation
          limbSwing += dt * 10;
          if (limbsRef.current) {
            limbsRef.current.leftLeg.rotation.x = Math.sin(limbSwing) * 0.6;
            limbsRef.current.rightLeg.rotation.x = -Math.sin(limbSwing) * 0.6;
            limbsRef.current.leftArm.rotation.x = -Math.sin(limbSwing) * 0.6;
            limbsRef.current.rightArm.rotation.x = Math.sin(limbSwing) * 0.6;
          }
        } else {
          // Reset limbs
          if (limbsRef.current) {
            limbsRef.current.leftLeg.rotation.x = 0;
            limbsRef.current.rightLeg.rotation.x = 0;
            limbsRef.current.leftArm.rotation.x = 0;
            limbsRef.current.rightArm.rotation.x = 0;
          }
        }

        // Jump handling
        if (keysPressed.current['Space'] && pState.isGrounded) {
          pState.vel.y = pState.jumpPower;
          pState.isGrounded = false;
          if (!isMuted) playJumpSound();
        }

        // Gravity application
        pState.vel.y -= 45 * dt;
        pState.pos.y += pState.vel.y * dt;

        // Collision detection with parts
        pState.isGrounded = false;
        const playerRadius = 1.0;
        const playerHeight = 4.0;

        for (const part of game.parts) {
          const [px, py, pz] = part.position;
          const [sx, sy, sz] = part.size;

          const minX = px - sx / 2 - playerRadius;
          const maxX = px + sx / 2 + playerRadius;
          const minZ = pz - sz / 2 - playerRadius;
          const maxZ = pz + sz / 2 + playerRadius;
          const topY = py + sy / 2;
          const bottomY = py - sy / 2;

          // Check if player is horizontally within bounds
          if (pState.pos.x >= minX && pState.pos.x <= maxX && pState.pos.z >= minZ && pState.pos.z <= maxZ) {
            // Check landing on top
            if (pState.pos.y >= topY && pState.pos.y <= topY + 1.2 && pState.vel.y <= 0) {
              pState.pos.y = topY;
              pState.vel.y = 0;
              pState.isGrounded = true;

              // Checkpoint reached
              if (part.tag === 'checkpoint' && part.checkpointNumber) {
                if (!pState.unlockedCheckpoints.has(part.checkpointNumber)) {
                  pState.unlockedCheckpoints.add(part.checkpointNumber);
                  pState.respawnPos.set(px, topY + 2, pz);
                  setHudStats((prev) => ({
                    ...prev,
                    stage: part.checkpointNumber || prev.stage,
                    coins: prev.coins + 15,
                  }));
                  setFloatingMessage(`🏁 Checkpoint ${part.checkpointNumber} Reached! (+15 Coins)`);
                  if (!isMuted) playCheckpointSound();
                  setTimeout(() => setFloatingMessage(null), 2500);

                  // Change mesh color to bright green
                  const mesh = partsMeshMap.current.get(part.id);
                  if (mesh && (mesh.material as any).color) {
                    (mesh.material as any).color.setHex(0x00ff77);
                  }
                }
              }

              // Speed boost pad
              if (part.tag === 'speed_pad') {
                pState.pos.z += 12 * dt;
              }

              // Jump pad launch
              if (part.tag === 'jump_pad' && pState.isGrounded) {
                pState.vel.y = 28;
                pState.isGrounded = false;
                if (!isMuted) playJumpPadSound();
                setFloatingMessage('🚀 SUPER JUMP BOOST!');
                setTimeout(() => setFloatingMessage(null), 1800);
              }

              // Finish Line Trophy
              if (part.tag === 'finish' && !showVictory) {
                setShowVictory(true);
                if (!isMuted) playVictorySound();
                confetti({
                  particleCount: 120,
                  spread: 80,
                  origin: { y: 0.6 },
                });
              }
            }

            // Hazard / Lava Death Check
            if (part.tag === 'lava') {
              if (pState.pos.y >= bottomY && pState.pos.y <= topY + 2.0) {
                // Player died in lava!
                if (!isMuted) playOofSound();
                setFloatingMessage('💀 OOF! You fell into Lava!');
                pState.pos.copy(pState.respawnPos);
                pState.vel.set(0, 0, 0);
                setHudStats((prev) => ({ ...prev, health: 100 }));
                setTimeout(() => setFloatingMessage(null), 2000);
              }
            }
          }

          // Coin Collection Check
          if (part.tag === 'coin' && !pState.collectedCoins.has(part.id)) {
            const dist = pState.pos.distanceTo(new THREE.Vector3(px, py, pz));
            if (dist < 3.2) {
              pState.collectedCoins.add(part.id);
              const val = part.coinValue || 10;
              setHudStats((prev) => ({ ...prev, coins: prev.coins + val }));
              setFloatingMessage(`🪙 +${val} ${game.gameplay.currencyName}!`);
              if (!isMuted) playCoinSound();
              setTimeout(() => setFloatingMessage(null), 1800);

              // Hide coin mesh
              const coinMesh = partsMeshMap.current.get(part.id);
              if (coinMesh) coinMesh.visible = false;
            }
          }
        }

        // Void Fall / Death check
        if (pState.pos.y < -30) {
          if (!isMuted) playOofSound();
          pState.pos.copy(pState.respawnPos);
          pState.vel.set(0, 0, 0);
          setFloatingMessage('💀 Fell into the Void! Respawning...');
          setTimeout(() => setFloatingMessage(null), 2000);
        }

        // Update player avatar position & rotation
        playerGroup.position.copy(pState.pos);
        playerGroup.rotation.y = pState.yaw;

        // Third-Person Follow Camera
        const targetCamPos = new THREE.Vector3(
          pState.pos.x,
          pState.pos.y + 7,
          pState.pos.z + 18
        );
        camera.position.lerp(targetCamPos, 0.12);
        camera.lookAt(pState.pos.x, pState.pos.y + 2.5, pState.pos.z);
      } else {
        // Studio Orbit Camera
        const { theta, phi, radius } = orbitAngle.current;
        const target = new THREE.Vector3(0, 5, 0);
        camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
        camera.position.y = target.y + radius * Math.cos(phi);
        camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
        camera.lookAt(target);
      }

      // Rotate coins and crystals
      game.parts.forEach((part) => {
        if (part.tag === 'coin' || part.name.includes('Crystal')) {
          const mesh = partsMeshMap.current.get(part.id);
          if (mesh && mesh.visible) {
            mesh.rotation.y += 0.03;
          }
        }
      });

      // Update Selection Box
      if (selectedPartId && selectionBoxRef.current) {
        const mesh = partsMeshMap.current.get(selectedPartId);
        if (mesh) {
          selectionBoxRef.current.setFromObject(mesh);
          selectionBoxRef.current.visible = true;
        }
      } else if (selectionBoxRef.current) {
        selectionBoxRef.current.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [game]);

  // Keyboard controls listener for play mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse interaction: Orbit camera & Part selection
  const handleMouseDown = (e: React.MouseEvent) => {
    isOrbitDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isOrbitDragging.current || isPlayMode) return;
    const dx = e.clientX - prevMousePos.current.x;
    const dy = e.clientY - prevMousePos.current.y;
    prevMousePos.current = { x: e.clientX, y: e.clientY };

    orbitAngle.current.theta -= dx * 0.008;
    orbitAngle.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, orbitAngle.current.phi - dy * 0.008));
  };

  const handleMouseUp = () => {
    isOrbitDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isPlayMode) return;
    orbitAngle.current.radius = Math.max(10, Math.min(180, orbitAngle.current.radius + e.deltaY * 0.05));
  };

  // Raycast to select part on click
  const handleClick = (e: React.MouseEvent) => {
    if (isPlayMode || !containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const meshes = Array.from(partsMeshMap.current.values());
    const intersects = raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const partId = clickedMesh.userData?.partId;
      if (partId) {
        onSelectPart(partId);
      }
    } else {
      onSelectPart(null);
    }
  };

  const handleResetCharacter = () => {
    const pState = playerPhysicsRef.current;
    pState.pos.copy(pState.respawnPos);
    pState.vel.set(0, 0, 0);
    setFloatingMessage('Respawned at checkpoint!');
    setTimeout(() => setFloatingMessage(null), 1500);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#141720] select-none overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
      {/* 3D Viewport Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1e29] border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-red-500" />
            Roblox Studio Viewport
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {game.genre.toUpperCase()}
          </span>
          <span className="text-slate-500 hidden sm:inline">
            {isPlayMode ? '🎮 Test Play Mode Active (WASD + Space)' : '🛠️ Studio Edit Mode (Orbit / Select Parts)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Test Play Toggle Button */}
          <button
            onClick={onTogglePlayMode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition text-xs shadow-sm ${
              isPlayMode
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlayMode ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                Stop Test (F5)
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Play & Test Game
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing outline-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />

      {/* Play Mode Authentic Roblox TopBar & HUD Overlay */}
      {isPlayMode && (
        <div className="absolute top-12 left-0 right-0 pointer-events-none flex flex-col items-center">
          {/* TopBar Leaderboard Pill */}
          <div className="pointer-events-auto flex items-center gap-4 px-5 py-2 rounded-full bg-[#1e2230]/90 backdrop-blur-md border border-slate-700 shadow-xl text-sm font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span>⛳ Stage:</span>
              <span className="font-bold text-white text-base font-mono">{hudStats.stage}</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-amber-400">
              <span>🪙 {game.gameplay.currencyName}:</span>
              <span className="font-bold text-white text-base font-mono">{hudStats.coins}</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <button
              onClick={handleResetCharacter}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset character back to last checkpoint"
            >
              <RotateCcw className="w-3 h-3" />
              Reset (R)
            </button>
          </div>

          {/* Floating Action Message (Coin, Checkpoint, Oof) */}
          {floatingMessage && (
            <div className="mt-3 px-4 py-1.5 rounded-lg bg-black/80 backdrop-blur border border-amber-500/50 text-amber-300 text-sm font-bold animate-bounce shadow-lg">
              {floatingMessage}
            </div>
          )}
        </div>
      )}

      {/* Victory Celebration Modal */}
      {showVictory && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-20">
          <div className="max-w-md w-full bg-[#1e2230] border-2 border-amber-500 rounded-2xl p-6 text-center shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/40">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 font-['Fredoka']">🏆 VICTORY ACHIEVED!</h3>
            <p className="text-slate-300 text-sm mb-4">
              You conquered the entire course and touched the Golden Trophy!
            </p>
            <div className="bg-slate-900/60 rounded-xl p-3 mb-6 flex justify-around text-center border border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Total Coins</div>
                <div className="text-xl font-bold text-amber-400 font-mono">{hudStats.coins + 500}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Stages Cleared</div>
                <div className="text-xl font-bold text-emerald-400 font-mono">100%</div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowVictory(false);
                handleResetCharacter();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-sm hover:brightness-110 transition shadow-lg"
            >
              Play Again / Respawn
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls Legend */}
      <div className="absolute bottom-3 left-4 right-4 pointer-events-none flex items-center justify-between text-[11px] text-slate-400">
        <div className="bg-[#12151f]/80 backdrop-blur px-3 py-1 rounded-md border border-slate-800">
          {isPlayMode ? (
            <span>WASD = Walk • Space = Jump • Shift = Sprint • R = Reset</span>
          ) : (
            <span>Left Click + Drag = Orbit • Scroll = Zoom • Click Part = Inspect Properties</span>
          )}
        </div>
        <div className="bg-[#12151f]/80 backdrop-blur px-3 py-1 rounded-md border border-slate-800 hidden sm:block">
          Studs Grid: 4x4 • Lighting: {game.lighting.technology}
        </div>
      </div>
    </div>
  );
};
