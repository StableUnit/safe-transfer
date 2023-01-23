import { useState, useEffect, useRef } from "react";

const CLOSE_TIMEOUT = 3000;

export const useGenUrlPopup = (genUrl?: string) => {
    const [isGenUrlPopupVisible, setIsGenUrlPopupVisible] = useState(false);
    const [canCloseGenUrl, setCanCloseGenUrl] = useState(false);
    const timeoutId = useRef<any>();

    useEffect(() => {
        const newValue = Boolean(genUrl && genUrl !== "");
        setIsGenUrlPopupVisible(newValue);
        if (newValue) {
            timeoutId.current = setTimeout(() => setCanCloseGenUrl(true), CLOSE_TIMEOUT);
        } else {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            setCanCloseGenUrl(false);
        }
    }, [genUrl]);

    const closeGenUrlPopup = () => {
        setIsGenUrlPopupVisible(false);
    };

    return { isGenUrlPopupVisible, closeGenUrlPopup, canCloseGenUrl };
};
