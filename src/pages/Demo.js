import { useRef, useMemo, Fragment, useCallback, Suspense } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useHelper, useTexture } from '@react-three/drei';
import { useControls, folder } from 'leva';

import metalTextures from '../assets/metal-textures.jpg';
import * as THREE from 'three';

const MATERIAL_KIND = {
  basic: 'basic',
  normal: 'normal',
  depth: 'depth',
  line: 'line',
  points: 'points',
  lambert: 'lambert',
  phong: 'phong',
  standard: 'standard',
};

export default function Demo() {
  const {
    backgroundColor,
    isAxesHelper,
    isGridHelper,
    oscillation,
    followed,
    showGround,
    groundPlaneColor,
    materialKind,
    materialColor: color,
    emissiveColor,
    emissiveIntensity,
    isDoubleSide,
    opacity,
    isRotate,
    shininess,
    specular,
    metalness,
    roughness,
    lightColor,
    lightIntensity,
    ambient: ambientLight,
    hemisphere: hemisphereLight,
    skyColor,
    groundColor,
    directional: directionalLight,
    directionalHelper,
    directionalPosition,
    point: pointLight,
    pointPosition,
    pointHelper,
    spot: spotLight,
    spotPosition,
    spotHelper,
    spotDistance,
    spotAngle,
    penumbra,
    decay,
  } = useControls({
    backgroundColor: {
      label: 'Background',
      value: '#111111',
    },
    isAxesHelper: {
      label: 'Axes',
      value: true,
    },
    isGridHelper: {
      label: 'Grid',
      value: true,
    },
    oscillation: {
      label: 'Oscillation',
      value: true,
    },
    isRotate: {
      label: 'Rotation',
      value: true,
    },
    followed: {
      label: 'Camera Lock',
      value: false,
    },
    Ground: folder({
      showGround: {
        label: 'Display',
        value: true,
      },
      groundPlaneColor: {
        label: 'Color',
        value: '#218550',
        render: (get) => get('Ground.showGround'),
      },
    }),
    Object: folder({
      materialKind: {
        label: 'Kind',
        value: MATERIAL_KIND.standard,
        options: {
          'Basic Material': MATERIAL_KIND.basic,
          'Normal Material': MATERIAL_KIND.normal,
          'Depth Material': MATERIAL_KIND.depth,
          'Line Material': MATERIAL_KIND.line,
          'Points Material': MATERIAL_KIND.points,
          'Lambert Material': MATERIAL_KIND.lambert,
          'Phong Material': MATERIAL_KIND.phong,
          'Standard Material': MATERIAL_KIND.standard,
        },
      },
      materialColor: {
        label: 'Color',
        value: '#aaa123',
        render: (get) => get('Object.materialKind') !== MATERIAL_KIND.normal,
      },
      opacity: {
        label: 'Opacity',
        value: 1,
        min: 0,
        max: 1,
        step: 0.1,
      },
      emissiveColor: {
        label: 'Emissive',
        value: '#ffffff',
        render: (get) => get('Object.materialKind') === MATERIAL_KIND.lambert,
      },
      emissiveIntensity: {
        label: 'Intensity',
        value: 0,
        min: 0,
        max: 5,
        step: 0.1,
        render: (get) => get('Object.materialKind') === MATERIAL_KIND.lambert,
      },
      isDoubleSide: {
        label: 'DoubleSided',
        value: false,
        render: (get) => get('Object.materialKind') === MATERIAL_KIND.lambert,
      },
      shininess: {
        label: 'Shininess',
        value: 30,
        min: 0,
        max: 100,
        render: (get) => get('Object.materialKind') === MATERIAL_KIND.phong,
      },
      specular: {
        label: 'Specular',
        value: '#111111',
        render: (get) => get('Object.materialKind') === MATERIAL_KIND.phong,
      },
      metalness: {
        label: 'Metalness',
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        render: (get) => get('Object.materialKind') === MATERIAL_KIND.standard,
      },
      roughness: {
        label: 'Roughness',
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        render: (get) => get('Object.materialKind') === MATERIAL_KIND.standard,
      },
    }),
    Lights: folder({
      lightColor: {
        label: 'Color',
        value: '#ee6b6b',
      },
      lightIntensity: { label: 'Intensity', value: 8, min: 0, max: 10 },
      'Spot Light': folder({
        spot: {
          label: 'Turn On',
          value: true,
        },
        spotHelper: {
          label: 'Helper',
          value: true,
          render: (get) => get('Lights.Spot Light.spot'),
        },
        spotPosition: {
          label: 'Position',
          value: [0, 0], // (x, z)
          step: 0.5,
          render: (get) => get('Lights.Spot Light.spot'),
        },
        spotDistance: {
          label: 'Distance',
          value: 3,
          render: (get) => get('Lights.Spot Light.spot'),
        },
        spotAngle: {
          label: 'Angle',
          value: (1 / 6) * Math.PI,
          step: 0.1 * Math.PI,
          min: 0,
          max: 2 * Math.PI,
          render: (get) => get('Lights.Spot Light.spot'),
        },
        penumbra: {
          label: 'Penumbra',
          value: 0.1,
          step: 0.1,
          min: 0,
          max: 1,
          render: (get) => get('Lights.Spot Light.spot'),
        },
        decay: {
          label: 'Decay',
          value: 0.1,
          step: 0.1,
          min: 0,
          max: 1,
          render: (get) => get('Lights.Spot Light.spot'),
        },
      }),
      'Ambient Light': folder({
        ambient: {
          label: 'Turn On',
          value: false,
        },
      }),
      'Hemisphere Light': folder({
        hemisphere: {
          label: 'Turn On',
          value: false,
        },
        skyColor: {
          label: 'Sky Color',
          value: '#333888',
          render: (get) => get(`Lights.Hemisphere Light.hemisphere`),
        },
        groundColor: {
          label: 'Ground Color',
          value: '#aaaaaa',
          render: (get) => get('Lights.Hemisphere Light.hemisphere'),
        },
      }),
      'Directional Light': folder({
        directional: {
          label: 'Turn On',
          value: false,
        },
        directionalHelper: {
          label: 'Helper',
          value: true,
          render: (get) => get('Lights.Directional Light.directional'),
        },
        directionalPosition: {
          label: 'Position',
          value: [0, 0], // (x, z)
          step: 0.5,
          render: (get) => get('Lights.Directional Light.directional'),
        },
      }),
      'Point Line': folder({
        point: {
          label: 'Turn On',
          value: false,
        },
        pointHelper: {
          label: 'Helper',
          value: true,
          render: (get) => get('Lights.Point Line.point'),
        },
        pointPosition: {
          label: 'Position',
          value: [0, 0], // (x, z)
          step: 0.5,
          render: (get) => get('Lights.Point Line.point'),
        },
      }),
    }),
  });
  const lights = useMemo(() => {
    return [
      ambientLight && [
        'Ambient Light',
        'illuminate everywhere in the same level (does not come from a specific direction).',
      ],
      hemisphereLight && [
        'Hemisphere Light',
        'A light source positioned directly above the scene just like the sky light, with color fading from the sky color to the ground color. This light cannot be used to cast shadows.',
      ],
      directionalLight && [
        'Directional Light',
        'A light that gets emitted in a specific direction. This light will behave as though it is infinitely far away and the rays produced from it are all parallel. The common use case for this is to simulate daylight; the sun is far enough away that its position can be considered to be infinite, and all light rays coming from it are parallel.',
      ],
      pointLight && [
        'Point Light',
        'A light that gets emitted from a single point in all directions. A common use case for this is to replicate the light emitted from a bare lightbulb.',
      ],
      spotLight && ['Spot Light', 'A light comes from a single point.'],
    ].filter(Boolean);
  }, [ambientLight, hemisphereLight, directionalLight, pointLight, spotLight]);
  const targetRef = useRef();
  const controlRef = useRef();
  return (
    <VStack w="100%" h="100%" alignItems="flex-start">
      <TitleDescription kind={materialKind} lights={lights} />
      <Box w="100%" flex={1}>
        <Canvas
          shadows
          camera={{
            position: [2, 2, 2],
          }}
          onCreated={(state) => {
            state.scene.background = new THREE.Color(backgroundColor);
          }}
        >
          <Config
            backgroundColor={backgroundColor}
            followed={followed}
            targetRef={targetRef}
            controlRef={controlRef}
          />
          <Suspense fallback={null}>
            <Donut
              donutRef={targetRef}
              oscillation={oscillation}
              kind={materialKind}
              color={color}
              emissiveColor={emissiveColor}
              emissiveIntensity={emissiveIntensity}
              opacity={opacity}
              isDoubleSide={isDoubleSide}
              isRotate={isRotate}
              shineness={shininess}
              specular={specular}
              metalness={metalness}
              roughness={roughness}
            />
          </Suspense>
          {showGround && <Plane color={groundPlaneColor} />}
          <Lights
            ambientLight={ambientLight}
            hemisphereLight={hemisphereLight}
            directionalLight={directionalLight}
            pointLight={pointLight}
            pointPosition={pointPosition}
            pointHelper={pointHelper}
            spotLight={spotLight}
            spotPosition={spotPosition}
            spotHelper={spotHelper}
            spotDistance={spotDistance}
            spotAngle={spotAngle}
            penumbra={penumbra}
            decay={decay}
            directionalHelper={directionalHelper}
            directionalPosition={directionalPosition}
            lightColor={lightColor}
            lightIntensity={lightIntensity}
            skyColor={skyColor}
            groundColor={groundColor}
          />
          {isAxesHelper && <axesHelper />}
          {isGridHelper && <gridHelper />}
          {!followed && <OrbitControls ref={controlRef} />}
        </Canvas>
      </Box>
    </VStack>
  );
}

