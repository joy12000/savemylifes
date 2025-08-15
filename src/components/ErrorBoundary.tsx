  import React from "react";

  type Props = { children: React.ReactNode };
  type State = { hasError: boolean; error?: any; stack?: string; componentStack?: string };

  export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: any) {
      return { hasError: true, error };
    }
    componentDidCatch(error: any, info: any) {
      console.error("ErrorBoundary caught:", error, info);
      (window as any).__APP_LAST_ERROR__ = { error, info };
      this.setState({
        stack: (error && error.stack) ? String(error.stack) : undefined,
        componentStack: info?.componentStack ? String(info.componentStack) : undefined,
      });
    }
    render() {
      if (this.state.hasError) {
        const message = this.state.error?.message ?? String(this.state.error);
        return (
          <div style={{padding:24, fontFamily:"system-ui, sans-serif"}}>
            <h1 style={{fontSize:20, marginBottom:8}}>앱 오류가 발생했어요</h1>
            <p style={{opacity:.8, marginBottom:16}}>새로고침을 시도하거나, 아래 오류 메시지/스택을 개발자에게 전달해 주세요.</p>
            <pre style={{whiteSpace:"pre-wrap", background:"#111827", color:"#e5e7eb", padding:12, borderRadius:8, marginBottom:12}}>
{message}
            </pre>
            {this.state.stack && (
              <details open>
                <summary style={{cursor:"pointer"}}>스택 트레이스</summary>
                <pre style={{whiteSpace:"pre-wrap", background:"#0b0f1a", color:"#cbd5e1", padding:12, borderRadius:8}}>{this.state.stack}</pre>
              </details>
            )}
          </div>
        );
      }
      return this.props.children;
    }
  }
