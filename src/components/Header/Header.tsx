import React from "react";
import { useMoralis } from "react-moralis";

import { getShortAddress } from "../../utils/wallet";
import NavbarLink from "./supportComponents/NavbarLink/NavbarLink";

import "./Header.scss";

interface NavbarProps {
    onMetamaskConnect: () => void;
    onWalletConnect: () => void;
    onDisconnect: () => void;
    token: string | null;
}

const Header = ({ token, onWalletConnect, onMetamaskConnect, onDisconnect }: NavbarProps) => {
    const { account } = useMoralis();

    const handleOpenSendPage = () => {
        window.open("/", "_self");
    };

    return (
        <div className="header">
            <div className="header__logo">
                <a href="https://stableunit.org/" target="_blank" rel="noreferrer">
                    <img src="https://stableunit.org/assets/img/logo.svg" />
                </a>
            </div>
            <div className="header__navbar">
                <NavbarLink isSelected={!token} onClick={token ? handleOpenSendPage : undefined}>
                    SEND
                </NavbarLink>
                {account ? (
                    <div className="header__address" onClick={onDisconnect}>
                        {getShortAddress(account)}
                    </div>
                ) : (
                    <div>
                        <div className="header__button" onClick={onMetamaskConnect} id="connect-button-metamask">
                            Connect wallet
                        </div>
                        <div className="header__button" onClick={onWalletConnect} id="connect-button-wallet-connect">
                            Connect wallet
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
