import React from "react";

import { getShortAddress } from "../../utils/wallet";
import "./Header.scss";

interface NavbarProps {
    address?: string;
    onConnect: () => void;
    onDisconnect: () => void;
}

const Header = ({ address, onConnect, onDisconnect }: NavbarProps) => (
    <div className="header">
        {address ? (
            <div className="header__address-container">
                <div className="header__address">{getShortAddress(address)}</div>
                <div className="header__button" onClick={onDisconnect}>
                    Disconnect
                </div>
            </div>
        ) : (
            <div className="header__button" onClick={onConnect}>
                Connect wallet
            </div>
        )}
    </div>
);

export default Header;
