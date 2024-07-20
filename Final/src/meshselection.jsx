import React, { useState, useEffect } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { WebGLRenderer } from 'three';

extend({ EffectComposer, RenderPass, OutlinePass });

const MeshSelection = () => {
  const { scene, camera, gl, size } = useThree();
  const [composer] = useState(() => new EffectComposer(gl));
  const [outlinePass] = useState(() => new OutlinePass(size, scene, camera));
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(outlinePass);
  }, [composer, scene, camera]);

  useEffect(() => {
    outlinePass.visibleEdgeColor.set('#ffff00');
  }, [outlinePass]);

  useFrame(() => {
    composer.render();
  }, 1);

  useFrame(({ raycaster, mouse }) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const selected = intersects[0].object;
      if (selected !== selectedObject) {
        setSelectedObject(selected);
        outlinePass.selectedObjects = [selected];
        console.log(`Selected: ${selected.name}`);
      }
    }
  });

  return null;
};

export default MeshSelection;
