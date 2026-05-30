import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    if (typeof window === "undefined") return;
    const hostname = window.location.hostname;
    if (hostname.startsWith("consultor.")) {
      throw redirect({ to: "/consultor/$slug", params, replace: true });
    }
    if (hostname.startsWith("matrix.")) {
      throw redirect({ to: "/matrix/$slug", params, replace: true });
    }
  },
  component: () => null,
});
