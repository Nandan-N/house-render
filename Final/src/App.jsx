import { Canvas } from '@react-three/fiber'
import './App.css'
import { OrbitControls } from '@react-three/drei'
import Scene from './scene'
import React from 'react'
import Import from './import';
import MeshSearch from './meshsearch';

const DraggableMesh = ({ object }) => {
  const [position, setPosition] = useState([0, 0, 0]);
  const bind = useDrag(({ offset: [x, y] }) => {
    setPosition([x, y, 0]);
  });

  return (
    <mesh position={position} {...bind()}>
      <primitive object={object} />
    </mesh>
  );
};


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
  setMeshes(loadedMeshes); // Ensure setMeshes is called here
  console.log('Loaded Meshes:', loadedMeshes); // Debugging line
};


export default function App() {
  return (
    <>
      <div className='scene'>
        <div className='viewport'>
        <Import onFileUpload={handleFileUpload} />
        <Canvas camera={{ position: [2,2,2] }}>
          <ambientLight intensity={0.1} />
          <directionalLight color="red" position={[0, 0, 5]} />
          
          <Scene />
          <OrbitControls />
        </Canvas>
        </div>
      </div> 
    </>
  )
}