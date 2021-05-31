import { Suspense } from 'react';
import * as THREE from 'three';
import { VStack, Box, Text } from '@chakra-ui/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

import city from '../assets/panorama-city.jpg';

export default function Panorama() {
  return (
    <VStack w="100%" h="100%" alignItems="stretch">
      <Text fontSize="4xl" fontWeight="bold">
        Panorama Effect
      </Text>
      <Box flex={1}>
        <Canvas>
          <Suspense fallback={null}>
            <Sphere />
          </Suspense>
        </Canvas>
      </Box>
    </VStack>
  );
}

function Sphere() {
  const texture = useTexture(city);
  useFrame((state) => {
    state.camera.rotation.y += 0.001;
  });
  return (
    <mesh>
      <sphereGeometry args={[20, 100, 100]} />
      <meshBasicMaterial side={THREE.DoubleSide} map={texture} />
    </mesh>
  );
}
