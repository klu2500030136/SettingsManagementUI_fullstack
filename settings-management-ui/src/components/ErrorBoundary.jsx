import React from "react";

class ErrorBoundary extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {

    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {

    console.error(
      "Error Boundary:",
      error,
      errorInfo
    );
  }

  render() {

    if (this.state.hasError) {

      return (
        <div className="flex items-center justify-center min-h-screen">

          <div className="bg-white p-10 rounded-2xl shadow-lg text-center">

            <h1 className="text-4xl font-bold text-red-500">
              Something went wrong
            </h1>

            <p className="text-slate-600 mt-4">
              Please refresh the application.
            </p>

          </div>

        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;