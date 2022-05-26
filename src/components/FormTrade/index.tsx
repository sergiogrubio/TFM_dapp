import React from 'react';
import { useState } from 'react';
import {
  DappUI,
  useGetNetworkConfig,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';
import { BytesValue } from '@elrondnetwork/erdjs';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { contractAddress, numDecimals } from 'config';
import { hexEncodeNumber, hexEncodeStr } from '../../controllers/common';
import {
  getProvider,
  myQueryNum,
  myTransactions
} from '../../controllers/myTransactions';

const FormTrade = () => {
  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');
  const [amountTransaction, setAmountTransaction] = useState('');
  const [amountAvailableTk1, setAmountAvailableTk1] = useState('');
  const [amountAvailableTk2, setAmountAvailableTk2] = useState('');
  const [amountAvailablePoolTk1, setAmountAvailablePoolTk1] = useState('');
  const [amountAvailablePoolTk2, setAmountAvailablePoolTk2] = useState('');
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
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

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

  const updatePriceEgldToken = async (
    token: string,
    amount: number | string
  ) => {
    const numerator = await myQueryNum(
      contractAddress,
      network,
      'priceEgldTokenNoFeeNumerator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(amount))
      ]
    );

    const denominator = await myQueryNum(
      contractAddress,
      network,
      'priceEgldTokenNoFeeDenominator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(amount))
      ]
    );
    const resultStr = bigIntDiv(numerator, denominator);
    setAmountTransaction(resultStr);
    console.log(
      'updatePriceEgldToken',
      amountTransaction,
      resultStr,
      numerator,
      denominator
    );

    // setToken1('xEGLD');
    // setToken2(token.split('-')[0]);
  };

  const updatePriceTokenEgld = async (
    token: string,
    amount: number | string
  ) => {
    const numerator = await myQueryNum(
      contractAddress,
      network,
      'priceTokenEgldNoFeeNumerator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(amount))
      ]
    );

    const denominator = await myQueryNum(
      contractAddress,
      network,
      'priceTokenEgldNoFeeDenominator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(amount))
      ]
    );

    const resultStr = bigIntDiv(numerator, denominator);
    setAmountTransaction(resultStr);
    console.log(
      'updatePriceTokenEgld',
      amountTransaction,
      resultStr,
      numerator,
      denominator
    );

    // setToken1(token.split('-')[0]);
    // setToken2('xEGLD');
  };

  const bigIntDiv = (numerator: string, denominator: string) => {
    const numeratorBig = new BigNumber(numerator, 10);
    const denominatorBig = new BigNumber(denominator, 10);
    const result = numeratorBig.dividedBy(denominatorBig).toFixed(0);
    return result.toString();
  };

  const updateAmount = (pToken1: string, pToken2: string, pAmount: number) => {
    // converting to int
    const num = new BigNumber(`${pAmount}e+${numDecimals}`, 10);
    const amount = num.toString();

    if (pToken1 === 'xEGLD') {
      console.log('updatePriceEgldToken', pToken2, amount);
      // get how many tokens I need to get 1 EGLD
      updatePriceEgldToken(pToken2, amount);
    } else {
      console.log('updatePriceTokenEgld', pToken1, amount);
      // get how many EGLD I need to get 1 token
      updatePriceTokenEgld(pToken1, amount);
    }
  };

  const queryFunc = async (token: string, func: string) => {
    const answer = await myQueryNum(contractAddress, network, func, [
      BytesValue.fromHex(hexEncodeStr(token))
    ]);
    return answer;
  };

  const updateCurrentK = async (token: string) => {
    const myCurrentK = await queryFunc(token, 'calculateK');
    setCurrentK(myCurrentK);
  };

  const updateInitialK = async (token: string) => {
    const myInitialK = await queryFunc(token, 'getInitialK');
    setInitialK(myInitialK);
  };

  const updateAmountToken = async (token: string, setter: any) => {
    const myAmountToken = await queryFunc(token, 'getLiquidityToken');
    setter(myAmountToken);
  };

  const updateAmountEgld = async (token: string, setter: any) => {
    const myAmountEgld = await queryFunc(token, 'getLiquidityEgld');
    setter(myAmountEgld);
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

  const updateBalance = (pToken1: string, pToken2: string) => {
    const provider = getProvider();
    setAmountAvailableTk1('');
    setAmountAvailableTk2('');
    setAmountAvailablePoolTk1('');
    setAmountAvailablePoolTk2('');
    if (pToken1 === 'xEGLD') {
      provider.getTokenData(address, pToken2).then(({ balance }) => {
        //setItemsSelect(tokens);
        setAmountAvailableTk1(account.balance);
        setAmountAvailableTk2(balance);
        updateAmountEgld(pToken2, setAmountAvailablePoolTk1);
        updateAmountToken(pToken2, setAmountAvailablePoolTk2);
      });
    } else {
      provider.getTokenData(address, pToken1).then(({ balance }) => {
        //setItemsSelect(tokens);
        setAmountAvailableTk1(balance);
        setAmountAvailableTk2(account.balance);
        updateAmountEgld(pToken1, setAmountAvailablePoolTk2);
        updateAmountToken(pToken1, setAmountAvailablePoolTk1);
      });
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const tks = tradeData.pair.toString().split(',');
    const amount = tradeData.amount;
    const tk1 = tks[0];
    const tk2 = tks[1];

    if (tk1 === 'xEGLD') {
      // Buy EGLD with token, egld_to_token
      swapEgldForToken(amount, tk2, contractAddress, 60000000);
    } else {
      // Buy token with EGLD, token_to_egld
      swapTokenForEgld(amount, tk1, contractAddress, 60000000);
    }
  };

  const swapTokenForEgld = async (
    pValue: number,
    pToken: string,
    pAddress: string,
    pGas: number
  ) => {
    const transaction = {
      value: pValue,
      data: 'swapTokenForEgld' + '@' + hexEncodeStr(pToken),
      receiver: pAddress,
      gasLimit: pGas
    };
    const sessionId = await myTransactions([transaction]);

    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    } else {
      console.log('swapTokenForEgld error sessionId = null');
    }
  };

  const swapEgldForToken = async (
    pValue: number,
    pToken: string,
    pAddress: string,
    pGas: number
  ) => {
    const transaction = {
      value: '0',
      data:
        'ESDTTransfer' +
        '@' + // token identifier in hexadecimal encoding
        hexEncodeStr(pToken) +
        '@' + // value to transfer in hexadecimal encoding
        hexEncodeNumber(pValue) +
        '@' + // name of method to call in hexadecimal encoding
        hexEncodeStr('swapEgldForToken'),
      receiver: pAddress,
      gasLimit: pGas
    };

    const sessionId = await myTransactions([transaction]);

    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    } else {
      console.log('swapEgldForToken error sessionId = null');
    }
  };

  // TODO: change "any"
  const handleInputChangeSelect = (event: any) => {
    setTradeData({
      ...tradeData,
      [event.target.name]: event.target.value
    });
    const amount = tradeData.amount;
    const tks = event.target.value.toString().split(',');
    // setToken1('');
    // setPriceToken1('');
    // setAmountAvailableTk1('');
    // setToken2('');
    // setPriceToken2('');
    // setAmountAvailableTk2('');
    // setInitialK('0');
    // setCurrentK('0');

    if (tks.length > 1) {
      const tk1 = tks[0];
      const tk2 = tks[1];

      setToken1(tk1);
      setToken2(tk2);

      updateAmount(tk1, tk2, amount);

      if (tk1 === 'xEGLD') {
        updateCurrentK(tk2);
        updateInitialK(tk2);

        // updateBalance(tk1, tk2);
      } else {
        updateCurrentK(tk1);
        updateInitialK(tk1);
        // updateBalance(tk2, tk1);
      }
      updateBalance(tk1, tk2);
    }
  };

  const handleInputChange = (event: any) => {
    setTradeData({
      ...tradeData,
      [event.target.name]: event.target.value
    });
    const tks = tradeData.pair.toString().split(',');
    updateAmount(tks[0], tks[1], event.target.value);
  };

  return (
    <>
      <h4 className='mb-3 font-weight-normal text-light'>Swap tokens</h4>
      <form className='' onSubmit={handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='token' className=''>
            Select pair:
          </label>
          <select
            className='form-control'
            id='pair'
            name='pair'
            onChange={handleInputChangeSelect}
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
            Amount of {token2.split('-')[0]}:
          </label>
          <input
            className='form-control'
            type='number'
            name='amount'
            min='1'
            step='any'
            onChange={handleInputChange}
            required
          />
          <div className='container text-left m-0 mt-2 p-0'>
            <div className='form-group row mt-0 mb-0'>
              <div className='col-md-12'>
                <p className='text-info m-0'>
                  <strong>You&apos;ll get: </strong>
                  <DappUI.Denominate
                    value={amountTransaction}
                    token={token1.split('-')[0]}
                  />
                </p>
                <p className='text-info m-0'>
                  <strong>Pool (amount available): </strong>
                </p>
                <p className='text-info m-0'>
                  <DappUI.Denominate
                    value={amountAvailablePoolTk1}
                    token={token1.split('-')[0]}
                  />
                </p>
                <p className='text-info m-0'>
                  <DappUI.Denominate
                    value={amountAvailablePoolTk2}
                    token={token2.split('-')[0]}
                  />
                </p>
                <p className='text-info m-0'>
                  <strong>Your wallet (amount available):</strong>
                </p>
                <p className='text-info m-0'>
                  <DappUI.Denominate
                    value={amountAvailableTk1}
                    token={token1.split('-')[0]}
                  />
                </p>

                <p className='text-info m-0'>
                  <DappUI.Denominate
                    value={amountAvailableTk2}
                    token={token2.split('-')[0]}
                  />
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
            Buy {token1.split('-')[0]} with {token2.split('-')[0]}
          </button>
        </div>
      </form>
    </>
  );
};

export default FormTrade;
