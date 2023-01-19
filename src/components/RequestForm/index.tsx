import React, { ChangeEvent, useMemo, useState } from "react";
import { Autocomplete, FormControl, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";
import { networkNames, networkToId, NetworkType } from "../../utils/network";
import Button from "../../ui-kit/components/Button/Button";
import { ReactComponent as ArrowDownIcon } from "../../ui-kit/images/arrow-down.svg";
import GenUrl from "../GenUrl";
import Twitter from "../Twitter";
import { generateRequestUrl } from "../../utils/urlGenerator";
import { isAddress } from "../../utils/wallet";
import TOKEN_LIST from "../../contracts/tokenlist.json";

import "./styles.scss";

const RequestPage = React.memo(() => {
    const [genUrl, setGenUrl] = useState<string>();
    const [networkName, setNetworkName] = useState<NetworkType>();
    const [toAddress, setToAddress] = useState<string>();
    const [token, setToken] = useState<string>();
    const [value, setValue] = useState<number>();

    const hasAllRequiredData = networkName && isAddress(toAddress);

    const availableTokens = useMemo(() => {
        if (networkName) {
            // @ts-ignore
            return TOKEN_LIST[networkToId[networkName]]
                ?.map((v: any) => ({
                    label: v.symbol,
                    address: v.address,
                }))
                .sort((a: any, b: any) => a.label.localeCompare(b.label));
        }

        return [];
    }, [networkName]);

    const onGenerate = () => {
        if (hasAllRequiredData && toAddress) {
            setGenUrl(
                generateRequestUrl({
                    token,
                    to: toAddress,
                    value,
                    networkName,
                })
            );
        }
    };

    const handleNetworkChange = (event: SelectChangeEvent) => {
        setNetworkName(event.target.value as NetworkType);
    };

    const handleTokenChange = (event: any, newValue: any) => {
        setToken(newValue?.address);
    };

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToAddress(event.target.value);
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
                        <div className="request-form__label required">Network</div>
                        <FormControl className="request-form__network-form">
                            <Select
                                value={networkName || "placeholder-value"}
                                onChange={handleNetworkChange}
                                inputProps={{ "aria-label": "Without label" }}
                                IconComponent={ArrowDownIcon}
                                MenuProps={{ classes: { paper: "request-form__paper", list: "request-form__list" } }}
                            >
                                <MenuItem disabled value="placeholder-value">
                                    <NetworkImage />
                                    Select network
                                </MenuItem>
                                {Object.entries(networkNames).map(([id, name]) => (
                                    <MenuItem key={id} value={id}>
                                        <NetworkImage network={id} />
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <div className="request-form__label required">Recipient address</div>
                        <TextField
                            value={toAddress}
                            id="address"
                            className="request-form__address"
                            placeholder="Paste your address here ..."
                            variant="outlined"
                            onChange={handleAddressChange}
                        />

                        <div className="request-form__label">Token address</div>
                        <Autocomplete
                            id="token-address"
                            className="request-form__address"
                            placeholder="Select token"
                            options={availableTokens}
                            sx={{ width: 300 }}
                            onChange={handleTokenChange}
                            filterOptions={(options, state) => {
                                return options.filter((v) =>
                                    (v as any).label.toLowerCase().includes(state.inputValue.toLowerCase())
                                );
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <div className="request-form__label">Requested value</div>
                        <TextField
                            id="value"
                            className="request-form__value"
                            placeholder="0.00"
                            type="number"
                            onChange={handleValueChange}
                            value={value?.toString()}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>

                    <Button onClick={onGenerate} className="request-form__button" disabled={!hasAllRequiredData}>
                        Generate request link
                    </Button>
                </div>
                <GenUrl genUrl={genUrl} text="Request link:" />
            </div>
            <Twitter />
        </>
    );
});

export default RequestPage;