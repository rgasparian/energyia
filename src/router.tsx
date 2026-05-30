import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function getBasePath(url?: string): string {
  // No servidor, usa a URL do request reescrita pelo server.ts
  // No cliente, usa o hostname
  if (typeof window === "undefined") {
    // SSR — server.ts já reescreveu a URL para /consultor/... ou /matrix/...
    // então basepath deve ser vazio aqui
    return "";
  }
  // Cliente — detecta pelo hostname
  const hostname = window.location.hostname;
  if (hostname.startsWith("consultor.")) return "/consultor";
  if (hostname.startsWith("matrix.")) return "/matrix";
  if (hostname.startsWith("cliente.")) return "/cliente";
  return "";
}

export const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath: getBasePath(),
  });
  return router;
};
