import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-6"
          style={{ backgroundColor: "#F5E6D3" }}
        >
          <div className="text-6xl mb-6">😔</div>
          <h1
            className="text-2xl font-semibold mb-2 text-center"
            style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
          >
            Something went wrong
          </h1>
          <p
            className="text-sm text-center mb-8 max-w-[300px]"
            style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
          >
            We're sorry, but something unexpected happened. Please try again.
          </p>
          <Button
            variant="nudge"
            size="cta"
            onClick={this.handleReset}
            className="max-w-[280px]"
          >
            Return Home
          </Button>
          {this.state.error && (
            <p
              className="text-xs mt-6 text-center max-w-[300px]"
              style={{ color: "rgba(44, 62, 80, 0.4)", fontFamily: "Inter, sans-serif" }}
            >
              Error: {this.state.error.message}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
