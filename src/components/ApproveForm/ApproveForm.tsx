import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import { FormControl, IconButton, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import cn from "classnames";
import { useMoralisWeb3Api } from "react-moralis";
import BN from "bn.js";

import { changeNetworkAtMetamask, NetworkType, getTrxHashLink, idToNetwork, networkNames } from "../../utils/network";
import { ensToAddress, isAddress } from "../../utils/wallet";
import {
    beautifyTokenBalance,
    CUSTOM_TOKENS,
    fromHRToBN,
    getTokenContractFactory,
    toHRNumberFloat,
} from "../../utils/tokens";
import ERC20_ABI from "../../contracts/ERC20.json";
import { generateUrl, getShortHash, getShortUrl, handleCopyUrl } from "../../utils/urlGenerator";
import { ReactComponent as ArrowDownIcon } from "../../ui-kit/images/arrow-down.svg";
import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";
import Button from "../../ui-kit/components/Button/Button";
import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";

import "./ApproveForm.scss";
import CustomTokenMenuItem from "./supportComponents/CustomTokenMenuItem/CustomTokenMenuItem";
import { StateContext } from "../../reducer/constants";
import { arrayUniqueByKey, sortByBalance, sortBySymbol } from "../../utils/array";
import { rpcList } from "../../utils/rpc";
import { getTokens } from "../../utils/storage";
import { trackEvent } from "../../utils/events";

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
    onConnect: () => void;
}

