import React from 'react';
import { DappUI, DappProvider } from '@elrondnetwork/dapp-core';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Layout from 'components/Layout';
// import Fund from 'pages/Fund';
import PageNotFound from 'pages/PageNotFound';
import { routeNames } from 'routes';
import routes from 'routes';

import '@elrondnetwork/dapp-core/build/index.css';

const environment = 'devnet';

const {
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal,
  DappCorePages: { UnlockPage }
} = DappUI;
const referrer = document.referrer;
const mainroute = '/' + referrer.split('/').pop();
const defaultRoute = '/Trade';

const App = () => {
  return (
    <Router>
      <DappProvider
        environment={environment}
        customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
      >
        <Layout>
          <TransactionsToastList shouldRenderDefaultCss='true' />
          <NotificationModal />
          <SignTransactionsModals className='custom-class-for-modals' />
          <Routes>
            <Route
              path={routeNames.unlock}
              element={
                <UnlockPage
                  loginRoute={mainroute !== '/' ? mainroute : defaultRoute}
                />
              }
            />
            {routes.map((route: any, index: number) => (
              <Route
                path={route.path}
                key={'route-key-' + index}
                element={<route.component />}
              />
            ))}
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </Layout>
      </DappProvider>
    </Router>
  );
};

export default App;
