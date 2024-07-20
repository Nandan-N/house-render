import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const Import = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        let loader;

        switch (fileExtension) {
          case 'glb':
          case 'gltf':
            loader = new GLTFLoader();
            break;
          case 'obj':
            loader = new OBJLoader();
            break;
          case 'fbx':
            loader = new FBXLoader();
            break;
          default:
            console.error('Unsupported file format:', fileExtension);
            return;
        }

        if (loader) {
          const onLoad = (model) => {
            const loadedMeshes = [];
            model.scene.traverse((child) => {
              if (child.isMesh) {
                loadedMeshes.push({
                  id: child.id,
                  name: child.name,
                  mesh: child,
                });
              }
            });
            onFileUpload(loadedMeshes);
          };

          if (fileExtension === 'obj') {
            const object = loader.parse(reader.result);
            onLoad({ scene: object });
          } else {
            loader.parse(reader.result, '', onLoad, (error) => {
              console.error(`Error loading ${fileExtension.toUpperCase()} file:`, error);
            });
          }
        }
      };

      if (['glb', 'gltf', 'fbx'].includes(fileExtension)) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="import-container">
      <input type="file" accept=".glb,.gltf,.obj,.fbx" onChange={handleFileChange} />
    </div>
  );
};

export default Import;
