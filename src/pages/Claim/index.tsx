import * as React from 'react';
import {
  useGetAccountInfo,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';

import FormClaim from '../../components/FormClaim';
import Transactions from '../../components/Transactions';
import { Address, ProxyProvider } from '@elrondnetwork/erdjs';

const Claim = () => {
  // const { address, account } = useGetAccountInfo();
  // console.log(address);
  // const objAddress = new Address(address);
  // // const data1 = getAccount(address);
  // const { network } = useGetNetworkConfig();
  // const proxy = new ProxyProvider(network.apiAddress);

  // console.log(proxy);
  // proxy
  //   .getAddressEsdtList(objAddress)
  //   .then(({ returnData }) => {
  //     console.log(returnData);
  //   })
  //   .catch((err) => {
  //     console.error('Unable to call VM query', err);
  //   });

  return (
    <div className='container py-4'>
      <div className='row'>
        <div className='col-12 col-md-10 mx-auto'>
          <div className='card shadow-sm rounded border-0'>
            <div className='card-body p-1'>
              <div className='card rounded border-0 bg-primary'>
                <div className='card-body text-center p-4'>
                  <FormClaim />
                </div>
              </div>
              <Transactions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Claim;
