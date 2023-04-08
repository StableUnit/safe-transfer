import React, { ChangeEvent, useContext, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

import { getAddressLink, idToNetwork, networkToId, NetworkType } from "../../utils/network";
import GenUrl from "../GenUrl";
import Twitter from "../Twitter";
import { generateRequestUrl } from "../../utils/urlGenerator";
import TOKEN_LIST from "../../contracts/tokenlist.json";
import { GradientHref } from "../../ui-kit/components/GradientHref";
import { StateContext } from "../../reducer/constants";
import NetworkInput from "./supportComponents/NetworkInput";
import GenerateButton from "./supportComponents/GenerateButton";
import RecipientInput from "./supportComponents/RecipientInput";

import "./styles.scss";

type TokenType = {
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

    const availableTokens = useMemo(() => {
        // @ts-ignore
        if (networkName && TOKEN_LIST[networkToId[networkName]]) {
            // @ts-ignore
            return TOKEN_LIST[networkToId[networkName]]
                ?.map((v: any) => ({
                    label: v.symbol,
                    address: v.address,
                    name: v.name,
                    logo: v.logoURI ?? "/default.svg",
                }))
                .sort((a: any, b: any) => a.label.localeCompare(b.label));
        }

        return [];
    }, [networkName]);

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

    const handleTokenChange = (event: any, newValue: any) => {
        setToken(newValue);
    };

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

                        <div className="request-form__label">Token address</div>
                        <Autocomplete
                            id="token-address"
                            className="request-form__default-input"
                            placeholder="Select token"
                            options={availableTokens}
                            sx={{ width: 300 }}
                            onChange={handleTokenChange}
                            renderOption={(props, option, state) => {
                                return (
                                    <li {...props}>
                                        <img
                                            src={option.logo}
                                            width={20}
                                            height={20}
                                            onError={({ currentTarget }) => {
                                                // eslint-disable-next-line no-param-reassign
                                                currentTarget.onerror = null; // prevents looping
                                                // eslint-disable-next-line no-param-reassign
                                                currentTarget.src = "/default.svg";
                                            }}
                                        />
                                        <div>{option.label}</div>
                                    </li>
                                );
                            }}
                            renderInput={(params) => {
                                return (
                                    <div className="request-form__token-input">
                                        {token && (
                                            <img
                                                src={token.logo}
                                                width={20}
                                                height={20}
                                                onError={({ currentTarget }) => {
                                                    // eslint-disable-next-line no-param-reassign
                                                    currentTarget.onerror = null; // prevents looping
                                                    // eslint-disable-next-line no-param-reassign
                                                    currentTarget.src = "/default.svg";
                                                }}
                                            />
                                        )}
                                        <TextField {...params} />
                                    </div>
                                );
                            }}
                        />
                        {token && networkName && (
                            <GradientHref
                                isExternal
                                target="_blank"
                                href={getAddressLink(token.address, networkName)}
                                className="request-form__token-name"
                            >
                                {token.name ?? token.label}
                            </GradientHref>
                        )}

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
