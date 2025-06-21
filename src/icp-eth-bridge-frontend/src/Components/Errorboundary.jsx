import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to trigger fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by Error Boundary:", error, errorInfo);

    // Optional: wait briefly before reloading
    
      window.location.reload(); // Refresh the page
  
  }

  render() {
    if (this.state.hasError) {
      return null; // Or show a loading/spinner temporarily
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
