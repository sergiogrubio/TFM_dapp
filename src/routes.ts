import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';
import Claim from './pages/Claim';
import Fund from './pages/Fund';
import Home from './pages/Home';
import Trade from './pages/Trade';

export const routeNames = {
  home: '/',
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  fund: '/fund',
  claim: '/claim',
  trade: '/trade'
};

const routes: Array<any> = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.fund,
    title: 'Fund',
    component: Fund,
    authenticatedRoute: true
  },
  {
    path: routeNames.claim,
    title: 'Claim',
    component: Claim,
    authenticatedRoute: true
  },
  {
    path: routeNames.trade,
    title: 'Trade',
    component: Trade,
    authenticatedRoute: true
  }
];

const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • Elrond ${dAppName}`
    : `Elrond ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
