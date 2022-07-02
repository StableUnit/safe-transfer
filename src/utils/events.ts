import amplitude from "amplitude-js";

export const trackEvent = (event: string, data?: Record<string, any>) => {
    amplitude.getInstance().logEvent(event, data);
};
