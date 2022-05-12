import React from 'react';
import { AuthenticatedRoutesWrapper } from '@elrondnetwork/dapp-core';
import { useLocation } from 'react-router-dom';
import routes, { routeNames } from 'routes';
import Footer from './Footer';
import Navbar from './Navbar';
import { capitalize } from '../../controllers/common';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname, search } = useLocation();
  const menuOpt = pathname.split('/')[1];
  console.log(capitalize(menuOpt), children);
  return (
    <div className='bg-light d-flex flex-column flex-fill wrapper'>
      <Navbar current={capitalize(menuOpt)} />
      <main className='d-flex flex-column flex-grow-1'>
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={`${routeNames.unlock}${search}`}
        >
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
