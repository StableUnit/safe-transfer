import React, { ChangeEvent, useContext, useState } from "react";
import { TextField } from "@mui/material";

import { idToNetwork } from "../../utils/network";
import GenUrl from "../GenUrl";
import Twitter from "../Twitter";
import { generateRequestUrl } from "../../utils/urlGenerator";
import { StateContext } from "../../reducer/constants";
import NetworkInput from "./supportComponents/NetworkInput";
import GenerateButton from "./supportComponents/GenerateButton";
import RecipientInput from "./supportComponents/RecipientInput";
import TokenAddress from "./supportComponents/TokenAddress";

import "./styles.scss";

export type TokenType = {
    label: string;
    address: string;
    logo: string;
    name: string;
};

interface RequestPageProps {
    onConnect: () => void;
}

const RequestPage = ({ onConnect }: RequestPageProps) => {
    const [genUrl, setGenUrl] = useState<string>();
    const { uiSelectedChainId } = useContext(StateContext);
    const [toAddress, setToAddress] = useState<string>();
    const [token, setToken] = useState<TokenType>();
    const [value, setValue] = useState<number>();

    const networkName = idToNetwork[uiSelectedChainId];

    const isGenButtonDisabled = Boolean(!networkName || !toAddress || (token && !value) || (!token && value));

    const onGenerate = () => {
        if (toAddress) {
            setGenUrl(
                generateRequestUrl({
                    token: token?.address,
                    to: toAddress,
                    value,
                    networkName,
                })
            );
        }
    };

    const handleAddressChange = (v?: string) => setToAddress(v);

    const handleTokenChange = (newValue: TokenType) => setToken(newValue);

    const handleValueChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.value === "") {
            setValue(undefined);
        } else {
            setValue(+event.target.value);
        }
    };

    return (
        <>
            <div className="request-form-container">
                <div className="request-form">
                    <div className="request-form__title">Request</div>

                    <div className="request-form__content">
                        <NetworkInput />

                        <RecipientInput toAddress={toAddress} onAddressChange={handleAddressChange} />

                        <TokenAddress token={token} onTokenChange={handleTokenChange} />

                        <div className="request-form__label">Requested value</div>
                        <TextField
                            id="value"
                            className="request-form__default-input"
                            placeholder="0.00"
                            type="number"
                            onChange={handleValueChange}
                            value={value?.toString()}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>

                    <GenerateButton onGenerate={onGenerate} onConnect={onConnect} disabled={isGenButtonDisabled} />
                </div>
                <GenUrl genUrl={genUrl} text="Request link:" />
            </div>
            <Twitter />
        </>
    );
};

export default RequestPage;
