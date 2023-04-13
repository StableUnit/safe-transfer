import React from "react";
import { useAccount } from "wagmi";

import Button from "../../../../ui-kit/components/Button/Button";

import "./styles.scss";

type GenerateButtonProps = {
    onConnect: () => void;
    onGenerate: () => void;
    disabled?: boolean;
};

const GenerateButton = ({ onGenerate, disabled, onConnect }: GenerateButtonProps) => {
    const { address } = useAccount();

    return address ? (
        <Button onClick={onGenerate} className="request-form__button" disabled={disabled}>
            Generate request link
        </Button>
    ) : (
        <Button onClick={onConnect} className="request-form__button">
            CONNECT WALLET
        </Button>
    );
};

export default GenerateButton;
