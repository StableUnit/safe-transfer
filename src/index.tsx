import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { ReactNotifications } from "react-notifications-component";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import amplitude from "amplitude-js";
import { BrowserRouter } from "react-router-dom";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { mainnet, polygon, goerli, optimism, bsc, fantom, avalanche } from "wagmi/chains";
import { Web3Modal } from "@web3modal/react";

import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { initialState, StateContext, DispatchContext } from "./reducer/constants";
import reducer from "./reducer";
import { wagmiCustomNetworks } from "./utils/network";

import "./index.scss";
import "react-notifications-component/dist/theme.css";

Sentry.init({
    dsn: "https://7a6df39090c749e3a39eb6bce2d5fad8@o922999.ingest.sentry.io/6543522",
    integrations: [new Integrations.BrowserTracing(), new Sentry.Integrations.Breadcrumbs({ console: false })],
    tracesSampleRate: 1.0,
});

amplitude.getInstance().init("33269ec4443fd55fdcb0c426627ec40f");

const PROJECT_ID = "8bc6fb62be86919096fcd7486c9d70ad";

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
        wagmiCustomNetworks.cronos,
        wagmiCustomNetworks.boba,
        wagmiCustomNetworks.aurora,
        wagmiCustomNetworks.harmony,
    ];
    // Wagmi client
    const { provider } = configureChains(chains, [walletConnectProvider({ projectId: PROJECT_ID })]);
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: modalConnectors({ appName: "web3Modal", chains }),
        provider,
    });

    // Web3Modal Ethereum Client
    const ethereumClient = new EthereumClient(wagmiClient, chains);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <ErrorBoundary>
                    <ReactNotifications />
                    <BrowserRouter>
                        <WagmiConfig client={wagmiClient}>
                            <App />
                        </WagmiConfig>
                        <Web3Modal projectId={PROJECT_ID} ethereumClient={ethereumClient} />
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
