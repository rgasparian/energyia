import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug")({
  beforeLoad: async ({ params, context }) => {
    // Este código roda no servidor E no cliente
    // No servidor, a URL já foi reescrita pelo server.ts
    // então /$slug nunca deveria ser atingido via subdomínio
    // Se chegar aqui no cliente via subdomínio, redireciona
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.startsWith("consultor.")) {
        throw redirect({ to: "/consultor/$slug", params, replace: true });
      }
      if (hostname.startsWith("matrix.")) {
        throw redirect({ to: "/matrix/$slug", params, replace: true });
      }
    }
  },
  component: () => null,
});
