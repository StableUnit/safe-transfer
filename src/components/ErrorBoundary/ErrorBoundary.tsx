import React, { ReactNode } from "react";
import { addErrorNotification } from "../../utils/notifications";

interface Props {
    children: ReactNode;
}

class ErrorBoundary extends React.Component<Props> {
    componentDidCatch(error: Error) {
        addErrorNotification("Internal Error", error.message);
    }

    render() {
        const { children } = this.props;

        return children;
    }
}

export default ErrorBoundary;
