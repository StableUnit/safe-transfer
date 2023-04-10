import React from "react";
import { useAccount } from "wagmi";

import Button from "../../../../ui-kit/components/Button/Button";
import { useRequestToken } from "../../../../hooks/useRequestToken";

import "./styles.scss";

type SendFormButtonProps = {
    disabled?: boolean;
    isApproveLoading: boolean;
    isTransferLoading: boolean;
    isTransferDone: boolean;
    onApprove: () => void;
    onTransfer: () => void;
    onConnect: () => void;
};

const SendFormButton = ({
    disabled,
    onApprove,
    onConnect,
    onTransfer,
    isApproveLoading,
    isTransferDone,
    isTransferLoading,
}: SendFormButtonProps) => {
    const { address } = useAccount();
    const { requestTokenData } = useRequestToken();
    const hasRequestToken = !!requestTokenData;

    if (!address) {
        return (
            <Button onClick={onConnect} className="send-form-button">
                CONNECT WALLET
            </Button>
        );
    }

    if (isTransferDone) {
        return (
            <Button className="send-form-button" disabled>
                You sent requested tokens
            </Button>
        );
    }

    if (hasRequestToken) {
        return (
            <Button onClick={onTransfer} className="send-form-button" disabled={disabled}>
                {isTransferLoading ? "Loading..." : "Send requested tokens"}
            </Button>
        );
    }

    return (
        <Button onClick={onApprove} className="send-form-button" disabled={disabled}>
            {isApproveLoading ? "Loading..." : "Approve"}
        </Button>
    );
};

export default SendFormButton;
