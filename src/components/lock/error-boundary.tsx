import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { failed: boolean };

export class LockErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-bg px-6 text-center text-[11px] tracking-[0.12em] text-dim">
          NO FILE
          <br />
          TRY A JPG OR PNG.
        </div>
      );
    }
    return this.props.children;
  }
}
