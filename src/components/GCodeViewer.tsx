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
    const planeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x333333,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
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
      window.innerWidth / window.innerHeight,
      0.1,
      cameraZ * 4
    );
    camera.position.set(cameraZ, cameraZ, cameraZ);
    //camera.lookAt(center);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false; // Remove inertia
    controls.dampingFactor = 0; // Ensure no damping
    controls.rotateSpeed = 1.0; // Adjust rotation speed
    //controls.target.copy(center);
    controls.target.set(0, 0, 0);
    controls.minDistance = maxDim * 0.01;
    controls.maxDistance = maxDim * 2;

    // Create tubes for each path
    const tubeRadius = 0.2;
    const tubeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xD2B48C, // Tan color
      shininess: 30,
      specular: 0x444444
    });

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    paths.forEach((path) => {
      const points = [
        new THREE.Vector3(path.start.x - 128, path.start.z, -(path.start.y - 128)),
        new THREE.Vector3(path.end.x - 128, path.end.z, -(path.end.y - 128))
      ];
      
      // Create a curve from the points
      const curve = new THREE.CatmullRomCurve3(points);
      
      // Create tube geometry
      const tubeGeometry = new THREE.TubeGeometry(curve, 1, tubeRadius, 8, false);
      
      // Create mesh
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      scene.add(tube);
    });

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [paths]);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
} 