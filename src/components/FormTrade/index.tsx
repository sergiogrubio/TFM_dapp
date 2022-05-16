import React from 'react';
import { useState } from 'react';
import {
  useGetNetworkConfig,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';
import { BytesValue } from '@elrondnetwork/erdjs';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { contractAddress } from 'config';
import { hexEncodeNumber, hexEncodeStr } from '../../controllers/common';
import { getProvider, myQuery } from '../../controllers/myTransactions';

const FormTrade = () => {
  const [priceToken1, setPriceToken1] = useState('');
  const [token1, setToken1] = useState('');
  const [priceToken2, setPriceToken2] = useState('');
  const [amountAvailable, setAmountAvailable] = useState('');
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
  const { address, account } = useGetAccountInfo();

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

  const updatePriceEgldToken = async (token: string) => {
    const amount = await myQuery(contractAddress, network, 'priceEgldToken', [
      BytesValue.fromHex(hexEncodeStr(token)),
      BytesValue.fromHex(hexEncodeNumber(1))
    ]);
    setPriceToken1('1');
    setPriceToken2(amount);
    setToken1('xEGLD');
    setToken2(token.split('-')[0]);
    console.log('updatePriceEgldToken', amount);
  };

  const updatePriceTokenEgld = async (token: string) => {
    const numerator = await myQuery(
      contractAddress,
      network,
      'priceTokenEgldNumerator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(1))
      ]
    );

    const denominator = await myQuery(
      contractAddress,
      network,
      'priceTokenEgldDenominator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(1))
      ]
    );

    const numeratorBig = new BigNumber(numerator, 10);
    const denominatorBig = new BigNumber(denominator, 10);
    const result = numeratorBig.dividedBy(denominatorBig).toFixed();
    const resultStr = result.toString();

    setPriceToken2(resultStr);
    if (resultStr !== '0') {
      setPriceToken1('1');
    } else {
      setPriceToken1('0');
    }
    setToken1(token.split('-')[0]);
    setToken2('xEGLD');
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

  const updateCurrentK = async (token: string) => {
    const myCurrentK = await myQuery(contractAddress, network, 'calculateK', [
      BytesValue.fromHex(hexEncodeStr(token))
    ]);
    setCurrentK(myCurrentK);
  };

  const updateInitialK = async (token: string) => {
    const myInitialK = await myQuery(contractAddress, network, 'getInitialK', [
      BytesValue.fromHex(hexEncodeStr(token))
    ]);
    setInitialK(myInitialK);
  };

  const updatePairs = (myAdd: string) => {
    const provider = getProvider();

    provider.getTokens(myAdd).then((tokens) => {
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

  const updateBalance = (token: string) => {
    console.log('updateBalance', token);
    if (token === 'xEGLD') {
      setAmountAvailable(account.balance);
    } else {
      const provider = getProvider();
      provider.getTokenData(address, token).then(({ balance }) => {
        //setItemsSelect(tokens);
        setAmountAvailable(balance);
        console.log(balance);
      });
    }
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
    if (tk1 === 'xEGLD') {
      updateCurrentK(tk2);
      updateInitialK(tk2);
      updateBalance(tk1);
    } else {
      updateCurrentK(tk1);
      updateInitialK(tk1);
      updateBalance(tk1);
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
            Amount in wei (
            <small>
              1 {`${token1}`} - 1000000000000000000 wei {`${token1}`}
            </small>
            ):
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
                <p className='text-info m-0'>
                  <strong>Price: </strong>
                  {`${priceToken1} ${token1} - ${priceToken2} ${token2}`}
                </p>
                <p className='text-info m-0'>
                  <strong>Available: </strong>
                  {`${amountAvailable} ${token1}`}
                </p>
              </div>
            </div>
            <div className='form-group row mt-0 mb-0 text-right'>
              <div className='col-md-12'>
                <p className='text-info m-0'>
                  <small>
                    <strong>Initial K:</strong> {`${initialK}`}
                  </small>
                </p>
                <p className='text-info m-0'>
                  <small>
                    <strong>Current K:</strong> {`${currentK}`}
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex m-0 p-0 justify-content-center'>
          <button className='btn bg-white m-2'>
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
            Buy {`${token1}`}
          </button>
        </div>
      </form>
    </>
  );
};

export default FormTrade;
