import { Heading, Box, Text, Link, VStack } from '@chakra-ui/react';

export default function ReadMe() {
  return (
    <Box color="blue.800" w="100%" fontSize="xl">
      <Heading mb={10}>
        Learn Three.js in{' '}
        <Link color="blue.500" href="https://reactjs.org/" target="_blank">
          React
        </Link>{' '}
        way
      </Heading>
      <VStack spacing={5} alignItems="flex-start">
        <Text>
          <Link href="https://threejs.org/" target="_blank" color="blue.500">
            Three.js
          </Link>{' '}
          is an awesome library that makes the Web 3D development a lot easier.
        </Text>
        <Text>
          However, when I begin three.js, from this{' '}
          <Link
            color="blue.500"
            href="https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_cloth.html"
            target="_blank"
          >
            official documentation code example
          </Link>
          , creating meshes, objects, materials, lights, render loops, and so on
          in imperative way is not really my thing. Why not just create
          everything in{' '}
          <b>declarative, more functional, and component-based objects!</b> That
          is what React looks like.
        </Text>
        <Text>
          Special thanks to the three.js react renderer{' '}
          <Link
            href="https://github.com/pmndrs/react-three-fiber"
            color="blue.500"
            target="_blank"
          >
            react-three/fiber
          </Link>{' '}
          which makes web 3d happen in React world.
        </Text>
        <Text>
          It is welcome to check my{' '}
          <Link
            color="blue.500"
            href="https://github.com/xJkit/learn-threejs-in-react-way"
            target="_blank"
          >
            source code.
          </Link>{' '}
          Any suggestion and PR is welcome!
        </Text>
      </VStack>
    </Box>
  );
}
