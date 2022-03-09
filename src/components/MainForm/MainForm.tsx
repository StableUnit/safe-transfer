import React, { ChangeEvent, useCallback, useState } from "react";
import Web3 from "web3";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useMoralis } from "react-moralis";
import { changeNetworkAtMetamask, idToNetwork, networkNames } from "../../utils/network";

import "./MainForm.scss";
import { isAddress } from "../../utils/wallet";
import { TOKENS } from "../../utils/tokens";

interface MainFormProps {}

const MainForm = () => {
    const { account, chainId: hexChainId } = useMoralis();
    const chainId = Web3.utils.hexToNumber(hexChainId ?? "");
    const networkName = idToNetwork[chainId];
    const [toAddress, setToAddress] = useState<undefined | string>(undefined);
    const [value, setValue] = useState<undefined | number>(undefined);
    const [selectedToken, setSelectedToken] = useState<undefined | string>(undefined);

    const handleNetworkChange = useCallback((event) => {
        changeNetworkAtMetamask(event.target.value);
    }, []);

    if (!account) {
        return <div className="main-form">Please connect your wallet</div>;
    }

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToAddress(event.target.value);
    };

    const handleTokenChange = (event: SelectChangeEvent) => {
        setSelectedToken(event.target.value);
    };

    const handleValueChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(+event.target.value);
    };

    const handleApprove = () => {
        console.log(toAddress, value);
    };

    const isCorrectData = isAddress(toAddress) && (value ?? 0) > 0;
    const availableTokens = TOKENS.filter((token) => token.platforms[networkName] !== undefined);

    return (
        <div className="main-form">
            <FormControl className="main-form__network-form">
                <InputLabel id="network-form-label">Network</InputLabel>
                <Select labelId="network-form-label" value={networkName} label="Network" onChange={handleNetworkChange}>
                    {Object.entries(networkNames).map(([id, name]) => (
                        <MenuItem key={id} value={id}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                id="address"
                className="main-form__address"
                label="Address"
                variant="outlined"
                onChange={handleAddressChange}
            />
            <FormControl className="main-form__token-form">
                <InputLabel id="token-form-label">Token</InputLabel>
                <Select labelId="token-form-label" value={selectedToken} label="Token" onChange={handleTokenChange}>
                    {availableTokens.map((token) => (
                        <MenuItem key={token.id} value={token.platforms[networkName]}>
                            {token.symbol.toUpperCase()}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                id="value"
                className="main-form__value"
                label="Value"
                type="number"
                onChange={handleValueChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button variant="contained" onClick={handleApprove} className="main-form__button" disabled={!isCorrectData}>
                Approve
            </Button>
        </div>
    );
};

export default MainForm;
