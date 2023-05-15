import jwt from "jsonwebtoken";
import { NetworkType } from "./network";
import { addErrorNotification, addSuccessNotification } from "./notifications";

const SECRET_KEY = "someSecretKey";

export type TokenInfoType = {
    address: string;
    from: string;
    to: string;
    value: string;
    chain: NetworkType;
};

export type RequestUrlType = {
    token?: string;
    to: string;
    value?: number;
    networkName: NetworkType;
};

export const generateUrl = ({ address, from, to, value, chain }: TokenInfoType) => {
    const { origin } = window.location;
    const token = jwt.sign({ address, from, to, value, chain }, SECRET_KEY);

    return `${origin}/receive?token=${token}`;
};

export const generateRequestUrl = ({ token, to, value, networkName }: RequestUrlType) => {
    const { origin } = window.location;
    const requestToken = jwt.sign({ token, to, value, networkName }, SECRET_KEY);

    return `${origin}/send?requestToken=${requestToken}`;
};

// @ts-ignore
window.generateUrl = generateUrl;

export const decodeToken = <T>(token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY) as T;
    } catch (e) {
        return undefined;
    }
};

export const getShortUrl = (url?: string) => (url ? `${url.slice(0, 18)}...${url.slice(url.length - 4)}` : "");
export const getLongUrl = (url?: string) => (url ? `${url.slice(0, 32)}...${url.slice(url.length - 8)}` : "");
export const getShortHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(hash.length - 3)}`;

const copyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let res = false;
    try {
        res = document.execCommand("copy");
        if (res) {
            addSuccessNotification("Copied", undefined, true);
        }
    } catch (err) {
        addErrorNotification("Error", "Can't copy in this browser");
    }

    document.body.removeChild(textArea);
    return res;
};

export const handleCopyUrl = (url: string) => () => {
    if (url) {
        // navigator.clipboard.writeText(url);
        copyTextToClipboard(url);
    }
};
