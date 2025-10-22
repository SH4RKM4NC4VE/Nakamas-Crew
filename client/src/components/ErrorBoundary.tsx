import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-black text-[#39ff14]">
          <div className="flex flex-col items-center w-full max-w-2xl p-8 border-2 border-[#39ff14] bg-black/90">
            <div className="text-6xl mb-6 animate-pulse">💀</div>

            <h2 
              className="text-xl mb-4 text-center"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              ¡ERROR CRÍTICO!
            </h2>
            
            <p 
              className="text-sm mb-6 text-center text-[#00bfff]"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              La tripulación ha encontrado un problema...
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 w-full rounded bg-gray-900 border border-[#39ff14] overflow-auto mb-6 max-h-40">
                <pre className="text-xs text-[#ff6b6b] whitespace-break-spaces font-mono">
                  {this.state.error?.stack}
                </pre>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="button-arcade px-6 py-3 text-lg flex items-center gap-2"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              <RotateCcw size={16} />
              REINICIAR
            </button>
            
            <p 
              className="text-xs mt-4 text-center text-[#666]"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              Si el problema persiste, contacta al Capitán
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
