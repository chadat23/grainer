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
}

export default function GCodeViewer({ paths, baseColor, accentColor }: GCodeViewerProps) {
//export default function GCodeViewer({ paths }: GCodeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.log('Container ref not available');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Calculate bounds
    const bounds = new THREE.Box3();
    paths.forEach(path => {
      bounds.expandByPoint(new THREE.Vector3(path.start.x, path.start.y, path.start.z));
      bounds.expandByPoint(new THREE.Vector3(path.end.x, path.end.y, path.end.z));
    });
    const center = bounds.getCenter(new THREE.Vector3());
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
      //(width || window.innerWidth) / (height || window.innerHeight),
      0.1,
      cameraZ * 4
    );
    camera.position.set(cameraZ, cameraZ, cameraZ);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

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

    // Create rectangles for each path
    const pathWidth = 0.4; // Width of the rectangle
    const pathHeight = 0.2; // Height of the rectangle
    const roughness = 0.7;
    const metalness = 0.2;
    const side = THREE.DoubleSide;
    //const pathMaterial = new THREE.MeshStandardMaterial({ 
    //  color: baseColor, // Tan color
    //  roughness: roughness,
    //  metalness: 0.2,
    //  side: THREE.DoubleSide
    //});

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

    paths.forEach((path) => {
      const start = new THREE.Vector3(path.start.x, path.start.y, path.start.z);
      const end = new THREE.Vector3(path.end.x, path.end.y, path.end.z);
      //const start = new THREE.Vector3(path.start.x - 128, path.start.z, -(path.start.y - 128));
      //const end = new THREE.Vector3(path.end.x - 128, path.end.z, -(path.end.y - 128));
      
      // Calculate the direction and length of the path
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      direction.normalize();

      // Create a box geometry
      const geometry = new THREE.BoxGeometry(length, pathHeight, pathWidth);

      // Create a material
      const relativeZ = (path.start.z - finalMinZ) / (finalMaxZ - finalMinZ);
      const color = interpolateColor(baseColorInt, accentColorInt, relativeZ);
      console.log("color: ", color);
      //console.log("color: ", color);
      //console.log("finalMinZ: {0}, finalMaxZ: {1}, currentZ: {2}, relativeZ: {3}", finalMinZ, finalMaxZ, path.start.z, relativeZ);
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
      
      scene.add(box);
    });

    // Handle window resize
    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        // Update renderer and camera based on the container's new size
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });

    // Tell the observer to watch our specific container element
    resizeObserver.observe(containerRef.current);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      //window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      containerRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  //}, [paths, width, height]);
  }, [paths]);

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