'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Command, Vertex } from '@/types/command';
import { BaseColorizer, ColorizerFactory, ColorizerType } from '@/services/colorizers';

interface GCodeViewerProps {
  commands: Command[];
  colorizerType: ColorizerType; // Required - no default
  minColor: string;
  maxColor: string;
  lightNominalWidth: number;
  lightWidthStandardDeviation: number;
  darkNominalWidth: number;
  darkWidthStandardDeviation: number;
  transitionNominalWidth: number;
  transitionStandardDeviation: number;
  seed: number;
  cameraVertex: Vertex;
  lookAtVertex: Vertex;
}

export default function GCodeViewer({ 
  commands, 
  colorizerType, 
  minColor, 
  maxColor, 
  lightNominalWidth,
  lightWidthStandardDeviation,
  darkNominalWidth,
  darkWidthStandardDeviation,
  transitionNominalWidth,
  transitionStandardDeviation,
  seed,
  cameraVertex, 
  lookAtVertex 
}: GCodeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const renderedPathsRef = useRef<number[]>([]);
  const colorizerRef = useRef<BaseColorizer>(ColorizerFactory.createColorizer(colorizerType));

  // Effect for initial setup of scene, camera, renderer, and controls
  useEffect(() => {
    //console.log("GCodeViewer useEffect called");
    if (!containerRef.current) {
      //console.log('Container ref not available');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Calculate bounds
    const bounds = new THREE.Box3();
    commands.forEach(command => {
      if (command.toolPath) {
        bounds.expandByPoint(new THREE.Vector3(command.toolPath.start.x, command.toolPath.start.y, command.toolPath.start.z));
        bounds.expandByPoint(new THREE.Vector3(command.toolPath.end.x, command.toolPath.end.y, command.toolPath.end.z));
      }
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
  }, [commands, cameraVertex, lookAtVertex]); // Re-run only when paths or initial camera points change

  // Effect for handling colorizer type changes
  useEffect(() => {
    colorizerRef.current = ColorizerFactory.createColorizer(colorizerType);
  }, [colorizerType]);

  // Effect for creating the optimized geometry (only when toolPaths change)
  useEffect(() => {
    console.log("GCodeViewer geometry creation useEffect called");
    if (!sceneRef.current) {
      console.log('Scene ref not initialized for geometry creation');
      return;
    }

    // Remove old geometry and mesh
    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      (meshRef.current.material as THREE.Material).dispose();
    }
    if (geometryRef.current) {
      geometryRef.current.dispose();
    }

    // Create optimized geometry with all paths in a single buffer
    const pathWidth = 0.2;
    const pathHeight = 0.4;
    
    // Pre-allocate arrays for better performance
    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    
    let vertexIndex = 0;
    let indexOffset = 0;
    const renderedPaths: number[] = []; // Track which paths are actually rendered

    // Calculate the min and max Z values for color mapping
    var provisionalMinZ: number | undefined = undefined;
    var provisionalMaxZ: number | undefined = undefined;
    commands.forEach((command) => {
      if (command.toolPath) {
        if (provisionalMinZ === undefined || command.toolPath.start.z < provisionalMinZ) {
          provisionalMinZ = command.toolPath.start.z;
        }
        if (provisionalMaxZ === undefined || command.toolPath.start.z > provisionalMaxZ) {
          provisionalMaxZ = command.toolPath.start.z;
        }
      }
    });
    if (provisionalMinZ === undefined || provisionalMaxZ === undefined) {
      provisionalMinZ = 0;
      provisionalMaxZ = 1;
    }
    const minZ = provisionalMinZ!;
    const maxZ = provisionalMaxZ!;

    const minColorInt = parseInt(minColor.slice(1), 16);
    const maxColorInt = parseInt(maxColor.slice(1), 16);

    // Create box geometry for each path and merge into single buffer
    commands.forEach((command, pathIndex) => {
      if (command.toolPath && command.toolPath.isExtrusion) {
        const start = new THREE.Vector3(-command.toolPath.start.x + 128, command.toolPath.start.z, -command.toolPath.start.y + 128);
        const end = new THREE.Vector3(-command.toolPath.end.x + 128, command.toolPath.end.z, -command.toolPath.end.y + 128);
        //const start = new THREE.Vector3(command.toolPath.start.x, command.toolPath.start.y, command.toolPath.start.z);
        //const end = new THREE.Vector3(command.toolPath.end.x, command.toolPath.end.y, command.toolPath.end.z);
      
        // Calculate the direction and length of the path
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        direction.normalize();

        // Skip very short paths to reduce geometry
        if (length < 0.01) {
          //console.log(`Skipping short path ${pathIndex}, length: ${length}`);
          return;
        }

        // Track that this path is being rendered
        renderedPaths.push(pathIndex);

        // Calculate color for this path (will be updated by colorizer)
        let color = 0x99FF99;

        // Convert hex color to RGB
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;

        // Create a box geometry for this path
        const boxGeometry = new THREE.BoxGeometry(length, pathHeight, pathWidth);
      
        // Create a temporary mesh for transformation
        const tempMesh = new THREE.Mesh(boxGeometry);
      
        // Position at midpoint
        tempMesh.position.copy(start).add(end).multiplyScalar(0.5);
      
        // Look at the end point
        tempMesh.lookAt(end);
      
        // Rotate to align the length with the path direction
        tempMesh.rotateY(Math.PI / 2);
      
        // Update the world matrix
        tempMesh.updateMatrixWorld();
      
        // Extract vertices and transform them
        const positions = boxGeometry.attributes.position.array as Float32Array;
        const boxIndices = boxGeometry.index?.array as Uint16Array;

        // Add vertices for this box
        for (let i = 0; i < positions.length; i += 3) {
          const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
          vertex.applyMatrix4(tempMesh.matrixWorld);
          
          vertices.push(vertex.x, vertex.y, vertex.z);
          colors.push(r / 255, g / 255, b / 255);
        }

        // Add indices for this box
        if (boxIndices) {
          for (let i = 0; i < boxIndices.length; i++) {
            indices.push(boxIndices[i] + indexOffset);
          }
        }

        indexOffset += boxGeometry.attributes.position.count;
        boxGeometry.dispose();
      }
    });

    console.log(`Created geometry with ${renderedPaths.length} rendered paths out of ${commands.length} total paths`);
    console.log(`Total vertices: ${vertices.length / 3}, Total indices: ${indices.length}`);

    // Store the rendered paths for color updates
    renderedPathsRef.current = renderedPaths;

    // Create the combined geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Create material with vertex colors
    const material = new THREE.MeshStandardMaterial({ 
      vertexColors: true,
      roughness: 0.7,
      metalness: 0.2,
      side: THREE.DoubleSide
    });

    // Create the single mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    sceneRef.current.add(mesh);
    geometryRef.current = geometry;
    meshRef.current = mesh;

  }, [commands]); // Only re-run when toolPaths change

  // Effect for updating colors (when colors or accent sliders change)
  useEffect(() => {
    console.log("GCodeViewer color update useEffect called");
    if (!geometryRef.current || !meshRef.current) {
      console.log('No geometry available for color update');
      return;
    }

    const colorAttribute = geometryRef.current.getAttribute('color') as THREE.BufferAttribute;
    if (!colorAttribute) return;

    const colors = colorAttribute.array as Float32Array;
    const renderedPaths = renderedPathsRef.current || [];
    
    // Use the LayerColorizer to calculate colors
    const colorizer = colorizerRef.current;
    const { lineColors } = colorizer.calculateColors({
      commands,
      minColor,
      maxColor,
      lightNominalWidth,
      lightWidthStandardDeviation,
      darkNominalWidth,
      darkWidthStandardDeviation,
      transitionNominalWidth,
      transitionStandardDeviation,
      seed
    });

    let colorIndex = 0;

    // Update colors only for rendered paths
    renderedPaths.forEach((pathIndex: number) => {
      const command = commands[pathIndex];
      if (command.toolPath) {
        // Get color from the colorizer
        const color = lineColors.get(command.lineNumber) || 0x99FF99;

        // Convert hex color to RGB
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;

        // Update colors for all vertices of this path (24 vertices per box)
        for (let i = 0; i < 24; i++) {
          const index = colorIndex * 3;
          if (index + 2 < colors.length) {
            colors[index] = r / 255;
            colors[index + 1] = g / 255;
            colors[index + 2] = b / 255;
          } else {
            console.warn(`Color index ${index} out of bounds for path ${pathIndex}`);
          }
          colorIndex++;
        }
      }
    });

    console.log(`Updated colors for ${renderedPaths.length} paths, total color vertices: ${colorIndex}`);

    // Mark the attribute as needing update
    colorAttribute.needsUpdate = true;

  }, [commands, minColor, maxColor, lightNominalWidth, lightWidthStandardDeviation, darkNominalWidth, darkWidthStandardDeviation, transitionNominalWidth, transitionStandardDeviation, seed, colorizerType]); // Re-run when colors, accent sliders, or colorizer type change

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
