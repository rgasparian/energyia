import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/matrix")({
  component: MatrixLayout,
});

export function MatrixLayout() {
  return <Outlet />;
}
