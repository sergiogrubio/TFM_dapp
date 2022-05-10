import * as React from 'react';
import {
  useGetAccountInfo,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import FormFund from '../../components/FormFund';
import Actions from '../Common/Actions';
import TopInfo from '../Common/TopInfo';
import Transactions from '../Common/Transactions';
import { Address, ProxyProvider } from '@elrondnetwork/erdjs';

const Fund = () => {
  const { address, account } = useGetAccountInfo();
  const objAddress = new Address(address);
  // const data1 = getAccount(address);
  const { network } = useGetNetworkConfig();
  const proxy = new ProxyProvider(network.apiAddress);

  proxy
    .getAddressEsdtList(objAddress)
    .then(({ returnData }) => {
      console.log(returnData);
    })
    .catch((err) => {
      console.error('Unable to call VM query', err);
    });

  return (
    <div className='container py-4'>
      <div className='row'>
        <div className='col-12 col-md-10 mx-auto'>
          <div className='card shadow-sm rounded border-0'>
            <div className='card-body p-1'>
              <div className='card rounded border-0 bg-primary'>
                <div className='card-body text-center p-4'>
                  <FormFund />
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

export default Fund;
