import React from "react";
import { useMoralis } from "react-moralis";

import { getShortAddress } from "../../utils/wallet";
import "./Header.scss";

interface NavbarProps {
    onMetamaskConnect: () => void;
    onWalletConnect: () => void;
    onDisconnect: () => void;
}

const Header = ({ onWalletConnect, onMetamaskConnect, onDisconnect }: NavbarProps) => {
    const { account } = useMoralis();

    return (
        <div className="header">
            <div className="header__logo">
                <a href="https://stableunit.org/" target="_blank" rel="noreferrer">
                    <img src="https://stableunit.org/assets/img/logo.svg" />
                </a>
            </div>
            {account ? (
                <div className="header__address-container">
                    <div className="header__address">{getShortAddress(account)}</div>
                    <div className="header__button" onClick={onDisconnect} id="disconnect-button">
                        Disconnect
                    </div>
                </div>
            ) : (
                <div className="header__buttons">
                    <div className="header__button" onClick={onMetamaskConnect} id="connect-button-metamask">
                        Sign in using Metamask
                    </div>
                    <div className="header__button" onClick={onWalletConnect} id="connect-button-wallet-connect">
                        Sign in using Wallet Connect
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