function TitleDescription({ kind, lights = [] }) {
  const [title, description] = {
    [MATERIAL_KIND.basic]: [
      'Basic Materials',
      'Uniform color on the geometry surfaces',
    ],
    [MATERIAL_KIND.normal]: [
      'Normal Materials',
      'A material that maps the normal vectors to RGB colors',
    ],
    [MATERIAL_KIND.depth]: [
      'Depth Materials',
      'color based on the distance from camera: closer gets darker, further gets lighter',
    ],
    [MATERIAL_KIND.line]: [
      'Line Materials',
      'Only show the outline of the shape',
    ],
    [MATERIAL_KIND.points]: [
      'Points Materials',
      'Only show the points outline of the shape',
    ],
    [MATERIAL_KIND.lambert]: [
      'Lambert Materials',
      'Light sensitive material which simulates the Lambertian Reflection',
    ],
    [MATERIAL_KIND.phong]: [
      'Phong Materials',
      'A material for shinny surfaces with specular effects',
    ],
    [MATERIAL_KIND.standard]: [
      'Standard Materials',
      'A material uses a metalic-roughness model to simulate real material',
    ],
  }[kind];

  return (
    <VStack
      maxWidth="600px"
      spacing={3}
      color="blue.800"
      alignItems="flex-start"
      fontWeight="bold"
    >
      <Text fontSize="2xl">{title}</Text>
      <Text>{description}</Text>
      {lights.map(([title, description], idx) => (
        <Fragment key={idx}>
          <Text fontSize="2xl">{title}</Text>
          <Text>{description}</Text>
        </Fragment>
      ))}
    </VStack>
  );
}

