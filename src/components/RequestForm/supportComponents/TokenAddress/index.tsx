import React, { useContext, useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { GradientHref } from "../../../../ui-kit/components/GradientHref";
import { getAddressLink, idToNetwork, networkToId } from "../../../../utils/network";
import TOKEN_LIST from "../../../../contracts/tokenlist.json";
import { StateContext } from "../../../../reducer/constants";
import { TokenType } from "../../index";

import "./styles.scss";
import CustomTokenButton from "../CustomTokenButton";

type TokenAddressProps = {
    token?: TokenType;
    onTokenChange: (v: TokenType) => void;
};

const TokenAddress = ({ token, onTokenChange }: TokenAddressProps) => {
    const { uiSelectedChainId } = useContext(StateContext);
    const networkName = idToNetwork[uiSelectedChainId];

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

    const handleTokenChange = (event: any, newValue: any) => {
        onTokenChange(newValue);
    };

    return (
        <>
            <div className="request-form__label">Token address</div>
            <div className="token-address__content">
                <Autocomplete
                    id="token-address"
                    className="request-form__default-input"
                    placeholder="Select token"
                    options={availableTokens}
                    sx={{ width: 300 }}
                    onChange={handleTokenChange}
                    renderOption={(props, option: any) => {
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
                            <div className="token-address__input">
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
                <CustomTokenButton />
            </div>

            {token && networkName && (
                <GradientHref
                    isExternal
                    target="_blank"
                    href={getAddressLink(token.address, networkName)}
                    className="token-address__token-name"
                >
                    {token.name ?? token.label}
                </GradientHref>
            )}
        </>
    );
};

export default TokenAddress;
