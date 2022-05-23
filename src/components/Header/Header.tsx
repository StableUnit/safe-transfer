import React from "react";
import { useMoralis } from "react-moralis";

import { getShortAddress } from "../../utils/wallet";
import NavbarLink from "./supportComponents/NavbarLink/NavbarLink";

import "./Header.scss";

interface NavbarProps {
    onConnect: () => void;
    onDisconnect: () => void;
    token: string | null;
}

const Header = ({ token, onConnect, onDisconnect }: NavbarProps) => {
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
                    <div className="header__button" onClick={onConnect} id="connect-button">
                        Connect wallet
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
