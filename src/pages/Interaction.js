import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Box, VStack, Text } from '@chakra-ui/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useHelper } from '@react-three/drei';

export default function Interaction() {
  return (
    <VStack w="100%" h="100%" alignItems="stretch">
      <Text fontSize="4xl" fontWeight="bold">
        Use Arrow Key to Move the Object
      </Text>
      <Box flex={1}>
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
        </Canvas>
      </Box>
    </VStack>
  );
}

function Ball() {
  const radius = 1;
  const ballRef = useRef();
  const posX = useRef(0);
  const posZ = useRef(0);
  const delta = useRef(0.1);
  useFrame((state) => {
    if (ballRef.current.position.x !== posX.current) {
      ballRef.current.position.x = parseFloat(
        (ballRef.current.position.x + delta.current).toFixed(2)
      );
      ballRef.current.rotation.x += delta.current;
      state.camera.position.x = parseFloat(
        (state.camera.position.x + delta.current).toFixed(2)
      );
    }
    if (ballRef.current.position.z !== posZ.current) {
      ballRef.current.position.z = parseFloat(
        (ballRef.current.position.z + delta.current).toFixed(2)
      );
      ballRef.current.rotation.z += delta.current;
      state.camera.position.z = parseFloat(
        (state.camera.position.z + delta.current).toFixed(2)
      );
    }
  });

  const handleInteraction = useCallback((evt) => {
    switch (evt.key) {
      case 'ArrowUp':
        posX.current -= 1;
        delta.current = -0.1;
        break;
      case 'ArrowDown':
        posX.current += 1;
        delta.current = 0.1;
        break;
      case 'ArrowRight':
        posZ.current -= 1;
        delta.current = -0.1;
        break;
      case 'ArrowLeft':
        posZ.current += 1;
        delta.current = 0.1;
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
      <sphereGeometry args={[radius, 30, 30]} />
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
