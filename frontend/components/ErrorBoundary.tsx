'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorCount: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

/**
 * ErrorBoundary - Catches and handles React errors gracefully
 * Provides automatic retry mechanism and user-friendly error display
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
    
    // Track error count for retry logic
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1
    }))
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    })
    
    // Reload the page if errors persist
    if (this.state.errorCount > 3) {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animated-grid-bg" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 max-w-2xl mx-auto px-4 text-center"
          >
            <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 border border-red-500/30 shadow-2xl">
              <div className="text-6xl mb-6">⚠️</div>
              
              <h2 className="font-orbitron text-3xl text-white mb-4">
                Oops! Something went wrong
              </h2>
              
              <p className="font-montserrat text-gray-400 mb-6">
                Don't worry - we're working on getting you back to the game!
              </p>
              
              {this.state.errorCount <= 3 && (
                <p className="font-montserrat text-sm text-gray-500 mb-6">
                  Error #{this.state.errorCount} - Automatic retry available
                </p>
              )}
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="bg-gradient-to-r from-patriots-red to-seahawks-green text-white px-6 py-3 rounded-lg font-bebas text-lg hover:scale-105 transition-transform"
                >
                  {this.state.errorCount > 3 ? 'Reload Page' : 'Try Again'}
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="font-montserrat text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                    Error Details (Dev Mode)
                  </summary>
                  <pre className="mt-4 p-4 bg-black/40 rounded-lg text-xs text-red-400 overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
