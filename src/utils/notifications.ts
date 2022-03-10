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
            duration: 10000,
            onScreen: true,
        },
    });
};
