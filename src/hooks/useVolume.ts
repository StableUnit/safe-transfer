import { useState, useEffect } from "react";
import { getVolume } from "../utils/events";

export const useVolume = () => {
    const [volume, setVolume] = useState(0);

    const updateVolume = async () => {
        setVolume((await getVolume()).totalTransferedUsd);
    };

    useEffect(() => {
        updateVolume();
    }, []);

    return volume;
};
