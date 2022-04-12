import React from "react";
import { addErrorNotification } from "../../utils/notifications";

interface ErrorBoundaryProps {
    children: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    componentDidCatch(error: Error) {
        addErrorNotification("Internal Error", error.message);
    }

    render() {
        const { children } = this.props;

        return children;
    }
}

export default ErrorBoundary;
