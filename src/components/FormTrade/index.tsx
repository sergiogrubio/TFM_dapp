import React from 'react';
import { useState } from 'react';
import {
  DappUI,
  useGetNetworkConfig,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';
import { BytesValue } from '@elrondnetwork/erdjs';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { contractAddress, maxNum, numDecimals } from 'config';
import { hexEncodeNumber, hexEncodeStr } from '../../controllers/common';
import {
  getProvider,
  myQueryNum,
  myTransactions
} from '../../controllers/myTransactions';

const FormTrade = () => {
  const [amountTransactionBuy, setAmountTransactionBuy] = useState('');
  const [amountTransactionSell, setAmountTransactionSell] = useState('');
  const [amountAvailableToken, setAmountAvailableToken] = useState('');
  const [amountAvailableEgld, setAmountAvailableEgld] = useState('');
  const [amountAvailablePoolToken, setAmountAvailablePoolToken] = useState('');
  const [amountAvailablePoolEgld, setAmountAvailablePoolEgld] = useState('');
  const [initialK, setInitialK] = useState('0');
  const [currentK, setCurrentK] = useState('0');
  const [referenceToken, setReferenceToken] = useState('');
  // const [disabledBuy, setDisabledBuy] = useState(false);
  // const [disabledSell, setDisabledSell] = useState(false);
  const [itemsSelect, setItemsSelect] = useState([
    { identifier: '', name: 'select a pair', value: '' }
  ]);
  const [tradeData, setTradeData] = useState({
    pair: '',
    amount: 0
  });
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

  const getPriceBuy = async (token: string, amount: number | string) => {
    const numerator = await myQueryNum(
      contractAddress,
      network,
      'priceEgldTokenNumerator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(amount))
      ]
    );

    const denominator = await myQueryNum(
      contractAddress,
      network,
      'priceEgldTokenDenominator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(amount))
      ]
    );
    const resultStr = bigIntDiv(numerator, denominator);
    return resultStr;
  };

  const getPriceSell = async (token: string, amount: number | string) => {
    const numerator = await myQueryNum(
      contractAddress,
      network,
      'priceTokenEgldNumerator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(amount))
      ]
    );

    const denominator = await myQueryNum(
      contractAddress,
      network,
      'priceTokenEgldDenominator',
      [
        BytesValue.fromHex(hexEncodeStr(token)),
        BytesValue.fromHex(hexEncodeNumber(amount))
      ]
    );

    const resultStr = bigIntDiv(numerator, denominator);
    return resultStr;
  };

  const bigIntDiv = (numerator: string, denominator: string) => {
    const numeratorBig = new BigNumber(numerator, 10);
    const denominatorBig = new BigNumber(denominator, 10);
    const result = numeratorBig.dividedBy(denominatorBig).toFixed(0);
    return result.toString();
  };

  const updateAmount = async (pToken: string, pAmount: number) => {
    const num = new BigNumber(`${pAmount}e+${numDecimals}`, 10);
    const amount = num.toString();

    const priceBuy = await getPriceBuy(pToken, amount);
    setAmountTransactionBuy(priceBuy);
    const priceSell = await getPriceSell(pToken, amount);
    setAmountTransactionSell(priceSell);
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

  const getAmountToken = async (token: string) => {
    const myAmountToken = await queryFunc(token, 'getLiquidityToken');
    return myAmountToken;
  };

  const getAmountEgld = async (token: string) => {
    const myAmountEgld = await queryFunc(token, 'getLiquidityEgld');
    return myAmountEgld;
  };

  const updatePairs = (myAdd: string) => {
    const provider = getProvider();
    provider.getTokens(myAdd).then((tokens) => {
      tokens.map((i: { name: string }) => {
        i.name = i.name + '-xEGLD';
      });
      // idea for sorting:
      // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
      tokens = tokens.sort((a: any, b: any) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      setItemsSelect(tokens);
    });
  };

  const updateBalance = async (pToken: string) => {
    const provider = getProvider();
    setAmountAvailableToken('');
    setAmountAvailableEgld('');
    setAmountAvailablePoolToken('');
    setAmountAvailablePoolEgld('');

    // label "Your wallet (amount available)""
    provider.getTokenData(address, pToken).then(({ balance }) => {
      //setItemsSelect(tokens);
      setAmountAvailableToken(balance);
      setAmountAvailableEgld(account.balance);
    });

    // label "Pool (amount available)"
    const amountEgld = await getAmountEgld(pToken);
    const amountToken = await getAmountToken(pToken);
    setAmountAvailablePoolEgld(amountEgld);
    setAmountAvailablePoolToken(amountToken);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  const handleSubmitBuy = () => {
    const token = tradeData.pair;
    const decAmount = tradeData.amount;

    const num = new BigNumber(`${decAmount}e+${numDecimals}`, 10);
    const intAmount = num.toString();

    swapEgldForToken(intAmount, token, contractAddress, 60000000);
  };

  const handleSubmitSell = () => {
    const token = tradeData.pair;
    const decAmount = tradeData.amount;

    const num = new BigNumber(`${decAmount}e+${numDecimals}`, 10);
    const intAmount = num.toString();

    swapTokenForEgld(intAmount, token, contractAddress, 60000000);
  };

  const swapTokenForEgld = async (
    pValue: string,
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
        hexEncodeStr('swapTokenForEgld'),
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

  const swapEgldForToken = async (
    pValue: string,
    pToken: string,
    pAddress: string,
    pGas: number
  ) => {
    const transaction = {
      value: pValue,
      data: 'swapEgldForToken' + '@' + hexEncodeStr(pToken),
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

  // TODO: change "any"
  const handleInputChangeSelect = (event: any) => {
    setTradeData({
      ...tradeData,
      [event.target.name]: event.target.value
    });
    const amount = tradeData.amount;
    const token = event.target.value.trim();

    setAmountTransactionBuy('');
    setAmountTransactionSell('');

    if (token !== '') {
      // label "Current K"
      updateCurrentK(token);
      // label "Initial K"
      updateInitialK(token);

      // labels:
      // - "Your wallet (amount available)""
      // - "Pool (amount available)"
      updateBalance(token);

      // labels:
      // - "Buy"
      // - "Sell"
      updateAmount(token, amount);
      setReferenceToken('xEGLD');
      // disableButtons();
    } else {
      setAmountTransactionBuy('');
      setAmountTransactionSell('');
      setAmountAvailableToken('');
      setAmountAvailableEgld('');
      setAmountAvailablePoolToken('');
      setAmountAvailablePoolEgld('');
      setInitialK('0');
      setCurrentK('0');
      setReferenceToken('');
      // setDisabledBuy(false);
      // setDisabledBuy(true);
    }
  };

  const handleInputChange = (event: any) => {
    setTradeData({
      ...tradeData,
      [event.target.name]: event.target.value
    });

    const token = tradeData.pair;
    const amount = event.target.value;
    setAmountTransactionBuy('');
    setAmountTransactionSell('');
    if (token.trim() !== '') updateAmount(token, amount);

    // disableButtons();
  };

  // const disableButtons = () => {
  //   const numBuy = new BigNumber(amountTransactionBuy, 10);
  //   const numSell = new BigNumber(amountTransactionSell, 10);
  //   const poolEgld = new BigNumber(amountAvailablePoolEgld, 10);
  //   const poolToken = new BigNumber(amountAvailablePoolToken, 10);
  //   if (numBuy.gte(poolToken)) {
  //     setDisabledBuy(true);
  //   }
  //   if (numSell.gte(poolEgld)) {
  //     setDisabledSell(true);
  //   }
  // };

  return (
    <>
      <h4 className='mb-3 font-weight-normal text-light'>Swap tokens</h4>
      <form className='' onSubmit={handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='token' className='text-light'>
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
              <option key={x.identifier} value={x.identifier}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div className='form-group row mb-0'>
          <label htmlFor='amount' className='text-light'>
            Amount:
          </label>
          <input
            className='form-control'
            type='number'
            name='amount'
            min='0'
            maxLength={maxNum}
            step='0.0001'
            onChange={handleInputChange}
            required
          />
          <div className='container text-left m-0 mt-2 p-0'>
            <div className='form-group row mt-0 mb-0'>
              <div className='col-md-12'>
                <p className='text-info m-0'>
                  <strong>Buy: </strong>
                  Paying {tradeData.amount}{' '}
                  <span className='text-secondary'>{referenceToken}</span>{' '}
                  you&apos;ll get{' '}
                  <DappUI.Denominate
                    value={amountTransactionBuy}
                    token={tradeData.pair.split('-')[0]}
                  />
                </p>
                <p className='text-info m-0'>
                  <strong>Sell: </strong>
                  Paying {tradeData.amount}{' '}
                  <span className='text-secondary'>
                    {tradeData.pair.split('-')[0]}
                  </span>{' '}
                  you&apos;ll get{' '}
                  <DappUI.Denominate
                    value={amountTransactionSell}
                    token='xEGLD'
                  />
                </p>
                <p className='text-info m-0'>
                  <strong>Pool (amount available): </strong>
                </p>
                <p className='text-info m-0'>
                  <DappUI.Denominate
                    value={amountAvailablePoolToken}
                    token={tradeData.pair.split('-')[0]}
                  />
                </p>
                <p className='text-info m-0'>
                  <DappUI.Denominate
                    value={amountAvailablePoolEgld}
                    token='xEGLD'
                  />
                </p>
                <p className='text-info m-0'>
                  <strong>Your wallet (amount available):</strong>
                </p>
                <p className='text-info m-0'>
                  <DappUI.Denominate
                    value={amountAvailableToken}
                    token={tradeData.pair.split('-')[0]}
                  />
                </p>
                <p className='text-info m-0'>
                  <DappUI.Denominate
                    value={amountAvailableEgld}
                    token='xEGLD'
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
          <button className='btn bg-white m-2' onClick={handleSubmitBuy}>
            <FontAwesomeIcon icon={faArrowDown} className='text-primary' /> Buy{' '}
            {tradeData.pair.split('-')[0]} paying {referenceToken}
          </button>
          <button className='btn bg-white m-2' onClick={handleSubmitSell}>
            <FontAwesomeIcon icon={faArrowUp} className='text-primary' /> Sell{' '}
            {tradeData.pair.split('-')[0]} getting {referenceToken}
          </button>
        </div>
      </form>
    </>
  );
};

export default FormTrade;
