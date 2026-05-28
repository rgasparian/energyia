import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/consultor/$slug", params: { slug: params.slug }, replace: true });
  },
  component: () => null,
});
