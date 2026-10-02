import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('IB Quest failed to render', error, info)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="error-page">
          <p className="error-page__eyebrow">The trail is unclear</p>
          <h1>We could not open this part of the quest.</h1>
          <p>Please refresh the page. Your progress has not been changed.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Try again
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
