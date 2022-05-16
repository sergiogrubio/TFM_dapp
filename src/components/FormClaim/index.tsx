import React from 'react';
import { useState } from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import { BytesValue } from '@elrondnetwork/erdjs';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contractAddress } from 'config';
import { hexEncodeStr } from '../../controllers/common';

import {
  getProvider,
  myTransactions,
  myQuery
} from '../../controllers/myTransactions';

const FormClaim = () => {
  const [claimData, setClaimData] = useState({
    pair: ''
  });
  const [itemsSelect, setItemsSelect] = useState([
    { identifier: '', name: 'select a pair' }
  ]);
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);
  const [amountEgld, setAmountEgld] = useState('');
  const [amountToken, setAmountToken] = useState('');
  const [amountEarnEgld, setAmountEarnEgld] = useState('');
  const [amountEarnToken, setAmountEarnToken] = useState('');
  const { network } = useGetNetworkConfig();

  // run it only for a single time to load the amount available of the first pair
  // variable 'ignore' is a trick to achieve that goal
  React.useEffect(() => {
    let ignore = false;

    if (!ignore) {
      // tokens inside the smart contract
      updateTokens(contractAddress);
      // updateAmountEgld(claimData.pair);
      // updateAmountToken(claimData.pair);
      // updateEarningsToken(claimData.pair);
      // updateEarningsEgld();
    }

    return () => {
      ignore = true;
    };
  }, []);

  const updateTokens = (myAdd: string) => {
    const provider = getProvider();
    const address = myAdd;
    provider.getTokens(address).then((tokens) => {
      tokens.map((i: { name: string }) => {
        i.name = 'xEGLD-' + i.name;
      });
      // idea for sorting:
      // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
      tokens = tokens.sort((a: any, b: any) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      setItemsSelect(tokens);
    });
  };

  const updateAmountToken = async (pair: string) => {
    const amount = await myQuery(
      contractAddress,
      network,
      'getLiquidityToken',
      [BytesValue.fromHex(hexEncodeStr(pair))]
    );
    setAmountToken(amount);
  };

  const updateAmountEgld = async (pair: string) => {
    const amount = await myQuery(contractAddress, network, 'getLiquidityEgld', [
      BytesValue.fromHex(hexEncodeStr(pair))
    ]);
    setAmountEgld(amount);
  };

  const updateEarningsToken = async (pair: string) => {
    const amount = await myQuery(contractAddress, network, 'getEarnings', [
      BytesValue.fromHex(hexEncodeStr(pair))
    ]);
    setAmountEarnToken(amount);
  };

  const updateEarningsEgld = async () => {
    const amount = await myQuery(contractAddress, network, 'getEarnings', [
      BytesValue.fromHex(hexEncodeStr('EGLD'))
    ]);
    setAmountEarnEgld(amount);
  };

  const claimEarnings = async () => {
    const pair = claimData.pair;
    const transaction1 = {
      value: '0',
      data: 'claimEarnings' + '@' + hexEncodeStr(pair),
      receiver: contractAddress,
      gasLimit: 60000000
    };
    const transaction2 = {
      value: '0',
      data: 'claimEarnings' + '@' + hexEncodeStr('EGLD'),
      receiver: contractAddress,
      gasLimit: 60000000
    };

    const sessionId = await myTransactions([transaction1, transaction2]);

    if (sessionId != null) {
      setTransactionSessionId(sessionId);
      updateEarningsToken('');
      updateEarningsEgld();
    } else {
      console.log('claimEarnings');
    }
  };

  const claimPool = async () => {
    const pair = claimData.pair;
    const transaction1 = {
      value: '0',
      data: 'claimLiquidityToken' + '@' + hexEncodeStr(pair),
      receiver: contractAddress,
      gasLimit: 60000000
    };
    const transaction2 = {
      value: '0',
      data: 'claimLiquidityEgld' + '@' + hexEncodeStr(pair),
      receiver: contractAddress,
      gasLimit: 60000000
    };

    const sessionId = await myTransactions([transaction1, transaction2]);

    if (sessionId != null) {
      setTransactionSessionId(sessionId);
      updateAmountEgld(''); // setAmountEgld('0');
      updateAmountToken(''); // setAmountToken('0');
    } else {
      console.log('claimPool error sessionId = null');
    }
  };

  // TODO: change "any"
  const handleInputChange = (event: any) => {
    setClaimData({
      ...claimData,
      [event.target.name]: event.target.value
    });
    // problem: now claimData.pair is the value before
    // and event.target.value the new value
    // when you submit the for values are OK, but not now
    // so a solve it in a way I don't like...
    updateAmountEgld(event.target.value);
    updateAmountToken(event.target.value);
    updateEarningsToken(event.target.value);
    updateEarningsEgld();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const btn = document.activeElement;
    console.log(btn?.textContent);
    switch (btn?.textContent) {
      case 'Claim earnings': {
        claimEarnings();
        break;
      }
      case 'Claim pool': {
        claimPool();
        break;
      }
      default: {
        console.log('something went wrong');
        break;
      }
    }
  };

  return (
    <>
      <h4 className='mb-3 font-weight-normal text-light'>
        Claim earnings and liquidity pools
      </h4>
      <form className='' onSubmit={handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='pair' className='text-light'>
            Select pair:
          </label>
          <select
            className='form-control'
            id='pair'
            name='pair'
            onChange={handleInputChange}
            placeholder='select a pair'
            required
          >
            <option key='' value=''>
              select a pair
            </option>
            {itemsSelect.map((x) => (
              <option key={x.identifier} value={x.identifier}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div className='form-group row mt-0 mb-0'>
          <label htmlFor='amountPair' className='text-info'>
            Pool available: {`${amountEgld}-${amountToken}`}
          </label>
        </div>
        <div className='form-group row mt-0 mb-0'>
          <label htmlFor='amountEarnings' className='text-info'>
            Earnings available: {`${amountEarnEgld}-${amountEarnToken}`}
          </label>
        </div>
        <div className='d-flex mt-4 justify-content-center'>
          <button
            name='bEarnings'
            value='bEarnings'
            className='btn bg-white m-2'
          >
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
            Claim earnings
          </button>
          <button name='bPool' value='bPool' className='btn bg-white m-2'>
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
            Claim pool
          </button>
        </div>
      </form>
    </>
  );
};

export default FormClaim;
