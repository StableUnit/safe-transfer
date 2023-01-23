import amplitude from "amplitude-js";
import axios from "axios";

const BACKEND_URL = "http://146.190.27.205:4000/";

export const trackEvent = (event: string, data?: Record<string, any>) => {
    amplitude.getInstance().logEvent(event, data);
};

export const sendAddTransferEvent = async (data?: Record<string, any>) => {
    await axios.post(`${BACKEND_URL}/v1/addTransfer`, data);
};

export const getVolume = async () => {
    const response = await axios.get(`${BACKEND_URL}/v1/getVolume`);
    return response.data;
};
