import { Suspense } from 'react';
import * as THREE from 'three';
import { VStack, Box, Text as CKText } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls, useTexture } from '@react-three/drei';
import { useControls } from 'leva';

export default function TextDemo() {
  const { fontSize, textColor } = useControls({
    fontSize: {
      label: 'Font Size',
      value: 2,
      step: 0.1,
    },
    textColor: {
      label: 'Text Color',
      value: '#ffffff',
    },
  });
  return (
    <VStack w="100%" h="100%" alignItems="stretch">
      <CKText>Text Demo</CKText>
      <Box flex={1}>
        <Canvas
          camera={{
            position: [5, 10, 10],
          }}
          onCreated={(state) => {
            state.scene.background = new THREE.Color(0x222222);
          }}
        >
          <Text position={[0, 0, 2]} fontSize={fontSize} color={textColor}>
            Text without Material
          </Text>
          <Suspense fallback={null}>
            <WoodenText fontSize={fontSize} textColor={textColor} />
          </Suspense>
          <gridHelper />
          <OrbitControls />
        </Canvas>
      </Box>
    </VStack>
  );
}

function WoodenText({ fontSize, textColor }) {
  const texture = useTexture('texture-wood.jpg');
  return (
    <Text position={[0, 0, -2]} fontSize={fontSize}>
      <meshMatcapMaterial
        attach="material"
        color={textColor}
        // map={texture}
        matcap={texture}
        side={THREE.DoubleSide}
      />
      Text with Material
    </Text>
  );
}
