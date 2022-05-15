import React from 'react';
import { useState } from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import {
  Address,
  BytesValue,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contractAddress, providerAddress } from 'config';
import {
  hexEncodeStr,
  hexEncodeNumber,
  hexDecodeNumber
} from '../../controllers/common';
import { CustomNetworkProvider } from '../../controllers/myTransactions';

const FormTrade = () => {
  const [amountToken1, setAmountToken1] = useState('');
  const [token1, setToken1] = useState('');
  const [amountToken2, setAmountToken2] = useState('');
  const [token2, setToken2] = useState('');
  const [itemsSelect, setItemsSelect] = useState([
    { identifier: '', name: 'select a pair', value1: '', value2: '' }
  ]);
  const [tradeData, setTradeData] = useState({
    pair: [],
    amount: 0
  });
  const [initialK, setInitialK] = useState('0');
  const [currentK, setCurrentK] = useState('0');
  const { network } = useGetNetworkConfig();
  // run it only for a single time to load the amount available of the first pair
  // variable 'ignore' is a trick to achieve that goal
  React.useEffect(() => {
    let ignore = false;

    if (!ignore) {
      // tokens inside the smart contract
      updatePairs(contractAddress);
      // updatePrice(tradeData.pair);
      // updateAmountToken(claimData.pair);
      // updateEarningsToken(claimData.pair);
      // updateEarningsEgld(claimData.pair);
    }

    return () => {
      ignore = true;
    };
  }, []);

  const getProvider = () => {
    return new CustomNetworkProvider(providerAddress, {
      timeout: 5000
    });
  };

  const updatePriceEgldToken = (token: string) => {
    const func = 'priceEgldToken';

    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction(func),
      args: [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(1))
      ]
    });

    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const decNumber = hexDecodeNumber(decoded);
        setToken1('xEGLD');
        setToken2(token);
        if (decNumber === '') {
          setAmountToken1('0');
          setAmountToken2('0');
        } else {
          setAmountToken1('1');
          setAmountToken2(decNumber);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  };

  const updatePriceTokenEgld = (token: string) => {
    let func = 'priceTokenEgldNumerator';
    let numerator = 0;
    let denominator = 0;

    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction(func),
      args: [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(1))
      ]
    });

    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const decNumber = hexDecodeNumber(decoded);
        numerator = Number(decNumber);

        func = 'priceTokenEgldDenominator';
        const query2 = new Query({
          address: new Address(contractAddress),
          func: new ContractFunction(func),
          args: [
            BytesValue.fromHex(hexEncodeStr(token)),
            BytesValue.fromHex(hexEncodeNumber(1))
          ]
        });

        proxy
          .queryContract(query2)
          .then(({ returnData }) => {
            const [encoded] = returnData;
            const decoded = Buffer.from(encoded, 'base64').toString('hex');
            const decNumber = hexDecodeNumber(decoded);

            denominator = Number(decNumber);
            const result = numerator / denominator;
            const resultRound =
              Math.round((result + Number.EPSILON) * 10000000000000000) /
              10000000000000000;
            setToken1(token);
            setToken2('xEGLD');
            if (decNumber === '') {
              setAmountToken1('0');
              setAmountToken2('0');
            } else {
              setAmountToken1(resultRound.toString());
              setAmountToken2('1');
            }
          })
          .catch((err) => {
            console.error('Unable to call VM query', err);
          });
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  };

  const updatePrice = (tk1: string, tk2: string) => {
    if (tk1 === 'xEGLD') {
      updatePriceEgldToken(tk2);
    } else if (tk2 === 'xEGLD') {
      updatePriceTokenEgld(tk1);
    } else {
      console.log('Something went wrong');
    }
  };

  const updateCurrentK = (token: string) => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('calculateK'),
      args: [BytesValue.fromHex(hexEncodeStr(token))]
    });

    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const decNumber = hexDecodeNumber(decoded);

        if (decNumber === '') {
          setCurrentK('0');
        } else {
          setCurrentK(decNumber);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  };

  const updateInitialK = (token: string) => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getInitialK'),
      args: [BytesValue.fromHex(hexEncodeStr(token))]
    });

    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const decNumber = hexDecodeNumber(decoded);

        if (decNumber === '') {
          setInitialK('0');
        } else {
          setInitialK(decNumber);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  };

  const updatePairs = (myAdd: string) => {
    const provider = getProvider();
    const address = myAdd;
    provider.getTokens(address).then((tokens) => {
      tokens.map(
        (i: {
          identifier: string;
          name: string;
          value1: string;
          value2: string;
        }) => {
          tokens.push({
            identifier: i.identifier,
            name: i.name + '-xEGLD',
            value1: i.identifier,
            value2: 'xEGLD'
          });
          i.value1 = 'xEGLD';
          i.value2 = i.identifier;
          i.name = 'xEGLD-' + i.name;
        }
      );

      // idea for sorting:
      // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
      tokens = tokens.sort((a: any, b: any) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );

      setItemsSelect(tokens);
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // this works because names of tokens are built only with alphanumerics chars
    const btn = document.activeElement;
    const tks = tradeData.pair.toString().split(',');
    const tk1 = tks[0];
    const tk2 = tks[1];
    switch (btn?.textContent) {
      case 'Buy': {
        console.log(`buy ${tk1} with ${tk2}`);
        break;
      }
      case 'Sell': {
        console.log(`buy ${tk2} with ${tk1}`);
        break;
      }
      default: {
        // trans();
        break;
      }
    }
  };

  // TODO: change "any"
  const handleInputChange = (event: any) => {
    setTradeData({
      ...tradeData,
      [event.target.name]: event.target.value
    });
    // problem: now tradeData.pair is the value before
    // and event.target.value the new value
    // when you submit the for values are OK, but not now
    // so a solve it in a way I don't like...

    const tks = event.target.value.toString().split(',');
    const tk1 = tks[0];
    const tk2 = tks[1];

    updatePrice(tk1, tk2);
    if (tk1 !== 'xEGLD') {
      updateCurrentK(tk1);
      updateInitialK(tk1);
    } else {
      updateCurrentK(tk2);
      updateInitialK(tk2);
    }
    // updateAmountToken(event.target.value);
    // updateEarningsToken(event.target.value);
    // updateEarningsEgld(event.target.value);
  };

  return (
    <>
      <form className='' onSubmit={handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='token' className=''>
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
              <option key={x.name} value={[x.value1, x.value2]}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div className='form-group row mb-0'>
          <label htmlFor='amount' className=''>
            Amount (xxx):
          </label>
          <input
            className='form-control'
            type='number'
            placeholder='x1000000'
            step='1000000'
            min='0'
            max='100000000000000000000'
            id='amount'
            name='amount'
            required
          />
          <div className='container text-left m-0 mt-2 p-0'>
            <div className='form-group row mt-0 mb-0'>
              <div className='col-md-12'>
                <label htmlFor='amountToken' className='text-info'>
                  Price:{' '}
                  {`${amountToken1} ${token1} - ${amountToken2} ${token2}`}
                </label>
              </div>
            </div>
            <div className='form-group row mt-0 mb-0'>
              <div className='col-md-12'>
                <label htmlFor='initialK' className='text-info'>
                  Initial K: {`${initialK}`}
                </label>
              </div>
            </div>
            <div className='form-group row mt-0 mb-0'>
              <div className='col-md-12'>
                <label htmlFor='currentK' className='text-info'>
                  Current K: {`${currentK}`}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex m-0 p-0 justify-content-center'>
          <button className='btn bg-white m-2'>
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
            Buy
          </button>
          <button className='btn bg-white m-2'>
            <FontAwesomeIcon icon={faArrowUp} className='text-primary' />
            Sell
          </button>
        </div>
      </form>
    </>
  );
};

export default FormTrade;