const ApproveForm = ({ onConnect }: ApproveFormProps) => {
    const { address, chainId, web3, newCustomToken } = useContext(StateContext);
    const networkName = chainId ? idToNetwork[chainId] : undefined;
    const [toAddress, setToAddress] = useState<undefined | string>(undefined);
    const [value, setValue] = useState<undefined | number>(undefined);
    const [selectedToken, setSelectedToken] = useState<undefined | string>(undefined); // address
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [isCancelApproveLoading, setIsCancelApproveLoading] = useState(false);
    const [trxHash, setTrxHash] = useState("");
    const [trxLink, setTrxLink] = useState("");
    const [restoreHash, setRestoreHash] = useState<undefined | string>(undefined);
    const [isRestoreLoading, setIsRestoreLoading] = useState(false);
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [genUrl, setGenUrl] = useState<undefined | string>(undefined);
    const [allowance, setAllowance] = useState<undefined | string>(undefined);
    const Web3Api = useMoralisWeb3Api();

    const isCorrectData = isAddress(toAddress) && (value ?? 0) > 0 && selectedToken;
    const currentToken = balances.find((v) => v.token_address === selectedToken);
    const currentTokenBalance = currentToken
        ? toHRNumberFloat(new BN(currentToken.balance), +currentToken.decimals)
        : 0;
    const hasAllowance = !!(allowance && allowance !== "0");

    const getTokenContract = getTokenContractFactory(web3);

    const onMount = async () => {
        if (chainId && address) {
            const options = { chain: Web3.utils.toHex(chainId), address };
            try {
                // @ts-ignore
                const result = await Web3Api.account.getTokenBalances(options);
                setBalances(sortBySymbol(result));
            } catch (e) {
                setBalances([]);
            }

            const tokens = [
                ...CUSTOM_TOKENS[networkName as NetworkType],
                ...getTokens().map((token) => ({
                    address: token.address,
                    id: token.name,
                    symbol: token.symbol,
                })),
            ];
            for (const token of tokens) {
                const tokenContract = new rpcList[networkName as NetworkType].eth.Contract(
                    ERC20_ABI as any,
                    token.address
                );
                const decimals = await tokenContract.methods.decimals().call();
                const balance = await tokenContract.methods.balanceOf(address).call();

                const newTokenBalance = {
                    token_address: token.address,
                    name: token.id,
                    symbol: token.symbol,
                    decimals,
                    balance,
                } as BalanceType;
                setBalances((oldBalances) => {
                    const newBalances = arrayUniqueByKey(
                        [...oldBalances, newTokenBalance].map((v) => ({
                            ...v,
                            token_address: v.token_address.toLowerCase(),
                        })),
                        "token_address"
                    );
                    return sortByBalance(newBalances);
                });
            }
        }
    };

    useEffect(() => {
        if (newCustomToken) {
            const newTokenBalance = {
                token_address: newCustomToken.address,
                name: newCustomToken.name,
                symbol: newCustomToken.symbol,
                decimals: newCustomToken.decimals,
                balance: newCustomToken.balance,
            } as BalanceType;
            setBalances((oldBalances) => {
                const hasToken = !!oldBalances.find(
                    (oldBalance) => oldBalance.token_address === newTokenBalance.token_address
                );

                return hasToken ? oldBalances : sortByBalance([...oldBalances, newTokenBalance]);
            });
        }
    }, [newCustomToken]);

    useEffect(() => {
        onMount();
    }, [chainId, address]);

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
            const transaction = await web3?.eth.getTransactionReceipt(restoreHash ?? "");
            if (!transaction || !networkName) {
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
        if (!networkName) {
            addErrorNotification("Error", "No network");
            setIsApproveLoading(false);
            return;
        }

        const valueBN = fromHRToBN(value ?? 0, +selectedTokenInfo.decimals).toString();

        addSuccessNotification("Success", "Approve transaction completed");
        setIsApproveLoading(false);
        setGenUrl(
            generateUrl({
                address: selectedTokenInfo?.token_address,
                from: address ?? "",
                to: toAddress ?? "",
                value: valueBN,
                chain: networkName,
            })
        );
    };

    const cancelApprove = async () => {
        const tokenContract = getTokenContract(currentToken?.token_address ?? "");
        if (!tokenContract || !web3) {
            addErrorNotification("Error", "No network");
            return;
        }

        const gasPrice = await web3?.eth.getGasPrice();
        try {
            setIsCancelApproveLoading(true);
            await tokenContract.methods
                .approve(await ensToAddress(toAddress), "0")
                .send({ from: address, gasPrice: gasPrice && networkName === "polygon" ? +gasPrice * 2 : gasPrice });
            setAllowance(undefined);
        } catch (error) {
            // @ts-ignore
            const replacedHash = error?.replacement?.hash;
            if (replacedHash) {
                setAllowance(undefined);
            } else {
                console.error(error);
                addErrorNotification("Error", "Cancel approve transaction failed");
            }
            setIsCancelApproveLoading(false);
        }
    };

    const getTokenName = (tokenAddress?: string) => {
        return balances.find((v) => v.token_address === tokenAddress)?.symbol ?? tokenAddress;
    };

    const handleApprove = async () => {
        if (currentToken && value && toAddress && address && web3 && networkName) {
            setGenUrl(undefined);
            setTrxHash("");
            setTrxLink("");
            setIsApproveLoading(true);

            const valueBN = fromHRToBN(value, +currentToken.decimals).toString();
            const tokenContract = getTokenContract(currentToken.token_address);
            const gasPrice = await web3.eth.getGasPrice();
            const ensAddress = await ensToAddress(toAddress);

            try {
                trackEvent("APPROVE_CREATED", {
                    fromAddress: address,
                    networkName,
                    value,
                    currency: getTokenName(selectedToken),
                });
                await tokenContract?.methods
                    .approve(ensAddress, valueBN)
                    .send({
                        from: address,
                        gasPrice: gasPrice && networkName === "polygon" ? +gasPrice * 2 : gasPrice,
                    })
                    .on("transactionHash", (hash: string) => {
                        setTrxHash(hash);
                        setTrxLink(getTrxHashLink(hash, networkName));
                    });
                trackEvent("APPROVE_FINISHED", {
                    fromAddress: address,
                    networkName,
                    value,
                    currency: getTokenName(selectedToken),
                });
                onSuccessApprove(currentToken);
            } catch (error) {
                // @ts-ignore
                const replacedHash = error?.replacement?.hash;
                if (replacedHash) {
                    setTrxHash(replacedHash);
                    setTrxLink(getTrxHashLink(replacedHash, networkName));
                    onSuccessApprove(currentToken);
                } else {
                    console.error(error);
                    addErrorNotification("Error", "Approve transaction failed");
                    setIsApproveLoading(false);
                }
            }
        }
    };

    const handleMaxClick = () => {
        setValue(+currentTokenBalance);
    };

    const setAllowanceAsync = async () => {
        if (isCorrectData && currentToken) {
            const tokenContract = getTokenContract(currentToken.token_address);
            if (tokenContract) {
                const allowanceFromContract = await tokenContract.methods
                    .allowance(address, await ensToAddress(toAddress))
                    .call();
                setAllowance(allowanceFromContract.toString());
            }
        } else {
            setAllowance(undefined);
        }
    };

    useEffect(() => {
        setAllowanceAsync();
    }, [isCorrectData]);

    return (
        <div className="approve-form__container">
            <div className={cn("approve-form", { "approve-form--disabled": !address })}>
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
                                {networkName && <CustomTokenMenuItem networkName={networkName} />}
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

                {hasAllowance && currentToken && (
                    <div className="approve-form__allowance">
                        <div className="approve-form__allowance__text">
                            <span>Allowance for selected address is </span>
                            <span>
                                {beautifyTokenBalance(allowance, +currentToken.decimals)} {currentToken.symbol}
                            </span>
                            <br />
                            Please cancel this approve.
                        </div>
                        <Button
                            onClick={cancelApprove}
                            className="approve-form__button"
                            disabled={isCancelApproveLoading}
                        >
                            {isCancelApproveLoading ? "Loading..." : "Cancel Approve"}
                        </Button>
                    </div>
                )}

                {address ? (
                    <Button
                        onClick={handleApprove}
                        className="approve-form__button"
                        disabled={!isCorrectData || isApproveLoading || hasAllowance}
                    >
                        {isApproveLoading ? "Loading..." : "Approve"}
                    </Button>
                ) : (
                    <Button onClick={onConnect} className="approve-form__button">
                        CONNECT WALLET
                    </Button>
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
                        disabled={isRestoreLoading || !address}
                    >
                        {isRestoreLoading ? "Loading..." : "Restore"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ApproveForm;
