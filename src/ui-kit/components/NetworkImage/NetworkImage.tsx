import React from "react";
import DefaultImage from "../../images/default.png";
import EthImage from "../../images/eth.png";
import PolygonImage from "../../images/polygon.png";
import FantomImage from "../../images/fantom.png";
import BscImage from "../../images/bsc.png";
import AvalancheImage from "../../images/avalanche.png";
import AuroraImage from "../../images/aurora.png";

export type NetworkType = "eth" | "rinkeby" | "polygon" | "bsc" | "fantom" | "avalanche" | string;

interface NetworkImageProps {
    network?: NetworkType;
    width?: number;
    height?: number;
}

const getNetworkImage = (network?: NetworkType) => {
    switch (network) {
        case "eth":
            return EthImage;
        case "rinkeby":
            return EthImage;
        case "polygon":
            return PolygonImage;
        case "fantom":
            return FantomImage;
        case "bsc":
            return BscImage;
        case "avalanche":
            return AvalancheImage;
        case "aurora":
            return AuroraImage;
        default:
            return DefaultImage;
    }
};

export const NetworkImage = ({ network, width = 32, height = 32 }: NetworkImageProps) => (
    <img src={getNetworkImage(network)} width={width} height={height} alt={network} />
);
