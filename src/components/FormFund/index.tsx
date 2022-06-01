import React from 'react';
import { useState } from 'react';
import {
  DappUI,
  useGetNetworkConfig,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';
import { BytesValue } from '@elrondnetwork/erdjs';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { contractAddress, numDecimals } from 'config';
import { hexEncodeStr, hexEncodeNumber } from '../../controllers/common';
import {
  getProvider,
  myTransactions,
  myQueryNum
} from '../../controllers/myTransactions';
const FormFund = () => {
  const [fundData, setFundData] = useState({
    token: '',
    amountToken: 0,
    amountEgld: 0
  });
  const [itemsSelect, setItemsSelect] = useState([
    { identifier: '', name: 'select a token' }
  ]);

  const [amountFundedEgld, setAmountFundedEgld] = useState('');
  const [amountFundedToken, setAmountFundedToken] = useState('');
  const { network } = useGetNetworkConfig();
  const account = useGetAccountInfo();
  const { address } = account;
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

  // run it only for a single time to load the amount available of the first pair
  // variable 'ignore' is a trick to achieve that goal
  React.useEffect(() => {
    let ignore = false;

    if (!ignore) {
      // tokens inside the user's wallet
      updateTokens(address);
    }

    return () => {
      ignore = true;
    };
  }, []);

  // TODO: change "any"
  const handleInputChange = (event: any) => {
    setFundData({
      ...fundData,
      [event.target.name]: event.target.value
    });
    const token = event.target.value.trim();

    if (token !== '') {
      // problem: now claimData.pair is the value before
      // and event.target.value the new value
      // when you submit the for values are OK, but not now
      // so a solve it in a way I don't like...
      updateFundedEgld(event.target.value);
      updateFundedToken(event.target.value);
      // updateTokens(address);
    } else {
      setAmountFundedEgld('');
      setAmountFundedToken('');
    }
  };

  const handleInputChangeToken = (event: any) => {
    setFundData({
      ...fundData,
      [event.target.name]: event.target.value
    });
  };

  const handleInputChangeEgld = (event: any) => {
    setFundData({
      ...fundData,
      [event.target.name]: event.target.value
    });
  };

  const updateFundedToken = async (token: string) => {
    console.log('updateFundedToken', token);
    const amount = await myQueryNum(
      contractAddress,
      network,
      'getLiquidityToken',
      [BytesValue.fromHex(hexEncodeStr(token))]
    );
    setAmountFundedToken(amount);
  };

  const updateFundedEgld = async (token: string) => {
    console.log('updateFundedEgld', token);
    const amount = await myQueryNum(
      contractAddress,
      network,
      'getLiquidityEgld',
      [BytesValue.fromHex(hexEncodeStr(token))]
    );
    setAmountFundedEgld(amount);
  };

  const updateTokens = (myAdd: string) => {
    const provider = getProvider();
    provider.getTokens(myAdd).then((tokens) => {
      setItemsSelect(tokens);
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // const { sendTransactions } = transactionServices;

    const token = fundData.token;
    const amountToken = new BigNumber(
      `${fundData.amountToken}e+${numDecimals}`,
      10
    );
    const amountEgld = new BigNumber(
      `${fundData.amountEgld}e+${numDecimals}`,
      10
    );

    const data =
      'ESDTTransfer' +
      '@' +
      hexEncodeStr(token) + // token identifier in hexadecimal encoding, UOC-d139bb
      '@' + // value to transfer in hexadecimal encoding, 52b7d2dcc80cd2e4000000=100000000000000000000000000
      hexEncodeNumber(amountToken.toString()) +
      '@' +
      hexEncodeStr('addLiquidityToken'); // name of method to call in hexadecimal encoding

    const transaction1 = {
      value: 0,
      data,
      receiver: contractAddress,
      gasLimit: 60000000
    };

    const transaction2 = {
      value: amountEgld.toString(),
      data: 'addLiquidityEgld' + '@' + hexEncodeStr(token),
      receiver: contractAddress,
      gasLimit: 60000000
    };

    const sessionId = await myTransactions([transaction1, transaction2]);
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  return (
    <>
      <h4 className='mb-3 font-weight-normal text-light'>
        Fund liquidity pools
      </h4>
      <form className='' onSubmit={handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='token' className='text-light'>
            Select token:
          </label>
          <select
            className='form-control'
            id='token'
            name='token'
            placeholder='select a token'
            onChange={handleInputChange}
            value={fundData.token}
            required
          >
            <option key='' value=''>
              select a token
            </option>
            {itemsSelect.map((x) => (
              <option key={x.identifier} value={x.identifier}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div className='form-group row'>
          <label htmlFor='amountToken' className='text-light'>
            Amount token:
          </label>
          <input
            className='form-control'
            type='number'
            min='0'
            step='0.0001'
            id='amountToken'
            name='amountToken'
            onChange={handleInputChangeToken}
            required
          />
          <label htmlFor='amountToken' className='text-info'>
            Already funded:{' '}
            <DappUI.Denominate
              value={amountFundedToken}
              token={fundData.token.split('-')[0]}
            />
          </label>
        </div>
        <div className='form-group row'>
          <label htmlFor='amountEgld' className='text-light'>
            Amount xEGLD:
          </label>
          <input
            className='form-control'
            type='number'
            min='0'
            step='0.0001'
            id='amountEgld'
            name='amountEgld'
            onChange={handleInputChangeEgld}
            required
          />
          <label htmlFor='amountEgld' className='text-info'>
            Already funded:{' '}
            <DappUI.Denominate value={amountFundedEgld} token='xEGLD' />
          </label>
        </div>
        <div className='d-flex mt-4 justify-content-center'>
          <button className='btn bg-white m-2'>
            <FontAwesomeIcon icon={faArrowUp} className='text-primary' /> Fund
          </button>
        </div>
      </form>
    </>
  );
};

export default FormFund;
