import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    if (typeof window === "undefined") return;
    const hostname = window.location.hostname;
    if (hostname.startsWith("consultor.") || hostname.startsWith("matrix.")) return;
    throw redirect({
      to: "/consultor/$slug",
      params: { slug: params.slug },
      replace: true,
    });
  },
  component: () => null,
});
