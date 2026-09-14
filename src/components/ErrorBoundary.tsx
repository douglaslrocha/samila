import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends (React.Component as any) {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Maison ErrorBoundary] Erro capturado:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetAndClear = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      // Limpa caches e cookies básicos se possível
      window.location.href = window.location.origin + window.location.pathname + '?reset=' + Date.now();
    } catch (e) {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F4EF] text-[#3D3229] flex flex-col items-center justify-center p-6 md:p-12 font-sans selection:bg-[#6F775C] selection:text-[#F7F4EF]">
          <div className="max-w-2xl w-full bg-white border border-[#7A5B43]/10 rounded-2xl p-8 shadow-xl space-y-8">
            
            {/* Header com o Monograma */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border border-[#7A5B43]/30 flex items-center justify-center p-2 bg-white shadow-sm">
                <span className="font-cinzel text-xl font-medium tracking-widest text-[#7A5B43]">ME</span>
              </div>
              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl tracking-wider text-[#3D3229] font-light">
                  Ops! Algo deu errado no Atelier
                </h2>
                <p className="text-sm text-[#7A5B43] font-mono tracking-wide">
                  O sistema encontrou um erro inesperado durante a renderização.
                </p>
              </div>
            </div>

            {/* Caixa do Erro Técnico */}
            <div className="bg-[#FAF8F5] border border-[#7A5B43]/10 rounded-lg p-5 font-mono text-xs text-[#5C4D41] space-y-3 overflow-auto max-h-60">
              <div className="font-semibold text-red-700">
                [{this.state.error?.name || 'Erro Técnico'}]: {this.state.error?.message || 'Erro desconhecido'}
              </div>
              {this.state.error?.stack && (
                <pre className="whitespace-pre-wrap text-[10px] leading-relaxed text-gray-600">
                  {this.state.error.stack}
                </pre>
              )}
              {this.state.errorInfo?.componentStack && (
                <pre className="whitespace-pre-wrap text-[10px] leading-relaxed text-gray-500">
                  Component Stack: {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            {/* Ações e Instruções */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={this.handleResetAndClear}
                className="w-full sm:w-auto px-6 py-3 bg-[#3D3229] hover:bg-[#524438] active:bg-[#2A221B] text-white font-medium text-xs tracking-widest uppercase rounded-lg shadow transition-colors"
              >
                Limpar Cache e Reiniciar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-6 py-3 border border-[#7A5B43]/20 hover:bg-[#FAF8F5] text-[#3D3229] font-medium text-xs tracking-widest uppercase rounded-lg transition-colors"
              >
                Tentar Recarregar
              </button>
            </div>

            <p className="text-[11px] text-center text-[#7A5B43]/70 leading-relaxed max-w-md mx-auto">
              Se o problema persistir após limpar o cache, por favor envie uma captura de tela (print) desta página contendo a mensagem de erro técnica acima para nosso suporte.
            </p>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
