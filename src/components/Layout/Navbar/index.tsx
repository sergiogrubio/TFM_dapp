import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import { ReactComponent as ElrondLogo } from './../../../assets/img/elrond.svg';

interface NavBarProps {
  current: string;
}

const Navbar = (props: NavBarProps) => {
  const { address } = useGetAccountInfo();
  const { current } = props;

  const handleLogout = () => {
    logout(`${window.location.origin}`);
  };

  const handleFund = () => {
    logout(`${window.location.origin}/fund`);
  };

  const handleClaim = () => {
    logout(`${window.location.origin}/claim`);
  };

  const handleTrade = () => {
    logout(`${window.location.origin}/trade`);
  };

  const isLoggedIn = Boolean(address);

  return (
    <BsNavbar className='bg-white border-bottom px-4 py-3'>
      <div className='container-fluid'>
        <Link
          className='d-flex align-items-center navbar-brand mr-0'
          to={isLoggedIn ? routeNames.trade : routeNames.home}
        >
          <ElrondLogo className='elrond-logo' />
          <span className='dapp-name text-muted'>{dAppName}</span>
        </Link>

        <Nav className='ml-auto'>
          {isLoggedIn && (
            <NavItem>
              <button
                className={
                  current == 'Fund'
                    ? 'btn btn-link bg-secondary'
                    : 'btn btn-link'
                }
                onClick={handleFund}
              >
                Fund
              </button>
            </NavItem>
          )}
          {isLoggedIn && (
            <NavItem>
              <button
                className={
                  current == 'Claim'
                    ? 'btn btn-link bg-secondary'
                    : 'btn btn-link'
                }
                onClick={handleClaim}
              >
                Claim
              </button>
            </NavItem>
          )}
          {isLoggedIn && (
            <NavItem>
              <button
                className={
                  current == 'Trade'
                    ? 'btn btn-link bg-secondary'
                    : 'btn btn-link'
                }
                onClick={handleTrade}
              >
                Trade
              </button>
            </NavItem>
          )}
          {isLoggedIn && (
            <NavItem>
              <button className='btn btn-link' onClick={handleLogout}>
                Close
              </button>
            </NavItem>
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
