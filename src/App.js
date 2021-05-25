import { Grid, VStack, Center } from '@chakra-ui/react';
import { Switch, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Basic from './pages/Basic';
import NotFound from './pages/NotFound';

const routes = [
  {
    path: '/',
    title: 'Home',
    Component: Home,
  },
  {
    path: '/basic',
    title: 'Basic',
    Component: Basic,
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
    >
      {routes.map((route) => (
        <Link to={route.path} key={route.title}>
          <Center w="100%" p={3} _hover={{ bgColor: 'blue.700' }}>
            {route.title}
          </Center>
        </Link>
      ))}
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
    <Grid h="100vh" w="100vw" templateColumns="170px 1fr">
      <Sidebar />
      <Main />
    </Grid>
  );
}

export default App;
