import React, { useState } from 'react';
import Import from './import';
import MeshSearch from './meshsearch';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const ImportContainer = () => {
  const [meshes, setMeshes] = useState([]);

  const handleFileUpload = (gltf) => {
    const loadedMeshes = [];
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log('Mesh found:', child); // Debugging line
        loadedMeshes.push({
          id: child.id,
          name: child.name,
          mesh: child
        });
      }
    });
    setMeshes(loadedMeshes);
    console.log('Loaded Meshes:', loadedMeshes); // Debugging line
  };

  const handleMeshSelect = (mesh) => {
    console.log(`Selected Mesh: ${mesh.name}`);
    // Implement mesh highlighting logic here
  };

  const handleGroupSelect = (group) => {
    console.log('Selected Group:', group);
    // Implement group creation logic here
  };

  return (
    <div className="import-container">
      <Import onFileUpload={handleFileUpload} />
      <MeshSearch meshes={meshes} onMeshSelect={handleMeshSelect} onGroupSelect={handleGroupSelect} />
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {meshes.map((mesh) => (
          <primitive key={mesh.id} object={mesh.mesh} />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ImportContainer;
