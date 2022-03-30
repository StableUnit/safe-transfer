import jwt from "jsonwebtoken";
import { NetworkType } from "./network";

const SECRET_KEY = "someSecretKey";

export type TokenInfoType = {
    address: string;
    from: string;
    to: string;
    value: string;
    chain: NetworkType;
};

export const generateUrl = ({ address, from, to, value, chain }: TokenInfoType) => {
    const { origin } = window.location;
    const token = jwt.sign({ address, from, to, value, chain }, SECRET_KEY);

    return `${origin}?token=${token}`;
};

export const decodeToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY) as TokenInfoType;
    } catch (e) {
        return undefined;
    }
};

export const getShortUrl = (url: string) => `${url.slice(0, 20)}...${url.slice(url.length - 4)}`;
export const getShortHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(hash.length - 3)}`;
