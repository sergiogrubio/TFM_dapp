import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { contractAddress } from 'config';
import { ReactComponent as HeartIcon } from '../../../assets/img/heart.svg';

const Footer = () => {
  const { address } = useGetAccountInfo();
  return (
    <footer className='bg-white mt-2 mb-2 text-center border-top'>
      <div className='row p-0 m-0'>
        <div className='col p-0'>
          <span className='opacity-6 mr-1'>Your address: </span>
          <span data-testid='accountAddress'>{address}</span>
        </div>
      </div>
      <div className='row p-0 m-0'>
        <div className='col p-0 m-0'>
          <span className='opacity-6 mr-1'>Contract address: </span>
          <span data-testid='contractAddress'>{contractAddress}</span>
        </div>
      </div>
      <div className='row p-0 m-0'>
        <div className='col p-0 m-0'>
          <a
            {...{
              target: '_blank'
            }}
            className='align-items-center'
            href='https://elrond.com/'
          >
            Made by Sergi thanks to the
            <HeartIcon className='mx-1' />
            of the Elrond Team.
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
