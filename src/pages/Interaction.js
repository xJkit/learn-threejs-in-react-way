import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Box } from '@chakra-ui/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useHelper } from '@react-three/drei';

export default function Interaction() {
  return (
    <Box w="100%" h="100%">
      <Canvas
        camera={{
          position: [8, 8, -4],
        }}
        onCreated={(state) => {
          state.scene.background = new THREE.Color(0xaaaaaa);
        }}
      >
        <gridHelper />
        <Ball />
        <Light />
        {/* <OrbitControls /> */}
      </Canvas>
    </Box>
  );
}

function Ball() {
  const ballRef = useRef();
  const posX = useRef(0);
  const posZ = useRef(0);
  useFrame((state) => {
    ballRef.current.position.x = posX.current;
    ballRef.current.position.z = posZ.current;
    // state.camera.lookAt(ballRef.current.position);
  });

  const handleInteraction = useCallback((evt) => {
    // console.log(evt.key);
    switch (evt.key) {
      case 'ArrowUp':
        posX.current -= 1;
        break;
      case 'ArrowDown':
        posX.current += 1;
        break;
      case 'ArrowRight':
        posZ.current -= 1;
        break;
      case 'ArrowLeft':
        posZ.current += 1;
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleInteraction, false);
    return () => document.removeEventListener('keydown', handleInteraction);
  }, [handleInteraction]);

  return (
    <mesh ref={ballRef} position={[posX.current, 1, posZ.current]}>
      <sphereGeometry args={[1, 30, 30]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Light(props) {
  const directionLightRef = useRef();
  useHelper(directionLightRef, THREE.DirectionalLightHelper);
  return (
    <directionalLight
      position={[10, 10, 10]}
      ref={directionLightRef}
      {...props}
    />
  );
}