function Config({ backgroundColor, followed, targetRef }) {
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  scene.background = new THREE.Color(backgroundColor);
  const followCamera = useCallback(() => {
    if (followed && targetRef.current) {
      camera.lookAt(targetRef.current.position);
      // controlRef.current.update();
    }
  }, [followed, targetRef, camera]);
  useFrame(followCamera);
  return null;
}

function Lights({
  ambientLight,
  hemisphereLight,
  directionalLight,
  directionalHelper,
  directionalPosition,
  pointLight,
  pointHelper,
  pointPosition,
  spotLight,
  spotPosition,
  spotHelper,
  spotDistance,
  penumbra,
  decay,
  spotAngle,
  lightColor,
  lightIntensity,
  skyColor,
  groundColor,
}) {
  const directionalLightRef = useRef();
  const pointLightRef = useRef();
  const spotLightRef = useRef();
  useHelper(
    directionalHelper && directionalLightRef,
    THREE.DirectionalLightHelper
  );
  useHelper(pointHelper && pointLightRef, THREE.PointLightHelper);
  useHelper(spotHelper && spotLightRef, THREE.SpotLightHelper);

  return (
    <>
      {ambientLight && (
        <ambientLight color={lightColor} intensity={lightIntensity} />
      )}
      {hemisphereLight && (
        <hemisphereLight
          intensity={lightIntensity}
          skyColor={skyColor}
          groundColor={groundColor}
        />
      )}
      {directionalLight && (
        <directionalLight
          castShadow
          position={[directionalPosition[0], 1.5, directionalPosition[1]]}
          ref={directionalLightRef}
          color={lightColor}
          intensity={lightIntensity}
        />
      )}
      {pointLight && (
        <pointLight
          castShadow
          ref={pointLightRef}
          color={lightColor}
          position={[pointPosition[0], 0.5, pointPosition[1]]}
          intensity={lightIntensity}
          distance={10}
        />
      )}
      {spotLight && (
        <spotLight
          castShadow
          ref={spotLightRef}
          color={lightColor}
          position={[spotPosition[0], 2, spotPosition[1]]}
          intensity={lightIntensity}
          distance={spotDistance}
          angle={spotAngle}
          penumbra={penumbra}
          decay={decay}
        />
      )}
    </>
  );
}

