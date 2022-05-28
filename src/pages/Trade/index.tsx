import * as React from 'react';
import FormTrade from '../../components/FormTrade';
import Transactions from '../../components/Transactions';
const filterFuncs = ['swapEgldForToken', 'swapTokenForEgld'];
const Trade = () => {
  return (
    <div className='container py-4'>
      <div className='row'>
        <div className='col-12 col-md-10 mx-auto'>
          <div className='card shadow-sm rounded border-0'>
            <div className='card-body p-1'>
              <div className='card rounded border-0 bg-primary'>
                <div className='card-body text-center p-4'>
                  <FormTrade />
                </div>
              </div>
              <Transactions
                title='Transactions related to trading and your account'
                filterFuncs={filterFuncs}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;
