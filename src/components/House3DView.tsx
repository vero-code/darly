import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { RingEntrywayDevice } from '@/lib/types/devices';
import { EntrywayBadge } from './EntrywayBadge';
import { QuickControlsOverlay } from './QuickControlsOverlay';
import { CameraFocusDock } from './CameraFocusDock';
import { DeviceSpecCards } from './DeviceSpecCards';
import { ambientAudio } from '../utils/audioChime';

interface House3DViewProps {
  sensors: RingEntrywayDevice[];
  onToggleSensor: (sensorId: string) => void;
  selectedSensorId: string | null;
  onSelectSensor: (sensorId: string) => void;
}

export const House3DView: React.FC<House3DViewProps> = ({
  sensors,
  onToggleSensor,
  selectedSensorId,
  onSelectSensor,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeDeviceFocus, setActiveDeviceFocus] = useState<'all' | 'doorbell' | 'contact' | 'motion'>('all');
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDoorbellRinging, setIsDoorbellRinging] = useState(false);
  const [isMotionActive, setIsMotionActive] = useState(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Dynamic 3D Objects
  const doorHingeRef = useRef<THREE.Group | null>(null);
  const targetDoorAngle = useRef<number>(0);
  const currentDoorAngle = useRef<number>(0);

  const doorbellLedRingRef = useRef<THREE.Mesh | null>(null);
  const motionConeRef = useRef<THREE.Mesh | null>(null);

  // Smooth camera targets
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(7.5, 5.5, 7.5));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.4, 0));
  const isTransitioningCamera = useRef<boolean>(false);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 540;

    // 1. Scene & Atmosphere - Clean studio without clouds or fog
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7.5, 5.5, 7.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't go under floor
    controls.minDistance = 2.5;
    controls.maxDistance = 20;
    controls.target.set(0, 1.4, 0);
    controlsRef.current = controls;

    // Release camera to user as soon as mouse interaction begins
    controls.addEventListener('start', () => {
      isTransitioningCamera.current = false;
    });

    // 5. Lighting Rig (Crisp direct sunlight + balanced studio fill)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.4);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    sunLight.position.set(8, 14, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 30;
    const d = 6;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const porchLight = new THREE.PointLight(0xfef08a, 1.0, 7);
    porchLight.position.set(-1.8, 2.6, 1.2);
    scene.add(porchLight);

    // 6. Materials
    const porchWoodMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.6 });
    const foyerTileMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.25 });
    const extWallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const intWallMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.7 });
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
    const doorSlabMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

    // 7. Base Foundation: Porch (Outdoor) + Foyer (Indoor)
    // Outdoor Porch Deck (Z > 0)
    const porchDeck = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 4.0), porchWoodMat);
    porchDeck.position.set(0, -0.15, 2.0);
    porchDeck.receiveShadow = true;
    scene.add(porchDeck);

    // Stone Steps down to garden
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 1.0), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.8 }));
    step1.position.set(0, -0.22, 4.4);
    step1.receiveShadow = true;
    scene.add(step1);

    // Indoor Foyer Floor (Z < 0)
    const foyerFloor = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 4.0), foyerTileMat);
    foyerFloor.position.set(0, -0.15, -2.0);
    foyerFloor.receiveShadow = true;
    scene.add(foyerFloor);

    // Welcome Doormat on porch
    const mat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 1.0), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 }));
    mat.position.set(0, 0.02, 1.0);
    scene.add(mat);

    // 8. Architectural Main Wall Divider (Separating Porch and Foyer along Z = 0)
    const wallHeight = 3.2;
    // Left Wall section
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2.3, wallHeight, 0.25), extWallMat);
    leftWall.position.set(-2.05, wallHeight / 2, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right Wall section
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2.3, wallHeight, 0.25), extWallMat);
    rightWall.position.set(2.05, wallHeight / 2, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Lintel Wall above door opening
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 0.25), extWallMat);
    lintel.position.set(0, 2.8, 0);
    lintel.castShadow = true;
    scene.add(lintel);

    // Interior Foyer Side Wall (Where Motion Detector is mounted)
    const foyerSideWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, wallHeight, 4.0), intWallMat);
    foyerSideWall.position.set(3.075, wallHeight / 2, -2.0);
    foyerSideWall.receiveShadow = true;
    scene.add(foyerSideWall);

    // Doorway Frame Trim
    const doorTrimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.3), doorFrameMat);
    doorTrimLeft.position.set(-0.85, 1.2, 0);
    scene.add(doorTrimLeft);

    const doorTrimRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.3), doorFrameMat);
    doorTrimRight.position.set(0.85, 1.2, 0);
    scene.add(doorTrimRight);

    const doorTrimTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.3), doorFrameMat);
    doorTrimTop.position.set(0, 2.4, 0);
    scene.add(doorTrimTop);

    // -------------------------------------------------------------
    // ELEMENT 1: Ring Video Doorbell
    // -------------------------------------------------------------
    const doorbellGroup = new THREE.Group();
    doorbellGroup.position.set(-1.25, 1.45, 0.15); // outdoor face of left wall
    doorbellGroup.userData = { sensorId: 'darly-video-doorbell' };

    // Mounting backplate
    const dbBackplate = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.58, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    doorbellGroup.add(dbBackplate);

    // Top Module: Glossy Black Camera Enclosure
    const dbTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.28, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.3 })
    );
    dbTop.position.set(0, 0.13, 0.02);
    doorbellGroup.add(dbTop);

    // Camera Lens aperture
    const dbLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 })
    );
    dbLens.rotation.x = Math.PI / 2;
    dbLens.position.set(0, 0.16, 0.05);
    doorbellGroup.add(dbLens);

    // IR Night Vision Sensor dot
    const dbIR = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x1e293b })
    );
    dbIR.position.set(0, 0.23, 0.05);
    doorbellGroup.add(dbIR);

    // Microphone Pinhole
    const dbMic = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.02, 8),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    dbMic.rotation.x = Math.PI / 2;
    dbMic.position.set(0, 0.06, 0.05);
    doorbellGroup.add(dbMic);

    // Bottom Faceplate: Satin Nickel / Silver
    const dbBottom = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.26, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.7, roughness: 0.3 })
    );
    dbBottom.position.set(0, -0.13, 0.02);
    doorbellGroup.add(dbBottom);

    // Iconic Ring LED Circular Halo Button
    const ringHaloGeo = new THREE.TorusGeometry(0.055, 0.012, 16, 32);
    const ringHaloMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const ringHalo = new THREE.Mesh(ringHaloGeo, ringHaloMat);
    ringHalo.position.set(0, -0.13, 0.05);
    doorbellGroup.add(ringHalo);
    doorbellLedRingRef.current = ringHalo;

    // Center Bell Button
    const dbCenterBtn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.015, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 })
    );
    dbCenterBtn.rotation.x = Math.PI / 2;
    dbCenterBtn.position.set(0, -0.13, 0.048);
    doorbellGroup.add(dbCenterBtn);

    scene.add(doorbellGroup);

    // -------------------------------------------------------------
    // ELEMENT 2: Ring Alarm Contact Sensor
    // -------------------------------------------------------------
    // Hinge Group for Front Door (Hinged at X = -0.75, Z = 0)
    const doorHinge = new THREE.Group();
    doorHinge.position.set(-0.75, 0.05, 0);
    doorHingeRef.current = doorHinge;

    // Door Slab (Width 1.5, Height 2.3, Thickness 0.09)
    const doorSlab = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 2.3, 0.09),
      doorSlabMat
    );
    doorSlab.position.set(0.75, 1.15, 0);
    doorSlab.castShadow = true;
    doorSlab.receiveShadow = true;
    doorSlab.userData = { sensorId: 'darly-contact-sensor' };
    doorHinge.add(doorSlab);

    // Decorative Modern Glass Inset in Door
    const glassInset = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 1.4, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.4 })
    );
    glassInset.position.set(0.4, 1.2, 0);
    doorHinge.add(glassInset);

    // Door Handle & Lock
    const doorHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.18),
      handleMat
    );
    doorHandle.rotation.z = Math.PI / 2;
    doorHandle.position.set(1.35, 1.05, 0.08);
    doorHinge.add(doorHandle);

    const doorHandleBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.18),
      handleMat
    );
    doorHandleBack.rotation.z = Math.PI / 2;
    doorHandleBack.position.set(1.35, 1.05, -0.08);
    doorHinge.add(doorHandleBack);

    // Part A: Magnet Bar mounted on the door slab edge
    const contactMagnet = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.35, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    contactMagnet.position.set(1.44, 2.15, -0.05);
    contactMagnet.userData = { sensorId: 'darly-contact-sensor' };
    doorHinge.add(contactMagnet);

    scene.add(doorHinge);

    // Part B: Main Contact Sensor Body mounted on the fixed door frame (X = 0.81, Y = 2.2, Z = -0.05)
    const contactSensorBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.48, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
    );
    contactSensorBody.position.set(0.81, 2.2, -0.05);
    contactSensorBody.userData = { sensorId: 'darly-contact-sensor' };
    scene.add(contactSensorBody);

    // Contact Sensor Status Indicator LED
    const contactLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    contactLed.position.set(0.81, 2.38, -0.02);
    scene.add(contactLed);

    // -------------------------------------------------------------
    // ELEMENT 3: Ring Alarm Motion Detector
    // -------------------------------------------------------------
    const motionGroup = new THREE.Group();
    motionGroup.position.set(2.88, 2.4, -1.6);
    motionGroup.rotation.y = -Math.PI / 4 - 0.2; // angled towards entryway
    motionGroup.userData = { sensorId: 'darly-motion-detector' };

    // Corner Wedge Mounting Bracket
    const motionBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.48, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 })
    );
    motionGroup.add(motionBracket);

    // Main Motion Body with Beveled Chamfer
    const motionBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.45, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
    );
    motionBody.position.set(0, 0, 0.06);
    motionGroup.add(motionBody);

    // Faceted PIR Fresnel Lens (Frosted Translucent Optical Window)
    const pirLens = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.22, 0.03),
      new THREE.MeshStandardMaterial({ 
        color: 0xe0f2fe, 
        roughness: 0.15, 
        metalness: 0.1, 
        transparent: true, 
        opacity: 0.85 
      })
    );
    pirLens.position.set(0, -0.06, 0.125);
    motionGroup.add(pirLens);

    // PIR Status Indicator LED
    const motionLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    motionLed.position.set(0, 0.14, 0.125);
    motionGroup.add(motionLed);

    // Soft 3D Visual Detection Cone (illuminates on motion)
    const coneGeo = new THREE.ConeGeometry(2.4, 4.2, 16, 1, true);
    coneGeo.translate(0, -2.1, 0);
    coneGeo.rotateX(Math.PI / 2.3);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const motionCone = new THREE.Mesh(coneGeo, coneMat);
    motionCone.position.set(0, -0.06, 0.15);
    motionGroup.add(motionCone);
    motionConeRef.current = motionCone;

    scene.add(motionGroup);

    // 10. Raycasting Click Interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj) {
          if (obj.userData?.sensorId) {
            const sid = obj.userData.sensorId as string;
            onSelectSensor(sid);
            if (sid === 'darly-video-doorbell') {
              handleTriggerDoorbell();
            } else if (sid === 'darly-contact-sensor') {
              onToggleSensor('darly-contact-sensor');
            } else if (sid === 'darly-motion-detector') {
              handleTriggerMotion();
            }
            return;
          }
          obj = obj.parent;
        }
      }
    };

    container.addEventListener('click', handleClick);

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera position transitions (only when flying to a target)
      if (isTransitioningCamera.current) {
        camera.position.lerp(targetCameraPos.current, 0.06);
        controls.target.lerp(targetLookAt.current, 0.06);

        if(
          camera.position.distanceTo(targetCameraPos.current) < 0.05 &&
          controls.target.distanceTo(targetLookAt.current) < 0.05
        ) {
          isTransitioningCamera.current = false;
        }
      }
      
      controls.update();

      // Smooth door swinging
      if (doorHingeRef.current) {
        currentDoorAngle.current = THREE.MathUtils.damp(
          currentDoorAngle.current,
          targetDoorAngle.current,
          6,
          delta
        );
        doorHingeRef.current.rotation.y = currentDoorAngle.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 540;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Synchronize Door Open/Close with React State
  useEffect(() => {
    const frontDoor = sensors.find((s) => s.id === 'darly-contact-sensor');
    if (frontDoor) {
      targetDoorAngle.current = frontDoor.state === 'open' ? -Math.PI / 2.2 : 0;
    }
  }, [sensors]);

  // Synchronize Motion Sensor state
  useEffect(() => {
    const motion = sensors.find((s) => s.id === 'darly-motion-detector');
    if (motionConeRef.current) {
      const active = motion?.state === 'open' || isMotionActive;
      const mat = motionConeRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.35 : 0;
    }
  }, [sensors, isMotionActive]);

  // Handle Triggering the Ring Video Doorbell
  const handleTriggerDoorbell = () => {
    setIsDoorbellRinging(true);
    ambientAudio.playGentleCheckinChime();
    onToggleSensor('darly-video-doorbell');

    if (doorbellLedRingRef.current) {
      const mat = doorbellLedRingRef.current.material as THREE.MeshStandardMaterial;
      mat.emissive.setHex(0x38bdf8);
      mat.emissiveIntensity = 3.0;
    }

    setTimeout(() => {
      setIsDoorbellRinging(false);
      if (doorbellLedRingRef.current) {
        const mat = doorbellLedRingRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.2;
      }
    }, 2800);
  };

  // Handle Triggering Motion Detector
  const handleTriggerMotion = () => {
    setIsMotionActive(true);
    onToggleSensor('darly-motion-detector');
    setTimeout(() => {
      setIsMotionActive(false);
    }, 3200);
  };

  // Focus Camera onto one of the 3 Ring Devices
  const handleFocusDevice = (dev: 'all' | 'doorbell' | 'contact' | 'motion') => {
    setActiveDeviceFocus(dev);
    isTransitioningCamera.current = true;

    if (dev === 'all') {
      targetCameraPos.current.set(7.5, 5.5, 7.5);
      targetLookAt.current.set(0, 1.4, 0);
    } else if (dev === 'doorbell') {
      targetCameraPos.current.set(-1.25, 1.55, 1.8);
      targetLookAt.current.set(-1.25, 1.45, 0.15);
      onSelectSensor('darly-video-doorbell');
    } else if (dev === 'contact') {
      targetCameraPos.current.set(1.1, 2.3, 1.4);
      targetLookAt.current.set(0.8, 2.15, 0);
      onSelectSensor('darly-contact-sensor');
    } else if (dev === 'motion') {
      targetCameraPos.current.set(1.4, 2.3, -0.4);
      targetLookAt.current.set(2.88, 2.4, -1.6);
      onSelectSensor('darly-motion-detector');
    }
  };

  const handleToggleAutoRotate = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !isAutoRotating;
      controlsRef.current.autoRotateSpeed = 1.0;
      setIsAutoRotating(!isAutoRotating);
    }
  };

  const doorbellSensor = sensors.find((s) => s.id === 'darly-video-doorbell');
  const frontDoorSensor = sensors.find((s) => s.id === 'darly-contact-sensor');
  const motionSensor = sensors.find((s) => s.id === 'darly-motion-detector');

  return (
    <div className="space-y-4">
      {/* 3D Viewport Box */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-md">
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-[520px] select-none cursor-grab active:cursor-grabbing" />

        {/* Top Header Badge */}
        <EntrywayBadge deviceCount={sensors.length} />

        {/* Live Device Interactive Quick Controls Overlay */}
        <QuickControlsOverlay
          isDoorbellRinging={isDoorbellRinging || doorbellSensor?.state === 'open'}
          onTriggerDoorbell={handleTriggerDoorbell}
          isDoorOpen={frontDoorSensor?.state === 'open'}
          onToggleDoor={() => onToggleSensor('darly-contact-sensor')}
          isMotionActive={isMotionActive || motionSensor?.state === 'open'}
          onTriggerMotion={handleTriggerMotion}
        />

        {/* Bottom Focus & Camera Controls Dock */}
        <CameraFocusDock
          activeDeviceFocus={activeDeviceFocus}
          onFocusDevice={handleFocusDevice}
          isAutoRotating={isAutoRotating}
          onToggleAutoRotate={handleToggleAutoRotate}
        />
      </div>

      {/* Device Cards Linking to official specifications */}
      <DeviceSpecCards
        sensors={sensors}
        selectedSensorId={selectedSensorId}
        activeDeviceFocus={activeDeviceFocus}
        isDoorbellRinging={isDoorbellRinging}
        isMotionActive={isMotionActive}
        onFocusDevice={handleFocusDevice}
      />
    </div>
  );
};
