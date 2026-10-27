import { Component, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: import('react').ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, info.componentStack?.slice(0, 300));
  }

  handleReset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center px-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-rose-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Đã xảy ra lỗi</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {this.state.error?.message || 'Lỗi không xác định. Hãy thử tải lại trang.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold text-sm hover:bg-rose-200 dark:hover:bg-rose-950 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
