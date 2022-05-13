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
import { StateType } from '../../components/Transactions/types';
import { contractAddress } from 'config';
import { CustomNetworkProvider } from '../../controllers/CustomNetworkProvider';
import { isTypeNode } from 'typescript';

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
  //   const { address, account } = useGetAccountInfo();
  const account = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const { address } = account;
  const { sendTransactions, useGetActiveTransactionsStatus } =
    transactionServices;
  const { pending, timedOut, fail, success, completed, hasActiveTransactions } =
    useGetActiveTransactionsStatus();
  const {
    pendingTransactions,
    pendingTransactionsArray,
    hasPendingTransactions
  } = useGetPendingTransactions();
  const {
    network: { apiAddress }
  } = useGetNetworkConfig();
  const [state, setState] = React.useState<StateType>({
    transactions: [],
    transactionsFetched: undefined
  });

  const trans = () => {
    console.log(
      pending,
      timedOut,
      fail,
      success,
      completed,
      hasActiveTransactions
    );
    console.log(
      pendingTransactions,
      pendingTransactionsArray,
      hasPendingTransactions
    );
  };

  // run it only for a single time to load the amount available of the first pair
  // variable 'ignore' is a trick to achieve that goal
  React.useEffect(() => {
    let ignore = false;

    if (!ignore) {
      updateTokens(address);
      updateAmountEgld(claimData.pair);
      updateAmountToken(claimData.pair);
      updateEarningsToken(claimData.pair);
      updateEarningsEgld(claimData.pair);
    }

    return () => {
      ignore = true;
    };
  }, []);

  const getProvider = () => {
    return new CustomNetworkProvider('https://devnet-api.elrond.com', {
      timeout: 5000
    });
  };

  const updateTokens = (myAdd: string) => {
    const provider = getProvider();
    const address = myAdd;
    provider.getTokens(address).then((tokens) => {
      const newTokens = tokens.map((i: { name: string }) => {
        i.name = 'xEGLD-' + i.name;
      });
      console.log(tokens);
      setItemsSelect(tokens);
    });
  };

  const updateAmountToken = async (pair: string) => {
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

  const updateAmountEgld = async (pair: string) => {
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

  const updateEarningsToken = async (pair: string) => {
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

  const updateEarningsEgld = async (pair: string) => {
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
      receiver: contractAddress,
      gasLimit: 60000000
    };
    const transaction2 = {
      value: '0',
      data: 'claimEarnings' + '@' + hexEncodeStr('EGLD'),
      receiver: contractAddress,
      gasLimit: 60000000
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [transaction1, transaction2],
      // transactionsDisplayInfo: {
      //   processingMessage: 'Processing claim transaction',
      //   errorMessage: 'An error has occured (claim)',
      //   successMessage: 'Claim transaction successful'
      // },
      // minGasLimit: 120000, // default value wasn't enough
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
      receiver: contractAddress,
      gasLimit: 60000000
    };
    const transaction2 = {
      value: '0',
      data: 'claimLiquidityEgld' + '@' + hexEncodeStr(pair),
      receiver: contractAddress,
      gasLimit: 60000000
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [transaction1, transaction2],
      // transactionsDisplayInfo: {
      //   processingMessage: 'Processing claim pool transaction',
      //   errorMessage: 'An error has occured (claim pool)',
      //   successMessage: 'Claim pool transaction successful'
      // },
      redirectAfterSign: false
    });
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
    updateEarningsEgld(event.target.value);
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
        trans();
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
          <button name='bTrans' value='bTrans' className='btn bg-white m-2'>
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
            trans
          </button>
        </div>
      </form>
    </>
  );
};

export default FormClaim;
