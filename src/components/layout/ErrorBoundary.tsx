"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex-1 flex items-center justify-center p-8"
          style={{ backgroundColor: "var(--editor-bg)" }}
        >
          <div className="text-center space-y-4 max-w-sm">
            <AlertTriangle
              size={40}
              className="mx-auto"
              style={{ color: "#f44747" }}
            />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--tab-active-fg)" }}
            >
              Something went wrong
            </h2>
            <p
              className="text-[12px] leading-relaxed"
              style={{ color: "var(--editor-fg)", opacity: 0.6 }}
            >
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium rounded-sm transition-opacity"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity = "1")
              }
            >
              <RefreshCw size={12} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}