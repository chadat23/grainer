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
}

export default function GCodeViewer({ paths }: GCodeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  console.log('GCodeViewer received paths:', paths.length);
  if (paths.length > 0) {
    console.log('First path:', paths[0]);
    console.log('Last path:', paths[paths.length - 1]);
  }

  useEffect(() => {
    if (!containerRef.current) {
      console.log('Container ref not available');
      return;
    }

    console.log('Setting up Three.js scene...');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    console.log('Scene created');

    // Calculate bounds
    const bounds = new THREE.Box3();
    paths.forEach(path => {
      bounds.expandByPoint(new THREE.Vector3(path.start.x, path.start.y, path.start.z));
      bounds.expandByPoint(new THREE.Vector3(path.end.x, path.end.y, path.end.z));
    });
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    console.log('Model bounds:', {
      center: center.toArray(),
      size: size.toArray(),
      maxDim
    });

    const fov = 75;
    const cameraZ = Math.abs(maxDim / Math.sin((fov * Math.PI) / 360)) * 0.5;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      0.1,
      cameraZ * 4
    );
    camera.position.set(cameraZ, cameraZ, cameraZ);
    camera.lookAt(center);
    console.log('Camera created and positioned at:', camera.position.toArray());

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    console.log('Renderer created and added to DOM');

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.copy(center);
    controls.minDistance = maxDim * 0.1;
    controls.maxDistance = maxDim * 2;
    console.log('Controls created with target:', center.toArray());

    // Create lines for each path
    console.log('Creating lines for paths:', paths.length);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    paths.forEach((path, index) => {
      const points = [
        new THREE.Vector3(path.start.x, path.start.y, path.start.z),
        new THREE.Vector3(path.end.x, path.end.y, path.end.z)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      if (index < 5) {
        console.log(`Added line ${index} from`, points[0].toArray(), 'to', points[1].toArray());
      }
    });

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      console.log('Window resized:', width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    console.log('Starting animation loop');
    animate();

    // Cleanup
    return () => {
      console.log('Cleaning up Three.js scene');
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [paths]);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
} 