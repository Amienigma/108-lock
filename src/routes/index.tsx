import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/lock/app-shell";
import { LockErrorBoundary } from "@/components/lock/error-boundary";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <LockErrorBoundary>
      <AppShell />
    </LockErrorBoundary>
  );
}
