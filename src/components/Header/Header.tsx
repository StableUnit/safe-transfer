import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";

import { getShortAddress } from "../../utils/wallet";
import { StateContext } from "../../reducer/constants";
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
    {
        href: "/request",
        text: "Request",
    },
    {
        isExternal: true,
        href: "https://revoke.cash/",
        text: "Revoke",
    },
] as LinkType[];

const Header = ({ onConnect, onDisconnect }: NavbarProps) => {
    const { address } = useContext(StateContext);
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const { isMobile } = useDevice();
    const location = useLocation();

    const openMenuModal = () => {
        setIsMenuModalVisible(true);
    };
    const closeMenuModal = () => {
        setIsMenuModalVisible(false);
    };

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
                    </div>
                )}
                {address ? (
                    <div className="header__address" onClick={onDisconnect}>
                        {getShortAddress(address)}
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
