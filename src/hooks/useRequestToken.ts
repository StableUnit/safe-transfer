import { useState, useEffect } from "react";
import { decodeToken, RequestUrlType } from "../utils/urlGenerator";

export const useRequestToken = () => {
    const [token, setToken] = useState<string | null>(null);
    const tokenData = token ? decodeToken<RequestUrlType>(token) : undefined;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setToken(urlParams.get("requestToken"));
    }, []);

    return { requestToken: token, requestTokenData: tokenData };
};
