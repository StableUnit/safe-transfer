import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";

import { getShortAddress } from "../../utils/wallet";
import { StateContext } from "../../reducer/constants";
import { GradientHref } from "../../ui-kit/components/GradientHref";

import "./Header.scss";

interface NavbarProps {
    onConnect: () => void;
    onDisconnect: () => void;
}

const LINKS = [
    {
        isExternal: true,
        href: "https://medium.com/stableunit/avoid-sending-tokens-to-the-wrong-address-with-safe-transfer-7c649284496f",
        text: "Tutorial",
    },
    {
        href: "/send",
        text: "Send",
    },
    {
        href: "/receive",
        text: "Receive",
    },
];

const Header = ({ onConnect, onDisconnect }: NavbarProps) => {
    const { address } = useContext(StateContext);
    const location = useLocation();

    const totalTransferred = 1_000_000;

    return (
        <div className="header">
            <div className="header__logo-info">
                <div className="header__logo">
                    <a href="https://stableunit.org/" target="_blank" rel="noreferrer">
                        <img src="https://stableunit.org/assets/img/logo.svg" />
                    </a>
                </div>
                <div>
                    <GradientHref>Total transferred: </GradientHref>
                    <span>{totalTransferred.toLocaleString()}$</span>
                </div>
            </div>

            <div className="header__navbar">
                <div className="header__links">
                    {LINKS.map(({ href, text, isExternal }) => {
                        const isSelected = location.pathname.includes(href);
                        return (
                            <GradientHref
                                id={`links-${text.toLowerCase()}`}
                                className={cn("header__link", { "header__link--selected": isSelected })}
                                key={text}
                                href={href}
                                isExternal={isExternal}
                                target={isExternal ? "_blank" : undefined}
                                disabled={isSelected}
                            >
                                {text}
                            </GradientHref>
                        );
                    })}
                </div>
                {address ? (
                    <div className="header__address" onClick={onDisconnect}>
                        {getShortAddress(address)}
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
