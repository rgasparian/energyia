import { createFileRoute } from "@tanstack/react-router";

// Rota vazia — o server.ts já cuida do roteamento por subdomínio
export const Route = createFileRoute("/$slug")({
  component: () => null,
});
