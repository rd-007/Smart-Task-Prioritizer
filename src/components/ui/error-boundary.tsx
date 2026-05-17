"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl scale-150" />
            <div className="relative w-16 h-16 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-1.5">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>

          <Button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-full gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
