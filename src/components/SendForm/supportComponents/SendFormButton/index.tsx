import React from "react";
import { useAccount } from "wagmi";

import Button from "../../../../ui-kit/components/Button/Button";

import "./styles.scss";

type SendFormButtonProps = {
    disabled?: boolean;
    isApproveLoading: boolean;
    onApprove: () => void;
    onConnect: () => void;
};

const SendFormButton = ({ disabled, onApprove, onConnect, isApproveLoading }: SendFormButtonProps) => {
    const { address } = useAccount();

    if (!address) {
        return (
            <Button onClick={onConnect} className="send-form-button">
                CONNECT WALLET
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
