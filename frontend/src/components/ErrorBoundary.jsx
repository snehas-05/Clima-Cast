import React from 'react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 mesh-gradient">
          <div className="glass-card max-w-md w-full p-10 text-center rounded-3xl animate-fade-in">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-error">warning</span>
            </div>
            <h2 className="text-h2-dashboard text-on-surface mb-4">Something went wrong</h2>
            <p className="text-on-surface-variant mb-8">
              We encountered an unexpected atmospheric disturbance. Please try again or return home.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={this.handleRetry}
                className="w-full py-4 rounded-xl"
              >
                Retry Connection
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 rounded-xl"
              >
                Go to Dashboard
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-surface-container text-left text-xs overflow-auto rounded-xl max-h-40 custom-scrollbar">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
