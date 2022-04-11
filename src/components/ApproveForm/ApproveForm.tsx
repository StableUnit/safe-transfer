import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import Moralis from "moralis";
import { FormControl, IconButton, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import cn from "classnames";

import BN from "bn.js";
import {
    changeNetworkAtMetamask,
    CustomNetworkType,
    getTrxHashLink,
    idToNetwork,
    isCustomNetwork,
    networkNames,
} from "../../utils/network";
import { isAddress } from "../../utils/wallet";
import { beautifyTokenBalance, CUSTOM_TOKENS, fromHRToBN, toHRNumberFloat } from "../../utils/tokens";
import ERC20_ABI from "../../contracts/ERC20.json";
import { generateUrl, getShortHash, getShortUrl, handleCopyUrl } from "../../utils/urlGenerator";
import { ReactComponent as ArrowDownIcon } from "../../ui-kit/images/arrow-down.svg";
import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";
import Button from "../../ui-kit/components/Button/Button";
import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";

import "./ApproveForm.scss";
import { customWeb3s } from "../App/App";
import CustomTokenMenuItem from "./supportComponents/CustomTokenMenuItem/CustomTokenMenuItem";

type BalanceType = {
    // eslint-disable-next-line camelcase
    token_address: string;
    name: string;
    symbol: string;
    logo?: string | undefined;
    thumbnail?: string | undefined;
    decimals: string;
    balance: string;
};

interface ApproveFormProps {
    onMetamaskConnect?: () => void;
    onWalletConnect?: () => void;
}

const ApproveForm = ({ onMetamaskConnect, onWalletConnect }: ApproveFormProps) => {
    const { account, chainId: hexChainId, web3 } = useMoralis();
    const chainId = Web3.utils.hexToNumber(hexChainId ?? "");
    const networkName = idToNetwork[chainId];
    const [toAddress, setToAddress] = useState<undefined | string>(undefined);
    const [value, setValue] = useState<undefined | number>(undefined);
    const [selectedToken, setSelectedToken] = useState<undefined | string>(undefined); // address
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [trxHash, setTrxHash] = useState("");
    const [trxLink, setTrxLink] = useState("");
    const [restoreHash, setRestoreHash] = useState<undefined | string>(undefined);
    const [isRestoreLoading, setIsRestoreLoading] = useState(false);
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [genUrl, setGenUrl] = useState<undefined | string>(undefined);
    const Web3Api = useMoralisWeb3Api();

    const onMount = async () => {
        if (hexChainId && account) {
            if (!isCustomNetwork(networkName)) {
                const options = { chain: hexChainId, address: account };
                // @ts-ignore
                const result = await Web3Api.account.getTokenBalances(options);
                setBalances(result.sort((a, b) => (a.symbol > b.symbol ? 1 : -1)));
            } else {
                const tokens = CUSTOM_TOKENS[networkName as CustomNetworkType];
                const customTokenBalances = [] as BalanceType[];
                for (const token of tokens) {
                    const tokenContract = new customWeb3s[networkName as CustomNetworkType].eth.Contract(
                        ERC20_ABI as any,
                        token.address
                    );
                    const decimals = await tokenContract.methods.decimals().call();
                    const balance = await tokenContract.methods.balanceOf(account).call();
                    customTokenBalances.push({
                        token_address: token.address,
                        name: token.id,
                        symbol: token.symbol,
                        decimals,
                        balance,
                    });
                }
                setBalances(customTokenBalances.sort((a, b) => (new BN(a.balance).lt(new BN(b.balance)) ? 1 : -1)));
            }
        }
    };

    useEffect(() => {
        onMount();
    }, [hexChainId, account]);

    const handleNetworkChange = useCallback((event) => {
        changeNetworkAtMetamask(event.target.value);
    }, []);

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToAddress(event.target.value);
    };

    const handleTokenChange = (event: SelectChangeEvent) => {
        setSelectedToken(event.target.value);
    };

    const handleValueChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(+event.target.value);
    };

    const handleRestoreHashChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRestoreHash(event.target.value);
    };

    const handleRestore = async () => {
        try {
            setIsRestoreLoading(true);
            const transaction = await web3?.getTransactionReceipt(restoreHash ?? "");
            if (!transaction) {
                addErrorNotification("Error", "Can't get transaction");
                setIsRestoreLoading(false);
                return;
            }
            const valueBN = Web3.utils.hexToNumberString(transaction.logs[0].data);
            const to = `0x${transaction.logs[0].topics[2]?.slice(-40)}`;
            setGenUrl(
                generateUrl({
                    address: transaction.to,
                    from: transaction.from,
                    to,
                    value: valueBN,
                    chain: networkName,
                })
            );
            setIsRestoreLoading(false);
        } catch (e) {
            setIsRestoreLoading(false);
            console.error(e);
            addErrorNotification("Error", "Restore transaction failed");
        }
    };

    const onSuccessApprove = (selectedTokenInfo: BalanceType) => {
        const valueBN = fromHRToBN(value ?? 0, +selectedTokenInfo.decimals).toString();

        addSuccessNotification("Success", "Approve transaction completed");
        setIsApproveLoading(false);
        setGenUrl(
            generateUrl({
                address: selectedTokenInfo?.token_address,
                from: account ?? "",
                to: toAddress ?? "",
                value: valueBN,
                chain: networkName,
            })
        );
    };

    const handleApprove = async () => {
        const selectedTokenInfo = balances.find((v) => v.token_address === selectedToken);
        if (selectedTokenInfo && value && toAddress && account) {
            setGenUrl(undefined);
            setTrxHash("");
            setTrxLink("");
            setIsApproveLoading(true);
            const contractAddress = selectedTokenInfo.token_address;
            const valueBN = fromHRToBN(value, +selectedTokenInfo.decimals).toString();

            const ethers = Moralis.web3Library;
            // @ts-ignore
            const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, web3.getSigner());

            const gasPrice = await web3?.getGasPrice();
            try {
                const trx = await tokenContract.approve(toAddress, valueBN, {
                    gasPrice: gasPrice && networkName === "polygon" ? +gasPrice * 2 : gasPrice,
                });
                setTrxHash(trx.hash);
                setTrxLink(getTrxHashLink(trx.hash, networkName));
                await trx.wait();
                onSuccessApprove(selectedTokenInfo);
            } catch (error) {
                // @ts-ignore
                const replacedHash = error?.replacement?.hash;
                if (replacedHash) {
                    setTrxHash(replacedHash);
                    setTrxLink(getTrxHashLink(replacedHash, networkName));
                    onSuccessApprove(selectedTokenInfo);
                } else {
                    console.error(error);
                    addErrorNotification("Error", "Approve transaction failed");
                    setIsApproveLoading(false);
                }
            }
        }
    };

    const isCorrectData = isAddress(toAddress) && (value ?? 0) > 0 && selectedToken;
    const currentToken = balances.find((v) => v.token_address === selectedToken);
    const currentTokenBalance = currentToken
        ? toHRNumberFloat(new BN(currentToken.balance), +currentToken.decimals)
        : 0;

    const handleMaxClick = () => {
        setValue(+currentTokenBalance);
    };

    return (
        <div className="approve-form__container">
            <div className={cn("approve-form", { "approve-form--disabled": !account })}>
                <div className="approve-form__title">Send</div>

                <div className="approve-form__content">
                    <div className="approve-form__label">Network</div>
                    <FormControl className="approve-form__network-form">
                        <Select
                            value={networkName || "placeholder-value"}
                            onChange={handleNetworkChange}
                            inputProps={{ "aria-label": "Without label" }}
                            IconComponent={ArrowDownIcon}
                            MenuProps={{ classes: { paper: "approve-form__paper", list: "approve-form__list" } }}
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

                    <div className="approve-form__label">Recipient address</div>
                    <TextField
                        id="address"
                        className="approve-form__address"
                        placeholder="Paste address here ..."
                        variant="outlined"
                        onChange={handleAddressChange}
                    />

                    <div className="approve-form__content__line">
                        <div className="approve-form__label">Balance: {currentTokenBalance}</div>
                        <div className="approve-form__max-button" onClick={handleMaxClick}>
                            MAX
                        </div>
                    </div>

                    <div className="approve-form__content__line">
                        <FormControl className="approve-form__token-form">
                            <Select
                                value={selectedToken || "placeholder-value" || "custom-value"}
                                onChange={handleTokenChange}
                                inputProps={{ "aria-label": "Without label" }}
                                IconComponent={ArrowDownIcon}
                                MenuProps={{
                                    classes: {
                                        root: "approve-form__token-dropdown",
                                        paper: "approve-form__paper",
                                        list: "approve-form__list",
                                    },
                                }}
                            >
                                <MenuItem disabled value="placeholder-value">
                                    Select token
                                </MenuItem>
                                {balances.map((token) => (
                                    <MenuItem key={token.token_address} value={token.token_address}>
                                        <div>{token.symbol}</div>
                                        <div className="approve-form__token-form__balance">
                                            {beautifyTokenBalance(token.balance, +token.decimals)}
                                        </div>
                                    </MenuItem>
                                ))}
                                <CustomTokenMenuItem networkName={networkName} />
                            </Select>
                        </FormControl>

                        <TextField
                            id="value"
                            className="approve-form__value"
                            placeholder="0.00"
                            type="number"
                            onChange={handleValueChange}
                            value={value}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                </div>

                {account ? (
                    <Button
                        onClick={handleApprove}
                        className="approve-form__button"
                        disabled={!isCorrectData || isApproveLoading}
                    >
                        {isApproveLoading ? "Loading..." : "Approve"}
                    </Button>
                ) : (
                    <>
                        <Button id="#connect-button-wc" onClick={onWalletConnect} className="approve-form__button__wc">
                            CONNECT WALLET
                        </Button>
                        <Button
                            id="#connect-button-metamask"
                            onClick={onMetamaskConnect}
                            className="approve-form__button__metamask"
                        >
                            CONNECT WALLET
                        </Button>
                    </>
                )}
            </div>
            {trxHash && (
                <div className="approve-form__hash">
                    <div className="approve-form__hash__text">
                        <div>Hash:&nbsp;&nbsp;</div>
                        <div id="generated-url">
                            <a href={trxLink} target="_blank" rel="noreferrer">
                                {getShortHash(trxHash)}
                            </a>
                        </div>
                    </div>
                    <IconButton aria-label="copy" onClick={handleCopyUrl(trxHash)}>
                        <ContentCopyIcon />
                    </IconButton>
                </div>
            )}
            {genUrl && (
                <div className="approve-form__url">
                    <div className="approve-form__url__text">
                        <div>Link to receive:&nbsp;&nbsp;</div>
                        <a href={genUrl} target="_blank" rel="noreferrer">
                            {getShortUrl(genUrl)}
                        </a>
                    </div>
                    <IconButton aria-label="copy" onClick={handleCopyUrl(genUrl)}>
                        <ContentCopyIcon />
                    </IconButton>
                </div>
            )}
            <div className="approve-form">
                <div className="approve-form__restore">
                    <div>Restore link by Approve transaction hash</div>
                    <TextField
                        id="address"
                        className="approve-form__restore__input"
                        placeholder="Paste transaction hash here ..."
                        variant="outlined"
                        onChange={handleRestoreHashChange}
                    />
                    <Button
                        onClick={handleRestore}
                        className="approve-form__button"
                        disabled={isRestoreLoading || !account}
                    >
                        {isRestoreLoading ? "Loading..." : "Restore"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ApproveForm;
