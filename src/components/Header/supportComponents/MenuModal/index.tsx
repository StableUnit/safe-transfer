import React from "react";
import Modal from "react-modal";
import { useLocation } from "react-router-dom";

import { GradientHref } from "../../../../ui-kit/components/GradientHref";
import { CloseIcon } from "../../../../ui-kit/images/icons";
import { HeaderInfo } from "../HeaderInfo";

import "./styles.scss";

export type LinkType = {
    href: string;
    text: string;
    isExternal?: boolean;
};

interface NetworkModalProps {
    onClose: () => void;
    visible: boolean;
    links: LinkType[];
}

export const MenuModal = ({ onClose, visible, links }: NetworkModalProps) => {
    const location = useLocation();

    return (
        <Modal isOpen={visible} onRequestClose={onClose} className="menu-modal" overlayClassName="menu-modal-overlay">
            <div className="menu-modal__header">
                <HeaderInfo />
                <CloseIcon className="menu-modal__close" onClick={onClose} />
            </div>
            <div className="menu-modal__content">
                <div className="menu-modal__links">
                    {links.map((link) => (
                        <GradientHref
                            key={link.text}
                            onClick={onClose}
                            isExternal={link.isExternal}
                            target={link.isExternal ? "_blank" : undefined}
                            href={link.href}
                            className="menu-modal__link"
                            disabled={location.pathname.includes(link.href)}
                        >
                            {link.text}
                        </GradientHref>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
