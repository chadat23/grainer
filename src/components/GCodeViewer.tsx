'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ToolPath, Vertex } from '@/types/spatial';

interface GCodeViewerProps {
  toolPaths: ToolPath[];
  defaultColor: string;
  minColor: string;
  maxColor: string;
  cameraVertex: Vertex;
  lookAtVertex: Vertex;
  accentSliders: {
    accentNumb: number;
    accentLayer: number;
    accentTemp: number;
  }[];
}

export default function GCodeViewer({ toolPaths, defaultColor, minColor, maxColor, cameraVertex, lookAtVertex, accentSliders }: GCodeViewerProps) {
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
    toolPaths.forEach(toolPath => {
      bounds.expandByPoint(new THREE.Vector3(toolPath.start.x, toolPath.start.y, toolPath.start.z));
      bounds.expandByPoint(new THREE.Vector3(toolPath.end.x, toolPath.end.y, toolPath.end.z));
    });
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
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

    const fov = 100;
    const cameraZ = Math.abs(maxDim / Math.sin((fov * Math.PI) / 360)) * 0.5;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      fov,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      cameraZ * 10
    );
    camera.position.set(cameraVertex.x, cameraVertex.y, cameraVertex.z);
    camera.lookAt(new THREE.Vector3(lookAtVertex.x, lookAtVertex.y, lookAtVertex.z));
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
    //controls.target.set(0, 0, 0);
    controls.target.copy(center);
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
  }, [toolPaths, cameraVertex, lookAtVertex]); // Re-run only when paths or initial camera points change

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
    const pathWidth = 0.2; // Width of the rectangle
    const pathHeight = 0.4; // Height of the rectangle
    const roughness = 0.7;
    const metalness = 0.2;
    const side = THREE.DoubleSide;

    // Calculate the min and max Z values
    var provisionalMinZ: number | undefined = undefined;
    var provisionalMaxZ: number | undefined = undefined;
    toolPaths.forEach((toolPath) => {
      if (provisionalMinZ === undefined || toolPath.start.z < provisionalMinZ) {
        provisionalMinZ = toolPath.start.z;
      }
      if (provisionalMaxZ === undefined || toolPath.start.z > provisionalMaxZ) {
        provisionalMaxZ = toolPath.start.z;
      }
    });
    if (provisionalMinZ === undefined || provisionalMaxZ === undefined) {
      provisionalMinZ = 0;
      provisionalMaxZ = 1;
    }
    const minZ = provisionalMinZ!;
    const maxZ = provisionalMaxZ!;

    // Get the min and max temp from the accent sliders
    const minTemp = accentSliders.reduce((min, slider) => Math.min(min, slider.accentTemp), Infinity);
    const maxTemp = accentSliders.reduce((max, slider) => Math.max(max, slider.accentTemp), -Infinity);

    const defaultColorInt = parseInt(defaultColor.slice(1), 16);
    const minColorInt = parseInt(minColor.slice(1), 16);
    const maxColorInt = parseInt(maxColor.slice(1), 16);

    var accentIndex = 0;
    var color = minColorInt;

    toolPaths.forEach((toolPath) => {
      const start = new THREE.Vector3(toolPath.start.x, toolPath.start.y, toolPath.start.z);
      const end = new THREE.Vector3(toolPath.end.x, toolPath.end.y, toolPath.end.z);
      
      // Calculate the direction and length of the path
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      direction.normalize();

      // Create a box geometry
      const geometry = new THREE.BoxGeometry(length, pathHeight, pathWidth);

      // get color for the path
      color = 0x99FF99;
      if (toolPath.start.z  * 5 - 0.05 < accentSliders[accentIndex].accentLayer) {
        //color = defaultColorInt;
        color = 0xA52A2A;
      }
      //} else if (accentIndex < accentSliders.length - 1) {
        //if (path.start.z == accentSliders[accentIndex + 1].accentLayer) {
        //  accentIndex++;
        //}

        //color = calcColor(
        //  minColorInt, 
        //  maxColorInt, 
        //  minTemp, 
        //  maxTemp, 
        //  accentSliders[accentIndex].accentTemp, 
        //  accentSliders[accentIndex+1].accentTemp, 
        //  accentSliders[accentIndex].accentLayer, 
        //  accentSliders[accentIndex+1].accentLayer, 
        //  path.start.z
        //);
      //} else if (accentIndex == accentSliders.length - 1) {
        //color = accentSliders[accentIndex].accentTemp;
        //color = 0xA52A2A;
      //}
      //if (path.start.z == 400) {

      // Create a material
      //if (accentIndex < accentSliders.length) {
      //  if (path.start.z >= accentSliders[accentIndex].accentLayer && path.start.z <= accentSliders[accentIndex].accentTemp) {
      //    color = maxColorInt;
      //  } else if (color === maxColorInt) {
      //    accentIndex++;
      //    color = minColorInt;
      //  }
      //}
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
  }, [toolPaths, minColor, maxColor, cameraVertex, lookAtVertex, accentSliders]);

  return <div ref={containerRef} className="w-full h-full" />;
}

function calcTempsColor(minColor: number, maxColor: number, minTemp: number, maxTemp: number, thisTemp: number): number {
  const minR = (minColor >> 16) & 0xFF;
  const minG = (minColor >> 8) & 0xFF;
  const minB = minColor & 0xFF;
  const maxR = (maxColor >> 16) & 0xFF;
  const maxG = (maxColor >> 8) & 0xFF;
  const maxB = maxColor & 0xFF;

  const rDelta = maxR - minR;
  const gDelta = maxG - minG;
  const bDelta = maxB - minB;

  const r = minR + rDelta * (thisTemp - minTemp) / (maxTemp - minTemp);
  const g = minG + gDelta * (thisTemp - minTemp) / (maxTemp - minTemp);
  const b = minB + bDelta * (thisTemp - minTemp) / (maxTemp - minTemp);

  return (r << 16) | (g << 8) | b;
}

function calcLayerTemp(lastTemp: number, nextTemp: number, lastLayer: number, thisLayer: number, nextLayer: number): number {
  const tempDelta = nextTemp - lastTemp;
  const layerDelta = nextLayer - lastLayer;

  const temp = lastTemp + tempDelta * (thisLayer - lastLayer) / layerDelta;
  return temp;
}

// interpolate between two colors and return a hex color
function calcColor(
  minColor: number, 
  maxColor: number, 
  minTemp: number, 
  maxTemp: number, 
  lastTemp: number, 
  nextTemp: number, 
  lastLayer: number, 
  thisLayer: number, 
  nextLayer: number): number {

  const thisTemp = calcLayerTemp(lastTemp, nextTemp, lastLayer, thisLayer, nextLayer);
  const thisColor = calcTempsColor(minColor, maxColor, minTemp, maxTemp, thisTemp);
  return thisColor;
}
