import amplitude from "amplitude-js";
import axios from "axios";
import { redirectFrom } from "../index";

const BACKEND_URL = "http://146.190.27.205:4000";

export const trackEvent = (event: string, data?: Record<string, any>) => {
    if (data?.chainId === 5 || window.location.host === redirectFrom) {
        return;
    }
    amplitude.getInstance().logEvent(event, data);
};

export const sendAddTransferEvent = async (data?: Record<string, any>) => {
    try {
        await axios.post(`${BACKEND_URL}/v1/addTransfer`, data);
    } catch (e: any) {
        console.error(e.message);
    }
};

export const getVolume = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/v1/getVolume`);
        return response.data;
    } catch (e: any) {
        console.warn(e.message);
        return 0;
    }
};
