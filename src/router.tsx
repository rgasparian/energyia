import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function getBasePath(): string {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  if (hostname.startsWith("consultor.")) return "/consultor";
  if (hostname.startsWith("matrix.")) return "/matrix";
  if (hostname.startsWith("cliente.")) return "/cliente";
  return "";
}

export const getRouter = () => {
  const queryClient = new QueryClient();
  const basePath = getBasePath();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath: basePath,
  });

  return router;
};
