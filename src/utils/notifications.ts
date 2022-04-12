import { Store } from "react-notifications-component";

export const addErrorNotification = (title: string, errorMessage?: string) => {
    return Store.addNotification({
        title,
        message: errorMessage,
        type: "danger",
        container: "top-left",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true,
        },
    });
};

export const addSuccessNotification = (title: string, message?: string, isFast?: boolean) => {
    return Store.addNotification({
        title,
        message,
        type: "success",
        container: "top-left",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: isFast ? 1500 : 5000,
            onScreen: true,
        },
    });
};
