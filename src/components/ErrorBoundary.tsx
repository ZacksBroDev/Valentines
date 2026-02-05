import { Component, ReactNode, ErrorInfo } from "react";
import { motion } from "framer-motion";
import { HeartCrack, Heart } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // In production, you would send this to an error tracking service
    // e.g., Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback onReset={this.handleReset} error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  onReset: () => void;
  error: Error | null;
}

export const ErrorFallback = ({ onReset, error }: ErrorFallbackProps) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffd6e0 100%)",
      }}
      role="alert"
      aria-live="assertive"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="text-6xl mb-4 flex justify-center"
        >
          <HeartCrack size={64} className="text-gray-300" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h1>

        <p className="text-gray-600 mb-6">
          Don't worry, your favorites are safe. Let's try again!
        </p>

        {import.meta.env.DEV && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error details (dev only)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-auto max-h-32 text-red-600">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col gap-3">
          <motion.button
            onClick={onReset}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 px-6 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            Try Again <Heart size={16} fill="currentColor" />
          </motion.button>

          <motion.button
            onClick={() => window.location.reload()}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-colors"
          >
            Refresh Page
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorBoundary;
