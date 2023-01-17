import React, { useContext, useState } from "react";

import { StateContext } from "../../reducer/constants";
import GenUrl from "../GenUrl";
import Twitter from "../Twitter";

import "./styles.scss";

const RequestPage = React.memo(() => {
    const { address, chainId, web3 } = useContext(StateContext);
    const [genUrl, setGenUrl] = useState<undefined | string>(undefined);

    return (
        <>
            <div className="request-form-container">
                <GenUrl genUrl={genUrl} text="Request link:" />
                {/* <div className={cn("request-form", { "request-form--disabled": !address })}> */}
                {/*    <div className="request-form__title">Send</div> */}

                {/*    <div className="request-form__content"> */}
                {/*        <div className="request-form__label">Network</div> */}
                {/*        <FormControl className="request-form__network-form"> */}
                {/*            <Select */}
                {/*                value={networkName || "placeholder-value"} */}
                {/*                onChange={handleNetworkChange} */}
                {/*                inputProps={{ "aria-label": "Without label" }} */}
                {/*                IconComponent={ArrowDownIcon} */}
                {/*            MenuProps={{ classes: { paper: "request-form__paper", list: "request-form__list" } }} */}
                {/*            > */}
                {/*                <MenuItem disabled value="placeholder-value"> */}
                {/*                    <NetworkImage /> */}
                {/*                    Select network */}
                {/*                </MenuItem> */}
                {/*                {Object.entries(networkNames).map(([id, name]) => ( */}
                {/*                    <MenuItem key={id} value={id}> */}
                {/*                        <NetworkImage network={id} /> */}
                {/*                        {name} */}
                {/*                    </MenuItem> */}
                {/*                ))} */}
                {/*            </Select> */}
                {/*        </FormControl> */}

                {/*        <div className="request-form__label">Recipient address</div> */}
                {/*        <TextField */}
                {/*            id="address" */}
                {/*            className="request-form__address" */}
                {/*            placeholder="Paste address here ..." */}
                {/*            variant="outlined" */}
                {/*            onChange={handleAddressChange} */}
                {/*        /> */}

                {/*        <div className="request-form__content__line"> */}
                {/*            <div className="request-form__label">Balance: {currentTokenBalance}</div> */}
                {/*            <div className="request-form__max-button" onClick={handleMaxClick}> */}
                {/*                MAX */}
                {/*            </div> */}
                {/*        </div> */}

                {/*        <div className="request-form__content__line"> */}
                {/*            <FormControl className="request-form__token-form"> */}
                {/*                <Select */}
                {/*                    value={selectedToken || "placeholder-value" || "custom-value"} */}
                {/*                    onChange={handleTokenChange} */}
                {/*                    inputProps={{ "aria-label": "Without label" }} */}
                {/*                    IconComponent={ArrowDownIcon} */}
                {/*                    MenuProps={{ */}
                {/*                        classes: { */}
                {/*                            root: "request-form__token-dropdown", */}
                {/*                            paper: "request-form__paper", */}
                {/*                            list: "request-form__list", */}
                {/*                        }, */}
                {/*                    }} */}
                {/*                > */}
                {/*                    <MenuItem disabled value="placeholder-value"> */}
                {/*                        Select token */}
                {/*                    </MenuItem> */}
                {/*                    {isBalanceRequestLoading && ( */}
                {/*              <LoaderLine className="request-form__token-form__loader" width={150} height={24} /> */}
                {/*                    )} */}
                {/*                    {balances.map((token) => ( */}
                {/*                        <MenuItem key={token.token_address} value={token.token_address}> */}
                {/*                        <div className="request-form__token-form__symbol">{token.symbol}</div> */}
                {/*                            <div className="request-form__token-form__balance"> */}
                {/*                                {beautifyTokenBalance(token.balance, +token.decimals)} */}
                {/*                            </div> */}
                {/*                        </MenuItem> */}
                {/*                    ))} */}
                {/*                    {networkName && <CustomTokenMenuItem networkName={networkName} />} */}
                {/*                </Select> */}
                {/*            </FormControl> */}

                {/*            <TextField */}
                {/*                id="value" */}
                {/*                className="request-form__value" */}
                {/*                placeholder="0.00" */}
                {/*                type="number" */}
                {/*                onChange={handleValueChange} */}
                {/*                value={value?.toString()} */}
                {/*                InputLabelProps={{ */}
                {/*                    shrink: true, */}
                {/*                }} */}
                {/*            /> */}
                {/*        </div> */}
                {/*    </div> */}

                {/*    {hasAllowance && currentToken && ( */}
                {/*        <div className="request-form__allowance"> */}
                {/*            <div className="request-form__allowance__text"> */}
                {/*                <span>Allowance for selected address is </span> */}
                {/*                <span> */}
                {/*                {beautifyTokenBalance(allowance, +currentToken.decimals)} {currentToken.symbol} */}
                {/*                </span> */}
                {/*                <br /> */}
                {/*                Please cancel this approve. */}
                {/*            </div> */}
                {/*            <Button */}
                {/*                onClick={cancelApprove} */}
                {/*                className="request-form__button" */}
                {/*                disabled={isCancelApproveLoading} */}
                {/*            > */}
                {/*                {isCancelApproveLoading ? "Loading..." : "Cancel Approve"} */}
                {/*            </Button> */}
                {/*        </div> */}
                {/*    )} */}

                {/*    {address ? ( */}
                {/*        <Button */}
                {/*            onClick={handleApprove} */}
                {/*            className="request-form__button" */}
                {/*            disabled={!isCorrectData || isApproveLoading || hasAllowance} */}
                {/*        > */}
                {/*            {isApproveLoading ? "Loading..." : "Approve"} */}
                {/*        </Button> */}
                {/*    ) : ( */}
                {/*        <Button onClick={onConnect} className="request-form__button"> */}
                {/*            CONNECT WALLET */}
                {/*        </Button> */}
                {/*    )} */}
                {/* </div> */}
            </div>
            <Twitter />
        </>
    );
});

export default RequestPage;
