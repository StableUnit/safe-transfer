import React from "react";
import DefaultImage from "../../images/default.png";
import EthImage from "../../images/eth.png";
import PolygonImage from "../../images/polygon.png";
import FantomImage from "../../images/fantom.png";
import BscImage from "../../images/bsc.png";
import AvalancheImage from "../../images/avalanche.png";
import AuroraImage from "../../images/aurora.png";
import HarmonyImage from "../../images/harmony.png";
import OptimismImage from "../../images/optimism.png";
import BobaImage from "../../images/boba.png";
import SkaleImage from "../../images/skale.png";
import CronosImage from "../../images/cronos.png";

export type NetworkType =
    | "eth"
    | "goerli"
    | "polygon"
    | "bsc"
    | "fantom"
    | "avalanche"
    | "optimism"
    | "boba"
    | "skale"
    | "cronos"
    | string;

interface NetworkImageProps {
    network?: NetworkType;
    width?: number;
    height?: number;
}

const getNetworkImage = (network?: NetworkType) => {
    switch (network) {
        case "eth":
            return EthImage;
        case "goerli":
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
        case "harmony":
            return HarmonyImage;
        case "optimism":
            return OptimismImage;
        case "boba":
            return BobaImage;
        case "skale":
            return SkaleImage;
        case "cronos":
            return CronosImage;
        default:
            return DefaultImage;
    }
};

export const NetworkImage = ({ network, width = 32, height = 32 }: NetworkImageProps) => (
    <img src={getNetworkImage(network)} width={width} height={height} alt={network} />
);
