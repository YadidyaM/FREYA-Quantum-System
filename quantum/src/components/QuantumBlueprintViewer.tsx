import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { Blueprint, QubitConfig } from './QuantumBlueprint';

interface QubitMeshProps {
  qubit: QubitConfig;
  position: [number, number, number];
}

const QubitMesh: React.FC<QubitMeshProps> = ({ qubit, position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useHelper(glowRef, THREE.PointLightHelper, 0.5);

  useFrame((state) => {
    if (meshRef.current) {
      // Quantum state rotation
      meshRef.current.rotation.x += 0.01 * (1 - qubit.errorRate);
      meshRef.current.rotation.y += 0.01 * (qubit.coherenceTime / 100);

      // Simulate quantum coherence with scale pulsing
      const time = state.clock.getElapsedTime();
      const coherenceFactor = Math.sin(time * 2) * 0.1 * (qubit.coherenceTime / 100) + 1;
      meshRef.current.scale.setScalar(coherenceFactor);
    }
  });

  const getQubitColor = (type: string): string => {
    switch (type) {
      case 'superconducting':
        return '#3B82F6'; // blue
      case 'ion-trap':
        return '#10B981'; // emerald
      case 'photonic':
        return '#8B5CF6'; // purple
      default:
        return '#6B7280'; // gray
    }
  };

  const getQubitEmissive = (type: string): string => {
    switch (type) {
      case 'superconducting':
        return '#1D4ED8';
      case 'ion-trap':
        return '#059669';
      case 'photonic':
        return '#6D28D9';
      default:
        return '#4B5563';
    }
  };

  return (
    <group position={position}>
      {/* Quantum state sphere */}
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={getQubitColor(qubit.type)}
          emissive={getQubitEmissive(qubit.type)}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
          envMapIntensity={1}
        />
      </mesh>

      {/* Coherence field visualization */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshPhysicalMaterial
          color={getQubitColor(qubit.type)}
          transparent
          opacity={0.1}
          metalness={0}
          roughness={1}
        />
      </mesh>

      {/* Qubit glow effect */}
      <pointLight
        ref={glowRef}
        color={getQubitColor(qubit.type)}
        intensity={2}
        distance={3}
      />

      {/* Qubit label */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {qubit.id}
      </Text>

      {/* Error rate indicator */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[1, 0.1, 0.1]} />
        <meshStandardMaterial color="#CBD5E1" />
      </mesh>
      <mesh position={[-0.5 + (1 - qubit.errorRate) * 0.5, -0.8, 0]}>
        <boxGeometry args={[(1 - qubit.errorRate) * 1, 0.1, 0.1]} />
        <meshStandardMaterial color={getQubitColor(qubit.type)} />
      </mesh>
    </group>
  );
};

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  strength: number;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ start, end, strength }) => {
  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (lineRef.current) {
      // Quantum entanglement visualization
      const time = state.clock.getElapsedTime();
      const wave = Math.sin(time * 4) * 0.2;
      lineRef.current.material.opacity = 0.3 + wave * strength;
    }
  });

  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial
        color="#94A3B8"
        transparent
        opacity={0.3}
        linewidth={1}
      />
    </line>
  );
};

interface QuantumBlueprintViewerProps {
  blueprint: Blueprint;
}

const QuantumBlueprintViewer: React.FC<QuantumBlueprintViewerProps> = ({ blueprint }) => {
  const calculateQubitPositions = () => {
    const positions: Record<string, [number, number, number]> = {};
    const layerHeight = 2; // Reduced from 4 to bring layers closer together
    
    blueprint.qubits.forEach((qubit, index) => {
      const layerOffset = qubit.layer === 'quantum' ? 0 :
                         qubit.layer === 'control' ? layerHeight :
                         layerHeight * 2;
      
      let radius = 3;
      let angle = 0;

      switch (blueprint.architecture) {
        case 'linear':
          radius = index * 2;
          angle = 0;
          break;
        case 'grid':
          radius = Math.sqrt(index + 1) * 2;
          angle = (index * Math.PI * 2) / blueprint.qubits.length;
          break;
        case 'modular':
          radius = 3;
          angle = (index * Math.PI * 2) / blueprint.qubits.length;
          break;
      }
      
      positions[qubit.id] = [
        Math.cos(angle) * radius,
        layerOffset,
        Math.sin(angle) * radius
      ];
    });
    
    return positions;
  };

  const qubitPositions = calculateQubitPositions();

  return (
    <div className="w-full h-[400px] bg-white rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }} // Adjusted camera position and field of view
        shadows
      >
        <color attach="background" args={['white']} />
        <fog attach="fog" args={['white', 20, 30]} />
        
        <ambientLight intensity={0.8} /> {/* Increased ambient light intensity */}
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.2} // Increased light intensity
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />

        {/* Render quantum plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -2, 0]}> {/* Lowered the plane */}
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color="#F8FAFC"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>

        {/* Render qubits */}
        {blueprint.qubits.map((qubit) => (
          <QubitMesh
            key={qubit.id}
            qubit={qubit}
            position={qubitPositions[qubit.id]}
          />
        ))}

        {/* Render quantum connections */}
        {blueprint.qubits.map((qubit, index) => {
          if (index === 0) return null;
          const prevQubit = blueprint.qubits[index - 1];
          const connectionStrength = 1 - (qubit.errorRate + prevQubit.errorRate) / 2;
          return (
            <ConnectionLine
              key={`${prevQubit.id}-${qubit.id}`}
              start={qubitPositions[prevQubit.id]}
              end={qubitPositions[qubit.id]}
              strength={connectionStrength}
            />
          );
        })}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3} // Reduced minimum distance
          maxDistance={15}
          target={[0, 0, 0]} // Set the target to the center
        />
      </Canvas>
    </div>
  );
};

export default QuantumBlueprintViewer;