import React from 'react';
import { useState } from 'react';
import {
  useGetAccountInfo,
  useGetPendingTransactions
} from '@elrondnetwork/dapp-core';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';

// idea from:
// https://github.com/bogdan-rosianu/elrond-converters
const hexEncodeStr = (str: string) => Buffer.from(str, 'ascii').toString('hex');

// idea from:
// https://github.com/bogdan-rosianu/elrond-converters
const hexEncodeNumber = (num: number) => {
  const bn = new BigNumber(num, 10);
  let bnStr = bn.toString(16);

  if (bnStr.length % 2 != 0) {
    bnStr = '0' + bnStr;
  }

  return bnStr;
};

const FormClaim = () => {
  const [claimData, setClaimData] = useState({
    pair: 'SGR-07dffb' // put first element in the SELECT, is there a better way to do it?
  });
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

  // TODO: change "any"
  const handleInputChange = (event: any) => {
    setClaimData({
      ...claimData,
      [event.target.name]: event.target.value
    });
  };

  const { hasPendingTransactions, pendingTransactionsArray } =
    useGetPendingTransactions();
  console.log(hasPendingTransactions, pendingTransactionsArray);

  const { address, account } = useGetAccountInfo();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
  };

  return (
    <>
      <h4 className='mb-3 font-weight-normal text-light'>
        Claim earnings and liquidity pools
      </h4>
      <form className='' onSubmit={handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='token' className='text-light'>
            Select pair:
          </label>
          <select
            className='form-control'
            id='pair'
            name='pair'
            onChange={handleInputChange}
          >
            <option value='SGR-07dffb'>xEGLD-SGR</option>
            <option value='UOC-d139bb'>xEGLD-UOC</option>
            <option value='WEB-5d08be'>xEGLD-WEB</option>
          </select>
        </div>
        <div className='d-flex mt-4 justify-content-center'>
          <button className='btn bg-white m-2'>
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
            Claim earnings
          </button>
          <button className='btn bg-white m-2'>
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
            Claim pool
          </button>
        </div>
      </form>
    </>
  );
};

export default FormClaim;
