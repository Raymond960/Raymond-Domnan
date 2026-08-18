import * as React from 'react';
import { AlertTriangle, RefreshCw, MessageCircle, Home } from 'lucide-react';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Arimo UI Caught Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  handleClearCacheAndReset = () => {
    try {
      sessionStorage.clear();
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Something Went Wrong</h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                We encountered a temporary issue. No funds were charged and your cart data is safe.
              </p>
              {this.state.error && (
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-[11px] font-mono text-amber-300 text-left overflow-x-auto max-h-24">
                  {this.state.error.message || 'Unknown Application Error'}
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearCacheAndReset}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>Reset View to Home</span>
              </button>

              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Get Help on WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
