import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { ReactNotifications } from "react-notifications-component";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import amplitude from "amplitude-js";
import { BrowserRouter } from "react-router-dom";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, goerli, optimism, bsc, fantom, avalanche, arbitrum } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy";
import { SafeConnector } from "@gnosis.pm/safe-apps-wagmi";

import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { initialState, StateContext, DispatchContext } from "./reducer/constants";
import reducer from "./reducer";
import { wagmiCustomNetworks } from "./utils/network";

import "./index.scss";
import "react-notifications-component/dist/theme.css";

if (process.env.REACT_APP_ENV === "production" || process.env.REACT_APP_ENV === "beta") {
    Sentry.init({
        dsn: "https://7a6df39090c749e3a39eb6bce2d5fad8@o922999.ingest.sentry.io/6543522",
        integrations: [new Integrations.BrowserTracing(), new Sentry.Integrations.Breadcrumbs({ console: false })],
        tracesSampleRate: 1.0,
    });
}

amplitude.getInstance().init("33269ec4443fd55fdcb0c426627ec40f");

export const redirectFrom = "safe-transfer.stableunit.org";
const redirectTo = "safetransfer.cash";

if (window?.location?.host === redirectFrom) {
    window.open(window.location.href.replace(redirectFrom, redirectTo), "_self");
}

const AppContainer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const chains = [
        mainnet,
        goerli,
        optimism,
        bsc,
        polygon,
        fantom,
        avalanche,
        arbitrum,
        wagmiCustomNetworks.cronos,
        wagmiCustomNetworks.boba,
        wagmiCustomNetworks.aurora,
        wagmiCustomNetworks.harmony,
        wagmiCustomNetworks.celo,
        wagmiCustomNetworks.okxchain,
        wagmiCustomNetworks.gnosis,
        wagmiCustomNetworks.zkSync,
        wagmiCustomNetworks.kcc,
    ];

    const { provider, webSocketProvider } = configureChains(chains, [
        infuraProvider({ apiKey: process.env.REACT_APP_INFURA_KEY ?? "" }),
        publicProvider(),
    ]);

    const client = createClient({
        autoConnect: true,
        connectors: [
            new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
            new WalletConnectLegacyConnector({
                chains,
                options: {
                    qrcode: true,
                },
            }),
            new SafeConnector({
                chains,
                options: {
                    debug: true,
                },
            }),
        ],
        provider,
        webSocketProvider,
    });

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <ErrorBoundary>
                    <ReactNotifications />
                    <BrowserRouter>
                        <WagmiConfig client={client}>
                            <App />
                        </WagmiConfig>
                    </BrowserRouter>
                </ErrorBoundary>
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <AppContainer />
    </React.StrictMode>,
    document.getElementById("root")
);
