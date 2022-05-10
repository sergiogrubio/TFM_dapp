import React from 'react';
import { useState } from 'react';
import {
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
  refreshAccount,
  transactionServices
} from '@elrondnetwork/dapp-core';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  hexEncodeStr,
  hexEncodeNumber,
  hexDecodeNumber
} from '../../controllers/common';
import {
  Address,
  AddressValue,
  BytesValue,
  ContractFunction,
  ProxyProvider,
  Query,
  TypedValue
} from '@elrondnetwork/erdjs';
import { contractAddress } from 'config';

const FormClaim = () => {
  const [claimData, setClaimData] = useState({
    pair: 'SGR-07dffb' // put first element in the SELECT, is there a better way to do it?
  });
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

  const [amountEgld, setAmountEgld] = useState('');
  const [amountToken, setAmountToken] = useState('');
  const [amountEarnEgld, setAmountEarnEgld] = useState('');
  const [amountEarnToken, setAmountEarnToken] = useState('');
  const amountEgldEle = document.getElementById('amountEgld');
  const amountTokenEle = document.getElementById('amountToken');
  const amountEarnEgldEle = document.getElementById('amountEarnEgld');
  const amountEarnTokenEle = document.getElementById('amountEarnToken');

  //   const { address, account } = useGetAccountInfo();
  const account = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const { address } = account;
  const { sendTransactions } = transactionServices;

  React.useEffect(() => {
    if (amountEgldEle !== null) amountEgldEle.textContent = `${amountEgld}`;
    if (amountTokenEle !== null) amountTokenEle.textContent = `${amountToken}`;
    if (amountEarnEgldEle !== null)
      amountEarnEgldEle.textContent = `${amountEarnEgld}`;
    if (amountEarnTokenEle !== null)
      amountEarnTokenEle.textContent = `${amountEarnToken}`;
  });

  // run it only for a single time to load the amount available of the first pair
  // variable 'ignore' is a trick to achieve that goal
  React.useEffect(() => {
    let ignore = false;

    if (!ignore) {
      updateAmountEgld('');
      updateAmountToken('');
      updateEarningsToken('');
      updateEarningsEgld('');
    }

    return () => {
      ignore = true;
    };
  }, []);

  const updateAmountToken = async (value: string) => {
    const pair = value || claimData.pair;
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getLiquidityToken'),
      args: [BytesValue.fromHex(hexEncodeStr(pair))]
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const decNumber = hexDecodeNumber(decoded);
        // console.log(decNumber);
        if (decNumber === '') {
          setAmountToken('0');
        } else {
          setAmountToken(decNumber);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  };

  const updateAmountEgld = async (value: string) => {
    const pair = value || claimData.pair;
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getLiquidityEgld'),
      args: [BytesValue.fromHex(hexEncodeStr(pair))]
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const decNumber = hexDecodeNumber(decoded);
        // console.log(decNumber);
        if (decNumber === '') {
          setAmountEgld('0');
        } else {
          setAmountEgld(decNumber);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  };

  const updateEarningsToken = async (value: string) => {
    const pair = value || claimData.pair;
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getEarnings'),
      args: [BytesValue.fromHex(hexEncodeStr(pair))]
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const decNumber = hexDecodeNumber(decoded);
        // console.log(decNumber);
        if (decNumber === '') {
          setAmountEarnToken('0');
        } else {
          setAmountEarnToken(decNumber);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  };

  const updateEarningsEgld = async (value: string) => {
    const pair = value || claimData.pair;
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getEarnings'),
      args: [BytesValue.fromHex(hexEncodeStr('EGLD'))]
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const decNumber = hexDecodeNumber(decoded);
        // console.log(decNumber);
        if (decNumber === '') {
          setAmountEarnEgld('0');
        } else {
          setAmountEarnEgld(decNumber);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  };

  const claimEarnings = async () => {
    const pair = claimData.pair;
    const transaction1 = {
      value: '0',
      data: 'claimEarnings' + '@' + hexEncodeStr(pair),
      receiver: contractAddress
    };
    const transaction2 = {
      value: '0',
      data: 'claimEarnings' + '@' + hexEncodeStr('EGLD'),
      receiver: contractAddress
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [transaction1, transaction2],
      transactionsDisplayInfo: {
        processingMessage: 'Processing claim transaction',
        errorMessage: 'An error has occured (claim)',
        successMessage: 'Claim transaction successful'
      },
      minGasLimit: 120000, // default value wasn't enough
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
      updateEarningsToken('');
      updateEarningsEgld('');
    } else {
      console.log('claimEarnings');
    }
  };

  const claimPool = async () => {
    const pair = claimData.pair;
    const transaction1 = {
      value: '0',
      data: 'claimLiquidityToken' + '@' + hexEncodeStr(pair),
      receiver: contractAddress
    };
    const transaction2 = {
      value: '0',
      data: 'claimLiquidityEgld' + '@' + hexEncodeStr(pair),
      receiver: contractAddress
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [transaction1, transaction2],
      transactionsDisplayInfo: {
        processingMessage: 'Processing claim pool transaction',
        errorMessage: 'An error has occured (claim pool)',
        successMessage: 'Claim pool transaction successful'
      },
      gasLimit: 200000000, // default value wasn't enough
      redirectAfterSign: false
    });
    if (sessionId != null) {
      console.log(sessionId);
      setTransactionSessionId(sessionId);
      updateAmountEgld(''); // setAmountEgld('0');
      updateAmountToken(''); // setAmountToken('0');
    } else {
      console.log('claimPool');
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
    updateEarningsEgld(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
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
          >
            <option value='SGR-07dffb'>xEGLD-SGR</option>
            <option value='UOC-d139bb'>xEGLD-UOC</option>
            <option value='WEB-5d08be'>xEGLD-WEB</option>
          </select>
        </div>
        <div className='form-group row mt-0 mb-0'>
          <label htmlFor='amountPair' className='text-info'>
            Pool available: <span id='amountEgld'></span>-
            <span id='amountToken'></span>
          </label>
        </div>
        <div className='form-group row mt-0 mb-0'>
          <label htmlFor='amountEarnings' className='text-info'>
            Earnings available: <span id='amountEarnEgld'></span>-
            <span id='amountEarnToken'></span>
          </label>
        </div>
        <div className='d-flex mt-4 justify-content-center'>
          <button className='btn bg-white m-2' onClick={claimEarnings}>
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
            Claim earnings
          </button>
          <button className='btn bg-white m-2' onClick={claimPool}>
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
            Claim pool
          </button>
        </div>
      </form>
    </>
  );
};

export default FormClaim;
