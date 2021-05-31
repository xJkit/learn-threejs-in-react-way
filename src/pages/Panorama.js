import * as THREE from 'three';
import { VStack, Box, Text } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Panorama() {
  return (
    <VStack w="100%" h="100%" alignItems="stretch">
      <Text>Panorama Effect</Text>
      <Box flex={1}>
        <Canvas>
          <Sphere />
          <OrbitControls />
        </Canvas>
      </Box>
    </VStack>
  );
}

function Sphere() {
  return (
    <mesh>
      <sphereGeometry args={[10, 30, 30]} />
      <meshBasicMaterial side={THREE.DoubleSide} />
    </mesh>
  );
}
