import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";
    const isConsultorSubdomain = hostname.startsWith("consultor.");

    if (!isConsultorSubdomain) {
      throw redirect({
        to: "/consultor/$slug",
        params: { slug: params.slug },
        replace: true,
      });
    }
  },
  component: () => null,
});
