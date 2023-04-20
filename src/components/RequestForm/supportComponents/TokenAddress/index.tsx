import React, { useContext, useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { GradientHref } from "../../../../ui-kit/components/GradientHref";
import { getAddressLink, idToNetwork, networkToId, NetworkType } from "../../../../utils/network";
import TOKEN_LIST from "../../../../contracts/tokenlist.json";
import { StateContext } from "../../../../reducer/constants";
import { TokenType } from "../../index";

import "./styles.scss";
import CustomTokenButton from "../CustomTokenButton";
import { CUSTOM_TOKENS, isTokenSymbolDuplicated } from "../../../../utils/tokens";
import { getChainCustomTokens } from "../../../../utils/storage";

type TokenAddressProps = {
    token?: TokenType;
    onTokenChange: (v: TokenType) => void;
};

const TokenAddress = ({ token, onTokenChange }: TokenAddressProps) => {
    const { uiSelectedChainId, newCustomToken } = useContext(StateContext);
    const networkName = idToNetwork[uiSelectedChainId];

    const availableTokens = useMemo(() => {
        if (networkName) {
            const customTokens = getChainCustomTokens(uiSelectedChainId).map((v) => ({ ...v, isCustomToken: true }));

            const tokensFromList =
                // @ts-ignore
                TOKEN_LIST[networkToId[networkName]]
                    ?.sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))
                    .map((v: any) =>
                        isTokenSymbolDuplicated(networkName, v.symbol) ? { ...v, symbol: `${v.symbol} (${v.name})` } : v
                    ) ?? [];

            return [...customTokens, ...tokensFromList].map((v) => ({
                label: v.symbol,
                address: v.address,
                name: v.name || v.id,
                logo: v.logoURI ?? "/default.svg",
                isCustomToken: v.isCustomToken,
            }));
        }

        return [];
    }, [networkName, uiSelectedChainId, newCustomToken]);

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
                                <div>
                                    {option.label}
                                    {option.isCustomToken ? " (custom)" : ""}
                                </div>
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
