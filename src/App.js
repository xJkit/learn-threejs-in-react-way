import { Grid, VStack, Center, Icon, Link } from '@chakra-ui/react';
import { Switch, Route, Link as RouterLink } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

import ReadMe from './pages/ReadMe';
import Demo from './pages/Demo';
import Interaction from './pages/Interaction';
import Text from './pages/Text';
import Panorama from './pages/Panorama';
import NotFound from './pages/NotFound';

const routes = [
  {
    path: '/',
    title: 'Demo',
    Component: Demo,
  },
  {
    path: '/read-me',
    title: 'Read Me',
    Component: ReadMe,
  },
  {
    path: '/interaction',
    title: 'Interaction',
    Component: Interaction,
  },
  {
    path: '/text',
    title: 'Text',
    Component: Text,
  },
  {
    path: '/panorama',
    title: 'Panorama',
    Component: Panorama,
  },
];

function Sidebar() {
  return (
    <VStack
      h="100%"
      w="100%"
      pt={4}
      bgColor="blue.800"
      color="white"
      fontWeight="bold"
      alignItems="stretch"
      pos="relative"
    >
      {routes.map((route) => (
        <RouterLink to={route.path} key={route.title}>
          <Center
            color="blue.100"
            w="100%"
            p={3}
            _hover={{ bgColor: 'blue.700' }}
          >
            {route.title}
          </Center>
        </RouterLink>
      ))}
      <Center
        bgColor="blue.100"
        pos="absolute"
        lineHeight="60px"
        bottom={0}
        left={0}
        right={0}
        color="blue.800"
      >
        <Link href="https://github.com/xJkit" target="_blank">
          <Icon as={FaGithub} mr={2} />
          Jay Chung
        </Link>
      </Center>
    </VStack>
  );
}

function Main(props) {
  return (
    <VStack h="100%" w="100%" overflow="hidden" {...props} py={8} px={5}>
      <Switch>
        {routes.map((route) => (
          <Route
            exact
            key={route.path}
            path={route.path}
            component={route.Component}
          />
        ))}
        <Route component={NotFound} />
      </Switch>
    </VStack>
  );
}

function App() {
  return (
    <Grid h="100vh" w="100vw" templateColumns="140px 1fr">
      <Sidebar />
      <Main />
    </Grid>
  );
}

export default App;
