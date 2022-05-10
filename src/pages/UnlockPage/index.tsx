import React from 'react';
import { useLocation } from 'react-router-dom';
import { DappUI, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { routeNames } from 'routes';

export const UnlockRoute: () => JSX.Element = () => {
  const {
    ExtensionLoginButton,
    WebWalletLoginButton,
    LedgerLoginButton,
    WalletConnectLoginButton
  } = DappUI;
  const { isLoggedIn } = useGetLoginInfo();
  const referrer = document.referrer;
  const route = '/' + referrer.split('/').pop();

  React.useEffect(() => {
    if (isLoggedIn) {
      window.location.href = route;
    }
  }, [isLoggedIn]);

  return (
    <div className='home d-flex flex-fill align-items-center'>
      <div className='m-auto' data-testid='unlockPage'>
        <div className='card my-4 text-center'>
          <div className='card-body py-4 px-2 px-sm-2 mx-lg-4'>
            <h4 className='mb-4'>Login</h4>
            <p className='mb-4'>pick a login method2</p>

            <ExtensionLoginButton
              callbackRoute={route}
              loginButtonText={'Extension'}
            />
            <WebWalletLoginButton
              callbackRoute={route}
              loginButtonText={'Web wallet'}
            />
            <LedgerLoginButton
              loginButtonText={'Ledger'}
              callbackRoute={route}
              className={'test-class_name'}
            />
            <WalletConnectLoginButton
              callbackRoute={route}
              loginButtonText={'Maiar'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockRoute;
