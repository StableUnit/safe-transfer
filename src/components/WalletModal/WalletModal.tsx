import React from "react";
import Modal from "react-modal";

import { ReactComponent as CloseIcon } from "../../ui-kit/images/close.svg";
import { ReactComponent as ArrowRightIcon } from "../../ui-kit/images/arrow-right.svg";
import { ReactComponent as MetamaskIcon } from "../../ui-kit/images/metamask-circle.svg";
import { ReactComponent as WalletConnectIcon } from "../../ui-kit/images/walletconnect.svg";

import "./WalletModal.scss";

interface WalletModalProps {
    visible: boolean;
    onClose: () => void;
    onMetamaskConnect: () => void;
    onWalletConnect: () => void;
    onWalletConnectNative: () => void;
}
const WalletModal = ({
    visible,
    onWalletConnect,
    onWalletConnectNative,
    onMetamaskConnect,
    onClose,
}: WalletModalProps) => {
    return (
        <Modal
            isOpen={visible}
            onRequestClose={onClose}
            className="wallet-modal"
            overlayClassName="wallet-modal-overlay"
        >
            <CloseIcon className="wallet-modal__close" onClick={onClose} />
            <div className="wallet-modal__items">
                <div className="wallet-modal__item" onClick={onMetamaskConnect}>
                    <MetamaskIcon className="wallet-modal__item__icon" />
                    <div className="wallet-modal__item__name">Metamask</div>
                    <ArrowRightIcon className="wallet-modal__item__arrow" />
                </div>
                <div className="wallet-modal__item" onClick={onWalletConnect}>
                    <WalletConnectIcon className="wallet-modal__item__icon" />
                    <div className="wallet-modal__item__name">WalletConnect</div>
                    <ArrowRightIcon className="wallet-modal__item__arrow" />
                </div>
                <div className="wallet-modal__item" onClick={onWalletConnectNative}>
                    <WalletConnectIcon className="wallet-modal__item__icon" />
                    <div className="wallet-modal__item__name">WalletConnect (Gnosis Safe)</div>
                    <ArrowRightIcon className="wallet-modal__item__arrow" />
                </div>
            </div>
        </Modal>
    );
};

export default WalletModal;
