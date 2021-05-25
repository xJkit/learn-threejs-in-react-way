import { useRef, useMemo, Fragment, useCallback } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei';
import { useControls, folder } from 'leva';
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

export default function Basic() {
  const {
    背景色: backgroundColor,
    軸線輔助: isAxesHelper,
    格線輔助: isGridHelper,
    震盪: oscillation,
    相機鎖定: followed,
    材質選擇: materialKind,
    發光光顏色: emissiveColor,
    發光強度: emissiveIntensity,
    打開雙面: isDoubleSide,
    顏色: color,
    半透明: isTransparent,
    旋轉: isRotate,
    光澤: shininess,
    光澤色: specular,
    金屬程度: metalness,
    粗糙程度: roughness,
    照明色溫: lightColor,
    光線強度: lightIntensity,
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
    背景色: '#111111',
    軸線輔助: true,
    格線輔助: true,
    震盪: true,
    旋轉: true,
    相機鎖定: false,
    材質參數: folder({
      材質選擇: {
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
      顏色: {
        label: '顏色!',
        value: '#aaa123',
        render: (get) => get('材質參數.材質選擇') !== MATERIAL_KIND.normal,
      },
      半透明: {
        value: true,
        render: (get) => {
          return [
            MATERIAL_KIND.basic,
            MATERIAL_KIND.normal,
            MATERIAL_KIND.depth,
          ].includes(get('材質參數.材質選擇'));
        },
      },
      發光顏色: {
        value: '#ffffff',
        render: (get) => get('材質參數.材質選擇') === MATERIAL_KIND.lambert,
      },
      發光強度: {
        value: 0,
        min: 0,
        max: 5,
        step: 0.1,
        render: (get) => get('材質參數.材質選擇') === MATERIAL_KIND.lambert,
      },
      打開雙面: {
        value: false,
        render: (get) => get('材質參數.材質選擇') === MATERIAL_KIND.lambert,
      },
      光澤: {
        value: 30,
        min: 0,
        max: 100,
        render: (get) => get('材質參數.材質選擇') === MATERIAL_KIND.phong,
      },
      色澤: {
        value: '#111111',
        render: (get) => get('材質參數.材質選擇') === MATERIAL_KIND.phong,
      },
      金屬程度: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        render: (get) => get('材質參數.材質選擇') === MATERIAL_KIND.standard,
      },
      粗糙程度: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        render: (get) => get('材質參數.材質選擇') === MATERIAL_KIND.standard,
      },
    }),
    光線參數: folder({
      照明色溫: {
        value: '#ee2d2d',
      },
      光線強度: { value: 8, min: 0, max: 10 },
      ambient: false,
      hemisphere: false,
      skyColor: {
        value: '#333888',
        render: (get) => get('光線參數.hemisphere'),
      },
      groundColor: {
        value: '#aaaaaa',
        render: (get) => get('光線參數.hemisphere'),
      },
      directional: false,
      directionalHelper: {
        value: true,
        render: (get) => get('光線參數.directional'),
      },
      directionalPosition: {
        value: [0, 0], // (x, z)
        step: 0.5,
        render: (get) => get('光線參數.directional'),
      },
      point: false,
      pointHelper: {
        value: true,
        render: (get) => get('光線參數.point'),
      },
      pointPosition: {
        value: [0, 0], // (x, z)
        step: 0.5,
        render: (get) => get('光線參數.point'),
      },
      spot: true,
      spotHelper: {
        value: true,
        render: (get) => get('光線參數.spot'),
      },
      spotPosition: {
        value: [0, 0], // (x, z)
        step: 0.5,
        render: (get) => get('光線參數.spot'),
      },
      spotDistance: {
        value: 3,
        render: (get) => get('光線參數.spot'),
      },
      spotAngle: {
        value: (1 / 6) * Math.PI,
        step: 0.1 * Math.PI,
        min: 0,
        max: 2 * Math.PI,
        render: (get) => get('光線參數.spot'),
      },
      penumbra: {
        value: 0.1,
        step: 0.1,
        min: 0,
        max: 1,
        render: (get) => get('光線參數.spot'),
      },
      decay: {
        value: 0.1,
        step: 0.1,
        min: 0,
        max: 1,
        render: (get) => get('光線參數.spot'),
      },
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
    <VStack w="100%" h="100%">
      <TitleDescription kind={materialKind} lights={lights} />
      <Box w="100%" flex={1}>
        <Canvas
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
          <Donut
            donutRef={targetRef}
            oscillation={oscillation}
            kind={materialKind}
            color={color}
            emissiveColor={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            isTransparent={isTransparent}
            isDoubleSide={isDoubleSide}
            isRotate={isRotate}
            shineness={shininess}
            specular={specular}
            metalness={metalness}
            roughness={roughness}
          />
          <Plane />
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
    <VStack maxW="500px" spacing={3}>
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
          position={[directionalPosition[0], 1.5, directionalPosition[1]]}
          ref={directionalLightRef}
          color={lightColor}
          intensity={lightIntensity}
        />
      )}
      {pointLight && (
        <pointLight
          ref={pointLightRef}
          color={lightColor}
          position={[pointPosition[0], 0.5, pointPosition[1]]}
          intensity={lightIntensity}
          distance={10}
        />
      )}
      {spotLight && (
        <spotLight
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
  isTransparent,
  isDoubleSide,
  isRotate,
  shininess,
  specular,
  metalness,
  roughness,
}) {
  const opacity = isTransparent ? 0.8 : 1;
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
            transparent={isTransparent}
          />
        ),
        [MATERIAL_KIND.normal]: (
          <meshNormalMaterial opacity={opacity} transparent={isTransparent} />
        ),
        [MATERIAL_KIND.depth]: (
          <meshDepthMaterial
            color={color}
            opacity={opacity}
            transparent={isTransparent}
          />
        ),
        [MATERIAL_KIND.lambert]: (
          <meshLambertMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            side={isDoubleSide ? THREE.DoubleSide : THREE.FrontSide}
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
          />
        ),
      }[kind] || null}
    </mesh>
  );
}

function Plane() {
  return (
    <mesh rotation-x={(-90 / 180) * Math.PI}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial color="blue" metalness={0.5} roughness={0} />
    </mesh>
  );
}
