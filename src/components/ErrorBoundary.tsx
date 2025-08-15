import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    // 최소한 콘솔에라도 남김
    console.error("ErrorBoundary caught:", error, info);
    // 전역 표식(운영시 수집기로 보낼 수 있음)
    (window as any).__APP_LAST_ERROR__ = { error: String(error), info };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 24, fontFamily: "system-ui, sans-serif"}}>
          <h1 style={{fontSize: 20, marginBottom: 8}}>앱 오류가 발생했어요</h1>
          <p style={{opacity: .8, marginBottom: 16}}>
            새로고침을 시도하거나, 아래 오류 메시지를 개발자에게 전달해 주세요.
          </p>
          <pre style={{whiteSpace:"pre-wrap", background:"#111827", color:"#e5e7eb", padding:12, borderRadius:8}}>
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