function Donut({
  donutRef,
  kind,
  oscillation,
  color,
  emissiveColor,
  emissiveIntensity,
  opacity,
  isDoubleSide,
  isRotate,
  shininess,
  specular,
  metalness,
  roughness,
}) {
  let angle = 0;
  useFrame(() => {
    if (donutRef.current) {
      if (oscillation) {
        donutRef.current.position.y = Math.sin(angle);
      }
      if (isRotate) {
        donutRef.current.rotation.x = angle;
      }
      angle += 0.01;
    }
  });
  const texture = useTexture(metalTextures);
  if ([MATERIAL_KIND.line].includes(kind)) {
    return (
      <line ref={donutRef} rotation-x={(-30 / 180) * Math.PI}>
        <torusGeometry args={[0.5, 0.2, 30, 30]} />
        <lineBasicMaterial color={color} linewidth={1} />
      </line>
    );
  }
  if ([MATERIAL_KIND.points].includes(kind)) {
    return (
      <points ref={donutRef} rotation-x={(-30 / 180) * Math.PI}>
        <torusGeometry args={[0.5, 0.2, 30, 30]} />
        <pointsMaterial color={color} size={0.01} />
      </points>
    );
  }
  return (
    <mesh
      ref={donutRef}
      rotation-x={(-30 / 180) * Math.PI}
      castShadow
      receiveShadow
    >
      <torusGeometry args={[0.5, 0.2, 30, 30]} />
      {{
        [MATERIAL_KIND.basic]: (
          <meshBasicMaterial
            color={color}
            opacity={opacity}
            transparent={opacity}
            map={texture}
          />
        ),
        [MATERIAL_KIND.normal]: (
          <meshNormalMaterial opacity={opacity} transparent={opacity !== 1} />
        ),
        [MATERIAL_KIND.depth]: (
          <meshDepthMaterial
            color={color}
            opacity={opacity}
            transparent={opacity}
            map={texture}
          />
        ),
        [MATERIAL_KIND.lambert]: (
          <meshLambertMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            side={isDoubleSide ? THREE.DoubleSide : THREE.FrontSide}
            opacity={opacity}
            transparent={opacity !== 1}
            map={texture}
          />
        ),
        [MATERIAL_KIND.phong]: (
          <meshPhongMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            side={isDoubleSide ? THREE.DoubleSide : THREE.FrontSide}
            shininess={shininess} // default 30
            specular={specular}
            opacity={opacity}
            transparent={opacity !== 1}
            map={texture}
          />
        ),
        [MATERIAL_KIND.standard]: (
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            side={isDoubleSide ? THREE.DoubleSide : THREE.FrontSide}
            metalness={metalness}
            roughness={roughness}
            opacity={opacity}
            transparent={opacity !== 1}
            map={texture}
          />
        ),
      }[kind] || null}
    </mesh>
  );
}

function Plane({ color }) {
  return (
    <mesh receiveShadow rotation-x={(-90 / 180) * Math.PI}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
