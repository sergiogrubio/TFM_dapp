import React from 'react';
import {
  AuthenticatedRoutesWrapper,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';
import { useLocation } from 'react-router-dom';
import { contractAddress } from 'config';
import routes, { routeNames } from 'routes';
import { capitalize } from '../../controllers/common';
import { getProvider } from '../../controllers/myTransactions';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname, search } = useLocation();
  const menuOpt = pathname.split('/')[1];
  const [isOwner, setIsOwner] = React.useState(false);
  const { address } = useGetAccountInfo();
  const provider = getProvider();

  provider.isOwnerSC(contractAddress, address).then((answer) => {
    setIsOwner(answer);
  });

  return (
    <div className='bg-light d-flex flex-column flex-fill wrapper'>
      <Navbar current={capitalize(menuOpt)} isOwner={isOwner} />
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
