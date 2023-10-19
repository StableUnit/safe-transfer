import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";

import { useAccount } from "wagmi";
import { getShortAddress } from "../../utils/wallet";
import { GradientHref } from "../../ui-kit/components/GradientHref";
import { useDevice } from "../../hooks/useDimensions";
import { BurgerIcon } from "../../ui-kit/images/icons";
import { LinkType, MenuModal } from "./supportComponents/MenuModal";
import { HeaderInfo } from "./supportComponents/HeaderInfo";

import "./Header.scss";

interface NavbarProps {
    onConnect: () => void;
    onDisconnect: () => void;
}

const LINKS = [
    {
        href: "/intro",
        text: "Intro",
    },
    {
        href: "/request",
        text: "Request",
    },
    {
        href: "/send",
        text: "Send",
    },
] as LinkType[];

const Header = ({ onConnect, onDisconnect }: NavbarProps) => {
    const { address } = useAccount();
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const { isMobile } = useDevice();
    const location = useLocation();

    const openMenuModal = () => {
        setIsMenuModalVisible(true);
    };
    const closeMenuModal = () => {
        setIsMenuModalVisible(false);
    };

    const revokeUrl = address ? `https://revoke.cash/address/${address}` : "https://revoke.cash/";

    return (
        <div className="header">
            <HeaderInfo />

            <div className="header__navbar">
                {!isMobile && (
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
                        <GradientHref
                            id="links-revoke"
                            className="header__link"
                            href={revokeUrl}
                            isExternal
                            target="_blank"
                        >
                            Revoke
                        </GradientHref>
                    </div>
                )}
                {address ? (
                    <div className="header__address" onClick={onDisconnect}>
                        <span className="header__address-text">{getShortAddress(address)}</span>
                        <span className="header__address-disconnect">Disconnect</span>
                    </div>
                ) : (
                    <div className="header__button" onClick={onConnect} id="connect-button">
                        Connect wallet
                    </div>
                )}
                {isMobile && <BurgerIcon className="header__menu" onClick={openMenuModal} />}
            </div>
            <MenuModal visible={isMenuModalVisible} onClose={closeMenuModal} links={LINKS} />
        </div>
    );
};

export default Header;
