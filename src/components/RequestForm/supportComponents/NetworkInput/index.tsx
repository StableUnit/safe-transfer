import React, { useContext, useEffect } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useNetwork } from "wagmi";

import { NetworkImage } from "../../../../ui-kit/components/NetworkImage/NetworkImage";
import { idToNetwork, networkNames } from "../../../../utils/network";
import { ReactComponent as ArrowDownIcon } from "../../../../ui-kit/images/arrow-down.svg";
import { DispatchContext, StateContext } from "../../../../reducer/constants";
import { Actions } from "../../../../reducer";

import "./styles.scss";
import { useNetworkChange } from "../../../../hooks/useNetworkChange";

type NetworkInputProps = {};

const NetworkInput = ({}: NetworkInputProps) => {
    const { chain } = useNetwork();
    const dispatch = useContext(DispatchContext);
    const { uiSelectedChainId } = useContext(StateContext);
    const { networkName, onNetworkChange: onNetworkSwitch } = useNetworkChange();

    useEffect(() => {
        if (chain?.id && dispatch) {
            dispatch({ type: Actions.SetUISelectedChainId, payload: chain.id });
        }
    }, [chain, dispatch]);

    return (
        <>
            <div className="request-form__label">Network</div>
            <FormControl className="network-input request-form__default-input">
                <Select
                    value={networkName || idToNetwork[uiSelectedChainId]}
                    onChange={onNetworkSwitch}
                    inputProps={{ "aria-label": "Without label" }}
                    IconComponent={ArrowDownIcon}
                    MenuProps={{ classes: { paper: "network-input__paper", list: "network-input__list" } }}
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
        </>
    );
};

export default NetworkInput;
