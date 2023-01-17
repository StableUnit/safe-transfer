import { useState, useEffect } from "react";
import { decodeToken, TokenInfoType } from "../utils/urlGenerator";

export const useReceiveToken = () => {
    const [token, setToken] = useState<string | null>(null);
    const tokenData = token ? decodeToken<TokenInfoType>(token) : undefined;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setToken(urlParams.get("token"));
    }, []);

    return { token, tokenData };
};
