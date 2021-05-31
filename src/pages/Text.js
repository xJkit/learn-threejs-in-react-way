import { Suspense } from 'react';
import * as THREE from 'three';
import { VStack, Box, Text as CKText } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls, useTexture } from '@react-three/drei';
import { useControls } from 'leva';
import _find from 'lodash/find';

const WEB_FONTS = [
  {
    label: 'Comic Nene',
    url: 'fonts/comic-neue-v2-latin-regular.woff',
  },
  {
    label: 'Roboto',
    url: 'fonts/roboto-v27-latin-regular.woff',
  },
  {
    label: 'ACME',
    url: 'fonts/acme-v11-latin-regular.woff',
  },
];

export default function TextDemo() {
  const { fontSize, textColor, textFont } = useControls({
    fontSize: {
      label: 'Font Size',
      value: 2,
      step: 0.1,
    },
    textColor: {
      label: 'Text Color',
      value: '#ffffff',
    },
    textFont: {
      label: 'Font Family',
      options: WEB_FONTS.map((font) => font.label),
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
          <Text
            position={[0, 1, 2]}
            fontSize={fontSize}
            rotation-x={(-1 / 2) * Math.PI}
            color={textColor}
            font={_find(WEB_FONTS, (font) => font.label === textFont).url}
          >
            Text without Material
          </Text>
          <Suspense fallback={null}>
            <WoodenText
              fontSize={fontSize}
              color={textColor}
              font={_find(WEB_FONTS, (font) => font.label === textFont).url}
            />
          </Suspense>
          <gridHelper />
          <OrbitControls />
        </Canvas>
      </Box>
    </VStack>
  );
}

function WoodenText({ fontSize, color, font }) {
  const texture = useTexture('texture-wood.jpg');
  return (
    <Text
      position={[0, 1, -2]}
      rotation-x={(-1 / 2) * Math.PI}
      fontSize={fontSize}
      font={font}
    >
      <meshMatcapMaterial
        attach="material"
        color={color}
        // map={texture}
        matcap={texture}
        side={THREE.DoubleSide}
      />
      Text with Material
    </Text>
  );
}
