'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Point {
  x: number;
  y: number;
  z: number;
  e: number;
}

interface Path {
  start: Point;
  end: Point;
}

interface GCodeViewerProps {
  paths: Path[];
  baseColor: string;
  accentColor: string;
  cameraPoint: Point;
  lookAtPoint: Point;
  accentSliders: {
    accentNumb: number;
    accentStart: number;
    accentEnd: number;
  }[];
}

export default function GCodeViewer({ paths, baseColor, accentColor, cameraPoint, lookAtPoint, accentSliders }: GCodeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pathMeshesRef = useRef<THREE.Mesh[]>([]);

  // Effect for initial setup of scene, camer, renderer, and controls
  useEffect(() => {
    console.log("GCodeViewer useEffect called");
    if (!containerRef.current) {
      console.log('Container ref not available');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Calculate bounds
    const bounds = new THREE.Box3();
    paths.forEach(path => {
      bounds.expandByPoint(new THREE.Vector3(path.start.x, path.start.y, path.start.z));
      bounds.expandByPoint(new THREE.Vector3(path.end.x, path.end.y, path.end.z));
    });
    const size = bounds.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Add grid helper
    const gridSize = 255;
    const gridDivisions = 16;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(25);
    scene.add(axesHelper);

    // Add ground plane
    const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      roughness: 0.8,
      metalness: 0.3
    });
    const groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -0.01; // Slightly below grid to prevent z-fighting
    scene.add(groundPlane);

    const fov = 50;
    const cameraZ = Math.abs(maxDim / Math.sin((fov * Math.PI) / 360)) * 0.25;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      fov,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      cameraZ * 4
    );
    camera.position.set(cameraPoint.x, cameraPoint.y, cameraPoint.z);
    camera.lookAt(new THREE.Vector3(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z));
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.dampingFactor = 0;
    controls.rotateSpeed = 1.0;
    controls.target.set(0, 0, 0);
    controls.minDistance = maxDim * 0.01;
    controls.maxDistance = maxDim * 2;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional lights from multiple angles
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, 0.5, -1);
    directionalLight2.castShadow = true;
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight3.position.set(0, -1, 0);
    directionalLight3.castShadow = true;
    scene.add(directionalLight3);

    // Animation loop
    const animate = () => {
      if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;
      requestAnimationFrame(animate);
      controlsRef.current?.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Handle window resize
    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry && rendererRef.current && cameraRef.current) {
        const { width, height } = entry.contentRect;
        rendererRef.current?.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(containerRef.current);

    // Cleanup for initial setup
    return () => {
      console.log('GCodeViewer initial setup cleanup called');
      resizeObserver.disconnect();
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [paths, cameraPoint, lookAtPoint]); // Re-run only when paths or initial camera points change

  // Effect for creating and updating the path geometries (when paths, baseColor, accentColor hange)
  useEffect(() => {
    console.log("GCodeViewer paths/color update useEffect called");
    if (!sceneRef.current) {
      console.log('Scene ref not initialized for path/color update');
      return;
    }

    // Remove old path methses from scene
    pathMeshesRef.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    pathMeshesRef.current = [];

    // Create rectangles for each path
    const pathWidth = 0.4; // Width of the rectangle
    const pathHeight = 0.2; // Height of the rectangle
    const roughness = 0.7;
    const metalness = 0.2;
    const side = THREE.DoubleSide;

    // Calculate the min and max Z values
    var minZ: number | undefined = undefined;
    var maxZ: number | undefined = undefined;
    paths.forEach((path) => {
      if (minZ === undefined || path.start.z < minZ) {
        minZ = path.start.z;
      }
      if (maxZ === undefined || path.start.z > maxZ) {
        maxZ = path.start.z;
      }
    });
    if (minZ === undefined || maxZ === undefined) {
      minZ = 0;
      maxZ = 1;
    }
    const finalMinZ = minZ!;
    const finalMaxZ = maxZ!;

    const baseColorInt = parseInt(baseColor.slice(1), 16);
    const accentColorInt = parseInt(accentColor.slice(1), 16);

    var accentIndex = 0;
    var color = baseColorInt;

    console.log("accentSliders", accentSliders);

    paths.forEach((path) => {
      const start = new THREE.Vector3(path.start.x, path.start.y, path.start.z);
      const end = new THREE.Vector3(path.end.x, path.end.y, path.end.z);
      
      // Calculate the direction and length of the path
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      direction.normalize();

      // Create a box geometry
      const geometry = new THREE.BoxGeometry(length, pathHeight, pathWidth);

      // Create a material
      //const relativeZ = (path.start.z - finalMinZ) / (finalMaxZ - finalMinZ);
      //const color = interpolateColor(baseColorInt, accentColorInt, relativeZ);
      //console.log("accentIndex", accentIndex);
      if (accentIndex < accentSliders.length) {
        if (path.start.z >= accentSliders[accentIndex].accentStart && path.start.z <= accentSliders[accentIndex].accentEnd) {
          color = accentColorInt;
        } else if (color === accentColorInt) {
          accentIndex++;
          color = baseColorInt;
        }
      }
      const pathMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(color), // Tan color
        roughness: roughness,
        metalness: metalness,
        side: side
      });
      
      // Create mesh
      const box = new THREE.Mesh(geometry, pathMaterial);
      box.castShadow = true;
      box.receiveShadow = true;
      
      // Position the box at the midpoint
      box.position.copy(start).add(end).multiplyScalar(0.5);
      
      // Rotate the box to align with the path
      box.lookAt(end);
      box.rotateY(Math.PI / 2); // Align the length with the path
      
      sceneRef.current!.add(box);
      pathMeshesRef.current.push(box);
    });
  }, [paths, baseColor, accentColor, cameraPoint, lookAtPoint, accentSliders]);

  return <div ref={containerRef} className="w-full h-full" />;
}

// interpolate between two colors and return a hex color
function interpolateColor(color1: number, color2: number, ratio: number): number {
  const r1 = (color1 >> 16) & 0xFF;
  const g1 = (color1 >> 8) & 0xFF;
  const b1 = color1 & 0xFF;
  const r2 = (color2 >> 16) & 0xFF;
  const g2 = (color2 >> 8) & 0xFF;
  const b2 = color2 & 0xFF;
  const r = r1 + (r2 - r1) * ratio;
  const g = g1 + (g2 - g1) * ratio;
  const b = b1 + (b2 - b1) * ratio;
  return (r << 16) | (g << 8) | b;
}