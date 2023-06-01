import React, { useContext, useEffect, useState } from "react";
import { useAccount, useContract, useContractWrite, useNetwork, useSigner } from "wagmi";

import { beautifyTokenBalance } from "../../../../utils/tokens";
import Button from "../../../../ui-kit/components/Button/Button";
import { addErrorNotification, addSuccessNotification } from "../../../../utils/notifications";
import { trackEvent } from "../../../../utils/events";
import { idToNetwork, networkToId } from "../../../../utils/network";
import CONTRACT_ERC20 from "../../../../contracts/ERC20.json";
import { StateContext } from "../../../../reducer/constants";
import { useGasPrice } from "../../../../hooks/useGasPrice";
import { rpcList } from "../../../../utils/rpc";
import { BalanceType } from "../../../../utils/types";

import "./styles.scss";

type AllowanceCheckerProps = {
    currentToken?: BalanceType;
    ensAddress?: string;
    onHasAllowanceChange: (hasAllowance: boolean) => void;
};

const AllowanceChecker = ({ currentToken, ensAddress, onHasAllowanceChange }: AllowanceCheckerProps) => {
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { chain } = useNetwork();
    const gasPrice = useGasPrice(chain?.id);
    const { uiSelectedChainId } = useContext(StateContext);
    const networkName = chain?.id ? idToNetwork[chain?.id] : idToNetwork[uiSelectedChainId];
    const [isCancelApproveLoading, setIsCancelApproveLoading] = useState(false);
    const currentTokenContract = useContract({
        address: currentToken?.token_address,
        abi: CONTRACT_ERC20,
        signerOrProvider: signer,
    });
    const { writeAsync: approve } = useContractWrite({
        mode: "recklesslyUnprepared",
        address: currentToken?.token_address as `0x${string}`,
        abi: CONTRACT_ERC20,
        chainId: chain?.id,
        functionName: "approve",
    });

    const [allowance, setAllowance] = useState<string>();
    const hasAllowance = !!(allowance && allowance !== "0");

    useEffect(() => {
        onHasAllowanceChange(hasAllowance);
    }, [hasAllowance]);

    const setAllowanceAsync = async () => {
        if (address && currentToken && ensAddress) {
            const tokenContract = new rpcList[networkName].eth.Contract(
                CONTRACT_ERC20 as any,
                currentToken?.token_address
            );

            const allowanceFromContract = await tokenContract.methods.allowance(address, ensAddress).call();
            setAllowance(allowanceFromContract.toString());
        } else {
            setAllowance(undefined);
        }
    };

    useEffect(() => {
        setAllowanceAsync();
    }, [address, ensAddress, currentToken]);

    const cancelApprove = async () => {
        if (!networkName || !currentTokenContract || !approve) {
            addErrorNotification("Error", "No network");
            return;
        }

        try {
            setIsCancelApproveLoading(true);
            const tx = await approve({
                recklesslySetUnpreparedArgs: [ensAddress, "0"],
                recklesslySetUnpreparedOverrides: { gasPrice },
            });
            const symbol = await currentTokenContract.symbol();
            await tx.wait();

            addSuccessNotification("Success", "Cancel allowance completed");
            // eslint-disable-next-line max-len
            // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
            trackEvent("APPROVED_REVOKE_SENT", {
                location: window.location.href,
                source: "Send Page",
                chainId: networkToId[networkName],
                txHash: tx.hash,
                fromAddress: address,
                toAddress: ensAddress,
                tokenAddress: currentToken?.token_address,
                tokenSymbol: symbol,
            });
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

    if (!hasAllowance || !currentToken) {
        return null;
    }

    return (
        <div className="allowance-checker">
            <div className="allowance-checker__text">
                <span>Allowance for selected address is </span>
                <span>
                    {beautifyTokenBalance(allowance, +currentToken.decimals)} {currentToken.symbol}
                </span>
                <br />
                Please cancel this approve.
            </div>
            <Button
                onClick={cancelApprove}
                className="send-form-button"
                disabled={isCancelApproveLoading || !ensAddress}
            >
                {isCancelApproveLoading ? "Loading..." : "Cancel Approve"}
            </Button>
        </div>
    );
};

export default AllowanceChecker;
